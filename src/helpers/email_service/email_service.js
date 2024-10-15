const nodemailer = require("nodemailer");
const config = require('../../config/config')


/***
 * Send Email
 */
const mailService = async (to, sub, html) => {
    let response = { success: true }
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // SMTP server
            port: 587,
            secure: false,
            auth: {
                user: config.email_service.email,
                pass: config.email_service.password,
            },
        });
        let mailOption = {
            from: config.email_service.email,
            to: to,
            subject: sub,
            html: html,
        };
        await transporter.sendMail(mailOption);
    } catch (e) {
        response.success = false
    }
    finally {
        return response
    }
};


module.exports = { mailService };
