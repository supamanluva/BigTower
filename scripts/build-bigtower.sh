#!/bin/bash

set -e

export DOCKER_BUILDKIT=0

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

echo "🚀 Building BigTower..."

# Build BigTower docker image
docker build -t bigtower --build-arg BT_VERSION=local "$SCRIPT_DIR/.."
