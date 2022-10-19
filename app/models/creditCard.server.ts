import type { CreditCard } from '@prisma/client';
import { prisma } from "~/db.server";

export function getCreditCard({ id }: Pick<CreditCard, 'id'>) {
  return prisma.creditCard.findFirst({
    where: { id }
  });
}

export function getCreditCardListItems() {
  return prisma.creditCard.findMany();
}

export function createCreditCard(creditCard : Omit<CreditCard, 'updatedAt' | 'createdAt' | 'id'>) {
  return prisma.creditCard.create({
    data: creditCard,
  });
}

export function deleteCreditCard({ id }: Pick<CreditCard, 'id'>) {
  return prisma.creditCard.deleteMany({
    where: { id },
  });
}

export function updateCreditCard(creditCard : Omit<CreditCard, 'updatedAt' | 'createAt'>) {
  return prisma.creditCard.update({
    where: { id: creditCard.id },
    data: creditCard,
  });
}

type GeneratedCC = {
  type: string,
  date: string,
  fullName: string,
  cardNumber: string,
  cvv: string,
  pin: number
}

export async function generateCCInfo(){
  if(!process.env.RANDOMMER_URL) return;

  const response = await fetch(process.env.RANDOMMER_URL, {
    method: 'GET',
    headers: {
      'X-Api-Key': process.env.RANDOMMER_KEY as string,
    },
  })

  const json = await response.json() as GeneratedCC;

  return {
    number: json?.cardNumber as string,
    cvv: json?.cvv as string,
    pin: json?.pin + "",
    expirationDate: new Date(json?.date as string),
    provider: json?.type as string,
  }
}
