import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const oauth2client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

export { oauth2client };