declare module 'intuit-oauth' {
    export default class OAuthClient {
        constructor(config: any);
        static scopes: {
            Accounting: string;
            OpenId: string;
            // Add other scopes as needed
        };
        authorizeUri(options: any): string;
        createToken(url: string): Promise<any>;
        refreshUsingToken(refreshToken: string): Promise<any>;
        setToken(token: any): void;
        token: any;
    }
}
