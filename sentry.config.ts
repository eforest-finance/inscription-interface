import * as Sentry from '@sentry/nextjs';
const { NODE_ENV } = process.env;

export const init = () =>
  Sentry.init({
    // Should add your own dsn
    dsn: 'https://fa9c2025468d390d5d3bf4ba491d45ad@o4505006413840384.ingest.sentry.io/4506218529685504',
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps

    // Replay may only be enabled for the client-side

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      if (NODE_ENV === 'development') {
        return null;
      }
      return event;
    },
  });
