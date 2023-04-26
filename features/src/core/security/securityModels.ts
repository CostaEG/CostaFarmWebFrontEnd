export interface Credentials {
    username: string;
    password: string;
}

export interface SecurityContext {
    identity: Identity;
    Tenant?: Tenant;
    scopes?: string[];    
    token?: TokenInfo;
}

export interface TokenInfo {
    identityToken?: string;
    accessToken: string;
    expiresIn: number;
    expiresAt?: number;   
    refreshToken?: string;
}

export interface Identity {
    id: string;
    name: string;
    impersonator?: string;
}

export interface Tenant {
    id: string;
    code: string;
    name: string;
}