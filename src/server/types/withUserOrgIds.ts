export type withUserOrgIds<T extends {}> = T & {
  userId: string;
  organizationId: string;
};

export type withOrgId<T extends {}> = T & {
  organizationId: string;
};

export type withUserId<T extends {}> = T & {
  userId: string;
};
