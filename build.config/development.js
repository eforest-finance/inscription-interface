const commonConfig = require('./common');
module.exports = {
  ...commonConfig,
  // do something
  experimental: {
    esmExternals: 'loose',
  },
};
