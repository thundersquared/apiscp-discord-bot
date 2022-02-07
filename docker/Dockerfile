FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy app source
COPY . .

# Install dependencies
RUN set -eux && \
    git submodule update && \
    yarn

# Run app
CMD [ "yarn", "start" ]
