# PIP Verification Bot MVP
This is a simple discord bot for verifying users as RIT students using Google's SSO

## Environment Setup
Firstly, this codebase uses [Bun](https://bun.com) as it's JS/TS runtime. I chose Bun for the following reasons
- First class Typescript support
- Automatic environment variable loading
- Built in and intuitive SQL and webserver apis

After installing Bun, run the following command to install dependencies
```bash
bun install
```

Great, environment variable time. I suggest you `mv .env.example .env` to have a starting point. There are five required variables which can be set by completing the two following sections
### Discord Setup
1. Firstly set `DISCORD_GUILD_ID` to the ID of your discord server
2. Secondly head on over to [discord.dev](https://discord.dev) and make a new application where you will need do a few things
	- Create a bot and copy it's Token to `DISCORD_TOKEN`
	- Copy the Application ID over to `DISCORD_CLIENT_ID`
	- Add the bot to your server by editing this link to include your bot's Application ID from earlier:
		> **discord.com/oauth2/authorize?client_id=`DISCORD_CLIENT_ID`&permissions=402655232&integration_type=0&scope=applications.commands+bot**
3. Now that your bot is in your server, you need to inform the server that the bot has some slash commands, so you should be able to run `bun slash` to set those up

### Google Setup
Awesome, Discord has been set up, It's Googlin' time
1. Go to [console.cloud.google.com](https://console.cloud.google.com/projectcreate) and create a Google Cloud project (if you haven't already)
2. Now go to [the api credentials page](https://console.cloud.google.com/apis/credentials) and create a new "OAuth Client ID"
	- Add "http://localhost:3000" to "Authorized JavaScript origins"
	- Add "http://localhost:3000/api/auth/" to "Authorized redirect URIs"
	- Save OAuth Client
3. Copy your Client ID into `GOOGLE_CLIENT_ID`, and copy your secret into `GOOGLE_CLIENT_SECRET`

## Starting Up
Run the following command to start the bot
```bash
bun start
```
And then use the command `/admin place verification` to send a verification button that users can use

# Other things of note
- Delete the `data.db` file to reset the database
