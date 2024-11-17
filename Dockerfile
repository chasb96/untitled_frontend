FROM rust:slim AS build_host
WORKDIR /app
COPY ./host .
RUN cargo build --release

FROM node:lts-alpine AS build_dist
WORKDIR /app
COPY ./package.json ./
RUN npm i -g npm@10.3.0 sass
RUN npm i
COPY . .
RUN sass ./src/scss/custom.scss ./src/assets/css/custom.css
RUN npm run build

FROM rust:slim
WORKDIR /

COPY --from=build_host /app/target/release/host ./host
COPY --from=build_dist /app/dist ./app/dist

RUN chmod 777 ./app/dist
RUN chmod 777 ./app/dist/*

EXPOSE 80

CMD [ "./host" ]