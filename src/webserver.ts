import db from './db'
import { client, SIGNING_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from './'
import { verify } from './integrity'

// Really basic web server for handling OAuth callback

export const server = Bun.serve({
	port: 3000,
	routes: {
		'/': () => new Response('why are you here'),
		'/api/auth/': async (req: Request) => {
			const url = new URL(req.url)
			const signedPayload = url.searchParams.get('state')
			const code = url.searchParams.get('code')
			const payload = verify(signedPayload || '', SIGNING_SECRET)
			if (!payload || !code) return new Response('Invalid request')
			const { discord, server } = JSON.parse(payload || '{}')
			if (!discord || !server) return new Response('Invalid request')

			const exists = await db.users.discordExists(discord!)
			if (exists) return new Response('Email already verified, you are free to go back to discord :)')

			const tokenRequest = await fetch('https://oauth2.googleapis.com/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					code,
					client_id: GOOGLE_CLIENT_ID!,
					client_secret: GOOGLE_CLIENT_SECRET!,
					redirect_uri: url.origin + url.pathname,
					grant_type: 'authorization_code'
				}).toString()
			})

			const tokenRequestBody = await tokenRequest.json() as { access_token: string }
			if (!tokenRequestBody.access_token) return new Response('Invalid request')

			const infoRequest = await fetch(
				`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenRequestBody.access_token}`
			)
			const infoRequestBody = await infoRequest.json() as { id: string, email: string, picture: string, hd: string, name: string }

			if (infoRequestBody.hd !== 'g.rit.edu') return new Response('Please use your RIT email')
			if (!infoRequestBody.email) return new Response('Invalid request')

			const user = await db.users.add({
				email: infoRequestBody.email,
				discord,
				name: infoRequestBody.name ?? null
			})

			const guild = client.guilds.cache.get(server)
			if (guild && Bun.env.DISCORD_VERIFIED_ROLE_ID) {
				const member = guild.members.cache.get(discord)
				const role = await guild.roles.fetch(Bun.env.DISCORD_VERIFIED_ROLE_ID)

				if (member) {
					if (user.name) member.setNickname(user.name)
					if (role) member.roles.add(role)
				}
			}

			return new Response('Email verified, you are free to go back to discord :)')
		},
	}
})

console.log(`Web server up at ${server.url}`)