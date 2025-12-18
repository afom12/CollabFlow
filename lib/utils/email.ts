/**
 * Email notification utilities
 * Uses Resend API for sending emails
 */

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

/**
 * Send an email notification
 */
export async function sendEmail(options: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Email not sent (RESEND_API_KEY not configured):", options)
    return { success: true, id: "demo-email-id" }
  }

  try {
    const result = await resend.emails.send({
      from: options.from || process.env.EMAIL_FROM || "CollabFlow <noreply@collabflow.com>",
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    return { success: true, id: result.id }
  } catch (error) {
    console.error("Failed to send email:", error)
    return {
      success: false,
      error: "Failed to send email",
    }
  }
}

/**
 * Send mention notification email
 */
export async function sendMentionEmail(
  to: string,
  userName: string,
  context: string,
  link: string
) {
  return sendEmail({
    to,
    subject: `${userName} mentioned you in ${context}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You were mentioned!</h2>
        <p>${userName} mentioned you in ${context}.</p>
        <p>
          <a href="${link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View ${context}
          </a>
        </p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from CollabFlow.
        </p>
      </div>
    `,
  })
}

/**
 * Send comment notification email
 */
export async function sendCommentEmail(
  to: string,
  userName: string,
  context: string,
  commentPreview: string,
  link: string
) {
  return sendEmail({
    to,
    subject: `${userName} commented on ${context}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New comment</h2>
        <p>${userName} commented on ${context}:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p style="margin: 0;">${commentPreview}</p>
        </div>
        <p>
          <a href="${link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View comment
          </a>
        </p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from CollabFlow.
        </p>
      </div>
    `,
  })
}

/**
 * Send assignment notification email
 */
export async function sendAssignmentEmail(
  to: string,
  userName: string,
  issueTitle: string,
  link: string
) {
  return sendEmail({
    to,
    subject: `You were assigned to "${issueTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New assignment</h2>
        <p>${userName} assigned you to:</p>
        <h3 style="margin: 15px 0;">${issueTitle}</h3>
        <p>
          <a href="${link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View issue
          </a>
        </p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from CollabFlow.
        </p>
      </div>
    `,
  })
}

