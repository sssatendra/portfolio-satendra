import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Satendra Kumar | Senior Full-Stack Engineer & System Architect',
  description: 'Senior Software Engineer specializing in high-performance BI tools, algorithmic trading platforms, and distributed microservices with Python, Flask, and React.js.',
  keywords: ['Satendra Kumar', 'Software Engineer', 'Full-Stack Developer', 'System Architect', 'Python Flask', 'React.js', 'Distributed Systems', 'BI Analytics'],
  openGraph: {
    title: 'Satendra Kumar | Senior Full-Stack Engineer',
    description: 'Portfolio of Satendra Kumar, specializing in high-performance systems and enterprise SaaS architecture.',
    type: 'website',
  }
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
