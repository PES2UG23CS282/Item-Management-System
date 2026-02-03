#!/bin/bash
set -e

# Fetch metadata attributes (passed via --metadata)
REPO_URL=$(curl -fs -H "Metadata-Flavor: Google" "http://metadata.google.internal/computeMetadata/v1/instance/attributes/REPO_URL" || true)
MONGODB_URI=$(curl -fs -H "Metadata-Flavor: Google" "http://metadata.google.internal/computeMetadata/v1/instance/attributes/MONGODB_URI" || true)
PORT=$(curl -fs -H "Metadata-Flavor: Google" "http://metadata.google.internal/computeMetadata/v1/instance/attributes/PORT" || echo "8080")

APP_DIR=/opt/item-management

echo "Starting GCE startup script..."

if [ -z "$REPO_URL" ]; then
  echo "REPO_URL metadata not set. Exiting."
  exit 1
fi

echo "Installing Node.js and required packages..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get update
apt-get install -y nodejs git build-essential

echo "Cloning repository: $REPO_URL"
rm -rf "$APP_DIR"
git clone "$REPO_URL" "$APP_DIR"

if [ ! -d "$APP_DIR/backend" ]; then
  echo "Backend folder not found in repo at $APP_DIR/backend"
  exit 1
fi

cd "$APP_DIR/backend"
echo "Installing npm dependencies..."
npm install --production

echo "Writing .env file"
cat > .env <<EOF
MONGODB_URI=${MONGODB_URI}
PORT=${PORT}
EOF

echo "Creating systemd service..."
cat > /etc/systemd/system/item-management.service <<EOF
[Unit]
Description=Item Management Node App
After=network.target

[Service]
Type=simple
WorkingDirectory=${APP_DIR}/backend
Environment=PORT=${PORT}
Environment=MONGODB_URI=${MONGODB_URI}
ExecStart=/usr/bin/node server.js
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable item-management
systemctl start item-management

echo "Startup script finished. App should be running on port ${PORT}."
