/**
 * Supabase Library — Barrel Index
 * Import everything from here in your components/routes.
 *
 * Examples:
 *   import { getSupabaseBrowserClient } from '@/lib/supabase';
 *   import { createSupabaseAdminClient }   from '@/lib/supabase';
 *   import { getProducts, createOrder }    from '@/lib/supabase/queries/mall';
 *   import { getUserProfile }              from '@/lib/supabase/queries/users';
 */

// Clients
export { getSupabaseBrowserClient, supabase } from './client';
export { createSupabaseServerClient, createSupabaseAdminClient } from './server';

// Domain query helpers
export * from './queries/mall';
export * from './queries/users';
export * from './queries/investments';
export * from './queries/vendors';
export * from './queries/otp';

// Types
export type {
    // Enums
    UserRole, KYCStatus, InvestmentStatus, CommissionStatus,
    VendorStatus, VendorTier, OrderStatus, PaymentStatus,
    ProductStatus, SettlementStatus,
    // Rows
    UserProfileRow, CategoryRow, ProductRow, OrderRow, OrderItemRow,
    InvestmentRow, CommissionLedgerRow, KYCDocumentRow, VendorRow,
    VendorProductRow, VendorOrderRow, VendorSettlementRow,
    OTPVerificationRow, AuditLogRow, RankBonusRow,
    // Inserts
    UserProfileInsert, ProductInsert, OrderInsert, OrderItemInsert,
    InvestmentInsert, VendorInsert, VendorProductInsert,
    VendorOrderInsert, CommissionLedgerInsert, OTPVerificationInsert, AuditLogInsert,
    // Updates
    UserProfileUpdate, ProductUpdate, OrderUpdate,
    VendorUpdate, VendorProductUpdate, VendorOrderUpdate,
    // Responses
    SupabaseResult, PaginatedResult,
} from './types';
