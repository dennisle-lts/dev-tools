#!/bin/bash
set -e

# Resolve paths relative to this script's location
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

source "$ENV_FILE"

if [ -z "$APP_VERSION" ]; then
  echo "Error: APP_VERSION is not set in $ENV_FILE"
  exit 1
fi

IMAGE_NAME="dev-tools"
TAR_FILE="$SCRIPT_DIR/${IMAGE_NAME}-${APP_VERSION}.tar"

# Ensure a multi-platform buildx builder exists
if ! docker buildx inspect multiplatform &>/dev/null; then
  echo "Creating multi-platform buildx builder..."
  docker buildx create --name multiplatform --use
else
  docker buildx use multiplatform
fi

echo "Building ${IMAGE_NAME}:${APP_VERSION} for linux/amd64 and linux/arm64..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag "${IMAGE_NAME}:${APP_VERSION}" \
  --output "type=oci,dest=${TAR_FILE}" \
  "$REPO_ROOT"

echo ""
echo "Image exported to: ${TAR_FILE}"
echo ""
echo "Deploy steps:"
echo "  1. sftp ${TAR_FILE} docker-compose.yml .env user@host:~/"
echo "  2. On target: docker load -i ${IMAGE_NAME}-${APP_VERSION}.tar"
echo "  3. On target: docker compose up -d"
