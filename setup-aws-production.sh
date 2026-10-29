#!/bin/bash
# ==============================================================================
# PAW NEAR - AWS EC2 Production Deployment Script
# Automatically configures Nginx, Node.js PM2, and Free HTTPS SSL for pawnear.in
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$SCRIPT_DIR/client"
SERVER_DIR="$SCRIPT_DIR/server"

DOMAIN="pawnear.in"
WWW_DOMAIN="www.pawnear.in"
PORT=5001

echo "=========================================================="
echo "🐾 Setting up PAW NEAR Production on AWS Server for $DOMAIN"
echo "Project Directory: $SCRIPT_DIR"
echo "=========================================================="

# 1. Update and install Node.js, Nginx & Certbot
echo "📦 Ensuring dependencies (Node.js, Nginx, Certbot, PM2)..."
sudo apt update -y
sudo apt install -y nginx certbot python3-certbot-nginx

if ! command -v node &> /dev/null; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2 globally..."
  sudo npm install -g pm2
fi

# 2. Build the React Frontend
echo "🔨 Building React Frontend..."
cd "$CLIENT_DIR"
npm install
npm run build

# 3. Setup Backend with PM2
echo "🚀 Starting Node.js Backend Engine with PM2 on port $PORT..."
cd "$SERVER_DIR"
npm install
pm2 stop paw-server 2>/dev/null || true
pm2 delete paw-server 2>/dev/null || true
pm2 start server.js --name "paw-server"
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu || true

# 4. Configure Nginx Reverse Proxy
echo "🌐 Configuring Nginx for $DOMAIN..."
sudo tee /etc/nginx/sites-available/pawnear > /dev/null << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $WWW_DOMAIN;

    # Frontend Single Page App Build
    root $CLIENT_DIR/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Allow larger image uploads
    client_max_body_size 50M;
}
EOF

# Enable Site and reload Nginx
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/pawnear /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 5. Enable SSL HTTPS with Certbot
echo "🔒 Enabling Free HTTPS SSL Certificate for $DOMAIN..."
sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos -m pawnear.support@gmail.com --redirect || echo "⚠️ Certbot could not get SSL yet. Ensure DNS has propagated first, then run: sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"

echo "=========================================================="
echo "🎉 DEPLOYMENT COMPLETE! Your website is live at:"
echo "👉 https://$DOMAIN"
echo "👉 https://$WWW_DOMAIN"
echo "=========================================================="
