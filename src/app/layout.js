import './globals.css';
import { CarrinhoProvider } from '@/components/Carrinho';

export const metadata = {
  title: 'Com Tradições — Pastelaria · Refeições',
  description: 'Bolos caseiros, pastelaria e refeições do dia. Encomende online e levante na loja.',
  icons: { icon: '/favicon.svg' }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#EBD5B5'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <CarrinhoProvider>{children}</CarrinhoProvider>
      </body>
    </html>
  );
}
