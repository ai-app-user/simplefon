export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 bg-slate-900/80 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2" aria-label="simplefon.ai home">
            <Logo />
            <span className="font-semibold tracking-tight text-lg">simplefon<span className="text-cyan-400">.ai</span></span>
          </a>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-cyan-300 transition">Features</a>
            <a href="#how" className="hover:text-cyan-300 transition">How it works</a>
            <a href="#pricing" className="hover:text-cyan-300 transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            {/* TBD links for later */}
            <a href="#" aria-label="Log in (TBD)" className="text-sm px-3 py-2 rounded-xl hover:text-cyan-300">Log in</a>
            <a href="#" aria-label="Sign up (TBD)" className="text-sm px-4 py-2 rounded-xl bg-cyan-400 text-slate-900 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 active:translate-y-px transition">Sign up</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 pt-14 lg:pt-24 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-300/90 bg-cyan-400/10 ring-1 ring-cyan-400/20 px-3 py-1 rounded-full">AI Phone Assistant <span className="w-1 h-1 rounded-full bg-cyan-300" /></p>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Get a business phone number & smart AI agent in <span className="text-cyan-300">under 5 minutes</span>
              </h1>
              <p className="mt-5 text-base/7 text-slate-300 max-w-xl">
                Simplefon.ai answers calls 24/7, qualifies leads, collects details, and sends them to you automatically. Start for just <span className="font-semibold text-white">$5</span>—no engineers, no contracts.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="#" className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-cyan-400 text-slate-900 font-semibold hover:bg-cyan-300 active:translate-y-px shadow-lg shadow-cyan-500/20" aria-label="Sign up (TBD)">
                  Start free trial — $5
                </a>
                <a href="#how" className="inline-flex items-center justify-center px-5 py-3 rounded-2xl ring-1 ring-white/20 hover:ring-white/40">
                  See how it works
                </a>
              </div>
              <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
                <Badge>Setup in 5 min</Badge>
                <Badge>No credit card lock-in</Badge>
                <Badge>Cancel anytime</Badge>
              </div>
            </div>

            {/* Phone preview card */}
            <div className="relative">
              <div className="mx-auto max-w-sm w-full">
                <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-800 to-slate-900 p-4 shadow-2xl">
                  <div className="rounded-3xl border border-white/10 bg-black p-4">
                    <div className="aspect-[9/19.5] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 ring-1 ring-white/10 p-4 flex flex-col">
                      <div className="flex items-center justify-between text-[10px] text-slate-300">
                        <span>9:41</span>
                        <span>LTE • 100%</span>
                      </div>
                      <div className="mt-6 flex-1 flex items-center justify-center">
                        <CallCard />
                      </div>
                      <div className="mt-6 grid grid-cols-4 gap-2 text-[10px] text-center text-slate-400">
                        <span>Recent</span>
                        <span>Keypad</span>
                        <span>Assist</span>
                        <span>Voicemail</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center text-xs text-slate-400">Live demo of how Simplefon answers and captures details</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="mt-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-sm text-slate-400">Trusted by busy owners of food trucks, contractors, cleaners, and more</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 opacity-80">
            <LogoChip label="Food Trucks" />
            <LogoChip label="Contractors" />
            <LogoChip label="Clinics" />
            <LogoChip label="Property Mgmt" />
            <LogoChip label="Local Services" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <Feature
              icon={<SparkIcon />}
              title="Answers every call"
              desc="Greets callers, understands intent, and handles common requests without you picking up."
            />
            <Feature
              icon={<NotepadIcon />}
              title="Collects the right info"
              desc="Name, number, reason for call, appointment details—captured cleanly and sent to you."
            />
            <Feature
              icon={<BoltIcon />}
              title="Setup in minutes"
              desc="Pick a number, set your business basics, and go live. No code or special hardware."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">From zero to calls in 3 simple steps</h2>
          <ol className="mt-8 grid lg:grid-cols-3 gap-8">
            <Step n={1} title="Create your account" desc="Click Sign up and enter your business name and contact email." />
            <Step n={2} title="Pick a phone number" desc="Select a local or toll-free number. Configure hours & call routing." />
            <Step n={3} title="Go live" desc="Your AI answers calls immediately, logs details, and texts or emails you." />
          </ol>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Try it now for <span className="text-cyan-300">$5</span></h3>
              <p className="mt-4 text-slate-300">Includes a new phone number and a fully functional AI assistant. Keep the number if you love it. Cancel anytime.</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3"><CheckIcon /> 24/7 call answering</li>
                <li className="flex items-start gap-3"><CheckIcon /> Lead capture & summaries to your email/text</li>
                <li className="flex items-start gap-3"><CheckIcon /> Simple dashboard (web + mobile)</li>
              </ul>
              <div className="mt-8 flex gap-3">
                <a href="#" className="px-5 py-3 rounded-2xl bg-cyan-400 text-slate-900 font-semibold hover:bg-cyan-300 active:translate-y-px shadow-lg shadow-cyan-500/20" aria-label="Sign up (TBD)">Get started — $5</a>
                <a href="#" className="px-5 py-3 rounded-2xl ring-1 ring-white/20 hover:ring-white/40" aria-label="Log in (TBD)">Log in</a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                <Stat label="Avg. setup time" value="<5 min" />
                <Stat label="Missed calls saved" value="90%" />
                <Stat label="Hours saved / week" value="8–12" />
                <Stat label="Starting at" value="$5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Common questions</h3>
          <div className="mt-8 grid lg:grid-cols-2 gap-8 text-slate-300">
            <Faq q="Can I use my existing number?" a="Yes. You can forward your current business line to your Simplefon number, or port your number in (coming soon)." />
            <Faq q="What happens after a call?" a="Your assistant summarizes the conversation and sends you the caller's info via text and email." />
            <Faq q="Is there a mobile app?" a="The dashboard is mobile friendly from day one. Native apps are on our roadmap." />
            <Faq q="Do I need any hardware?" a="No. Everything runs in the cloud. You just configure and go live." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Logo size={16} />
            <span className="text-sm">© {new Date().getFullYear()} simplefon.ai</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-cyan-300">Privacy</a>
            <a href="#" className="hover:text-cyan-300">Terms</a>
            <a href="#" className="hover:text-cyan-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] text-cyan-300/90 bg-cyan-400/10 ring-1 ring-cyan-400/20 px-3 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
      {children}
    </span>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-1">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-slate-300">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="flex gap-4">
      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-slate-900 font-bold">{n}</div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-slate-300">{desc}</p>
      </div>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
      <div className="font-semibold">{q}</div>
      <div className="mt-2 text-sm text-slate-300">{a}</div>
    </div>
  );
}

function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" className="fill-cyan-400/20" />
      <path d="M7 9c0-1.1.9-2 2-2h2a2 2 0 012 2v1a2 2 0 01-2 2H9v2h4" className="stroke-cyan-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="17" cy="17" r="2" className="fill-cyan-300" />
    </svg>
  );
}

function LogoChip({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-slate-900/50">
      <Logo size={16} />
      <span className="text-xs text-slate-300">{label}</span>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4.24 4.24M14.76 14.76 19 19M5 19l4.24-4.24M14.76 9.24 19 5" stroke="currentColor" className="text-cyan-300" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function NotepadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" className="stroke-cyan-300" strokeWidth="1.5"/>
      <path d="M8 7h8M8 11h8M8 15h6" stroke="currentColor" className="text-cyan-300" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" className="fill-cyan-300" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" className="text-cyan-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CallCard() {
  return (
    <div className="w-full max-w-[280px] rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-slate-200">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Incoming call</div>
        <div className="text-xs text-slate-400">simplefon.ai</div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-cyan-400/20 ring-1 ring-cyan-300/30 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07A19.5 19.5 0 013.16 9.81 19.8 19.8 0 01.09 1.18 2 2 0 012.07-.999999L5.07-.999999c1.1 0 2 .9 2 2.01 0 .45-.15.89-.43 1.25L4.98 4.8a16 16 0 006.22 6.22l1.54-1.66c.36-.28.8-.43 1.25-.43 1.11 0 2.01.9 2.01 2.01v3.02z" stroke="currentColor" className="text-cyan-300" strokeWidth="1.5"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-sm">+1 (310) 555-0164</div>
          <div className="text-xs text-slate-400">Los Angeles, CA</div>
        </div>
      </div>
      <div className="mt-4 text-xs rounded-lg bg-black/40 p-3 ring-1 ring-white/5">
        <div className="text-cyan-300 font-semibold">AI Assistant</div>
        <p className="mt-1 text-slate-300">Hi! Thanks for calling. How can I help you today? I can take your name, number, and details and get them to the right person.</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button className="w-full rounded-xl bg-rose-500/90 hover:bg-rose-400 text-white font-semibold py-2">Decline</button>
        <button className="w-full rounded-xl bg-emerald-400/90 hover:bg-emerald-300 text-slate-900 font-semibold py-2">Answer</button>
      </div>
    </div>
  );
}
