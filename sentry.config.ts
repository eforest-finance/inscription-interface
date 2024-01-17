import * as Sentry from '@sentry/nextjs';
const { NODE_ENV } = process.env;

export const init = () =>
  Sentry.init({
    // Should add your own dsn
    dsn: 'https://8d3f9d3cbbc2dd1d57e1cdc662fcf5c7@o4505006413840384.ingest.sentry.io/4506455731798016',
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
