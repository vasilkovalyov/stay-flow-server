export const AUTH_ALGORITHM = 'HS256';
export const HASH_TOKEN_ALGORITHM = 'sha256';

export const JWT_ACCESS_TOKEN_COOKIE_TTL = 15;
export const JWT_REFRESH_TOKEN_COOKIE_TTL = 7;

export const JWT_ACCESS_TOKEN_TTL = `${JWT_ACCESS_TOKEN_COOKIE_TTL}m`;
export const JWT_REFRESH_TOKEN_TTL = `${JWT_REFRESH_TOKEN_COOKIE_TTL}d`;

export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
