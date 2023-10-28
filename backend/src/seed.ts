import { prisma } from "./prisma";

export const seed = async () => {
  await prisma.dog.deleteMany();
  await prisma.user.deleteMany();
};
