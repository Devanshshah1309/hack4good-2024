FROM node:18-alpine3.18

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# install pnpm
RUN npm install -g pnpm

# Install app dependencies 
RUN pnpm install

# Generate prisma client
RUN npx prisma generate

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN pnpm run build

# Start server
CMD [ "pnpm", "run", "start:prod" ]

