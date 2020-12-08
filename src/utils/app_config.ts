import 'dotenv/config';

export const app_config = {
  ngrok: {
    enabled: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 9001,
    subdomain: process.env.NGROK_SUBDOMAIN,
    authtoken: process.env.NGROK_AUTHTOKEN,
  },
};
