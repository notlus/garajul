# FROM node:4
FROM hypriot/rpi-node
EXPOSE 3000

RUN mkdir -p /usr/src/garaj-node
WORKDIR /usr/src/garaj-node

COPY package.json /usr/src/garaj-node/
RUN npm install
COPY . /usr/src/garaj-node

CMD [ "npm", "start" ]
