import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, type ChatInputCommandInteraction, type ButtonInteraction } from "discord.js"
import { GOOGLE_CLIENT_ID, REDIRECT_URI, SIGNING_SECRET } from "."
import { sign } from "./integrity"
import db from "./db"

type Commands = Record<any, (int: ChatInputCommandInteraction) => unknown>
type Buttons = Record<any, (int: ButtonInteraction) => unknown>

export const commands: Commands = {
	async ['/place verification'](int) {
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

export const buttons: Buttons = {
	async ['verify'](int) {
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