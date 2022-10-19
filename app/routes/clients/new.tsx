import { Form } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createClient } from "../../models/client.server";
import { createCreditCard, generateCCInfo } from "~/models/creditCard.server";
import invariant from "tiny-invariant";
import ClientForm from "~/components/ClientForm";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const generatedCC = await generateCCInfo();

  invariant(generatedCC, "No CC generated");
  const cc = await createCreditCard(generatedCC);

  const client = await createClient({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    middleName: formData.get("middleName") as string,
    lastName: formData.get("lastName") as string,
    secondLastName: formData.get("secondLastName") as string,
    status: parseInt(formData.get("status") as string),
    birthDate: new Date(formData.get("birthDate") as string),
    analystId: "cl93kyncc0002z4sluynlqmn3",
    creditCardId: cc.id,
  });

  console.log({ client });

  return redirect(`/clients`);
}

export default function New() {
  return <ClientForm />;
}
