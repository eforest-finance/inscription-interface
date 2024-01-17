const { NEXT_PUBLIC_CSS_APP_PREFIX, NEXT_PUBLIC_BUNDLE_ANALYZER, NODE_ENV } = process.env;

const { withSentryConfig } = require('@sentry/nextjs');
const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  include: '.next',
  configFile: '.sentryclirc',
  urlPrefix: '~/_next',
  org: 'blockchainforever',
  project: 'symbol-market',
};
module.exports = [
  (nextConfig) => (NODE_ENV === 'development' ? nextConfig : withSentryConfig(nextConfig, sentryWebpackPluginOptions)),
];
