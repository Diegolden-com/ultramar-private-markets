import OAuthClient from 'intuit-oauth';

export const getQBClient = () => {
    return new OAuthClient({
        clientId: process.env.QB_CLIENT_ID || '',
        clientSecret: process.env.QB_CLIENT_SECRET || '',
        environment: process.env.QB_ENVIRONMENT || 'sandbox', // 'sandbox' or 'production'
        redirectUri: process.env.QB_REDIRECT_URI || 'http://localhost:3000/api/integration/quickbooks/callback',
    });
};
