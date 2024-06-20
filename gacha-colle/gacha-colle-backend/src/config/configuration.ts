export default () => ({
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  encrypt: {
    secretKey: process.env.SECRET_KEY,
  },
  sendGrid: {
    apiKey: process.env.SENDGRID_KEY,
    from: process.env.SENDGRID_FROM,
  },
  gcp: {
    projectId: process.env.GCP_PROJECT_ID,
    clientEmail: process.env.GCP_CLIENT_EMAIL,
    privateKey: process.env.GCP_PRIVATE_KEY,
    bucketName: process.env.GCP_BUCKET_NAME,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
  website: {
    domain: process.env.WEBSITE_DOMAIN,
  },
  api: {
    domain: process.env.API_DOMAIN,
  },
  email: {
    email_verification_url: process.env.EMAIL_VERIFICATION_URL,
    password_reset_url: process.env.PASSWORD_RESET_URL,
    email_verification_subject: process.env.EMAIL_VERIFICATION_SUBJECT,
    password_reset_subject: process.env.PASSWORD_RESET_SUBJECT,
    email_verification_template: process.env.EMAIL_VERIFICATION_TEMPLATE,
    password_reset_template: process.env.PASSWORD_RESET_TEMPLATE,
  },
  redis: {
    url: process.env.REDIS_URL,
  }
});
