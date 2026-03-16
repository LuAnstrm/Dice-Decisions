import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter-Variable.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

const jetbrainsMono = localFont({
  src: [
    {
      path: '../../public/fonts/JetBrainsMono-Variable.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['monospace'],
});

const almendraDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/AlmendraDisplay-Regular.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-display-fantasy',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

const rye = localFont({
  src: [
    {
      path: '../../public/fonts/Rye-Regular.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-display-western',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

export const metadata: Metadata = {
  title: 'Dice & Decisions',
  description: 'Probability-powered Dungeon Master Command Center for homebrew RPGs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="fantasy">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${almendraDisplay.variable} ${rye.variable} antialiased`}
      >
        <TooltipProvider delay={0}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
