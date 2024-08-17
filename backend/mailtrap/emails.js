import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE
} from './emailTemplates.js'
import { mailtrapClient, sender } from './mailtrap.config.js'

export const sendVerificationEmail = async (email, verificationCode) => {
  const recipients = [{ email }]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationCode
      ),
      category: 'Email Verification'
    })

    console.log('Email sent successfully', response)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error(`Failed to send verification email ${error.message}`)
  }
}

export const sendEmailWelcome = async (email, name) => {
  const recipients = [{ email }]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: 'f12f8382-8dc4-40a4-a32f-0271fede4fe5',
      template_variables: {
        company_info_name: 'Auth04 Company',
        name,
        company_info_address: '36 Mieu Dam, Ha Noi',
        company_info_city: 'Ha Noi',
        company_info_zip_code: '400000',
        company_info_country: 'Viet Nam'
      }
    })

    console.log('Email sent successfully', response)
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw new Error(`Failed to send welcome email ${error.message}`)
  }
}

export const sendResetPasswordEmail = async (email, resetURL) => {
  const recipients = [{ email }]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: 'Reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL)
    })
    console.log('Email sent successfully', response)
  } catch (error) {
    console.error('Error sending reset password email:', error)
    throw new Error(`Failed to send reset password email ${error.message}`)
  }
}

export const sendResetEmailSuccess = async (email, resetURL) => {
  const recipients = [{ email }]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: 'Password Reset Successfully',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password Reset'
    })
    console.log('Email sent successfully', response)
  } catch (error) {
    console.error('Error sending reset password email:', error)
    throw new Error(`Failed to send reset password email ${error.message}`)
  }
}
