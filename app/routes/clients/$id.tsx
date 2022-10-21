import type { Analyst, Client } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import ClientForm from "~/components/ClientForm";
import { deleteClient, getClient, updateClient } from "~/models/client.server";
import invariant from "tiny-invariant";
import { getClientProperties, validateClient } from "~/utils";
import { getAnalystListItems } from "~/models/analyst.server";

export async function action({ request }: ActionArgs) {
  const { client, errors, hasErrors } = await getClientProperties(request);

  if (hasErrors) {
    return json(errors);
  }

  const { id, action } = client;

  invariant(typeof id === "string", "id must be a string");

  if (action === "delete") {
    await deleteClient(id);
    return redirect("/clients");
  } else {
    const validatedClient = await validateClient(client, client.creditCardId);
    const newClient = await updateClient({
      ...validatedClient,
      id,
    });

    return redirect(`/clients/${newClient.id}`);
  }
}

export async function loader({ params }: LoaderArgs) {
  const id = params.id as string;
  const client = await getClient(id);
  const analysts = await getAnalystListItems();

  return json({ client, analysts });
}

export default function View() {
  const { client, analysts } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();
  return (
    <div>
      {client ? (
        <h1>{`${client?.name} ${client?.middleName} ${client?.lastName} ${client?.secondLastName}`}</h1>
      ) : null}

      <ClientForm
        client={client as unknown as Client}
        errors={errors}
        analysts={analysts as unknown as Analyst[]}
      />
    </div>
  );
}
