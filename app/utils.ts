import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import invariant from 'tiny-invariant';

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export async function getClientProperties(request: Request) {
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

  return {
    client: {
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
    },
    hasErrors,
    errors,
  };
}
type ClientFromRequest = {
  id?: FormDataEntryValue;
  action?: FormDataEntryValue;
  name: FormDataEntryValue;
  email: FormDataEntryValue;
  phone: FormDataEntryValue;
  middleName: FormDataEntryValue;
  lastName: FormDataEntryValue;
  secondLastName: FormDataEntryValue;
  status: FormDataEntryValue;
  birthDate: FormDataEntryValue;
  analystId?: FormDataEntryValue;
};

export async function validateClient(
  {
    name,
    email,
    phone,
    middleName,
    lastName,
    secondLastName,
    status,
    birthDate,
  }: ClientFromRequest,
  creditCard?: string | FormDataEntryValue
) {
  invariant(typeof name === "string", "name must be a string");
  invariant(validateEmail(email), "email must be a string");
  invariant(typeof phone === "string", "phone must be a string");
  invariant(typeof middleName === "string", "middleName must be a string");
  invariant(typeof lastName === "string", "lastName must be a string");
  invariant(
    typeof secondLastName === "string",
    "secondLastName must be a string"
  );
  invariant(typeof status === "string", "status must be a string");
  invariant(typeof birthDate === "string", "birthDate must be a string");
  invariant(typeof creditCard === "string", "creditCardId must be a string");

  return {
    name,
    email,
    phone,
    middleName,
    lastName,
    secondLastName,
    status: parseInt(status),
    birthDate: new Date(birthDate),
    creditCardId: creditCard,
  };
}

