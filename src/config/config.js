require('dotenv').config();

module.exports = {
     port: process.env.PORT || '3000',
     db_url: process.env.DB_URL || 'Database URL',
     project_path: process.env.PROJECT_PATH || 'http://localhost:3000',
     frontend_base_url: process.env.FRONTEND_BASE_URL || 'http://localhost:3000',
     email_service: {
          email: process.env.EMAIL || 'Email',
          password: process.env.PASSWORD || 'Password',
          support_center_email: process.env.SUPPORT_CENTER_EMAIL || 'Support Center Email',
     },
     jwt: {
          secret: process.env.JWT_SECRET || 'ezezxrdctgvuhnijminivtfcrxetvyn',
          session_token_expiry_time: process.env.SESSION_TOKEN_EXPIRE_TIME || '1d',
          forgot_link_expiry_time: process.env.FORGOT_LINK_EXPIRE_TIME || '10m',
     }
}