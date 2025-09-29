import { ActionRowBuilder, ButtonBuilder, type ButtonInteraction, ButtonStyle, type ChatInputCommandInteraction, Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js'
//@ts-expect-error because 'sign' is untyped unfortunately
import { sign } from 'sign'
import db from './db'

// ENV Check
export const { DISCORD_TOKEN, SIGNING_SECRET = crypto.randomUUID(), REDIRECT_URI = "http://localhost:3000/api/auth/", GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = Bun.env
if (!DISCORD_TOKEN || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) throw 'Please ensure you have the required ENV variables set'

// Discord Bot Client
export const client =
	new Client({ intents: [GatewayIntentBits.Guilds] })
		.on(Events.ClientReady, async ({ user: { tag } }) => {
			console.log(`Logged in as ${tag}`)
			// Start the web server once the bot is confirmed online
			await import('./webserver')
		})
		.on(Events.InteractionCreate, interaction => {
			if (interaction.isChatInputCommand()) handleCommand(interaction)
			if (interaction.isButton()) handleButton(interaction)
		})

client.login(Bun.env.DISCORD_TOKEN)

// Slash Command Handler
async function handleCommand(int: ChatInputCommandInteraction) {
	const commandName = `/${int.commandName} ${int.options.getSubcommand(true)}`.trim()
	switch (commandName) {
		case '/place verification': {
			const response = {
				content: 'You need to verify your RIT email address to access this server',
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents([
							new ButtonBuilder()
								.setCustomId('verify')
								.setLabel('Start Verification')
								.setStyle(ButtonStyle.Primary)
								.setEmoji('🎉')
						])
				]
			}

			if (int.channel?.isSendable()) {
				await int.channel.send(response)
				const reply = await int.reply('k')
				await reply.delete()
			}
			else int.reply(response)
		}
	}
}

// Button Handler
async function handleButton(int: ButtonInteraction) {
	switch (int.customId) {
		case 'verify': {
			if (await db.users.discordExists(int.user.id)) {
				return int.reply({
					content: 'you\'re already verified dawg',
					flags: [MessageFlags.Ephemeral]
				})
			}
			int.reply({
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setLabel('Login with Google')
								.setStyle(ButtonStyle.Link)
								.setURL('https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
									client_id: GOOGLE_CLIENT_ID!,
									redirect_uri: REDIRECT_URI,
									response_type: 'code',
									scope: 'email profile',
									hd: 'g.rit.edu',
									state: await sign(JSON.stringify({
										discord: int.user.id,
										server: int.guildId
									}), SIGNING_SECRET)
								}))
						)
				],
				flags: [MessageFlags.Ephemeral]
			})
		}
	}
}