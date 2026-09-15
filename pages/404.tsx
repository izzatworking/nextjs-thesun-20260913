import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-black text-red-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          Sorry, there is no page here
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors"
        >
          Back to main page
        </Link>
      </div>
    </div>
  );
}