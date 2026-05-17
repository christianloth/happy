import { MMKV } from 'react-native-mmkv';

// Separate MMKV instance for server config that persists across logouts
const serverConfigStorage = new MMKV({ id: 'server-config' });

const SERVER_KEY = 'custom-server-url';
const LOG_SERVER_KEY = 'log-server-url';
const VOICE_LK_KEY = 'voice-livekit-url';
const VOICE_TOKEN_FETCH_KEY = 'voice-token-fetch-url';
const DEFAULT_SERVER_URL = 'https://api.cluster-fluster.com';
const DEFAULT_VOICE_LK_URL = 'wss://livekit.rtc.elevenlabs.io';

export function getServerUrl(): string {
    return serverConfigStorage.getString(SERVER_KEY) ||
           (globalThis as any).__HAPPY_CONFIG__?.serverUrl ||
           process.env.EXPO_PUBLIC_HAPPY_SERVER_URL ||
           DEFAULT_SERVER_URL;
}

export function setServerUrl(url: string | null): void {
    if (url && url.trim()) {
        serverConfigStorage.set(SERVER_KEY, url.trim());
    } else {
        serverConfigStorage.delete(SERVER_KEY);
    }
}

export function getLogServerUrl(): string | null {
    return serverConfigStorage.getString(LOG_SERVER_KEY) ||
           process.env.EXPO_PUBLIC_LOG_SERVER_URL ||
           null;
}

export function setLogServerUrl(url: string | null): void {
    if (url && url.trim()) {
        serverConfigStorage.set(LOG_SERVER_KEY, url.trim());
    } else {
        serverConfigStorage.delete(LOG_SERVER_KEY);
    }
}

export function isUsingCustomServer(): boolean {
    return getServerUrl() !== DEFAULT_SERVER_URL;
}

export function getVoiceLiveKitUrl(): string {
    return serverConfigStorage.getString(VOICE_LK_KEY) ||
           (globalThis as any).__HAPPY_CONFIG__?.voiceLiveKitUrl ||
           process.env.EXPO_PUBLIC_VOICE_LIVEKIT_URL ||
           DEFAULT_VOICE_LK_URL;
}

export function setVoiceLiveKitUrl(url: string | null): void {
    if (url && url.trim()) {
        serverConfigStorage.set(VOICE_LK_KEY, url.trim());
    } else {
        serverConfigStorage.delete(VOICE_LK_KEY);
    }
}

export function getVoiceTokenFetchUrl(): string | undefined {
    return serverConfigStorage.getString(VOICE_TOKEN_FETCH_KEY) ||
           (globalThis as any).__HAPPY_CONFIG__?.voiceTokenFetchUrl ||
           process.env.EXPO_PUBLIC_VOICE_TOKEN_FETCH_URL ||
           undefined;
}

export function setVoiceTokenFetchUrl(url: string | null): void {
    if (url && url.trim()) {
        serverConfigStorage.set(VOICE_TOKEN_FETCH_KEY, url.trim());
    } else {
        serverConfigStorage.delete(VOICE_TOKEN_FETCH_KEY);
    }
}

export function isUsingCustomVoiceLiveKit(): boolean {
    return getVoiceLiveKitUrl() !== DEFAULT_VOICE_LK_URL;
}

export function getServerInfo(): { hostname: string; port?: number; isCustom: boolean } {
    const url = getServerUrl();
    const isCustom = isUsingCustomServer();
    
    try {
        const parsed = new URL(url);
        const port = parsed.port ? parseInt(parsed.port) : undefined;
        return {
            hostname: parsed.hostname,
            port,
            isCustom
        };
    } catch {
        // Fallback if URL parsing fails
        return {
            hostname: url,
            port: undefined,
            isCustom
        };
    }
}

export function validateServerUrl(url: string): { valid: boolean; error?: string } {
    if (!url || !url.trim()) {
        return { valid: false, error: 'Server URL cannot be empty' };
    }
    
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return { valid: false, error: 'Server URL must use HTTP or HTTPS protocol' };
        }
        return { valid: true };
    } catch {
        return { valid: false, error: 'Invalid URL format' };
    }
}