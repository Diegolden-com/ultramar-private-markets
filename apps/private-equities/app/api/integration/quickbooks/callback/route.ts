import { NextResponse, NextRequest } from 'next/server';
import { getQBClient } from '@/lib/quickbooks/client';
import { storeToken } from '@/lib/quickbooks/auth';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const url = req.url; // Contains the full URL with query params

    // Parse the callback URL
    const oauthClient = getQBClient();

    try {
        const authResponse = await oauthClient.createToken(url);
        const tokenData = authResponse.getJson();

        // Extract realmId directly from URL if missing in tokenData
        // QuickBooks passes it as a query param `realmId`
        const realmId = searchParams.get('realmId') || tokenData.realmId;

        // TODO: Get real user ID from session. For V1 we might hardcode or use a param.
        // Assuming we have a way to identify the user, e.g. from a cookie or the 'state' param if we encoded it.
        const userId = 'user_123'; // Mock placeholder

        await storeToken(userId, { ...tokenData, realmId });

        return NextResponse.redirect(new URL('/oracle', req.url));
    } catch (e) {
        console.error('OAuth Callback Error:', e);
        return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
    }
}
