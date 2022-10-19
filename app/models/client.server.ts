import type { Client } from '@prisma/client';
import { prisma } from "~/db.server";

export function getClient(id : string) {
  return prisma.client.findFirst({
    where: { id }
  });
}

export function getClientListItems() {
  return prisma.client.findMany();
}

export function createClient(client : Omit<Client, 'updatedAt' | 'createdAt' | 'id'>) {
  return prisma.client.create({
    data: client,
  });
}

export function deleteClient(id: string) {
  return prisma.client.deleteMany({
    where: { id },
  });
}

export function updateClient(client : Omit<Client, 'updatedAt' | 'createdAt'>) {
  return prisma.client.update({
    where: { id: client.id },
    data: client,
  });
}
