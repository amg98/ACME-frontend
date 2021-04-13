FROM node:15-alpine

WORKDIR /frontend
COPY . .
RUN npm i

RUN npm run build

CMD ["sh", "-c", "npm run start:prod"]
