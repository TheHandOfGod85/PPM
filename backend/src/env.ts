import { cleanEnv, port, str } from 'envalid'

const env = cleanEnv(process.env, {
  PORT: 5000,
  MONGO_CONNECTION_STRING: str(),
  WEBSITE_URL: str(),
  SERVER_URL: str(),
  NODE_ENV: str(),
  SESSION_SECRET: str(),
})

export default env
