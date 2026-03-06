/***  
 * Investment Constants - BRAVECOM Sunray Ecosystem  
 * Defines investment tiers, rates, and business rules  
 *\/  
ECHO is on.
export enum InvestmentTier { LEVEL_A = "LEVEL_A", L1 = "L1", L2 = "L2", L3 = "L3", L4 = "L4", L5 = "L5", L6 = "L6" }  
ECHO is on.
export interface TierConfig { tier: InvestmentTier; name: string; amount: number; monthlyReturn: number; annualReturn: number; minRoleLevel: number; description: string; } 
