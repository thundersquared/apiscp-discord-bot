FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy app source
COPY . .
COPY .* .

# Install dependencies
RUN set -eux && \
    apk add --no-cache git && \
    git submodule init && \
    git submodule update && \
    apk del git && \
    yarn

# Run app
CMD [ "yarn", "start" ]
