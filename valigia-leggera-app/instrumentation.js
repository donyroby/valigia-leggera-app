// Avvisi errori lato server (pagine e API): vedi lib/sentry.js
import * as Sentry from "@sentry/nextjs";
import { DSN, opzioniSentry } from "./lib/sentry";

export async function register() {
  if (DSN) Sentry.init(opzioniSentry);
}

export const onRequestError = Sentry.captureRequestError;
