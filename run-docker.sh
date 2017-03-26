# MongoDB
DATABASE_URI="mongodb://mongo/projectx"
DATABASE_HOST="mongodb://mongo"
DATABASE_PORT="27017"
DATABASE_NAME="projectx"
DATABASE_USER=null
DATABASE_PASSWORD=null

# Global
GIT_REPO_TAG=$(git rev-parse --abbrev-ref HEAD)

docker network create development
docker-compose build
MAX_UPLOAD_SIZE=${MAX_UPLOAD_SIZE} \
DATABASE_URI=${DATABASE_URI} \
DATABASE_HOST=${DATABASE_HOST} \
DATABASE_PORT=${DATABASE_PORT} \
DATABASE_NAME=${DATABASE_NAME} \
DATABASE_USER=${DATABASE_USER} \
DATABASE_PASSWORD=${DATABASE_PASSWORD} \

docker-compose -f docker-compose.yml up -d
