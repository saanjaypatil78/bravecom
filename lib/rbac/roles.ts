/**
 * 10-Level Role-Based Access Control (RBAC) System
 * Role hierarchy: higher = more permissions
 */

// User Roles Enum
export enum UserRole {
    GUEST = 1,        // Guest - public access only
    REGISTERED = 2,   // Registered - basic access
    INVESTOR = 3,     // Investor - investment features
    VENDOR = 4,       // Vendor - vendor portal
    FINANCE = 5,      // Finance - payout access
    COMPLIANCE = 6,   // Compliance - KYC verification
    ADMIN = 7,        // Admin - user management
    SUPER_ADMIN = 8,  // Super Admin - system config
    SYSTEM = 9,       // System - automated operations
    ROOT = 10          // Root - full access
}

// Role display names
export const RoleNames: Record<UserRole, string> = {
    [UserRole.GUEST]: 'Guest',
    [UserRole.REGISTERED]: 'Registered',
    [UserRole.INVESTOR]: 'Investor',
    [UserRole.VENDOR]: 'Vendor',
    [UserRole.FINANCE]: 'Finance',
    [UserRole.COMPLIANCE]: 'Compliance',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.SYSTEM]: 'System',
    [UserRole.ROOT]: 'Root',
};

// Role descriptions
export const RoleDescriptions: Record<UserRole, string> = {
    [UserRole.GUEST]: 'Public access only - view public content',
    [UserRole.REGISTERED]: 'Basic registered user - access to personal dashboard',
    [UserRole.INVESTOR]: 'Investor - investment features and portfolio',
    [UserRole.VENDOR]: 'Vendor - vendor portal access',
    [UserRole.FINANCE]: 'Finance - payout processing access',
    [UserRole.COMPLIANCE]: 'Compliance - KYC verification access',
    [UserRole.ADMIN]: 'Admin - user management and moderation',
    [UserRole.SUPER_ADMIN]: 'Super Admin - system configuration',
    [UserRole.SYSTEM]: 'System - automated operations',
    [UserRole.ROOT]: 'Root - full system access',
};

// Check if user role meets required role
export function hasRole(userRole: number, requiredRole: number): boolean {
    return userRole >= requiredRole;
}

// Get role by name
export function getRoleByName(name: string): UserRole | null {
    const role = Object.keys(UserRole).find(
        key => UserRole[key as keyof typeof UserRole] === name.toUpperCase()
    );
    return role ? UserRole[role as keyof typeof UserRole] : null;
}

// Get role hierarchy path
export function getRoleHierarchy(role: UserRole): UserRole[] {
    const hierarchy: UserRole[] = [];
    for (let i = role; i <= UserRole.ROOT; i++) {
        hierarchy.push(i as UserRole);
    }
    return hierarchy;
}

// Role-based route access
export const RoleRouteAccess: Record<string, UserRole> = {
    '/': UserRole.GUEST,
    '/login': UserRole.GUEST,
    '/register': UserRole.GUEST,
    '/dashboard': UserRole.REGISTERED,
    '/dashboard/investments': UserRole.INVESTOR,
    '/dashboard/vendor': UserRole.VENDOR,
    '/dashboard/finance': UserRole.FINANCE,
    '/dashboard/compliance': UserRole.COMPLIANCE,
    '/dashboard/admin': UserRole.ADMIN,
    '/dashboard/super-admin': UserRole.SUPER_ADMIN,
};

// Role colors for UI
export const RoleColors: Record<UserRole, string> = {
    [UserRole.GUEST]: '#9CA3AF',
    [UserRole.REGISTERED]: '#3B82F6',
    [UserRole.INVESTOR]: '#10B981',
    [UserRole.VENDOR]: '#F59E0B',
    [UserRole.FINANCE]: '#8B5CF6',
    [UserRole.COMPLIANCE]: '#EC4899',
    [UserRole.ADMIN]: '#EF4444',
    [UserRole.SUPER_ADMIN]: '#DC2626',
    [UserRole.SYSTEM]: '#6B7280',
    [UserRole.ROOT]: '#000000',
};
