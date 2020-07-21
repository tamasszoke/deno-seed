# Development
FROM node:10-alpine
WORKDIR /frontend
COPY package*.json /frontend/
RUN npm install
RUN npm rebuild node-sass
ADD . /frontend/
EXPOSE 3002
EXPOSE 35729
CMD ["npm", "start"]
