import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Satendra Kumar | Senior Full-Stack Software Engineer',
  description: 'Portfolio of Satendra Kumar, a Senior Software Engineer specializing in high-performance BI tools and distributed systems.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
