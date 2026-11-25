import crypto from 'node:crypto'
import readline from 'node:readline'

function generate(password) {
  if (!password || password.length < 8) {
    console.error('Error: Password must be at least 8 characters long.')
    process.exit(1)
  }
  const salt = crypto.randomBytes(16)
  const key = crypto.scryptSync(password, salt, 64)
  const passwordHash = `scrypt:${salt.toString('hex')}:${key.toString('hex')}`
  const sessionSecret = crypto.randomBytes(32).toString('hex')

  console.log('\nAdd these environment variables to Vercel (Project Settings -> Environment Variables) and .env.local:\n')
  console.log(`ADMIN_EMAIL=your-admin@patch4ever.com`)
  console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`)
  console.log(`ADMIN_SESSION_SECRET=${sessionSecret}\n`)
}

const argPassword = process.argv[2]
if (argPassword) {
  generate(argPassword)
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  rl.question('Enter new admin password (min 8 characters): ', (answer) => {
    rl.close()
    generate(answer.trim())
  })
}
