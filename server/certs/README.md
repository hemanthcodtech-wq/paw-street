# AWS Database SSL/TLS Certificates

If you are using **Amazon DocumentDB (with MongoDB compatibility)** on AWS:
1. Download the Amazon RDS/DocumentDB Global Root CA bundle:
   https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
2. Save it here as `global-bundle.pem`.
3. The backend database connector (`server/config/db.js`) will automatically load it to establish an encrypted TLS connection with your AWS DocumentDB cluster.

If you are using **MongoDB on an AWS EC2 instance**, SSL CA certificate is not strictly required unless you have enabled TLS on your EC2 MongoDB configuration.

