import { useNavigate } from 'react-router-dom';

const STATS = [
  { value: '2.4B+', label: 'Sources Indexed',   icon: 'storage' },
  { value: '127ms', label: 'Avg. Response',      icon: 'bolt' },
  { value: '99.2%', label: 'Uptime SLA',         icon: 'verified' },
  { value: '14.8K', label: 'Analyses Completed', icon: 'analytics' },
];

const FEATURES = [
  {
    icon: 'search',
    color: 'var(--blue)',
    colorBg: 'var(--blue-bg)',
    title: 'Real-time Web Search',
    desc: 'Agents crawl the live web to find the most recent citations, counter-evidence, and primary sources.',
  },
  {
    icon: 'psychology',
    color: 'var(--teal)',
    colorBg: 'var(--teal-bg)',
    title: 'AI Claim Extraction',
    desc: 'Advanced NLP dissects complex narratives into individual, independently verifiable statements.',
  },
  {
    icon: 'gavel',
    color: 'var(--navy)',
    colorBg: 'var(--navy-light)',
    title: 'Digital Jurist Scoring',
    desc: 'A definitive VerifAI Score 0–100 using Forensic Linguistics and Probabilistic Confidence Scoring.',
  },
  {
    icon: 'security',
    color: 'var(--green)',
    colorBg: 'var(--green-bg)',
    title: 'Source Trust Analysis',
    desc: 'Evaluates the trustworthiness and authority of every source cited — not just whether citations exist.',
  },
  {
    icon: 'manage_search',
    color: 'var(--amber)',
    colorBg: 'var(--amber-bg)',
    title: 'Bias Pattern Detection',
    desc: 'Identifies political framing, institutional slant, and omission patterns across the source network.',
  },
  {
    icon: 'auto_awesome',
    color: '#7c3aed',
    colorBg: '#ede9fe',
    title: 'AI Authorship Detection',
    desc: 'Detects LLM-generated text, synthetic media attribution, and machine-written content signatures.',
  },
];

const HOW_IT_WORKS = [
  { num: '01', title: 'Submit Your Content', desc: 'Paste text, enter a URL, or upload a document. VerifAI accepts articles, social posts, PDFs, and more.' },
  { num: '02', title: 'Forensic Analysis', desc: 'Our engine extracts every claim, searches 42+ databases, and cross-references primary sources in real time.' },
  { num: '03', title: 'Read Your Report', desc: 'Get a structured report with per-claim verdicts, confidence scores, source citations, and an overall VerifAI Score.' },
];

const TESTIMONIALS = [
  { quote: 'VerifAI has become the first tool we reach for before publishing. The claim-level breakdown is extraordinary.', name: 'Sarah Chen', role: 'Senior Editor, Reuters Digital', initials: 'SC', color: '#2563eb' },
  { quote: 'We integrated the API into our editorial workflow. Turnaround time went from hours to seconds — at higher accuracy.', name: 'James Okafor', role: 'Head of Fact-Check, BBC Verify', initials: 'JO', color: '#059669' },
  { quote: 'The bias detection alone is worth it. VerifAI surface patterns our team would have missed entirely.', name: 'Dr. Priya Nair', role: 'Research Director, Media Standards UK', initials: 'PN', color: '#7c3aed' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>

      {/* ──────────── NAV ──────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 60,
        background: 'rgba(250,247,241,0.42)',
        backdropFilter: 'blur(5px) saturate(110%)',
        WebkitBackdropFilter: 'blur(13px) saturate(100%)',
        borderBottom: '1px solid rgba(255,255,255,0.55)',
        boxShadow: '0 8px 24px rgba(26,39,68,0.08)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--navy), var(--navy-mid))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(26,39,68,0.3)',
          }}>
            <span className="material-icons-round" style={{ color: 'white', fontSize: '0.9rem' }}>verified</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.04em', color: 'var(--navy)' }}>VerifAI</span>
          <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginLeft: 2 }}>v2.4</span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {[''].map(l => (
            <a key={l} href="#" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.12s' }}
              onMouseEnter={e => e.target.style.color = 'var(--navy)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
            >{l}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/history')} style={{ fontSize: '0.875rem' }}>Sign in</button>
          <button className="btn btn-primary" onClick={() => navigate('/verify')} style={{ borderRadius: 99, padding: '8px 18px', fontSize: '0.875rem' }}>
            Get started free
          </button>
        </div>
      </nav>

      {/* ──────────── HERO ──────────── */}
      <section style={{
        padding: '100px 48px 80px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decoration blobs */}
        <div style={{ position: 'absolute', left: '10%', top: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,78,216,0.06), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '8%', top: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,107,26,0.06), transparent 70%)', pointerEvents: 'none' }} />

        <div className="animate-in">
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '7px 10px',
            marginBottom: 28,
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.65)',
            background: 'linear-gradient(120deg, rgba(255,255,255,0.78), rgba(255,255,255,0.56))',
            boxShadow: '0 10px 24px rgba(26,39,68,0.12)',
            backdropFilter: 'blur(10px) saturate(125%)',
            WebkitBackdropFilter: 'blur(10px) saturate(125%)',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(34,197,94,0.16), rgba(22,163,74,0.08))',
              border: '1px solid rgba(22,163,74,0.22)',
            }}>
              <span className="material-icons-round" style={{ fontSize: '0.86rem', color: 'var(--green-vivid)' }}>bolt</span>
              <div className="live-indicator" style={{ fontSize: '0.62rem', color: 'var(--green)' }}>
                <span className="live-dot" />&nbsp;Live Intelligence
              </div>
            </div>

            <span style={{
              fontSize: '0.69rem',
              color: 'var(--navy)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              background: 'rgba(26,39,68,0.06)',
              border: '1px solid rgba(26,39,68,0.1)',
              borderRadius: 999,
              padding: '4px 10px',
            }}>
              Digital Jurist · v2.4.0
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: 1.05,
            marginBottom: 24,
            maxWidth: 820,
            margin: '0 auto 24px',
          }}>
            Know what's true.<br />
            <span className="gradient-text">Instantly.</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 40px' }}>
            VerifAI is the world's most advanced AI fact-checking platform — powered by the Digital Jurist Intelligence engine. Verify any claim, article, or document in seconds.
          </p>

          {/* Input bar */}
          <div style={{
            maxWidth: 640, margin: '0 auto 20px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-strong)',
            borderRadius: 14,
            padding: 6,
            display: 'flex', gap: 6,
            boxShadow: 'var(--shadow-md)',
          }}>
            <input
              style={{
                flex: 1, border: 'none', background: 'transparent',
                padding: '10px 14px', fontSize: '0.9rem',
                color: 'var(--text-primary)', outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
              placeholder="Paste a claim, article, or URL to verify..."
            />
            <button
              className="btn btn-primary"
              onClick={() => navigate('/verify')}
              style={{ borderRadius: 10, padding: '10px 22px', fontSize: '0.9rem', flexShrink: 0 }}
            >
              <span className="material-icons-round">verified_user</span>
              Verify Now
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            No account required · Free tier includes 10 analyses/month
          </p>

          {/* CTA pair */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
            <button className="btn btn-primary" onClick={() => navigate('/verify')} style={{ borderRadius: 99, padding: '12px 28px', fontSize: '0.95rem' }}>
              <span className="material-icons-round">add</span>Start New Analysis
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/history')} style={{ borderRadius: 99, padding: '12px 24px', fontSize: '0.95rem' }}>
              <span className="material-icons-round">play_circle</span>Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* ──────────── STATS BAR ──────────── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface-card)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: '28px 32px',
              borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', gap: 16,
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,39,68,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-icons-round" style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>{s.icon}</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── FEATURES ──────────── */}
      <section style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)', marginBottom: 12 }}>Platform Capabilities</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 16 }}>
            Every tool to settle the truth
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Six independently powerful engines working in concert — giving you a complete, multi-dimensional picture of any claim.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card"
              style={{ padding: 24, transition: 'all 0.2s', cursor: 'default', animationDelay: `${i * 0.06}s` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = ''; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: f.colorBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <span className="material-icons-round" style={{ color: f.color, fontSize: '1.1rem' }}>{f.icon}</span>
              </div>
              <div style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: 7, color: 'var(--text-primary)' }}>{f.title}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── HOW IT WORKS ──────────── */}
      <section style={{ padding: '80px 48px', background: 'var(--surface-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)', marginBottom: 12 }}>The Process</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.04em' }}>
              From submission to verdict in seconds
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, position: 'relative' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: 28, left: 'calc(16.67% + 20px)', right: 'calc(16.67% + 20px)', height: 2, background: 'linear-gradient(90deg, var(--navy), var(--blue), var(--green))', borderRadius: 1, zIndex: 0 }} />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.num} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--navy), var(--navy-mid))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: 'var(--shadow-navy)',
                  border: '3px solid var(--surface-card)',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>{step.num}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: '0.845rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── TESTIMONIALS ──────────── */}
      <section style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)', marginBottom: 12 }}>Trusted by Newsrooms</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.04em' }}>
            The tool journalists rely on
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card" style={{ padding: 28 }}>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-icons-round" style={{ fontSize: '0.9rem', color: '#f59e0b' }}>star</span>
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── CTA BANNER ──────────── */}
      <section style={{ padding: '0 48px 90px' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 50%, #2d50a0 100%)',
          borderRadius: 20, padding: '64px 80px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          {/* Decoration */}
          <div style={{ position: 'absolute', right: -60, top: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: -40, bottom: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

          <div className="live-indicator" style={{ justifyContent: 'center', marginBottom: 20, color: 'rgba(255,255,255,0.8)' }}>
            <span className="live-dot" style={{ background: '#4ade80' }} />System Online · 99.2% Uptime
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20 }}>
            Stop guessing.<br />Start verifying.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 36px' }}>
            Join 14,000+ journalists, researchers, and analysts who use VerifAI to separate fact from fiction.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn"
              onClick={() => navigate('/verify')}
              style={{ background: 'white', color: 'var(--navy)', borderRadius: 99, padding: '13px 28px', fontSize: '0.95rem', fontWeight: 700, border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
            >
              <span className="material-icons-round">rocket_launch</span>Get Started Free
            </button>
            <button
              className="btn"
              onClick={() => navigate('/history')}
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white', borderRadius: 99, padding: '13px 24px', fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
            >
              <span className="material-icons-round">dashboard</span>Go to Dashboard
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 20, fontFamily: 'var(--font-mono)' }}>
            No credit card required · Free tier · Cancel anytime
          </p>
        </div>
      </section>

      {/* ──────────── FOOTER ──────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '36px 48px 28px', background: 'var(--surface-card)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32, marginBottom: 36 }}>
            {/* Brand */}
            <div style={{ maxWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, var(--navy), var(--navy-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-icons-round" style={{ color: 'white', fontSize: '0.8rem' }}>verified</span>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--navy)', letterSpacing: '-0.03em' }}>VerifAI</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>The Digital Jurist Intelligence platform. AI-powered fact-checking at forensic depth.</p>
            </div>

            {/* Links */}
            {[
              {
                heading: 'Legal',
                links: [
                  { label: 'About', to: '/about' },
                  { label: 'Privacy Policy', to: '/privacy' },
                  { label: 'Terms of Service', to: '/terms' },
                  { label: 'Security', to: '/security' },
                ],
              },
            ].map(col => (
              <div key={col.heading}>
                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 12 }}>{col.heading}</div>
                {col.links.map(l => (
                  <div key={l.label} style={{ marginBottom: 8 }}>
                    <button
                      type="button"
                      onClick={() => navigate(l.to)}
                      style={{
                        fontSize: '0.845rem',
                        color: 'var(--text-secondary)',
                        transition: 'color 0.12s',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => e.target.style.color = 'var(--navy)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                    >{l.label}</button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 20, flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>© 2026 VerifAI Inc. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="badge badge-navy"
                type="button"
                title="Prove you are secure"
                onClick={() => navigate('/trust/soc-2')}
                style={{ fontSize: '0.58rem', cursor: 'pointer', backgroundClip: 'padding-box' }}
              >
                SOC 2 Type II
              </button>
              <button
                className="badge badge-teal"
                type="button"
                title="Respect user privacy"
                onClick={() => navigate('/trust/gdpr')}
                style={{ fontSize: '0.58rem', cursor: 'pointer', backgroundClip: 'padding-box' }}
              >
                GDPR Compliant
              </button>
              <button
                className="badge badge-blue"
                type="button"
                title="Follow a security system"
                onClick={() => navigate('/trust/iso-27001')}
                style={{ fontSize: '0.58rem', cursor: 'pointer', backgroundClip: 'padding-box' }}
              >
                ISO 27001
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
