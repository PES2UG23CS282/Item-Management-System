#!/bin/bash
set -e

# Quick deploy helper for GCE Compute Engine
# Usage: ./deploy.sh REPO_URL MONGODB_URI [ZONE] [INSTANCE_NAME]

REPO_URL="$1"
MONGODB_URI="$2"
ZONE="${3:-us-central1-a}"
INSTANCE_NAME="${4:-item-mgmt-vm}"
MACHINE_TYPE="${5:-e2-medium}"

if [ -z "$REPO_URL" ] || [ -z "$MONGODB_URI" ]; then
  echo "Usage: $0 REPO_URL MONGODB_URI [ZONE] [INSTANCE_NAME] [MACHINE_TYPE]"
  exit 1
fi

echo "Creating GCE instance ${INSTANCE_NAME} in ${ZONE}..."

gcloud compute instances create "$INSTANCE_NAME" \
  --zone="$ZONE" \
  --machine-type="$MACHINE_TYPE" \
  --tags=http-server \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --metadata REPO_URL="$REPO_URL",MONGODB_URI="$MONGODB_URI",PORT=8080 \
  --metadata-from-file startup-script="$(pwd)/gce/startup-script.sh" \
  --boot-disk-size=20GB

echo "Creating firewall rule to allow TCP/8080..."
gcloud compute firewall-rules create "${INSTANCE_NAME}-allow-8080" --allow tcp:8080 --target-tags=http-server || true

echo "Deployment command finished. Use 'gcloud compute ssh ${INSTANCE_NAME} --zone ${ZONE}' to connect." 
