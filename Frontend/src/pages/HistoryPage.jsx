import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DATA = [
  { id: 1, title: 'The Impact of Synthetic Media on Election Integrity 2024', score: 94, status: 'completed', tag: 'bbc.co.uk/news/politics', date: 'Oct 24, 2023' },
  { id: 2, title: 'Analysis of SEC Regulation Proposal v2.44', score: 62, status: 'completed', tag: 'sec_proposal_final.pdf', date: 'Oct 22, 2023' },
  { id: 3, title: 'Deepfake Detection: Audio Snippet #4029', score: null, status: 'failed', tag: 'Corrupt data source', date: 'Oct 20, 2023', error: true },
  { id: 4, title: 'Climate Statistics Fact Check: Global Emissions 2023', score: 88, status: 'completed', tag: 'un.org/climate-data', date: 'Oct 18, 2023' },
  { id: 5, title: 'EU Digital Markets Act Enforcement Review', score: 71, status: 'completed', tag: 'ec.europa.eu/dma', date: 'Oct 15, 2023' },
  { id: 6, title: 'AI Chatbot Accuracy Benchmark — GPT vs Gemini', score: 85, status: 'completed', tag: 'stanford.edu/aiindex', date: 'Oct 12, 2023' },
  { id: 7, title: 'Global Supply Chain Disruption: Q1 2024 Analysis', score: 79, status: 'completed', tag: 'reuters.com/supply', date: 'Oct 10, 2023' },
  { id: 8, title: 'Urban Transit Recovery: Metropolitan Bus Claims', score: 53, status: 'completed', tag: 'mta.info/ridership', date: 'Oct 7, 2023' },
];

const ICON_BG = { completed: 'rgba(26,107,26,0.1)', failed: 'rgba(185,28,28,0.1)' };
const ICON_COLOR = { completed: 'var(--green)', failed: 'var(--red)' };
const ICON_NAME = { completed: 'check_circle', failed: 'error_outline' };

const SCORE_COLOR = s => s >= 75 ? 'var(--green)' : s >= 50 ? 'var(--amber)' : 'var(--red)';
const SCORE_BG = s => s >= 75 ? 'var(--green-bg)' : s >= 50 ? 'var(--amber-bg)' : 'var(--red-bg)';
const SCORE_BORDER = s => s >= 75 ? 'var(--green-border)' : s >= 50 ? 'var(--amber-border)' : 'var(--red-border)';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');

  return (
    <div className="animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="page-eyebrow">Archive Registry</div>
            <h1 className="page-title">Analysis History</h1>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'linear-gradient(135deg, var(--navy), var(--navy-mid))' : undefined,
                color: viewMode === 'grid' ? 'white' : undefined,
                borderColor: viewMode === 'grid' ? 'var(--navy)' : undefined,
                boxShadow: viewMode === 'grid' ? 'var(--shadow-navy)' : undefined,
              }}
            >
              <span className="material-icons-round">grid_view</span>Grid
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? 'linear-gradient(135deg, var(--navy), var(--navy-mid))' : undefined,
                color: viewMode === 'list' ? 'white' : undefined,
                borderColor: viewMode === 'list' ? 'var(--navy)' : undefined,
                boxShadow: viewMode === 'list' ? 'var(--shadow-navy)' : undefined,
              }}
            >
              <span className="material-icons-round">view_list</span>List
            </button>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Filter bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 10, marginBottom: 22 }}>
          {[
            ['search', 'Search Keywords', 'Filter by title...'],
            ['date_range', 'Date Range', 'Last 30 Days'],
            ['percent', 'Accuracy Score', 'All Scores'],
            ['task_alt', 'Analysis Status', 'All Statuses'],
          ].map(([icon, l, p]) => (
            <div key={l} style={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                <span className="material-icons-round" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{icon}</span>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</div>
              </div>
              <input className="input" placeholder={p} style={{ padding: '6px 10px', fontSize: '0.8rem', background: 'var(--bg)', border: '1px solid var(--border)' }} />
            </div>
          ))}
        </div>

        {/* Results */}
        {viewMode === 'list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DATA.map((item) => (
              <div
                key={item.id}
                className={`list-row list-row-${item.status === 'completed' ? (item.score >= 75 ? 'completed' : item.score >= 50 ? 'partial' : 'failed') : 'failed'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => item.status !== 'failed' && navigate('/reports')}
              >
                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                  background: ICON_BG[item.status],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${item.status === 'completed' ? 'var(--green-border)' : 'var(--red-border)'}`,
                }}>
                  <span className="material-icons-round" style={{ color: ICON_COLOR[item.status], fontSize: '1.05rem' }}>
                    {item.id <= 4 ? ['article', 'gavel', 'mic', 'public'][item.id - 1] : 'description'}
                  </span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }} className="ellipsis">
                    {item.title.length > 55 ? item.title.slice(0, 55) + '...' : item.title}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.date}</span>
                    {item.error
                      ? <span style={{ fontSize: '0.72rem', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span className="material-icons-round" style={{ fontSize: '0.75rem' }}>warning</span>
                        {item.tag}
                      </span>
                      : <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span className="material-icons-round" style={{ fontSize: '0.72rem', verticalAlign: 'middle' }}>language</span>
                        {item.tag}
                      </span>
                    }
                  </div>
                </div>

                {/* Score badge */}
                {item.score !== null
                  ? <div style={{
                    width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                    background: SCORE_BG(item.score),
                    border: `2px solid ${SCORE_BORDER(item.score)}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: SCORE_COLOR(item.score), lineHeight: 1.1 }}>{item.score}%</div>
                  </div>
                  : <div style={{ width: 46, flexShrink: 0, textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-muted)' }}>—</div>
                }

                {/* Status badge */}
                <span className={`badge badge-${item.status}`} style={{ flexShrink: 0 }}>
                  {item.status === 'completed' ? '✓ Done' : '✗ Failed'}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {item.status === 'completed' && (
                    <button className="btn btn-ghost" style={{ padding: '5px 7px', minWidth: 0 }} onClick={e => e.stopPropagation()} title="View Report">
                      <span className="material-icons-round" style={{ fontSize: '0.95rem' }}>visibility</span>
                    </button>
                  )}
                  {item.status === 'failed' && (
                    <button className="btn btn-ghost" style={{ padding: '5px 7px', minWidth: 0 }} onClick={e => e.stopPropagation()} title="Retry">
                      <span className="material-icons-round" style={{ fontSize: '0.95rem' }}>refresh</span>
                    </button>
                  )}
                  <button className="btn btn-ghost" style={{ padding: '5px 7px', minWidth: 0, color: 'var(--red)' }} onClick={e => e.stopPropagation()} title="Delete">
                    <span className="material-icons-round" style={{ fontSize: '0.95rem' }}>delete_outline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {DATA.map((item) => (
              <div
                key={item.id}
                className="card card-hover"
                style={{
                  cursor: item.status !== 'failed' ? 'pointer' : 'default',
                  borderColor: item.status === 'failed' ? 'var(--red-border)' : undefined,
                  background: item.status === 'failed' ? 'rgba(185,28,28,0.02)' : undefined,
                }}
                onClick={() => item.status !== 'failed' && navigate('/reports')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                      background: ICON_BG[item.status],
                      border: `1px solid ${item.status === 'completed' ? 'var(--green-border)' : 'var(--red-border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="material-icons-round" style={{ color: ICON_COLOR[item.status], fontSize: '1rem' }}>
                        {item.id <= 4 ? ['article', 'gavel', 'mic', 'public'][item.id - 1] : 'description'}
                      </span>
                    </div>
                    <span className={`badge badge-${item.status}`}>{item.status === 'completed' ? '✓ Done' : '✗ Failed'}</span>
                  </div>
                  {item.score !== null
                    ? <div style={{
                      minWidth: 54,
                      padding: '4px 8px',
                      borderRadius: 999,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: SCORE_COLOR(item.score),
                      background: SCORE_BG(item.score),
                      border: `1px solid ${SCORE_BORDER(item.score)}`,
                      textAlign: 'center',
                    }}>
                      {item.score}%
                    </div>
                    : <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>—</div>
                  }
                </div>

                <div style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.45 }}>
                  {item.title}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.date}</span>
                  <span style={{ fontSize: '0.72rem', color: item.error ? 'var(--red)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing 1–{DATA.length} of 128 entries</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-ghost" style={{ padding: '6px 9px' }}>
              <span className="material-icons-round" style={{ fontSize: '0.9rem' }}>chevron_left</span>
            </button>
            {[1, 2, 3, '…', 12].map((p, i) => (
              <button key={i} className="btn btn-secondary" style={{
                padding: '6px 11px', fontSize: '0.82rem',
                background: p === 1 ? 'linear-gradient(135deg, var(--navy), var(--navy-mid))' : undefined,
                color: p === 1 ? 'white' : undefined,
                borderColor: p === 1 ? 'var(--navy)' : undefined,
                boxShadow: p === 1 ? 'var(--shadow-navy)' : undefined,
              }}>
                {p}
              </button>
            ))}
            <button className="btn btn-ghost" style={{ padding: '6px 9px' }}>
              <span className="material-icons-round" style={{ fontSize: '0.9rem' }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
