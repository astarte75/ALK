import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// TODO: Add rate limiting (e.g., upstash/ratelimit) before production

interface ContactPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  requestType: string
  message: string
  recaptchaToken?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  let body: ContactPayload

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { firstName, lastName, email, phone, requestType, message, recaptchaToken } = body

  // Validate required fields
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !requestType?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
  }

  // reCAPTCHA verification (only when configured)
  if (process.env.RECAPTCHA_SECRET_KEY && recaptchaToken) {
    try {
      const res = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        { method: 'POST' }
      )
      const data = await res.json()
      if (!data.success || data.score < 0.5) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'reCAPTCHA verification error' }, { status: 500 })
    }
  }

  // SMTP fallback: log to console when not configured
  if (!process.env.SMTP_HOST) {
    console.log('SMTP not configured. Contact form data:', {
      firstName,
      lastName,
      email,
      phone,
      requestType,
      message: message.substring(0, 100),
    })
    return NextResponse.json({ success: true, note: 'SMTP not configured — logged to console' })
  }

  // Send email via nodemailer
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const fromAddress = process.env.CONTACT_EMAIL_FROM || 'noreply@alkemiacapital.com'
    const toAddress = process.env.CONTACT_EMAIL_TO || 'segreteria@alkemiacapital.com'

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #333;">Nuovo contatto dal sito web</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; width: 140px;">Nome</td><td style="padding: 8px 0;">${firstName} ${lastName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Telefono</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Tipo richiesta</td><td style="padding: 8px 0;">${requestType}</td></tr>
        </table>
        <h3 style="color: #333; margin-top: 24px;">Messaggio</h3>
        <p style="color: #444; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
    `

    const textBody = `Nuovo contatto dal sito web\n\nNome: ${firstName} ${lastName}\nEmail: ${email}\nTelefono: ${phone}\nTipo richiesta: ${requestType}\n\nMessaggio:\n${message}`

    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `Contatto da ${firstName} ${lastName} — ${requestType}`,
      html: htmlBody,
      text: textBody,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to send contact email:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
