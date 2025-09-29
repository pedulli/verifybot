import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, type ChatInputCommandInteraction, type ButtonInteraction } from "discord.js"
import { GOOGLE_CLIENT_ID, REDIRECT_URI, SIGNING_SECRET } from "."
import { sign } from "./integrity"
import db from "./db"

// Handler Type
type Handler<T> = Record<string, (int: T) => unknown>

// Slash Command Handlers
export const commands: Handler<ChatInputCommandInteraction> = {
	async ['/admin place verification'](int) {
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
	},
	async ['/admin place link'](int) {
		const label = int.options.getString('label', true)
		const url = int.options.getString('url', true)

		int.reply({
			components: [
				new ActionRowBuilder<ButtonBuilder>()
					.addComponents([
						new ButtonBuilder()
							.setLabel(label)
							.setStyle(ButtonStyle.Link)
							.setURL(url)
					])
			]

		})
	},
	async ['/admin user'](int) {
		const member = int.options.getUser('user')

		if (!member) return int.reply({ content: 'Cannot find member', flags: MessageFlags.Ephemeral })

		int.reply({ content: 'TODO', flags: MessageFlags.Ephemeral })
	}
}

// Custom Button Handlers
export const buttons: Handler<ButtonInteraction> = {
	async ['verify'](int) {
		if (await db.users.discordExists(int.user.id)) return int.reply({
			content: 'you\'re already verified dawg',
			flags: [MessageFlags.Ephemeral]
		})
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
								state: sign(JSON.stringify({
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