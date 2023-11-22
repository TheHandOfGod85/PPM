import { createTransport } from 'nodemailer'
import env from '../env'

const transporter = createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: 'sideprojects85@hotmail.com',
    pass: env.SMTP_PASSWORD,
  },
})
const url = env.WEBSITE_URL
export async function sendVerificationCode(
  toEmail: string,
  verificationCode: string
) {
  await transporter.sendMail({
    from: 'noreply@noreply.com',
    to: toEmail,
    subject: 'Your verification email',
    html: `<p>This is your verification email, it will expire in 1 day</p><br/>
    <p>Please click the link below to verify your email and register your account</p><br/>
    <strong>${url}/user/registration/${verificationCode}</strong>`,
  })
}