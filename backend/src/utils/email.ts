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
  userId: string,
  toEmail: string,
  verificationCode: string
) {
  try {
    await transporter.sendMail({
      from: 'noreply@noreply.com',
      to: toEmail,
      subject: 'Your verification email',
      html: `<p>This is your verification email, it will expire in 1 day</p><br/>
      <p>Please click or copy and paste the link below to verify your email and register your account</p><br/>
      <a>${url}/users/${userId}/signup/${verificationCode}</a>`,
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}
export async function sendPasswordResetCode(
  toEmail: string,
  verificationCode: string
) {
  try {
    await transporter.sendMail({
      from: 'noreply@noreply.com',
      to: toEmail,
      subject: 'Your reset passwrod code',
      html: `<p>Reset your password</p><br/>
      <p>Please click or copy and paste the link below to reset your password</p><br/>
      <p>This link will expire in 10 minutes</p><br/>
      <a>${url}/users/reset-password/${verificationCode}</a><br/> 
      <p>If you did not request a password reset, ingnore this email.</p>`,
    })
  } catch (error) {
    console.error('Error sending reset password email:', error)
    throw error
  }
}
