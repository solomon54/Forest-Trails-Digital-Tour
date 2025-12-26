//components/admin/activity/activity.types.ts
export interface Activity {
  readonly id: number;

  readonly admin: {
    readonly name: string;
    readonly email: string | null;
  };

  readonly action: string;

  readonly target: {
    readonly type: string;
    readonly id: number;
    readonly display: string; 
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
