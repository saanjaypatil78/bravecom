/**
 * Permission System for RBAC
 * Format: module:resource:action
 */
import { UserRole } from './roles';

// All permission codes
export enum Permission {
    // Registration Module
    REGISTRATION_SUBMIT_CREATE = 'registration:submit:create',
    REGISTRATION_REFERRAL_VALIDATE = 'registration:referral:validate',

    // KYC Module
    KYC_DOCUMENT_UPLOAD = 'kyc:document:upload',
    KYC_DOCUMENT_VERIFY = 'kyc:document:verify',
    KYC_STATUS_READ = 'kyc:status:read',

    // Investment Module
    INVESTMENT_CREATE_CREATE = 'investment:create:create',
    INVESTMENT_LIST_READ = 'investment:list:read',
    INVESTMENT_WITHDRAW_CREATE = 'investment:withdraw:create',

    // Vendor Module
    VENDOR_REGISTER_CREATE = 'vendor:register:create',
    VENDOR_PRODUCT_CREATE = 'vendor:product:create',
    VENDOR_PRODUCT_LIST = 'vendor:product:list',
    VENDOR_ORDER_READ = 'vendor:order:read',

    // Commission Module
    COMMISSION_CALCULATE_READ = 'commission:calculate:read',
    COMMISSION_HISTORY_READ = 'commission:history:read',

    // Payout Module
    PAYOUT_REQUEST_CREATE = 'payout:request:create',
    PAYOUT_APPROVE_UPDATE = 'payout:approve:update',
    PAYOUT_HISTORY_READ = 'payout:history:read',

    // Admin Module
    ADMIN_USER_LIST = 'admin:user:list',
    ADMIN_USER_UPDATE = 'admin:user:update',
    ADMIN_ROLE_ASSIGN = 'admin:role:assign',
    ADMIN_AUDIT_READ = 'admin:audit:read',

    // System Module
    SYSTEM_CONFIG_UPDATE = 'system:config:update',
    SYSTEM_WEBHOOK_MANAGE = 'system:webhook:manage',
}

// Role-based permissions (each role includes all permissions from lower roles)
export const RolePermissions: Record<UserRole, Permission[]> = {
    // Guest - no permissions
    [UserRole.GUEST]: [],

    // Registered - basic access
    [UserRole.REGISTERED]: [
        Permission.REGISTRATION_SUBMIT_CREATE,
        Permission.REGISTRATION_REFERRAL_VALIDATE,
        Permission.KYC_STATUS_READ,
        Permission.INVESTMENT_LIST_READ,
    ],

    // Investor - investment features
    [UserRole.INVESTOR]: [
        ...RolePermissions[UserRole.REGISTERED],
        Permission.INVESTMENT_CREATE_CREATE,
        Permission.INVESTMENT_WITHDRAW_CREATE,
        Permission.COMMISSION_HISTORY_READ,
        Permission.PAYOUT_REQUEST_CREATE,
        Permission.PAYOUT_HISTORY_READ,
    ],

    // Vendor - vendor portal
    [UserRole.VENDOR]: [
        ...RolePermissions[UserRole.REGISTERED],
        Permission.VENDOR_REGISTER_CREATE,
        Permission.VENDOR_PRODUCT_CREATE,
        Permission.VENDOR_PRODUCT_LIST,
        Permission.VENDOR_ORDER_READ,
    ],

    // Finance - payout access
    [UserRole.FINANCE]: [
        ...RolePermissions[UserRole.INVESTOR],
        Permission.COMMISSION_CALCULATE_READ,
        Permission.PAYOUT_APPROVE_UPDATE,
    ],

    // Compliance - KYC verification
    [UserRole.COMPLIANCE]: [
        ...RolePermissions[UserRole.REGISTERED],
        Permission.KYC_DOCUMENT_UPLOAD,
        Permission.KYC_DOCUMENT_VERIFY,
        Permission.KYC_STATUS_READ,
    ],

    // Admin - user management
    [UserRole.ADMIN]: [
        ...RolePermissions[UserRole.COMPLIANCE],
        ...RolePermissions[UserRole.FINANCE],
        Permission.ADMIN_USER_LIST,
        Permission.ADMIN_USER_UPDATE,
        Permission.ADMIN_ROLE_ASSIGN,
        Permission.ADMIN_AUDIT_READ,
    ],

    // Super Admin - system config
    [UserRole.SUPER_ADMIN]: [
        ...RolePermissions[UserRole.ADMIN],
        Permission.SYSTEM_CONFIG_UPDATE,
    ],

    // System - automated operations
    [UserRole.SYSTEM]: [
        ...RolePermissions[UserRole.SUPER_ADMIN],
    ],

    // Root - full access
    [UserRole.ROOT]: Object.values(Permission),
};

// Get permissions for a role
export function getRolePermissions(role: number): string[] {
    const permissions = RolePermissions[role as UserRole] || [];
    return permissions.map(p => p.toString());
}

// Check if user has a specific permission
export function hasPermission(permissions: string[], required: string): boolean {
    return permissions.includes(required);
}

// Check if user has any of the required permissions
export function hasAnyPermission(permissions: string[], required: string[]): boolean {
    return required.some(p => permissions.includes(p));
}

// Check if user has all required permissions
export function hasAllPermissions(permissions: string[], required: string[]): boolean {
    return required.every(p => permissions.includes(p));
}

// Check if user role meets required role level
export function hasRoleLevel(userRole: number, requiredRole: number): boolean {
    return userRole >= requiredRole;
}

// Get all permissions as flat array
export function getAllPermissions(): string[] {
    return Object.values(Permission);
}

// Permission categories for UI grouping
export const PermissionCategories = {
    registration: {
        name: 'Registration',
        permissions: [
            Permission.REGISTRATION_SUBMIT_CREATE,
            Permission.REGISTRATION_REFERRAL_VALIDATE,
        ],
    },
    kyc: {
        name: 'KYC',
        permissions: [
            Permission.KYC_DOCUMENT_UPLOAD,
            Permission.KYC_DOCUMENT_VERIFY,
            Permission.KYC_STATUS_READ,
        ],
    },
    investment: {
        name: 'Investment',
        permissions: [
            Permission.INVESTMENT_CREATE_CREATE,
            Permission.INVESTMENT_LIST_READ,
            Permission.INVESTMENT_WITHDRAW_CREATE,
        ],
    },
    vendor: {
        name: 'Vendor',
        permissions: [
            Permission.VENDOR_REGISTER_CREATE,
            Permission.VENDOR_PRODUCT_CREATE,
            Permission.VENDOR_PRODUCT_LIST,
            Permission.VENDOR_ORDER_READ,
        ],
    },
    commission: {
        name: 'Commission',
        permissions: [
            Permission.COMMISSION_CALCULATE_READ,
            Permission.COMMISSION_HISTORY_READ,
        ],
    },
    payout: {
        name: 'Payout',
        permissions: [
            Permission.PAYOUT_REQUEST_CREATE,
            Permission.PAYOUT_APPROVE_UPDATE,
            Permission.PAYOUT_HISTORY_READ,
        ],
    },
    admin: {
        name: 'Admin',
        permissions: [
            Permission.ADMIN_USER_LIST,
            Permission.ADMIN_USER_UPDATE,
            Permission.ADMIN_ROLE_ASSIGN,
            Permission.ADMIN_AUDIT_READ,
        ],
    },
    system: {
        name: 'System',
        permissions: [
            Permission.SYSTEM_CONFIG_UPDATE,
            Permission.SYSTEM_WEBHOOK_MANAGE,
        ],
    },
};
