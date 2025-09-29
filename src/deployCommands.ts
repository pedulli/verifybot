import { PermissionFlagsBits, PermissionsBitField, REST, Routes, SlashCommandBuilder } from "discord.js"

// ENV Shenanigans
const throwEnvErr = (m: string) => { throw 'Missing ENV Variable: ' + m }
const {
	DISCORD_TOKEN = throwEnvErr('DISCORD_TOKEN'),
	DISCORD_CLIENT_ID = throwEnvErr('DISCORD_CLIENT_ID'),
	DISCORD_GUILD_ID = throwEnvErr('DISCORD_GUILD_ID')
} = process.env

// Slash commands are defined here
const slashCommands = [
	new SlashCommandBuilder()
		.setName('admin')
		.setDescription('Admin actions')
		.addSubcommandGroup(group => group
			.setName('place')
			.setDescription('Place a thing')
			.addSubcommand(cmd => cmd
				.setName('verification')
				.setDescription('Place a verification button')
			)
			.addSubcommand(cmd => cmd
				.setName('link')
				.setDescription('Place a link button in chat')
				.addStringOption(opt => opt
					.setName('label')
					.setDescription('Label of button')
					.setRequired(true)
				)
				.addStringOption(opt => opt
					.setName('url')
					.setDescription('URL of button')
					.setRequired(true)
				)
		)
	)
	.addSubcommand(cmd => cmd
		.setName('user')
		.setDescription('Get info on a specific user')
		.addMentionableOption(opt => opt
			.setName('user')
			.setDescription('The user in question')
			.setRequired(true)
		)
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
]

const { length } = await new REST()
	.setToken(DISCORD_TOKEN)
	.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), { body: slashCommands }) as unknown[]


console.log(`${length} command${length - 1 ? 's have' : ' has'} been updated.`)