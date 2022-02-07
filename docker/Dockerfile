FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy app source
COPY . .

# Install dependencies
RUN set -eux && \
    apk add --no-cache git && \\
    git submodule update && \
    yarn

# Run app
CMD [ "yarn", "start" ]
