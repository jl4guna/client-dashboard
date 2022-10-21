import { json } from "@remix-run/node";
import { getAnalystListItems } from '~/models/analyst.server';

export async function loader() {
  const analysts = await getAnalystListItems();
  
  return json({ data: analysts });
};
