import { getQBClient } from './client';
import { getToken, storeToken } from './auth';

export async function getCompanyInfo(userId: string) {
    const tokenData = await getToken(userId);
    if (!tokenData) throw new Error("No QuickBooks connection found");

    const qbClient = getQBClient();

    // Check if token is expired and refresh if necessary
    if (new Date(tokenData.expires_at) < new Date()) {
        try {
            const authResponse = await qbClient.refreshUsingToken(tokenData.refresh_token);
            await storeToken(userId, { ...authResponse.getJson(), realmId: tokenData.realm_id });
            qbClient.setToken(authResponse.getJson());
        } catch (e) {
            console.error("Error refreshing token", e);
            throw new Error("Session expired, please reconnect QuickBooks");
        }
    } else {
        qbClient.setToken({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
        });
    }

    // Example call to fetch Company Info
    // Note: intuit-oauth is mainly for Auth. To make API calls, we often use the token 
    // to make direct fetch requests or use a library like 'node-quickbooks'.
    // For simplicity in this V1, we will use direct fetch with the access token.

    const realmId = tokenData.realm_id;
    const accessToken = qbClient.token.access_token;
    const baseURL = process.env.QB_ENVIRONMENT === 'production'
        ? 'https://quickbooks.api.intuit.com'
        : 'https://sandbox-quickbooks.api.intuit.com';

    const url = `${baseURL}/v3/company/${realmId}/companyinfo/${realmId}?minorversion=65`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`QuickBooks API Error: ${response.statusText}`);
    }

    return await response.json();
}

export async function getBalanceSheet(userId: string) {
    // Similar logic to fetch Balance Sheet report
    // ... logic to ensure valid token ...
    const tokenData = await getToken(userId);
    if (!tokenData) throw new Error("No QuickBooks connection found");

    const qbClient = getQBClient();

    // Check if token is expired and refresh if necessary
    if (new Date(tokenData.expires_at) < new Date()) {
        try {
            const authResponse = await qbClient.refreshUsingToken(tokenData.refresh_token);
            await storeToken(userId, { ...authResponse.getJson(), realmId: tokenData.realm_id });
            qbClient.setToken(authResponse.getJson());
        } catch (e) {
            console.error("Error refreshing token", e);
            throw new Error("Session expired, please reconnect QuickBooks");
        }
    } else {
        qbClient.setToken({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
        });
    }

    const realmId = tokenData.realm_id;
    const accessToken = qbClient.token.access_token;
    const baseURL = process.env.QB_ENVIRONMENT === 'production'
        ? 'https://quickbooks.api.intuit.com'
        : 'https://sandbox-quickbooks.api.intuit.com';

    const url = `${baseURL}/v3/company/${realmId}/reports/BalanceSheet?minorversion=65`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    return await response.json();
}
