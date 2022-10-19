import { useLoaderData, Outlet, Link } from "@remix-run/react";
import { getClientListItems } from "~/models/client.server";

export async function loader() {
  const clients = await getClientListItems();
  return { clients };
}

export default function Clients() {
  const { clients } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Clients</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <Link to={`/clients/${client.id}`}>{client.name}</Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}
