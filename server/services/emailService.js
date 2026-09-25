const nodemailer = require('nodemailer');

let cachedTransporter = null;

// Creates a fresh (non-pooled) transporter for a single send.
// Non-pooled avoids ETIMEDOUT from stale pool connections when many emails are sent.
const createFreshTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || process.env['SMTP-Host'] || 'smtp.hostinger.com';
  const username = process.env.SMTP_USER || process.env.EMAIL_USERNAME || process.env['SMTP-Username'] || process.env.SMTP_USERNAME || 'Support@aidessa.org';
  const password = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || process.env['SMTP-PASSWORD'];

  if (!host || !username || !password) {
    throw new Error('SMTP environment variables not configured');
  }

  const rawPort = process.env.SMTP_PORT || process.env.EMAIL_PORT || process.env['SMTP-Port'] || '465';
  const port = parseInt(rawPort, 10);
  const secure = port === 465 || (process.env.SMTP_SECURE || process.env.EMAIL_SECURE || '').toLowerCase() !== 'false';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user: username, pass: password },
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
    connectionTimeout: 15000,
    socketTimeout: 20000,
    greetingTimeout: 15000,
  });
};

// Kept for compatibility with code importing getTransporter directly
const getTransporter = async () => {
  const host = process.env.EMAIL_HOST || process.env['SMTP-Host'] || process.env.SMTP_HOST;
  const username = process.env.EMAIL_USERNAME || process.env['SMTP-Username'] || process.env.SMTP_USERNAME;
  const password = process.env.EMAIL_PASSWORD || process.env['SMTP-PASSWORD'] || process.env.SMTP_PASSWORD;

  if (host && username && password) {
    return createFreshTransporter();
  }

  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('Falling back to Ethereal Email');
      const account = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email', port: 587,
        auth: { user: account.user, pass: account.pass }
      });
    } catch (e) {
      console.warn('Ethereal setup bypassed, using jsonTransport fallback:', e.message);
      return nodemailer.createTransport({ jsonTransport: true });
    }
  }

  return nodemailer.createTransport({ jsonTransport: true });
};

const sendEmail = async (options, attempt = 1) => {
  const start = Date.now();
  // Always use a fresh transporter per send to avoid stale-pool ETIMEDOUT errors
  const transporter = createFreshTransporter();
  const fromAddr = process.env.EMAIL_FROM || process.env.EMAIL_USERNAME || 'Support@aidessa.org';
  const mailOptions = {
    from: `"Aidessa Support" <${fromAddr}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined,
    replyTo: options.replyTo || fromAddr,
    headers: { 'X-Mailer': 'Aidessa-Mailer' },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    const duration = Date.now() - start;
    console.log(`[Email Dispatched] to ${options.email} in ${duration}ms (attempt ${attempt}). Status: ${info.response}`);
    return info;
  } catch (error) {
    const duration = Date.now() - start;
    const isConnErr = ['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED', 'ESOCKET'].includes(error.code);
    if (isConnErr && attempt === 1) {
      console.warn(`[Email Retry] Connection error for ${options.email}: ${error.code}. Retrying in 500ms...`);
      await new Promise(r => setTimeout(r, 500));
      return sendEmail(options, 2);
    }
    console.warn(`[Email Failed] to ${options.email} after ${duration}ms (attempt ${attempt}): ${error.message}`);
    throw error;
  }
};

const sendPasswordResetEmail = async ({ email, firstName, token }) => {
  const envUrl = process.env.CLIENT_URL;
  const clientUrl = (process.env.NODE_ENV === 'production') 
    ? (envUrl && !envUrl.includes('localhost') ? envUrl : 'https://veritasaid.com')
    : (envUrl || 'http://localhost:3001');
  const resetURL = `${clientUrl.replace(/\/+$/, '')}/reset-password/${token}`;
  const name = firstName || 'there';

  const message = `Hi ${name}, Forgot your password? Use the link to reset: ${resetURL}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <p>Hi ${name},</p>
      <p>Forgot your password? Click the link below to reset it (valid for 10 minutes):</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetURL}" style="background-color: #085464; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p style="font-size: 14px; color: #666;">If you did not request this, please ignore this email.</p>
    </div>
  `;

  try {
    await sendEmail({ email, subject: 'Your password reset link - Aidessa', message, html });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('There was an error sending the email. Please try again later.');
  }
};

// Disabled welcome email function per explicit user directive
const sendWelcomeEmail = async () => {
  console.log('[Email Notice] Welcome email disabled per user configuration.');
};

const sendJoinConfirmationEmail = async ({ email, firstName }) => {
  const subject = 'Application Received – Aidessa';
  const message = `Hi ${firstName},
  
Thank you for submitting your join application to Aidessa. 
Our team is currently reviewing your details. Once verified, you will receive an invitation email with a link to complete your registration.

If you have any questions in the meantime, please reach out to us at Support@aidessa.org.

Best regards,
The Aidessa Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <h3 style="color: #085464;">Application Received</h3>
      <p>Hi ${firstName},</p>
      <p>Thank you for submitting your join application to <strong>Aidessa</strong>.</p>
      <p>Our team is currently reviewing your details. Once verified, you will receive an invitation email with a link to complete your registration.</p>
      <p>If you have any questions in the meantime, feel free to contact us at <a href="mailto:Support@aidessa.org" style="color: #085464; font-weight: bold;">Support@aidessa.org</a>.</p>
      <br />
      <hr style="border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 14px; color: #777;">Best regards,<br />The Aidessa Team</p>
    </div>
  `;

  try {
    await sendEmail({ email, subject, message, html });
  } catch (error) {
    console.error('Error sending join confirmation email:', error);
  }
};

const sendVoteAnnouncementEmail = async ({ email, firstName, voteTitle, voteId }) => {
  const envUrl = process.env.CLIENT_URL;
  const clientUrl = (process.env.NODE_ENV === 'production') 
    ? (envUrl && !envUrl.includes('localhost') ? envUrl : 'https://veritasaid.com')
    : (envUrl || 'http://localhost:3001');
  const voteLink = `${clientUrl.replace(/\/+$/, '')}/voting?voteId=${voteId}`;
  const name = firstName || 'Member';
  const subject = `New Vote: ${voteTitle} – Aidessa`;
  const message = `Hi ${name},

A new vote proposal "${voteTitle}" has been opened for community voting on Aidessa.

Please click the link below to cast your vote:
${voteLink}

Thank you for participating in the Aidessa governance process.

Best regards,
The Aidessa Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.6; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #085464; margin-top: 0;">New Governance Vote Announcement</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>A new vote proposal has been created and is now active on <strong>Aidessa</strong>:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #085464; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0; color: #111827;">${voteTitle}</h3>
      </div>
      <p>Your vote matters. Please click the button below to review the proposal details and cast your vote:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${voteLink}" style="background-color: #085464; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Cast Your Vote Now</a>
      </div>
      <p style="font-size: 13px; color: #6b7280;">
        Direct link: <a href="${voteLink}" style="color: #085464;">${voteLink}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0 20px;" />
      <p style="font-size: 14px; color: #4b5563; margin: 0;">
        Sincerely,<br />
        <strong>The Aidessa Team</strong>
      </p>
    </div>
  `;

  try {
    const res = await sendEmail({ email, subject, message, html });
    console.log(`[SMTP] Vote Announcement email successfully sent to: ${email}`);
    return res;
  } catch (error) {
    console.error(`[SMTP ERROR] Error sending vote announcement to ${email}:`, error);
    throw error;
  }
};

const sendOTPEmail = async ({ email, firstName, code, type = 'Password Reset' }) => {
  const name = firstName || 'there';
  const subject = `${type} OTP – Aidessa`;
  const message = `Hi ${name}, Your OTP is: ${code}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <p>Hi ${name},</p>
      <p>Your one-time password (OTP) for <strong>${type}</strong> is:</p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #085464;">${code}</span>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p style="font-size: 14px; color: #666;">If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 14px; color: #777;">Best regards,<br />The Aidessa Team</p>
    </div>
  `;

  try {
    return await sendEmail({ email, subject, message, html });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

const sendVerificationEmail = async ({ email, firstName, token }) => {
  const envUrl = process.env.CLIENT_URL;
  const clientUrl = (process.env.NODE_ENV === 'production') 
    ? (envUrl && !envUrl.includes('localhost') ? envUrl : 'https://veritasaid.com')
    : (envUrl || 'http://localhost:3001');
  const verifyURL = `${clientUrl.replace(/\/+$/, '')}/verify-email/${token}`;
  const name = firstName || 'there';
  const fromAddr = process.env.EMAIL_FROM || process.env.EMAIL_USERNAME || 'Support@aidessa.org';

  const subject = `Confirm your email for Aidessa`;

  const text = `Hello ${name},

Thank you for signing up for Aidessa.

To finish setting up your account, please confirm your email address by opening the link below:

${verifyURL}

This step helps us verify that this email address belongs to you.

If the link above does not open automatically, copy and paste it into your browser.

If you did not create an account with Aidessa, you can safely ignore this message and no further action is required.

Thank you,
Aidessa Team

—
This message was sent because a registration request was made using this email address.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <p>Hello ${name},</p>
      <p>Thank you for signing up for Aidessa.</p>
      <p>To finish setting up your account, please confirm your email address by opening the link below:</p>
      <div style="margin: 20px 0;">
        <a href="${verifyURL}" style="color: #085464; text-decoration: underline;">${verifyURL}</a>
      </div>
      <p>This step helps us verify that this email address belongs to you.</p>
      <p>If the link above does not open automatically, copy and paste it into your browser.</p>
      <p>If you did not create an account with Aidessa, you can safely ignore this message and no further action is required.</p>
      <p>Thank you,<br>Aidessa Team</p>
      <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #777;">
        —<br>
        This message was sent because a registration request was made using this email address.
      </div>
    </div>
  `;

  const transporter = createFreshTransporter();
  const info = await transporter.sendMail({
    from: `"Aidessa" <${fromAddr}>`,
    to: email,
    subject,
    text,
    html,
    replyTo: fromAddr,
    headers: {
      'List-Unsubscribe': `<mailto:${fromAddr}?subject=unsubscribe>`,
      'X-Priority': '3',
    },
  });
  console.log(`[Verification Email] Sent to ${email}. Status: ${info.response}`);
  return info;
};

module.exports = {
  sendPasswordResetEmail,
  getTransporter,
  sendEmail,
  sendWelcomeEmail,
  sendJoinConfirmationEmail,
  sendVoteAnnouncementEmail,
  sendOTPEmail,
  sendVerificationEmail
};