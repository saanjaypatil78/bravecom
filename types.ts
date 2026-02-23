
export interface Metric {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface Order {
  id: string;
  product: string;
  customer: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  amount: string;
}

export type ViewState = 'landing' | 'dashboard';

export type UserRole = 'admin' | 'partner' | 'investor';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
}
