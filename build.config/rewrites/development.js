function getBasePath() {
  return '/aelfinscription';
}

module.exports = [
  { source: `${getBasePath()}/api/:path*`, destination: 'https://test.eforest.finance/api/:path*', basePath: false },
  // { source: '/cms/:path*', destination: 'http://192.168.66.62:8056/:path*' },
  { source: `${getBasePath()}/cms/:path*`, destination: 'http://18.166.65.26:3104/:path*', basePath: false },
  {
    source: `${getBasePath()}/connect/:path*`,
    destination: 'https://test.eforest.finance/connect/:path*',
    basePath: false,
  },
  // {
  //   source: `${getBasePath()}/portkey/connect/:path*`,
  //   destination: 'http://192.168.66.203:8001/connect/:path*',
  //   basePath: false,
  // },
  // {
  //   source: `/AElfIndexer_DApp/:path*`,
  //   destination: 'http://192.168.66.203:8083/AElfIndexer_DApp/:path*',
  //   basePath: false,
  // },
  {
    source: `/AElfIndexer_Inscription/:path*`,
    destination: 'https://test.eforest.finance/AElfIndexer_Inscription/:path*',
    basePath: false,
    //http://192.168.67.216:8103/AElfIndexer_Inscription/InscriptionIndexerSchema/graphql
  },
  // {
  //   source: `${getBasePath()}/portkey/api/:path*`,
  //   destination: 'http://192.168.66.203:5001/api/:path*',
  //   basePath: false,
  // },
  ///connectApi
];
