import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createClient } from "../../models/client.server";
import { createCreditCard, generateCCInfo } from "~/models/creditCard.server";
import invariant from "tiny-invariant";
import ClientForm from "~/components/ClientForm";
import { useActionData } from "@remix-run/react";
import { getClientProperties, validateClient } from "~/utils";

export async function action({ request }: ActionArgs) {
  const { client, errors, hasErrors } = await getClientProperties(request);

  if (hasErrors) {
    return json(errors);
  }

  const generatedCC = await generateCCInfo();
  invariant(generatedCC, "No CC generated");
  const cc = await createCreditCard(generatedCC);

  const validatedClient = await validateClient(client, cc.id);

  console.log(validatedClient);

  const newClient = await createClient({
    ...validatedClient,
    analystId: "cl93kyncc0002z4sluynlqmn3",
  });

  console.log({ newClient });

  return redirect(`/clients`);
}

export default function New() {
  const errors = useActionData<typeof action>();

  return <ClientForm errors={errors} />;
}
