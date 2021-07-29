import dotenv from 'dotenv';
dotenv.config();


export const __prod__ = process.env.NODE_ENV === 'production';
export const __db_name__ = process.env.DB_NAME;
export const __db_user__ = process.env.DB_USER;
export const __db_pw__ = process.env.DB_PASSWORD;
export const __db_type__ = process.env.DB_TYPE;
