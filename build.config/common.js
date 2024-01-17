const rewritesConfig = require('./rewrites/index');
function getBasePath() {
  return '/aelfinscription';
}
module.exports = {
  reactStrictMode: true,
  basePath: getBasePath(),
  assetPrefix: getBasePath(),
  async rewrites() {
    return rewritesConfig;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.alipayobjects.com',
      },
      {
        protocol: 'https',
        hostname: '**.aliyuncs.com',
      },
    ],
  },
  // i18n: {
  //   locales: ['en-US', 'zh'],
  //   defaultLocale: 'en-US',
  // },
  productionBrowserSourceMaps: true,
  // sentry: {
  //   hideSourceMaps: true,
  // },
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });
    config.ignoreWarnings = [{ module: /node_modules/ }];

    // config.output.publicPath = getBasePath() + config.output.publicPath;
    return config;
  },
  publicRuntimeConfig: {
    basePath: getBasePath(),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
