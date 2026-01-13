import { NextResponse } from 'next/server';
import { getQBClient } from '@/lib/quickbooks/client';
import OAuthClient from 'intuit-oauth';

export async function GET() {
    const oauthClient = getQBClient();

    const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
        state: 'testState', // In prod, use a random string to prevent CSRF
    });

    return NextResponse.redirect(authUri);
}
