import '@portkey/did-ui-react/dist/assets/index.css';
import '@portkey-v1/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';
import 'antd/dist/antd.css';
import 'styles/aelf-web-login.css';
import 'styles/antd.custom.css';
import 'styles/global.css';
import 'styles/theme.css';
import Layout from 'pageComponents/home/layout';
import Provider from 'provider/';
import React from 'react';
import Script from 'next/script';

export const metadata = {
  title: 'AELF Inscriptions',
  description: 'AELF Inscriptions',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'no',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" name="viewport" />
        <link rel="shortcut icon" href="/aelfinscription/favicon.ico" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J0D8TQCBTF" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-J0D8TQCBTF');
        `}
        </Script>
      </head>
      <body>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
