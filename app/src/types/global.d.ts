export {};

declare global {
    interface Window {
        smartLoginSecurity: {
            apiUrl: string;
            nonce: string;
        };
    }
}