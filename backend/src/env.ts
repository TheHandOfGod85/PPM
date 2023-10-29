import { cleanEnv, port, str } from 'envalid'

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_CONNECTION_STRING: str(),
  WEBSITE_URL: str(),
  SERVER_URL: str(),
  NODE_ENV: str(),
})

export default env
