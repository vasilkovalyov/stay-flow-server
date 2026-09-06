import { UserMode, UserProfile } from '@generated/prisma/client';

export interface UserMeDtoResponse extends Omit<
  UserProfile,
  'id' | 'createdAt' | 'userId' | 'language' | 'locale'
> {
  id: number;
  email: string;
  createdAt: Date;
  activeMode: keyof typeof UserMode;
}
