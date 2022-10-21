import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createClient } from "../../models/client.server";
import { createCreditCard, generateCCInfo } from "~/models/creditCard.server";
import invariant from "tiny-invariant";
import ClientForm from "~/components/ClientForm";
import { useActionData, useLoaderData } from "@remix-run/react";
import { getClientProperties, validateClient } from "~/utils";
import { getAnalystListItems } from "~/models/analyst.server";
import type { Analyst } from "@prisma/client";

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

  const newClient = await createClient(validatedClient);

  console.log({ newClient });

  return redirect(`/clients`);
}

export async function loader() {
  const analysts = await getAnalystListItems();
  return { analysts };
}

export default function New() {
  const { analysts } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  return (
    <ClientForm errors={errors} analysts={analysts as unknown as Analyst[]} />
  );
}
