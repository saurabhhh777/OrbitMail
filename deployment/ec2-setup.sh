#!/bin/bash

# OrbitMail EC2 Setup Script
# This script sets up the EC2 instance for OrbitMail deployment

set -e

echo "🚀 Setting up OrbitMail on EC2..."

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Create orbitmail user
sudo useradd -m -s /bin/bash orbitmail || true
sudo usermod -aG sudo orbitmail

# Create application directories
sudo mkdir -p /opt/orbitmail/{express-server,smtp-server,email-service}
sudo chown -R orbitmail:orbitmail /opt/orbitmail

# Create systemd service files
echo "📝 Creating systemd service files..."

# Express Server Service
sudo tee /etc/systemd/system/orbitmail-express.service > /dev/null <<EOF
[Unit]
Description=OrbitMail Express Server
After=network.target

[Service]
Type=simple
User=orbitmail
WorkingDirectory=/opt/orbitmail/express-server
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# SMTP Server Service
sudo tee /etc/systemd/system/orbitmail-smtp.service > /dev/null <<EOF
[Unit]
Description=OrbitMail SMTP Server
After=network.target

[Service]
Type=simple
User=orbitmail
WorkingDirectory=/opt/orbitmail/smtp-server
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=SMTP_PORT=2525

[Install]
WantedBy=multi-user.target
EOF

# Email Service (if running separately)
sudo tee /etc/systemd/system/orbitmail-email.service > /dev/null <<EOF
[Unit]
Description=OrbitMail Email Service
After=network.target

[Service]
Type=simple
User=orbitmail
WorkingDirectory=/opt/orbitmail/email-service
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=EMAIL_SERVICE_PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
sudo systemctl daemon-reload

# Enable services
sudo systemctl enable orbitmail-express
sudo systemctl enable orbitmail-smtp
sudo systemctl enable orbitmail-email

# Setup firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 2525/tcp
sudo ufw allow 3001/tcp
sudo ufw --force enable

# Install MongoDB (if not using Atlas)
# sudo apt-get install -y mongodb
# sudo systemctl enable mongodb

echo "✅ EC2 setup completed!"
echo "📋 Next steps:"
echo "1. Configure environment variables in /opt/orbitmail/*/.env"
echo "2. Start services: sudo systemctl start orbitmail-*"
echo "3. Check status: sudo systemctl status orbitmail-*" 