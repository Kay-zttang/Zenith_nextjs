import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: {
    template:'%s | Zenith Dashboard',
    default: 'Zenith Dashboard',
  },
  description: 'The sample financial dashboard by Next.js Course, built with App Router.',
  //metadataBase: new URL('zenith-nextjs-ten.vercel.app')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialised`}>{children}</body>
    </html>
  );
}
