// Avvisi errori nel browser: vedi lib/sentry.js. Attivi solo sul sito vero, non in prova.
import * as Sentry from "@sentry/nextjs";
import { DSN, opzioniSentry } from "./lib/sentry";

if (DSN && typeof window !== "undefined" && window.location.hostname.endsWith("valigialeggera.it")) {
  Sentry.init(opzioniSentry);
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
