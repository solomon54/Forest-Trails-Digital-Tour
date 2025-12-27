// components/admin/activity/activity.types.ts

export interface ActivityAdmin {
  readonly id: number; 
  readonly name: string;
  readonly email: string | null;
  readonly photoUrl?: string;  // optional
  readonly isOnline?: boolean; // optional
}

export interface Activity {
  readonly id: number;
  readonly admin: ActivityAdmin; // use updated admin type
  readonly action: string;
  readonly target: {
    readonly type: string;
    readonly id: number;
    readonly display: string;
    readonly email?: string | null; 
  };
  readonly reason: string | null;
  readonly states?: {
    readonly before?: any;
    readonly after?: any;
  };
  readonly createdAt: string;
  readonly relativeTime: string;
}

export interface ActivityMeta {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}
