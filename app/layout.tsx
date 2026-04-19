import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'EON',
  description: 'Space themed project powered by Next.js',
};

type RootLayoutProps = {
  children: ReactNode;
};

export function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
