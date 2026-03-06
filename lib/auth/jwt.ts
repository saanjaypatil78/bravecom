/**
 * JWT Token Management for BRAVECOM Sunray Ecosystem
 * Access tokens: 15-minute expiry, Refresh tokens: 7-day expiry
 */
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

// Types
export interface JWTPayload {
    userId: string;
    email: string;
    role: number;
    permissions: string[];
    twoFactorEnabled: boolean;
    iat?: number;
    exp?: number;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
}

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-jwt-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.NEXTAUTH_SECRET || 'dev-refresh-secret';
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

// Generate access token
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY, algorithm: 'HS256' });
}

// Generate refresh token
export function generateRefreshToken(payload: Pick<JWTPayload, 'userId' | 'email'>): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY, algorithm: 'HS256' });
}

// Generate token pair
export function generateTokenPair(userData: {
    userId: string;
    email: string;
    role: number;
    permissions: string[];
    twoFactorEnabled: boolean;
}): TokenPair {
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken({ userId: userData.userId, email: userData.email });
    return { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_EXPIRY, refreshExpiresIn: REFRESH_TOKEN_EXPIRY };
}

// Verify access token
export function verifyAccessToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as JWTPayload;
    } catch (error) {
        console.error('[JWT] Access token verification failed:', error);
        return null;
    }
}

// Verify refresh token
export function verifyRefreshToken(token: string): { userId: string; email: string } | null {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET, { algorithms: ['HS256'] }) as { userId: string; email: string };
    } catch (error) {
        console.error('[JWT] Refresh token verification failed:', error);
        return null;
    }
}

// Decode token without verification
export function decodeToken(token: string): JWTPayload | null {
    try {
        return jwt.decode(token) as JWTPayload;
    } catch (error) {
        console.error('[JWT] Token decode failed:', error);
        return null;
    }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwt.decode(token) as { exp?: number };
        if (!decoded?.exp) return true;
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

// Get token expiration time
export function getTokenExpiration(token: string): Date | null {
    try {
        const decoded = jwt.decode(token) as { exp?: number };
        if (!decoded?.exp) return null;
        return new Date(decoded.exp * 1000);
    } catch {
        return null;
    }
}

// Supabase Integration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Get user data from database
export async function getUserDataFromDB(userId: string): Promise<{
    userId: string;
    email: string;
    role: number;
    permissions: string[];
    twoFactorEnabled: boolean;
} | null> {
    try {
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('id, email, role, permissions, two_factor_enabled')
            .eq('id', userId)
            .single();
        if (error || !profile) {
            console.error('[JWT] Failed to fetch user data:', error);
            return null;
        }
        const roleLevel = getRoleLevel(profile.role);
        return {
            userId: profile.id,
            email: profile.email,
            role: roleLevel,
            permissions: profile.permissions || [],
            twoFactorEnabled: profile.two_factor_enabled || false,
        };
    } catch (error) {
        console.error('[JWT] Database error:', error);
        return null;
    }
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<TokenPair | null> {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) return null;
    const userData = await getUserDataFromDB(payload.userId);
    if (!userData) return null;
    return generateTokenPair(userData);
}

// Role level mapping
function getRoleLevel(role: string): number {
    const roleLevels: Record<string, number> = {
        guest: 1, registered: 2, investor: 3, vendor: 4, finance: 5, compliance: 6, admin: 7, super_admin: 8, system: 9, root: 10,
    };
    return roleLevels[role.toLowerCase()] || 2;
}

// Extract token from header
export function extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.substring(7);
}

// Create auth response
export function createAuthResponse(userData: {
    userId: string;
    email: string;
    role: number;
    permissions: string[];
    twoFactorEnabled: boolean;
}) {
    const tokens = generateTokenPair(userData);
    return {
        success: true,
        user: { id: userData.userId, email: userData.email, role: userData.role, permissions: userData.permissions, twoFactorEnabled: userData.twoFactorEnabled },
        tokens,
    };
}
