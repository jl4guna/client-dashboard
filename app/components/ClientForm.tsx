import type { Client } from "@prisma/client";
import { Form, useTransition } from "@remix-run/react";

export type FormError = {
  [key: string]: string | null;
};

type Props = {
  client?: Client;
  errors?: FormError;
};

function addMissingDigit(digit: number) {
  return digit < 10 ? `0${digit}` : digit;
}

const ClientForm = ({ client, errors }: Props) => {
  console.log({ errors });

  const transition = useTransition();
  const submittingAction = transition.submission?.formData.get("action");
  const isUpdating = submittingAction === "update";
  const isDeleting = submittingAction === "delete";

  const birthDate = new Date(client?.birthDate || "");
  const formatedBirthDate = `${birthDate.getUTCFullYear()}-${addMissingDigit(
    birthDate.getUTCMonth() + 1
  )}-${addMissingDigit(birthDate.getUTCDate())}`;

  return (
    <Form
      method={client ? "put" : "post"}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        key={`${client?.id}-email`}
        defaultValue={client?.email}
      />
      <label htmlFor="phone">Phone</label>
      <input
        type="tel"
        name="phone"
        id="phone"
        key={`${client?.id}-phone`}
        defaultValue={client?.phone}
      />
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        key={`${client?.id}-name`}
        defaultValue={client?.name}
      />
      <label htmlFor="middleName">Middle Name</label>
      <input
        type="text"
        name="middleName"
        id="middleName"
        key={`${client?.id}-middleName`}
        defaultValue={client?.middleName}
      />
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        key={`${client?.id}-lastName`}
        defaultValue={client?.lastName}
      />
      <label htmlFor="secondLastName">Second Last Name</label>
      <input
        type="text"
        name="secondLastName"
        id="secondLastName"
        key={`${client?.id}-secondLastName`}
        defaultValue={client?.secondLastName}
      />
      <label htmlFor="birthDate">Birth Date</label>
      <input
        type="date"
        name="birthDate"
        id="birthDate"
        key={`${client?.id}-birthDate`}
        defaultValue={formatedBirthDate}
      />
      <label htmlFor="status">Status</label>

      <select
        name="status"
        id="status"
        key={`${client?.id}-status`}
        defaultValue={client?.status}
      >
        <option value={0}>Pending</option>
        <option value={1}>Processing</option>
        <option value={2}>Completed</option>
      </select>

      <input
        hidden
        type="string"
        name="analystId"
        id="analystId"
        key={`${client?.id}-analystId`}
        defaultValue={client?.analystId}
      />
      <input
        hidden
        type="string"
        name="creditCardId"
        id="creditCardId"
        key={`${client?.id}-creditCardId`}
        defaultValue={client?.creditCardId}
      />
      <input
        hidden
        type="string"
        name="id"
        id="id"
        key={`${client?.id}-id`}
        defaultValue={client?.id}
      />

      {client ? (
        <button type="submit" name="action" value="update">
          {isUpdating ? "Updating" : "Update"}
        </button>
      ) : null}
      {client ? null : (
        <button type="submit" name="action" value="create">
          {transition.submission ? "Creating" : "Create"}
        </button>
      )}
      {client ? (
        <button type="submit" name="action" value="delete">
          {isDeleting ? "Deleting" : "Delete"}
        </button>
      ) : null}

      <button type="reset">Reset</button>
    </Form>
  );
};

export default ClientForm;
