import { useState } from 'react'
import {
  UploadCloud,
  ScanLine,
  CheckCircle2,
  Search,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Circle,
} from 'lucide-react'

// Static beyond the first two steps — there is no backend roadmap-generation logic yet, only
// scan (OCR) and standard matching. Steps 1-2 are filled in from the real match; the rest stay
// as an illustrative sequence until a roadmap service exists to compute them for real.
const ROADMAP_TEMPLATE = [
  { title: 'Certification applicability', detail: 'Checking whether ISI marking is mandatory for this category.' },
  { title: 'Testing requirements', detail: 'Lab tests required before licence application.' },
  { title: 'Required documents & forms', detail: 'Form V and supporting test reports.' },
  { title: 'Application & licensing process', detail: 'Submit to BIS regional office.' },
  { title: 'Inspection / assessment', detail: 'Factory inspection where applicable.' },
  { title: 'Certification & post-certification', detail: 'Ongoing surveillance and renewal.' },
]

export default function Scan() {
  // --- Image scan (OCR) ---
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [detected, setDetected] = useState([])
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState('')

  // --- Standard matching (from OCR text, or typed directly) ---
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState([])
  const [explanation, setExplanation] = useState('')
  const [matching, setMatching] = useState(false)
  const [matchError, setMatchError] = useState('')

  const handleFileChange = event => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setScanError('Please upload an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setScanError('Image must be smaller than 5 MB.')
      return
    }

    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setDetected([])
    setScanError('')
    setMatches([])
    setExplanation('')
    setMatchError('')
  }

  const scanProduct = async () => {
    if (!selectedFile) {
      setScanError('Please choose a product image first.')
      return
    }

    setScanning(true)
    setScanError('')
    setDetected([])

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('/api/scan', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('OCR request failed')

      const data = await response.json()
      const text = data.extracted_text || []
      setDetected(text)

      // Roll straight into standard matching — no extra click, no page navigation.
      if (text.length) {
        const joined = text.join(' ')
        setQuery(joined)
        findStandards(joined)
      }
    } catch (err) {
      console.error(err)
      setScanError('Unable to connect to BIS SĀRTHI backend. Make sure FastAPI is running on port 8000.')
    } finally {
      setScanning(false)
    }
  }

  async function findStandards(searchQuery = query) {
    const value = searchQuery.trim()
    if (!value) {
      setMatchError('Please describe your product first.')
      return
    }

    setMatching(true)
    setMatchError('')
    setMatches([])
    setExplanation('')

    try {
      const response = await fetch('/api/standards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: value }),
      })
      if (!response.ok) throw new Error('Standards search failed')

      const data = await response.json()
      setMatches(data.matches || [])
      setExplanation(data.explanation || '')
      if (data.error) setMatchError(data.error)
    } catch (err) {
      console.error('Standards error:', err)
      setMatchError('Unable to find standards. Make sure FastAPI is running on port 8000.')
    } finally {
      setMatching(false)
    }
  }

  const topMatch = matches[0]
  const roadmapSteps = topMatch
    ? [
        { title: 'Product identified', status: 'done', detail: query },
        {
          title: 'Applicable standard identified',
          status: 'done',
          detail: `${topMatch.isNumber || 'BIS Standard'} — ${topMatch.title || ''}`,
        },
        ...ROADMAP_TEMPLATE.map((s, i) => ({ ...s, status: i === 0 ? 'current' : 'pending' })),
      ]
    : []

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      {/* HEADER */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-saffron-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-saffron-600">
          <ScanLine className="h-3.5 w-3.5" />
          Product Scanner
        </span>
        <h1 className="font-display mt-4 text-3xl font-bold text-navy-900">
          Upload a photo — we'll read the rest
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-navy-700/65">
          Product photos, labels, or spec sheets — or just describe it below. We'll always show
          what we detected before using it.
        </p>
      </div>

      {/* SCAN GRID */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT — UPLOAD */}
        <div className="card flex flex-col items-center justify-center gap-3 border-2 border-dashed border-navy-900/15 p-12 text-center">
          <UploadCloud className="h-10 w-10 text-navy-700/40" />
          <p className="text-sm font-semibold text-navy-800">Drag & drop an image, or click to upload</p>
          <p className="text-xs text-navy-700/50">JPG, PNG or WEBP · up to 5MB</p>

          <input
            id="product-image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="product-image"
            className="mt-2 cursor-pointer rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Choose File
          </label>

          {selectedFile && (
            <p className="mt-3 text-xs font-medium text-navy-700">Selected: {selectedFile.name}</p>
          )}
          {preview && (
            <img src={preview} alt="Selected product" className="mt-4 max-h-48 rounded-lg object-contain" />
          )}

          <button
            onClick={scanProduct}
            disabled={!selectedFile || scanning}
            className="mt-4 rounded-full bg-saffron-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-saffron-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : '🔍 Scan Product'}
          </button>

          {scanError && <p className="mt-3 text-xs font-medium text-red-600">{scanError}</p>}
        </div>

        {/* RIGHT — OCR RESULTS */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-navy-900">We detected the following</h2>
            <span className="rounded-full bg-verified-100 px-2.5 py-1 text-[11px] font-bold text-verified-600">
              Please verify
            </span>
          </div>

          {detected.length === 0 && !scanning && (
            <p className="mt-6 text-sm text-navy-700/50">Upload and scan a product image to see detected information.</p>
          )}
          {scanning && <p className="mt-6 text-sm text-navy-700/60">🔍 Reading product image...</p>}

          {detected.length > 0 && (
            <dl className="mt-4 divide-y divide-navy-900/5">
              {detected.map((text, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <dt className="text-xs text-navy-700/50">Detected Text {index + 1}</dt>
                  <dd className="text-sm font-semibold text-navy-900">{text}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* MANUAL DESCRIPTION — for when there's no photo to scan */}
      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-700/50">
          Or describe your product directly
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-navy-900/10 bg-white p-2 shadow-sm">
          <Search className="ml-2 h-4 w-4 shrink-0 text-navy-700/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !matching) findStandards()
            }}
            placeholder="e.g. 1L stainless steel water bottle, food-grade"
            className="flex-1 bg-transparent px-2 py-2.5 text-sm text-navy-900 outline-none placeholder:text-navy-700/40"
          />
          <button
            type="button"
            onClick={() => findStandards()}
            disabled={matching || !query.trim()}
            className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {matching ? 'Searching...' : 'Match'}
          </button>
        </div>
      </div>

      {matchError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{matchError}</p>
        </div>
      )}

      {/* SARTHI'S ANALYSIS */}
      {explanation && !matching && (
        <div className="mt-6 rounded-2xl border border-verified-600/10 bg-verified-100/40 p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-verified-100">
              <ShieldCheck className="h-4 w-4 text-verified-600" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-navy-900">Sarthi's analysis</h2>
              <p className="text-[11px] text-navy-700/50">Based on retrieved BIS document context</p>
            </div>
          </div>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-[1.7] text-navy-800">{explanation}</div>
        </div>
      )}

      {/* MATCHED STANDARDS */}
      {(matching || matches.length > 0) && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-700/50">
              Potentially applicable standards
            </p>
            {matches.length > 0 && (
              <span className="text-xs text-navy-700/40">
                {matches.length} result{matches.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {matching && (
            <div className="card flex items-center gap-3 p-5">
              <Loader2 className="h-5 w-5 animate-spin text-saffron-500" />
              <div>
                <p className="text-sm font-semibold text-navy-900">Searching BIS documents...</p>
                <p className="mt-0.5 text-xs text-navy-700/50">Finding relevant standards for your product.</p>
              </div>
            </div>
          )}

          {!matching &&
            matches.map((m, index) => (
              <div key={`${m.isNumber || m.title || 'standard'}-${index}`} className="card card-hover animate-rise p-5" style={{ '--delay': `${index * 60}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-base font-bold text-navy-900">{m.isNumber || 'BIS Standard'}</p>
                    <p className="mt-1 text-sm leading-relaxed text-navy-700/70">{m.title || 'Relevant BIS document'}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end">
                    <span className="text-lg font-bold tabular-nums text-saffron-600">
                      {typeof m.score === 'number' ? `${m.score}%` : '—'}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-navy-700/40">match</span>
                  </div>
                </div>

                {m.scheme && (
                  <span className="mt-3 inline-flex rounded-full bg-verified-100 px-2.5 py-1 text-[11px] font-bold text-verified-600">
                    {m.scheme}
                  </span>
                )}

                {m.why?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold text-navy-900">Why it may apply</p>
                    <ul className="space-y-1.5">
                      {m.why.map((reason, reasonIndex) => (
                        <li key={reasonIndex} className="flex items-start gap-2 text-xs leading-relaxed text-navy-700/65">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-700/40" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-navy-900/5 pt-3">
                  {m.url ? (
                    <a href={m.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-700 transition hover:underline">
                      Official source
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-navy-700/35">Official source unavailable</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {!matching && matches.length > 0 && (
        <div className="mt-6 flex items-start gap-2 rounded-xl bg-paper-100 p-4">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified-600" />
          <p className="text-xs leading-relaxed text-navy-700/60">
            These are potentially relevant documents retrieved from the BIS knowledge base.
            Always verify the applicable standard and current BIS requirements before taking
            compliance action.
          </p>
        </div>
      )}

      {/* ROADMAP — revealed once a standard has been matched */}
      {topMatch && (
        <div className="mt-14 border-t border-navy-900/10 pt-10">
          <h2 className="font-display text-2xl font-bold text-navy-900">Your BIS Compliance Roadmap</h2>
          <p className="mt-1 text-sm text-navy-700/65">
            A personalised path from product to certification, with sources at every step.
          </p>

          <div className="mt-8 space-y-0">
            {roadmapSteps.map((s, i) => (
              <div key={s.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {s.status === 'done' ? (
                    <CheckCircle2 className="h-6 w-6 text-verified-600" />
                  ) : (
                    <Circle className={`h-6 w-6 ${s.status === 'current' ? 'text-saffron-600' : 'text-navy-700/30'}`} />
                  )}
                  {i < roadmapSteps.length - 1 && <span className="my-1 h-full w-px flex-1 bg-navy-900/10" />}
                </div>
                <div className={`flex-1 pb-8 ${s.status === 'pending' ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-navy-900">{s.title}</p>
                    {s.status === 'current' && (
                      <span className="rounded-full bg-saffron-100 px-2.5 py-0.5 text-[10px] font-bold text-saffron-600">
                        IN PROGRESS
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-navy-700/65">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
