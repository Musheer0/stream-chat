import { QueryProvider } from '@/providers/QueryProvider';
import { StreamProvider } from '@/providers/StreamTokenProvider';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <StreamProvider>
        {children}
        <Toaster richColors/>
      </StreamProvider>
    </QueryProvider>
  );
}

