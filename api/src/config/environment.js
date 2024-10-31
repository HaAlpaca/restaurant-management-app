import "dotenv/config";
export const env = {
  PORT: process.env.PORT,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  PGSQL_CONNECTIONSTRING: process.env.PGSQL_CONNECTIONSTRING,
  PGSQL_CONNECTIONSTRING2: process.env.PGSQL_CONNECTIONSTRING2,
  BUILD_MODE: process.env.BUILD_MODE,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  jwksUri: process.env.jwksUri,
  issuer: process.env.issuer,
  audience: process.env.audience,
};
