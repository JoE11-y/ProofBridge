import * as argon2 from '@node-rs/argon2';
import { PrismaClient } from '@prisma/client';

export const seedAdmin = async (
  email: string,
  password: string,
  prisma: PrismaClient,
) => {
  const passwordHash = await argon2.hash(password);
  return prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
};
