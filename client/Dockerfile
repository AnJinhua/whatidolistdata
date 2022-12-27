# base image
FROM node:14-alpine

ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json ./
COPY package-lock.json ./

# install dependencies
RUN apk --no-cache add git
RUN npm install

# copy source files
COPY . .


# Expose port
EXPOSE 3000
CMD npm run start