declare module 'intuit-oauth' {
    export interface OAuthClientConfig {
        clientId: string;
        clientSecret: string;
        environment?: string;
        redirectUri: string;
        [key: string]: unknown;
    }

    export interface OAuthAuthorizeOptions {
        scope?: string[];
        state?: string;
        [key: string]: unknown;
    }

    export interface OAuthToken {
        access_token: string;
        refresh_token: string;
        realmId?: string;
        expires_in?: number;
        [key: string]: unknown;
    }

    export interface OAuthTokenResponse {
        getJson(): OAuthToken;
    }

    export default class OAuthClient {
        constructor(config: OAuthClientConfig);
        static scopes: {
            Accounting: string;
            OpenId: string;
            [key: string]: string;
        };
        authorizeUri(options: OAuthAuthorizeOptions): string;
        createToken(url: string): Promise<OAuthTokenResponse>;
        refreshUsingToken(refreshToken: string): Promise<OAuthTokenResponse>;
        setToken(token: OAuthToken): void;
        token: OAuthToken;
    }
}
