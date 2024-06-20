'use client';

import { Provider } from 'react-redux'
import './globals.css'
import store from '@cardpia-app/store'
import { ThemeProvider } from '@mui/material';
import { theme } from '@cardpia-app/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="ja">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/earlyaccess/notosansjp.css" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&display=swap" rel="stylesheet" />
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
        integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w=="
        crossOrigin="anonymous"
        />
        <title>カードピア</title>
      </head>
      <body className="bg-white h-screen">
      
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <>
          {children}
          </>
        </ThemeProvider>
        
      </Provider>
      </body>
    </html>
  )
}
