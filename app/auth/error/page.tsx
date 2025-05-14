import Link from 'next/link';

export default function AuthError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Failed
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            There was a problem connecting your Gmail account. Please try again.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link href="/api/auth/google" className="text-indigo-600 hover:text-indigo-500">
            Try Again
          </Link>
          <span className="mx-4 text-gray-500">|</span>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
