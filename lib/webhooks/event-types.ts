// ============================================================================
// WEBHOOK EVENT TYPES - Sunray Ecosystem
// ============================================================================

export const WEBHOOK_EVENT_TYPES = {
    // Commission Events
    COMMISSION_DISTRIBUTED: 'COMMISSION_DISTRIBUTED',
    COMMISSION_PROCESSED: 'COMMISSION_PROCESSED',
    RECURRING_COMMISSION_RUN: 'RECURRING_COMMISSION_RUN',

    // User Events
    USER_REGISTERED: 'USER_REGISTERED',
    USER_ACTIVATED: 'USER_ACTIVATED',
    USER_KYC_UPDATED: 'USER_KYC_UPDATED',
    
    // Investment Events
    INVESTMENT_CREATED: 'INVESTMENT_CREATED',
    INVESTMENT_CONFIRMED: 'INVESTMENT_CONFIRMED',
    INVESTMENT_COMPLETED: 'INVESTMENT_COMPLETED',

    // Rank Dynamics (Bi-Directional Autonomous System)
    USER_RANK_UPGRADED: 'USER_RANK_UPGRADED',
    USER_RANK_DOWNGRADED: 'USER_RANK_DOWNGRADED',
    USER_RANK_MAINTAINED: 'USER_RANK_MAINTAINED',
    RANK_WARNING_ISSUED: 'RANK_WARNING_ISSUED',
    RANK_WARNING_RESOLVED: 'RANK_WARNING_RESOLVED',
    RANK_REVERSED: 'RANK_REVERSED',
    RANK_EVALUATION_BATCH_COMPLETE: 'RANK_EVALUATION_BATCH_COMPLETE',
    RANK_GRACE_PERIOD_STARTED: 'RANK_GRACE_PERIOD_STARTED',
    RANK_GRACE_PERIOD_ENDED: 'RANK_GRACE_PERIOD_ENDED',
    
    // Franchise Events
    FRANCHISE_STATUS_CHANGED: 'FRANCHISE_STATUS_CHANGED',
    FRANCHISE_ROYALTY_CALCULATED: 'FRANCHISE_ROYALTY_CALCULATED',
    
    // System Events
    SYSTEM_BACKUP_COMPLETE: 'SYSTEM_BACKUP_COMPLETE',
    SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE',
} as const;

export type WebhookEventType = typeof WEBHOOK_EVENT_TYPES[keyof typeof WEBHOOK_EVENT_TYPES];

// ============================================================================
// WEBHOOK PRIORITY LEVELS
// ============================================================================
export const WEBHOOK_PRIORITY = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    CRITICAL: 'critical',
} as const;

export type WebhookPriority = typeof WEBHOOK_PRIORITY[keyof typeof WEBHOOK_PRIORITY];

// ============================================================================
// RANK DYNAMICS EVENT PAYLOADS
// ============================================================================
export interface UserRankUpgradedPayload {
    userId: string;
    previousRank: string;
    newRank: string;
    changeType: 'UPGRADE';
    reason: string;
    previousCommission: Record<string, number>;
    newCommission: Record<string, number>;
    commissionDifference: number;
    performanceScore: number;
    totalBusiness: number;
}

export interface UserRankDowngradedPayload {
    userId: string;
    previousRank: string;
    newRank: string;
    changeType: 'DOWNGRADE';
    reason: string;
    previousCommission: Record<string, number>;
    newCommission: Record<string, number>;
    commissionDifference: number;
    performanceScore: number;
    totalBusiness: number;
    gracePeriodEnds: string;
    isReversible: boolean;
}

export interface RankWarningIssuedPayload {
    userId: string;
    warningId: string;
    currentRank: string;
    warningType: 'PERFORMANCE_DROP' | 'INACTIVITY' | 'VOLUME_SHORTFALL';
    warningLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    performanceScore: number;
    deadlineDate: string;
    gracePeriodDays: number;
}

export interface RankReversedPayload {
    userId: string;
    previousRank: string;
    restoredRank: string;
    reason: string;
    performanceScore: number;
}

export interface RankEvaluationBatchCompletePayload {
    periodMonth: string;
    totalUsers: number;
    evaluated: number;
    upgraded: number;
    downgraded: number;
    maintained: number;
    errors: number;
}
