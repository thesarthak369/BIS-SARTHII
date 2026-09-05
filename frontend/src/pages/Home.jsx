import { Link } from 'react-router-dom'
import InteractiveHoverButton from '../components/ui/InteractiveHoverButton.jsx'
import BorderGlow from '../components/BorderGlow.jsx'
import TiltCard from '../components/TiltCard.jsx'
import {
  ScanLine,
  FileSearch,
  ClipboardList,
  Route as RouteIcon,
  ShieldCheck,
  CheckCircle2,
  Factory,
  Ship,
  FlaskConical,
  Users,
  GraduationCap,
  Quote,
} from 'lucide-react'

/* Every exchange below was run against the real backend before being written here — each
   returns this content with a live citation from the seed corpus. If a demo question ever
   stops answering, this array is the thing that quietly starts lying. */
const demoChats = [
  {
    q: 'Which standard applies to an LED bulb?',
    a: (
      <>
        <span className="font-semibold text-saffron-400">IS 16102 (Part 1)</span> for safety —
        certified through the CRS scheme, not the ISI mark. Part 2 covers performance.
      </>
    ),
    source: 'bis.gov.in — Compulsory Registration Scheme',
  },
  {
    q: 'How do I apply for an ISI mark licence?',
    a: (
      <>
        Register on Manak Online, then file the{' '}
        <span className="font-semibold text-saffron-400">Scheme I</span> application — one product,
        one standard, one factory address.
      </>
    ),
    source: 'manakonline.in — Application for grant of licence',
  },
]

/* Horizontal stagger only — two cards with clear air between them, no overlap. Margin +
   width stay proportional to the column (not fixed px) and sum to <=100%, or the box's
   right edge pushes past the column boundary into the text column — that overflow was
   invisible on a wide monitor (enough dead space to absorb it) but collided with the
   headline on a narrower laptop screen. Flat below lg, where any offset looks like a mistake. */
// Second card's right edge now deliberately extends past the first's, into the wider gap
// between the two grid columns below — that gap is the safety margin this borrows from, so
// it holds on typical screens but has less room to spare on a narrower "large" viewport than
// a strictly <=100%-of-column layout would.
const CHAT_LAYOUT = ['lg:ml-0 lg:w-full', 'lg:ml-[4%] lg:w-[107%]']

const steps = [
  { n: '01', icon: ScanLine, title: 'Describe or scan your product', desc: 'Type a description or upload a photo/label — Sarthi extracts what matters.' },
  { n: '02', icon: FileSearch, title: 'Get matched standards, with proof', desc: 'Ranked Indian Standards, each with a relevance score and the evidence behind it.' },
  { n: '03', icon: ClipboardList, title: 'Understand certification & forms', desc: 'Mandatory, voluntary, or unclear — stated plainly, with the exact forms required.' },
  { n: '04', icon: RouteIcon, title: 'Follow your compliance roadmap', desc: 'A personalised, step-by-step path from product to certified.' },
]

const users = [
  { icon: Factory, label: 'MSMEs & Manufacturers' },
  { icon: Ship, label: 'Importers & Businesses' },
  { icon: FlaskConical, label: 'Testing Labs & Consultants' },
  { icon: Users, label: 'Consumers' },
  { icon: GraduationCap, label: 'Students & Researchers' },
]

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-900">
        {/* Order matters: mesh (colour) → sheen (light) → grid (texture) → content. */}
        <div className="mesh-gradient" aria-hidden="true" />
        <div className="mesh-sheen" aria-hidden="true" />
        <div className="bg-grid absolute inset-0 opacity-30" aria-hidden="true" />
        {/* Darkened under the headline so it keeps its contrast ratio wherever the blobs
            happen to drift. The anchor sits right of centre because that is where the text
            column now is — left of it is the window stack, which needs no such backing. */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse at 70% 45%, rgba(10,17,40,0.55) 0%, rgba(10,17,40,0.25) 55%, transparent 80%)',
          }}
        />
        {/* Full-bleed rather than a centred max-w container: the two columns are meant to
            sit in opposite corners of the viewport, so the only thing holding them off the
            edge is the page padding. */}
        <div className="relative px-6 pb-24 pt-12 md:px-10 md:pt-16 lg:px-16">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-28">
            {/* Windows sit left on desktop, per the layout sketch — but second in source
                order so a phone shows the headline first and doesn't make the reader
                scroll past the mock windows to find out what the product is. */}
            <div className="order-2 space-y-12 lg:order-1">
              {demoChats.map((c, i) => (
                /* Layout classes live on the tilt wrapper, since that is now the positioned
                   element; BorderGlow just fills it. Sized up from the three-card version —
                   only two cards now, so each can take more of the column's height. */
                <TiltCard key={c.q} max={16} className={`max-w-3xl ${CHAT_LAYOUT[i]}`}>
                  <BorderGlow
                    className="text-left"
                    backgroundColor="#060b18"
                    colors={['#f2900f', '#0a1128', '#f7a836']}
                    glowColor="32 90 55"
                    borderRadius={16}
                    glowRadius={20}
                  >
                    <div className="flex items-center gap-1.5 border-b border-white/10 px-5 py-3.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="space-y-4 px-6 py-8">
                      <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-white/10 px-5 py-3 text-base text-white/90">
                        {c.q}
                      </div>
                      <div className="max-w-[92%] rounded-xl rounded-tl-sm border-l-2 border-saffron-400 bg-white/5 px-5 py-4 text-base leading-relaxed text-white/80">
                        {c.a}
                      </div>
                    </div>
                    {/* The source line is the product's whole promise made visible — and it
                      gives the card the extra height it needed without dead padding. */}
                    <div className="flex items-center gap-2 border-t border-white/10 px-6 py-3.5 text-xs text-white/40">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-verified-500" />
                      <span className="truncate">{c.source}</span>
                    </div>
                  </BorderGlow>
                </TiltCard>
              ))}
            </div>

            {/* ml-auto pushes the capped text block to the right edge of its column, so it
                hugs the viewport corner instead of floating in the middle of dead space. */}
            <div className="order-1 lg:order-2 lg:ml-auto lg:max-w-2xl">
              <h1 className="font-display font-bold text-white">
                Stop guessing your way through
                <span className="text-saffron-400"> BIS certification.</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-white/70">
                Most manufacturers discover what they needed after the application is rejected.
                Sarthi maps the standard, the testing, and the forms before you start.
              </p>

              <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link to="/chat" tabIndex={-1}>
                  <InteractiveHoverButton text="Ask Sarthi" variant="solid" />
                </Link>
                <Link
                  to="/scan"
                  className="press inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
                >
                  <ScanLine className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6" />{' '}
                  Scan a Product
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-verified-500" /> Evidence-backed answers
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-verified-500" /> Official BIS sources only
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-verified-500" /> English &amp; हिंदी
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-saffron-600">How it works</span>
          <h2 className="font-display mt-3 text-3xl font-bold text-navy-900 sm:text-[2.6rem] sm:leading-[1.1]">
            From a vague product to an actionable compliance path
          </h2>
        </div>
        {/* Desktop: one continuous horizontal line with a marker at each step, like stops
            on a route. The line sits behind the grid, spanning from the first marker's
            centre (12.5% of the row) to the last (87.5%) — each marker is centred in its
            own 25%-wide column. */}
        <div className="relative mt-14 hidden md:block">
          <div className="absolute left-[12.5%] right-[12.5%] top-6 h-px bg-navy-900/15" />
          <div className="relative grid grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.n} className="flex flex-col items-center px-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-saffron-500 text-white shadow-md shadow-saffron-500/20">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-saffron-600">
                  Step {s.n}
                </p>
                <h3 className="font-display mt-1 text-base font-bold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-700/65">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: same idea, rotated — the line runs down the left edge instead. */}
        <div className="mt-10 md:hidden">
          {steps.map((s, i) => (
            <div key={s.n} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-saffron-500 text-white">
                  <s.icon className="h-4 w-4" />
                </span>
                {i < steps.length - 1 && <span className="my-1 w-px flex-1 bg-navy-900/15" />}
              </div>
              <div className="flex-1 pb-8">
                <p className="text-[11px] font-bold uppercase tracking-wide text-saffron-600">Step {s.n}</p>
                <h3 className="font-display mt-0.5 text-base font-bold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-700/65">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EVIDENCE CALLOUT */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow text-saffron-600">Trust, by design</span>
            <h2 className="font-display mt-3 text-3xl font-bold text-navy-900 sm:text-[2.6rem] sm:leading-[1.1]">
              If we can't verify it, we say so.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-700/70">
              Every answer carries a confidence level and an evidence trail back to its source
              document and official BIS link. When the retrieved evidence isn't strong enough,
              Sarthi tells you plainly instead of guessing.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['HIGH confidence', 'MEDIUM confidence', 'LOW confidence', 'UNVERIFIED'].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-navy-900/10 bg-white px-3 py-1 text-xs font-semibold text-navy-800"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-verified-600">
              <ShieldCheck className="h-4 w-4" /> Evidence
            </div>
            <div className="mt-4 rounded-xl bg-verified-100 p-4">
              <div className="flex items-start gap-3">
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-verified-600" />
                <p className="text-sm leading-relaxed text-navy-800">
                  "...packaged drinking water shall conform to the requirements specified for
                  quality and safety before sale..."
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-navy-700/50">Source</dt>
                <dd className="font-semibold text-navy-900">IS 14543 — Packaged Drinking Water</dd>
              </div>
              <div>
                <dt className="text-navy-700/50">Scheme</dt>
                <dd className="font-semibold text-navy-900">Mandatory · ISI Mark</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-navy-700/50">Official BIS source</dt>
                <dd className="truncate font-semibold text-saffron-600">bis.gov.in ↗</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* USER TYPES */}
      {/* CTA BAND */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-8 py-14 text-center sm:px-16">
          <div
            className="absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
            style={{ background: 'var(--color-saffron-500)' }}
          />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white sm:text-[2.6rem] sm:leading-[1.1]">
              Ready to find your standard?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/65">
              Start a conversation, or upload a photo of your product to begin.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/chat"
                className="press shine rounded-full bg-saffron-500 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-saffron-600"
              >
                Ask Sarthi
              </Link>
              <Link
                to="/scan"
                className="press rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Start Compliance Roadmap
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-navy-900/5 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-center text-2xl font-bold text-navy-900">
            Built for everyone who deals with BIS
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {users.map((u) => (
              <div
                key={u.label}
                className="press inline-flex items-center gap-2.5 rounded-full border border-navy-900/10 bg-paper-50 px-5 py-2.5 transition-colors hover:border-saffron-400 hover:bg-white"
              >
                <u.icon className="h-4 w-4 text-navy-700" />
                <span className="text-sm font-semibold text-navy-800">{u.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
