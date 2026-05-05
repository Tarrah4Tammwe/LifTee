export const metadata = {
  title: 'Contact | OverstayCheck',
  description: 'Contact us.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <a href="/" className="text-blue-600 hover:underline mb-8 inline-block">
        ← Back to home
      </a>
      
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <p className="mb-6">This is an independent calculator tool. We don't accept support requests or legal enquiries at this time.</p>

      <h2 className="text-2xl font-bold mb-4">If You Need Immigration Legal Advice</h2>
      <p>Consult a qualified immigration attorney or contact <a href="https://www.uscis.gov" className="text-blue-600 hover:underline">USCIS</a>.</p>
    </div>
  )
}
