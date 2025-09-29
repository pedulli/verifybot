import { REST, Routes, SlashCommandBuilder } from "discord.js"

// ENV Shenanigans
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env
if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) throw 'Missing ENV vars'

const { length } = await new REST()
	.setToken(DISCORD_TOKEN)
	.put(
		Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
		{
			body: [
				new SlashCommandBuilder()
					.setName('place')
					.setDescription('Place a thing')
					.addSubcommand(cmd => cmd
						.setName('verification')
						.setDescription('Send a verification button')
					)
			]
		}) as any[]


console.log(`${length} command${length-1?'s have':' has'} been updated.`)