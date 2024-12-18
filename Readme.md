## osu! lv website back api

This is the back api for \<repo here> to comunicate with services like discord.

## Run locally

`npm run dev`

## Build using docker:

`docker build -t osu-lv-back-api .`

Then either run directly or make a docker-compose.yml file.




## required env variables:
```yml
PORT=3004
NODE_ENV=development
AUTH_USERNAME=admin
AUTH_PASSWORD=password
OSU_CLIENT_ID=00001
OSU_CLIENT_SECRET=osu_client_secret_here
DISCORD_BOT_TOKEN=discord_bot_token
```