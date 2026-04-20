import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE
} from './EmailTemplate.js'

import { sendEmail } from './senGrid.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        await sendEmail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        });

        
    } catch (error) {
        console.error('Error sending verification email', error.response?.body || error.message);
        throw new Error('Error sending verification email');
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        await sendEmail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        });
    } catch (error) {
        console.error('Error sending password reset email', error.response?.body || error.message);
        throw new Error('Error sending password reset email');
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        await sendEmail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: 'Welcome to our website',
            html: WELCOME_EMAIL_TEMPLATE,
        });

        
    } catch (error) {
        console.error('Error sending welcome email', error.response?.body || error.message);
        throw new Error('Error sending welcome email');
    }
};

export const sendRestSuccessEmail = async (email) => {
    try {
        await sendEmail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: 'Password reset successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });

        
    } catch (error) {
        console.error('Error sending reset success email', error.response?.body || error.message);
        throw new Error('Error sending reset success email');
    }
};