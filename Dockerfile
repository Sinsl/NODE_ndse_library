FROM node:18.10.0

WORKDIR /app

ARG NODE_ENV=production

COPY . ./

RUN npm install

CMD ["npm", "start"]
