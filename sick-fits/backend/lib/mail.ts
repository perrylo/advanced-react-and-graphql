import { createTransport, getTestMessageUrl } from 'nodemailer'

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

function makeANiceEmail(text: string): string {
  return `
    <div style="border: 1px solid black; padding:20px; font-family: sans-serif; line-height:2; font-size:20px">
      <h2>Hello There!</h2>
      ${text}
      <p>Perry</p>
    </div>
  `
}

// Nodemailer doesn't return a typed return that TS likes (TS doesn't like return of type any) so we do this...
// This is a TS Interface - https://jvilk.com/MakeTypes/

export interface Envelope {
  from: string
  to?: string[] | null
}
export interface MailResponse {
  accepted?: string[] | null
  rejected?: null[] | null
  envelopeTime: number
  messageTime: number
  messageSize: number
  response: string
  envelope: Envelope
  messageId: string
}

export async function sendPasswordResetEmail(resetToken: string, to: string): Promise<void> {
  // email user a token

  const url = `${process.env.FRONTEND_URL}/reset?token=${resetToken}`

  const info: MailResponse = (await transport.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Your password reset token!',
    html: makeANiceEmail(`
      <p>Your Password Reset Token is here!</p>

      <p><a href="${url}">Click here to reset<a/></p>

      <p>Or visit ${url}</p>
    `),
  })) as MailResponse

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`Message Sent! Preview it at ${getTestMessageUrl(info)}`)
  }
}
