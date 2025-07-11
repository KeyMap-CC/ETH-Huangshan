import React from 'react';
import { Outlet, Scripts, ScrollRestoration, Meta, Links } from "react-router";
// @ts-ignore - Ignore ChakraProvider type issues
import { ChakraProvider } from '@chakra-ui/react';
// @ts-ignore - Ignore missing declaration file
import { Web3Provider } from './context/Web3Context';
// @ts-ignore - Ignore missing declaration file
import Navbar from './components/Navbar';

// Layout component for the HTML document
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>Safe Wallet</title>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Root component that will be rendered at the root route (/)
export default function Root() {
  // @ts-ignore - Ignore ChakraProvider type errors
  return (
    <ChakraProvider>
      <Web3Provider>
        <Outlet />
      </Web3Provider>
    </ChakraProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html>
      <head>
        <title>Error!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <h1>Application Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
          <p>The application encountered an unexpected error.</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
