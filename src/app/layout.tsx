import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Video Form | Interactive Experience',
  description: 'An immersive video-based form experience',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
