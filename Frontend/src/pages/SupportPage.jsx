import { useState } from 'react';

const GUIDES = [
  { icon:'psychology',  title:'First Principles: Verifying Logic',  desc:'Understand the underlying heuristic models used to score claims.' },
  { icon:'api',         title:'REST API Documentation',             desc:'Programmatically submit claims and retrieve verified insights.' },
  { icon:'shield',      title:'Trust & Safety Protocols',           desc:'Data anonymization, encryption, and audit standards.' },
];

const FAQS = [
  { q:'How does VerifAI handle conflicting source data?', a:'When sources conflict, the Digital Jurist assigns probabilistic weights based on each source\'s Trust Index score, publication date, and institutional standing. High-authority sources have appropriate influence over the final determination.' },
  { q:'What are the latency expectations for API verification?', a:'Standard analyses complete within 60–120 seconds. The QuickCheck Flash model processes social-media-scale content in under 10 seconds. Enterprise API users can configure async webhooks for longer analyses.' },
  { q:'Is my input data used to train the global model?', a:'No. All submitted content is processed ephemerally and immediately discarded after analysis. VerifAI operates under a strict data-minimization policy compliant with GDPR Article 5 and CCPA standards.' },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [msg, setMsg] = useState('');

  return (
    <div className="animate-in">
      <div className="page-header">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 className="page-title">Support & Documentation</h1>
            <p className="page-subtitle">Access guides, API docs, and direct expert support.</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 14px', background:'var(--green-bg)', border:'1px solid var(--green-border)', borderRadius:9 }}>
            <span className="dot dot-live"></span>
            <span style={{ fontSize:'0.78rem', color:'var(--green)', fontFamily:'var(--font-mono)', fontWeight:600 }}>Avg Response: 0.8s</span>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:22 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
            {/* Guides */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <div className="section-label" style={{ margin:0 }}>Recommended Guides</div>
                <button className="btn btn-ghost" style={{ fontSize:'0.78rem' }}>All Docs <span className="material-icons-round" style={{ fontSize:'0.85rem' }}>arrow_forward</span></button>
              </div>
              <div className="grid-3">
                {GUIDES.map(g => (
                  <div className="card card-hover" key={g.title}>
                    <div style={{ width:32, height:32, borderRadius:8, background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                      <span className="material-icons-round" style={{ color:'white', fontSize:'0.95rem' }}>{g.icon}</span>
                    </div>
                    <div style={{ fontSize:'0.845rem', fontWeight:700, marginBottom:5, lineHeight:1.4 }}>{g.title}</div>
                    <div style={{ fontSize:'0.775rem', color:'var(--text-muted)', lineHeight:1.65 }}>{g.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div className="section-label">Frequently Asked Questions</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {FAQS.map((faq, i) => (
                  <div className="card" key={i} style={{ cursor:'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:14 }}>
                      <span style={{ fontSize:'0.865rem', fontWeight:600, lineHeight:1.5 }}>{faq.q}</span>
                      <span className="material-icons-round" style={{ color:'var(--text-muted)', flexShrink:0, transition:'transform 0.2s', transform:openFaq === i ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                    </div>
                    {openFaq === i && (
                      <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.72, marginTop:12, paddingTop:12, borderTop:'1px solid var(--divider)' }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ textAlign:'center', padding:'12px 0', fontSize:'0.78rem', color:'var(--text-muted)' }}>
                Can't find an answer?{' '}
                <a href="mailto:support@verifai.io" style={{ color:'var(--navy)', fontWeight:600 }}>support@verifai.io</a>
              </div>
            </div>

            {/* Status */}
            <div className="card" style={{ background:'var(--green-bg)', border:'1px solid var(--green-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span className="material-icons-round" style={{ color:'var(--green)' }}>check_circle</span>
                <div>
                  <div style={{ fontSize:'0.875rem', fontWeight:700, color:'var(--green)' }}>Platform Status: Operational</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>All systems nominal · checked 1 min ago</div>
                </div>
              </div>
              <button className="btn btn-secondary" style={{ fontSize:'0.78rem' }}>Status Page</button>
            </div>
          </div>

          {/* Right */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div className="card" style={{ background:'var(--navy)', border:'none' }}>
              <span className="material-icons-round" style={{ color:'white', marginBottom:10, display:'block', fontSize:'1.4rem' }}>support_agent</span>
              <h3 style={{ fontSize:'0.95rem', fontWeight:700, marginBottom:7, color:'white' }}>Need expert support?</h3>
              <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.7)', lineHeight:1.68, marginBottom:14 }}>
                Our intelligence team is available for complex verifications and technical integration.
              </p>
              <button className="btn" style={{ background:'white', color:'var(--navy)', width:'100%', justifyContent:'center', fontWeight:700, border:'none' }}>
                <span className="material-icons-round">chat</span>Start Live Chat
              </button>
            </div>

            <div className="card">
              <div className="section-label">Submit a Query</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <input className="input" placeholder="Subject" />
                <textarea className="input" rows={4} placeholder="Describe your question..." value={msg} onChange={e => setMsg(e.target.value)} />
                <button className="btn btn-primary" style={{ justifyContent:'center' }}>
                  <span className="material-icons-round">send</span>Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
