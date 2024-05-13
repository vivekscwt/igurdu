declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_TOKEN: string;
      AWS_S3_BUCKET: string;
      AWS_KEY_ID: string;
      AWS_ACCESS_KEY: string;
      AWS_REGION: 'us-east-2';
      PORT: string;
      APP_NAME: string;
      NODE_ENV: 'local' | 'production' | 'development';
      TZ: 'UTC';
      DATABASE_NAME: string;
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
      DATABASE_HOST: string;
      DATABASE_PORT: string;

      SENDGRID_EMAIL: string;
      SENDGRID_API_URL: string;
      SENDGRID_API_KEY: string;

      REDIS_URL: string;

      ENCRYPTION_SECRET_KEY: string;
    }
  }
}

export { }