FROM node:6.9.1

ENV HOME /app

ADD package.json ${HOME}/
ADD src/ ${HOME}/src
ADD process.yml ${HOME}/
#ADD npm-shrinkwrap.json ${HOME}/

WORKDIR $HOME
RUN npm install -g pm2 nodemon
RUN npm install --production

ENV PORT 6600

EXPOSE $PORT
ENV NODE_PATH .

CMD ["pm2-docker", "process.yml", "–json"]
