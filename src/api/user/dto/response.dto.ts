import { UserProfile } from '@generated/prisma/client';

export interface UserMeDtoResponse extends Omit<
  UserProfile,
  'id' | 'createdAt' | 'userId'
> {
  id: number;
  email: string;
  createdAt: Date;
}
