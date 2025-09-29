const hash = (input: string): string => Buffer.from(Bun.SHA512_256.hash(input).buffer).toHex()

export function sign(input: string, secret: string) {
	const encoded = encodeURIComponent(input)
	return `${encoded}/${hash(hash(Buffer.from(secret).toBase64()) + encoded)}`
}

export function verify(input: string, secret: string): string | null {
	const parts = input.split('/')
	const payload = decodeURIComponent(parts[0] || '')
	if (parts.length !== 2 || parts[1]!.length !== 64 || !payload || sign(payload, secret) !== input) return null
	return payload
}
