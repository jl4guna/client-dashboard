import type { Client } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import ClientForm from "~/components/ClientForm";
import { deleteClient, getClient, updateClient } from "~/models/client.server";
import invariant from "tiny-invariant";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const {
    id,
    action,
    name,
    email,
    phone,
    middleName,
    lastName,
    secondLastName,
    status,
    birthDate,
    analystId,
    creditCardId,
  } = Object.fromEntries(formData);

  const errors = {
    email: email ? null : "Email is required",
    name: name ? null : "Name is required",
    phone: phone ? null : "Phone is required",
    lastName: lastName ? null : "Last name is required",
    secondLastName: secondLastName ? null : "Second last name is required",
    birthDate: birthDate ? null : "Birth date is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof id === "string", "id must be a string");
  invariant(typeof name === "string", "name must be a string");
  invariant(typeof email === "string", "email must be a string");
  invariant(typeof phone === "string", "phone must be a string");
  invariant(typeof middleName === "string", "middleName must be a string");
  invariant(typeof lastName === "string", "lastName must be a string");
  invariant(
    typeof secondLastName === "string",
    "secondLastName must be a string"
  );
  invariant(typeof status === "string", "status must be a string");
  invariant(typeof birthDate === "string", "birthDate must be a string");
  invariant(typeof analystId === "string", "analystId must be a string");
  invariant(typeof creditCardId === "string", "creditCardId must be a string");

  if (action === "delete") {
    await deleteClient(id);
    return redirect("/clients");
  } else {
    const client = await updateClient({
      id,
      name,
      email,
      phone,
      middleName,
      lastName,
      secondLastName,
      status: parseInt(status),
      birthDate: new Date(birthDate),
      analystId,
      creditCardId,
    });

    return redirect(`/clients/${client.id}`);
  }
}

export async function loader({ params }: LoaderArgs) {
  const id = params.id as string;

  const client = await getClient(id);

  return json({ client });
}

export default function View() {
  const { client } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  console.log({ errors });

  return (
    <div>
      {client ? (
        <h1>{`${client?.name} ${client?.middleName} ${client?.lastName} ${client?.secondLastName}`}</h1>
      ) : (
        <h1>Create Client</h1>
      )}

      <ClientForm client={client as unknown as Client} />
    </div>
  );
}
