import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../store/analysisStore';
import { startVerification } from '../services/api';

export default function VerifyPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [model, setModel] = useState('ultra');
  const { dispatch } = useAnalysis();
  const isSubmitting = useRef(false);
  const [opts, setOpts] = useState({
    'Deep Source Triangulation': true,
    'AI Content Detection': true,
    'Bias Pattern Analysis': false,
    'Real-time Web Search': true,
  });

  const TABS = [
    { id: 'text', label: 'Text / Article', icon: 'article' },
    { id: 'url', label: 'URL', icon: 'link' },
    { id: 'social', label: 'Social Post', icon: 'tag' },
  ];

  const OPTS = [
    { key: 'Deep Source Triangulation', desc: 'Cross-reference 42 verified global databases' },
    { key: 'AI Content Detection', desc: 'Detect LLM-generated text and manipulation markers' },
    { key: 'Bias Pattern Analysis', desc: 'Identify political and institutional bias vectors' },
    { key: 'Real-time Web Search', desc: 'Live crawl for latest citations and evidence' },
  ];

  const MODELS = [
    { id: 'ultra', name: 'Jurist-V4 Ultra', desc: 'Deep reasoning with 128k context window.', badge: 'Recommended', icon: 'psychology' },
    { id: 'flash', name: 'QuickCheck Flash', desc: 'Sub-second latency for social media verification.', badge: null, icon: 'bolt' },
  ];

  const charLimit = 10000;
  const charPct = Math.min((text.length / charLimit) * 100, 100);

  const handleSubmit = () => {
    if (isSubmitting.current) return;
    if (tab === 'url' && !url.trim()) return;
    if (tab !== 'url' && !text.trim()) return;

    isSubmitting.current = true;

    const inputType = tab === 'url' ? 'URL' : 'TEXT';
    const inputContent = tab === 'url' ? url : text;

    dispatch({ type: 'START', inputType, inputContent });

    const cancel = startVerification(
      { input_type: inputType, content: inputContent },
      (event) => {
        if (event.stage === 'extracting') {
          dispatch({ type: 'SET_STAGE', stage: 'extracting' });
        } else if (event.stage === 'claims_found') {
          dispatch({ type: 'CLAIMS_FOUND', claims: event.data.claims });
        } else if (event.stage === 'retrieving') {
          dispatch({ type: 'SET_STAGE', stage: 'retrieving' });
        } else if (event.stage === 'verifying') {
          dispatch({ type: 'CLAIM_VERIFIED', claim_id: event.data.claim_id });
        } else if (event.stage === 'complete') {
          dispatch({ type: 'COMPLETE', report: event.data });
          navigate('/reports');
        } else if (event.stage === 'error') {
          dispatch({ type: 'ERROR', message: event.data.message });
          isSubmitting.current = false;
        }
      },
      () => {
        isSubmitting.current = false;
      },
      (err) => {
        dispatch({ type: 'ERROR', message: err });
        isSubmitting.current = false;
      }
    );

    dispatch({ type: 'SET_CANCEL', cancelFn: cancel });
    navigate('/live');
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-eyebrow">Verification Engine</div>
        <h1 className="page-title">New Analysis</h1>
        <p className="page-subtitle">Submit a claim, article, or URL for VerifAI forensic verification.</p>
      </div>

      <div className="page-body">
        <div style={{ maxWidth: 700 }}>
          {/* Tabs */}
          <div className="tab-group" style={{ marginBottom: 20 }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`tab-btn ${tab === t.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
              >
                <span className="material-icons-round" style={{ fontSize: '0.9rem' }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Input card */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
              {tab === 'text' ? 'Paste content to verify' : tab === 'url' ? 'Enter article URL' : 'Paste social media post'}
            </div>

            {tab === 'url'
              ? <input className="input" style={{ marginBottom: 14 }} placeholder="https://example.com/article-to-verify" value={url} onChange={e => setUrl(e.target.value)} />
              : <textarea className="input" rows={8} style={{ marginBottom: 10 }}
                placeholder={tab === 'text' ? 'Paste the full article, blog post, or any text content here...' : 'Paste the social media post or tweet here...'}
                value={text} onChange={e => setText(e.target.value)}
              />
            }

            {/* Character count bar (text/social only) */}
            {tab !== 'url' && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {text.length > 0 ? `${text.length.toLocaleString()} characters` : 'Supports articles, URLs, social posts'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: charPct > 90 ? 'var(--red)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {charPct > 0 ? `${Math.round(charPct)}%` : ''}
                  </span>
                </div>
                <div className="progress-track">
                  <div className={`progress-fill ${charPct > 90 ? 'progress-red' : charPct > 60 ? 'progress-amber' : 'progress-navy'}`} style={{ width: `${charPct}%` }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => { setText(''); setUrl(''); }}>Clear</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                <span className="material-icons-round">send</span>Begin Analysis
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-label">Analysis Configuration</div>
            {OPTS.map(o => (
              <div key={o.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <div style={{ fontSize: '0.865rem', fontWeight: 600 }}>{o.key}</div>
                    {opts[o.key] && <span className="badge badge-teal" style={{ fontSize: '0.55rem', padding: '2px 5px' }}>ON</span>}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{o.desc}</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={opts[o.key]} onChange={() => setOpts(p => ({ ...p, [o.key]: !p[o.key] }))} />
                  <span className="toggle-track"></span>
                </label>
              </div>
            ))}
          </div>

          {/* Model */}
          <div className="card">
            <div className="section-label">Inference Model</div>
            {MODELS.map(m => (
              <div
                key={m.id}
                onClick={() => setModel(m.id)}
                style={{
                  padding: '13px 15px', borderRadius: 10, cursor: 'pointer', marginBottom: m.id !== MODELS[MODELS.length - 1].id ? 10 : 0,
                  border: `1.5px solid ${model === m.id ? 'var(--navy)' : 'var(--border)'}`,
                  background: model === m.id ? 'rgba(26,39,68,0.05)' : 'var(--bg)',
                  display: 'flex', alignItems: 'center', gap: 13, transition: 'all 0.15s',
                  boxShadow: model === m.id ? '0 2px 8px rgba(26,39,68,0.1)' : 'none',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: model === m.id ? 'linear-gradient(135deg, var(--navy), var(--navy-mid))' : 'var(--surface-card)',
                  border: `1px solid ${model === m.id ? 'transparent' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                  boxShadow: model === m.id ? 'var(--shadow-navy)' : 'none',
                }}>
                  <span className="material-icons-round" style={{ fontSize: '1rem', color: model === m.id ? 'white' : 'var(--text-muted)' }}>{m.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                </div>
                {m.badge && <span className="badge badge-navy">{m.badge}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
