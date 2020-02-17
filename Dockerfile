FROM Node:alpine
WORKDIR /usr/src/path
COPY ./ ./
RUN npm install
EXPOSE 8080
CMD [ "node","app.js" ]

