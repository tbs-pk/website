import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-primary mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-primary text-white rounded-md hover:bg-accent transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Return Home
        </Link>
      </div>
    </MainLayout>
  );
}
