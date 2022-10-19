import type { Analyst } from '@prisma/client';
import { prisma } from "~/db.server";

export function getAnalyst({ id }: Pick<Analyst, 'id'>) {
  return prisma.analyst.findFirst({
    where: { id }
  });
}

export function getAnalystListItems() {
  return prisma.analyst.findMany();
}

export function createAnalyst(analyst : Omit<Analyst, 'updatedAt' | 'createdAt' | 'id'>) {
  return prisma.analyst.create({
    data: analyst,
  });
}

export function deleteAnalyst({ id }: Pick<Analyst, 'id'>) {
  return prisma.analyst.deleteMany({
    where: { id },
  });
}

export function updateAnalyst(analyst : Omit<Analyst, 'updatedAt' | 'createAt'>) {
  return prisma.analyst.update({
    where: { id: analyst.id },
    data: analyst,
  });
}
