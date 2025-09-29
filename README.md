# PIP Verification Bot MVP
This is a simple discord bot for verifying users as RIT students using Google's SSO

## Environment Setup
Firstly, this codebase uses [Bun](https://bun.com) as it's JS/TS runtime. Bun is great for a multitude of reasons but I used it mainly in this case because of it's built in sqlite support and simple web server, as well as auto env var loading. Bun should be easy to install in all environments.

After installing Bun, run the following command to install the required dependencies (discord.js and "sign")
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

## Running it
Run the following command, and then you should be good to go.
```bash
bun start
```

## Using it
Use the slash command `/place verification` to get the verification message

# Other things of note
- Delete the `data.db` file to reset the database
- Unfortunately the "sign" package isn't typed, perhaps there are alternatives but for now it gets the job done
