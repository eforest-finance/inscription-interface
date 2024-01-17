function getBasePath() {
  return '/symbolmarket';
}

// module.exports = [
//   { source: `${getBasePath()}/api/:path*`, destination: 'http://192.168.66.131:5004/api/:path*', basePath: false },
//   // { source: '/cms/:path*', destination: 'http://192.168.66.62:8056/:path*' },
//   { source: `${getBasePath()}/cms/:path*`, destination: 'http://192.168.66.131:8055/:path*', basePath: false },
//   {
//     source: `${getBasePath()}/connect/:path*`,
//     destination: 'http://192.168.66.131:8004/connect/:path*',
//     basePath: false,
//   },
//   {
//     source: `${getBasePath()}/portkey/connect/:path*`,
//     destination: 'http://192.168.67.179:8001/connect/:path*',
//     basePath: false,
//   },
//   {
//     source: `${getBasePath()}/AElfIndexer_DApp/:path*`,
//     destination: 'http://192.168.66.203:8083/AElfIndexer_DApp/:path*',
//     basePath: false,
//   },
//   {
//     source: `${getBasePath()}/portkey/api/:path*`,
//     destination: 'http://192.168.67.179:5001/api/:path*',
//     basePath: false,
//   },
//   ///connectApi
// ];

module.exports = [
  { source: `${getBasePath()}/api/:path*`, destination: 'http://192.168.67.124:5588/api/:path*', basePath: false },
  // { source: '/cms/:path*', destination: 'http://192.168.66.62:8056/:path*' },
  { source: `${getBasePath()}/cms/:path*`, destination: 'http://192.168.67.124:8056/:path*', basePath: false },
  {
    source: `${getBasePath()}/connect/:path*`,
    destination: 'http://192.168.67.124:8080/connect/:path*',
    basePath: false,
  },
  {
    source: `${getBasePath()}/portkey/connect/:path*`,
    destination: 'http://192.168.66.203:8001/connect/:path*',
    basePath: false,
  },
  {
    source: `/AElfIndexer_DApp/:path*`,
    destination: 'http://192.168.66.203:8083/AElfIndexer_DApp/:path*',
    basePath: false,
  },
  {
    source: `/AElfIndexer_Inscription/:path*`,
    destination: 'http://192.168.67.216:8103/AElfIndexer_Inscription/:path*',
    basePath: false,
    //http://192.168.67.216:8103/AElfIndexer_Inscription/InscriptionIndexerSchema/graphql
  },
  {
    source: `${getBasePath()}/portkey/api/:path*`,
    destination: 'http://192.168.66.203:5001/api/:path*',
    basePath: false,
  },
  ///connectApi
];
