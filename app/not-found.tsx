export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="mb-6">Sorry, we couldn't find the page you're looking for.</p>
      <a href="/" className="text-blue-600 hover:underline">
        ← Back to home
      </a>
    </div>
  )
}
