import { generatePageMetadata } from '@/lib/generatePageMetadata'

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Privacy policy for OverstayCheck. We protect your data and explain how we use information.',
  path: '/privacy',
})
export const metadata = {
  title: 'Privacy Policy | OverstayCheck',
  description: 'Our privacy policy.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <a href="/" className="text-blue-600 hover:underline mb-8 inline-block">
        ← Back to home
      </a>
      
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-6"><strong>Last updated: May 2026</strong></p>

      <h2 className="text-2xl font-bold mb-4">What Data We Collect</h2>
      <p className="mb-4">This calculator runs in your browser. We collect:</p>
      <ul className="list-disc list-inside mb-6">
        <li>Google Analytics (pages visited, device type, location)</li>
        <li>No data from your I-94 date or personal inputs (they stay on your device)</li>
      </ul>
      <p className="mb-4">We do <strong>not</strong> collect:</p>
      <ul className="list-disc list-inside mb-6">
        <li>Immigration status</li>
        <li>Personal identification</li>
        <li>Email addresses</li>
        <li>Cookies for cross-site tracking</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4">How We Use Analytics Data</h2>
      <p className="mb-6">We use it to understand traffic patterns and improve the site.</p>

      <h2 className="text-2xl font-bold mb-4">Advertising</h2>
      <p className="mb-6">This site displays Google AdSense advertisements. Google may use cookies to serve ads based on your browsing history. You can opt out at <a href="https://adssettings.google.com" className="text-blue-600 hover:underline">Google Ad Settings</a>.</p>

      <h2 className="text-2xl font-bold mb-4">Important: Not Legal Advice</h2>
      <p className="mb-6">This tool provides general information about US immigration thresholds. It is <strong>not legal advice</strong>. Individual circumstances vary. If you're in immigration proceedings or have an overstay, consult an immigration attorney.</p>

      <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
      <p className="mb-4">You can:</p>
      <ul className="list-disc list-inside mb-6">
        <li>Disable JavaScript to block analytics</li>
        <li>Use browser privacy tools</li>
        <li>Opt out of personalised Google ads</li>
      </ul>
      <p>We don't sell data or share personal information with third parties.</p>
    </div>
  )
}
