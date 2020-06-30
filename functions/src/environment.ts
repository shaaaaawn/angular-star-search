import { config } from 'dotenv';
config();

export const environments = {
  production: {
    production: true,
    base_url: process.env.FIREBASE_BASE_URL,
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      databaseURL: process.env.FIREBASE_DB_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    },
    debounce: {
      key: process.env.DEBOUNCE_KEY,
      public_key: process.env.DEBOUNCE_PUBLIC_KEY,
    },
    airtable: {
      endpoint: 'https://api.airtable.com',
      key: process.env.AIRTABLE_KEY,
      base: process.env.AIRTABLE_BASE,
    },
  },
};
// Production
const _env = environments.production;
//Local Dev
if (process.env.NODE_ENV === 'development') {
  _env.base_url = 'http://localhost:5000';
}
export const environment = _env;
