
#!/bin/bash

# Define variables
IMAGE_NAME="file_metadata"
CONTAINER_NAME="great_kapits"
PORT_MAPPING="5000:5000"

# Stop and remove the container if it's already running
docker stop "$CONTAINER_NAME" >/dev/null 2>&1
docker rm "$CONTAINER_NAME" >/dev/null 2>&1

# Run the Docker container
docker run -d --name "$CONTAINER_NAME" -p "$PORT_MAPPING" "$IMAGE_NAME"