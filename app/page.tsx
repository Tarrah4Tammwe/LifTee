import { OverstayCalculator } from "@/components/overstay-calculator"
import { Scale, Shield, Clock, AlertCircle } from "lucide-react"
import Script from "next/script"

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is unlawful presence in the US?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlawful presence is time spent in the US after your authorised stay expired — the date on your I-94, not your visa stamp. Once you accumulate more than 180 days of unlawful presence and leave the US, automatic re-entry bans apply.",
      },
    },
    {
      "@type": "Question",
      name: "How long can I overstay my US visa before getting banned?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under 180 days: no automatic entry ban, but your visa is voided. 180–364 days: a 3-year re-entry ban triggers when you leave. 365 days or more: a 10-year re-entry ban triggers when you leave.",
      },
    },
    {
      "@type": "Question",
      name: "Where do I find my I-94 expiry date?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Check your I-94 record online at i94.cbp.dhs.gov. Look for the 'Admit Until Date'. This is different from the expiry date on your visa stamp — the I-94 date is what controls your legal stay.",
      },
    },
    {
      "@type": "Question",
      name: "Does the 3-year or 10-year ban apply while I'm still in the US?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The ban only activates when you leave the US and then try to re-enter. If you remain in the US, the ban hasn't triggered yet — but unlawful presence is still accumulating every day.",
      },
    },
    {
      "@type": "Question",
      name: "Can I fix a US visa overstay without leaving?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sometimes. If you have a qualifying US citizen or permanent resident spouse or parent, you may be able to adjust status without leaving. Filing a timely extension before your I-94 expired also stops the clock. An immigration attorney can advise on your options.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to my visa if I overstay even one day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your visa is automatically voided — even after one day. You cannot use that visa to re-enter the US. You would need to apply for a new visa at a US consulate in your home country.",
      },
    },
    {
      "@type": "Question",
      name: "Does a pending I-539 extension application protect me from unlawful presence?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, if you filed a timely extension before your I-94 expired, unlawful presence does not accrue while it is pending. If the application is denied, the clock starts from the denial date.",
      },
    },
    {
      "@type": "Question",
      name: "Will an old overstay affect a future green card application?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Any overstay stays on your immigration record. An overstay over 180 days can trigger inadmissibility bars that require a waiver — even if it happened years ago.",
      },
    },
  ],
}

export default function Home() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />



      <main className="min-h-screen">
        <header className="border-b-2 border-secondary bg-card">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <span className="font-bold text-secondary text-lg">OverstayCheck</span>
            </div>
          </div>
        </header>

        <section className="max-w-4xl mx-auto px-4 pt-8 pb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary text-center text-balance">
            US Visa Overstay Calculator
          </h1>
          <p className="text-center text-muted-foreground mt-4 max-w-xl mx-auto text-pretty">
            Enter your I-94 expiry date. Find out instantly whether you face a 3-year or 10-year
            re-entry ban — and how many days you have before the next threshold.
          </p>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-12" aria-label="Overstay Calculator">
          <OverstayCalculator />
        </section>

        <section className="bg-card border-t-2 border-b-2 border-secondary py-12" aria-label="How It Works">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary text-center mb-8">
              The Three Overstay Thresholds
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <article className="border-2 border-secondary rounded-lg p-5 bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[var(--tier-safe)]">
                    <Shield className="h-5 w-5 text-card" />
                  </div>
                  <h3 className="font-bold text-secondary">Under 180 Days</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No automatic re-entry ban. Your visa is voided and future applications may be
                  affected — but if you leave now, no time bar applies.
                </p>
              </article>

              <article className="border-2 border-secondary rounded-lg p-5 bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[var(--tier-warning)]">
                    <Clock className="h-5 w-5 text-card" />
                  </div>
                  <h3 className="font-bold text-secondary">180-364 Days</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A 3-year re-entry ban triggers the moment you leave the US. The clock starts on
                  departure, not when you first overstayed.
                </p>
              </article>

              <article className="border-2 border-secondary rounded-lg p-5 bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[var(--tier-danger)]">
                    <AlertCircle className="h-5 w-5 text-card" />
                  </div>
                  <h3 className="font-bold text-secondary">365+ Days</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A 10-year re-entry ban triggers when you leave. This is the maximum automatic bar
                  under US immigration law.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-12" aria-label="Frequently Asked Questions">
          <h2 className="text-2xl font-bold text-secondary text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            <article className="border-2 border-secondary rounded-lg p-5 bg-card">
              <h3 className="font-bold text-secondary mb-2">What is &quot;unlawful presence&quot;?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlawful presence is time spent in the US after your authorised stay expired — the
                date on your I-94, not your visa stamp. Once you hit 180 days and leave, bans apply.
              </p>
            </article>

            <article className="border-2 border-secondary rounded-lg p-5 bg-card">
              <h3 className="font-bold text-secondary mb-2">Where do I find my I-94 expiry date?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Check{" "}
                <a href="https://i94.cbp.dhs.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  i94.cbp.dhs.gov
                </a>{" "}
                and look for the &quot;Admit Until Date&quot;. This is different from the expiry date on your
                visa stamp — the I-94 date is the one that matters.
              </p>
            </article>

            <article className="border-2 border-secondary rounded-lg p-5 bg-card">
              <h3 className="font-bold text-secondary mb-2">Does the ban apply while I&apos;m still in the US?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No. The 3-year or 10-year ban only activates when you leave and try to re-enter. But
                unlawful presence keeps accumulating every day you stay.
              </p>
            </article>

            <article className="border-2 border-secondary rounded-lg p-5 bg-card">
              <h3 className="font-bold text-secondary mb-2">What happens to my visa when I overstay?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                It&apos;s automatically voided — even after one day. You cannot use that visa to re-enter
                the US. You&apos;d need to apply for a new visa from your home country.
              </p>
            </article>

            <article className="border-2 border-secondary rounded-lg p-5 bg-card">
              <h3 className="font-bold text-secondary mb-2">Does a pending extension application protect me?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes — if you filed a timely extension (Form I-539) before your I-94 expired, the
                unlawful presence clock is paused while it&apos;s pending. If denied, the clock starts
                from the denial date.
              </p>
            </article>

            <article className="border-2 border-secondary rounded-lg p-5 bg-card">
              <h3 className="font-bold text-secondary mb-2">Can I fix an overstay without leaving?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sometimes. If you have a qualifying US citizen or permanent resident spouse or parent,
                you may be able to adjust status without leaving. An immigration attorney can assess
                your specific options.
              </p>
            </article>

            <article className="border-2 border-secondary rounded-lg p-5 bg-card">
              <h3 className="font-bold text-secondary mb-2">Will an old overstay affect a green card application?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes. Any overstay stays on your immigration record. An overstay over 180 days can
                trigger inadmissibility bars that require a waiver — even if it happened years ago.
              </p>
            </article>
          </div>
        </section>

        <section className="bg-muted border-t-2 border-secondary py-8" aria-label="Disclaimer">
          <div className="max-w-4xl mx-auto px-4">
            <div className="border-2 border-primary/30 rounded-lg p-5 bg-card">
              <h2 className="font-bold text-secondary mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Disclaimer
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This tool gives you general information based on standard US immigration thresholds.
                It is not legal advice. Individual circumstances — pending applications, asylum
                claims, age, TPS status — can change how the rules apply to you. If your situation
                is complicated, speak to an immigration attorney.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t-2 border-secondary py-8 bg-card">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} OverstayCheck. For informational purposes only.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Not affiliated with USCIS or any government agency.
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
