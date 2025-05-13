
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-700"></div>
        <p className="mt-4 text-lg">Loading knowledge base...</p>
      </div>
    </div>
  )
}

