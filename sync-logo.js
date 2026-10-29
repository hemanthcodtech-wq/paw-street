const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const sourceLogo = path.join(rootDir, 'client', 'public', 'logo.png');

if (!fs.existsSync(sourceLogo)) {
  console.error('❌ Could not find website logo at:', sourceLogo);
  process.exit(1);
}

const logoBuffer = fs.readFileSync(sourceLogo);
const base64Data = `data:image/png;base64,${logoBuffer.toString('base64')}`;

const targets = [
  path.join(rootDir, 'apps', 'user-app', 'assets', 'logo.png'),
  path.join(rootDir, 'apps', 'user-app', 'assets', 'icon.png'),
  path.join(rootDir, 'apps', 'user-app', 'assets', 'adaptive-icon.png'),
  path.join(rootDir, 'apps', 'user-app', 'public', 'logo.png'),
  path.join(rootDir, 'apps', 'user-app', 'public', 'favicon.png'),
  path.join(rootDir, 'apps', 'partner-app', 'assets', 'logo.png'),
  path.join(rootDir, 'apps', 'partner-app', 'assets', 'icon.png'),
  path.join(rootDir, 'apps', 'partner-app', 'assets', 'adaptive-icon.png'),
  path.join(rootDir, 'apps', 'partner-app', 'public', 'logo.png'),
  path.join(rootDir, 'apps', 'partner-app', 'public', 'favicon.png'),
];

targets.forEach((dest) => {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, logoBuffer);
  console.log('✅ Synced logo to:', path.relative(rootDir, dest));
});

// Also write base64 module for seamless rendering across all platforms
const jsCode = `// Auto-generated website logo asset\nexport const WEBSITE_LOGO_BASE64 = ${JSON.stringify(base64Data)};\nexport default WEBSITE_LOGO_BASE64;\n`;

const jsTargets = [
  path.join(rootDir, 'apps', 'user-app', 'src', 'assets', 'websiteLogo.js'),
  path.join(rootDir, 'apps', 'partner-app', 'src', 'assets', 'websiteLogo.js'),
];

jsTargets.forEach((dest) => {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, jsCode);
  console.log('✅ Generated JS logo module at:', path.relative(rootDir, dest));
});

console.log('🎉 Website logo successfully applied as icon to both apps!');

