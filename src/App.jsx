import { useState, useMemo } from 'react'
import { PLAYERS } from './playerData.js'
import PaananenReport from './PaananenReport.jsx'
import PaananenDashboard from './PaananenDashboard.jsx'
import DiarraDashboard from './DiarraDashboard.jsx'
import KilenDashboard from './KilenDashboard.jsx'
import PlayerDashboard from './PlayerDashboard.jsx'

const POS_GROUPS = [
  { id: 'all',       label: 'Alle' },
  { id: 'attackers', label: 'Angripere',  ids: ['paananen','diarra','kucys','gonstad','fenger','ladefoged','p_christiansen'] },
  { id: 'wingers',   label: 'Kanter/AMF', ids: ['kilen_s','mccowatt','austbo','bjerkebo','ejdum','heintz'] },
  { id: 'defenders', label: 'Forsvarere', ids: ['mbacke_diop','amundsen_day','falchener','askou','markmann','coulibaly'] },
]

const VERDICTS = ['Alle', 'High Potential', 'Interessant', 'Conditional Fit', 'Conditional Positive', 'Monitor']

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [view,        setView]       = useState('dashboard')
  const [posFilter,   setPosFilter]  = useState('all')
  const [verdictFilter, setVerdictFilter] = useState('Alle')
  const [search,      setSearch]     = useState('')

  const player = PLAYERS.find(p => p.id === selectedId)

  const filtered = useMemo(() => {
    let list = PLAYERS
    if (posFilter !== 'all') {
      const group = POS_GROUPS.find(g => g.id === posFilter)
      if (group?.ids) list = list.filter(p => group.ids.includes(p.id))
    }
    if (verdictFilter !== 'Alle') list = list.filter(p => p.verdict === verdictFilter)
    if (search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [posFilter, verdictFilter, search])

  if (selectedId && player) {
    const showReport = player.hasReport
    return (
      <div style={{ minHeight: '100vh', background: '#f5f2eb' }}>
        <div style={{ borderBottom: '1px solid rgba(15,14,13,0.12)', background: '#f5f2eb', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48, borderBottom: '1px solid rgba(15,14,13,0.07)' }}>
              <button onClick={() => setSelectedId(null)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: 13, color: '#7a7060', padding: '4px 0' }}>
                ← Alle spillere
              </button>
              <span style={{ fontSize: 11, color: 'rgba(15,14,13,0.2)' }}>|</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0f0e0d' }}>{player.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', padding: '2px 8px', border: `1px solid ${player.vc}`, color: player.vc, borderRadius: 2, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                {player.verdict}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4, height: 40, alignItems: 'center' }}>
              {showReport && (
                <button onClick={() => setView('report')} style={{ cursor: 'pointer', fontSize: 13, padding: '4px 14px', borderRadius: 6, border: view === 'report' ? '1.5px solid #0f0e0d' : '0.5px solid transparent', background: view === 'report' ? 'rgba(15,14,13,0.06)' : 'transparent', color: view === 'report' ? '#0f0e0d' : '#7a7060', fontWeight: view === 'report' ? 500 : 400, transition: 'all .15s' }}>
                  Rapport
                </button>
              )}
              <button onClick={() => setView('dashboard')} style={{ cursor: 'pointer', fontSize: 13, padding: '4px 14px', borderRadius: 6, border: view === 'dashboard' ? '1.5px solid #0f0e0d' : '0.5px solid transparent', background: view === 'dashboard' ? 'rgba(15,14,13,0.06)' : 'transparent', color: view === 'dashboard' ? '#0f0e0d' : '#7a7060', fontWeight: view === 'dashboard' ? 500 : 400, transition: 'all .15s' }}>
                Dashboard
              </button>
              <div style={{ marginLeft: 'auto', fontSize: 11, color: '#9a8f7f', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                {player.pos} · {player.league} · {player.nat}
              </div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 64px' }}>
          {player.hasReport    && view === 'report'    && <PaananenReport />}
          {player.hasReport    && view === 'dashboard' && <PaananenDashboard />}
          {player.hasDiarra                            && <DiarraDashboard />}
          {player.hasKilen                             && <KilenDashboard />}
          {!player.hasReport && !player.hasDiarra && !player.hasKilen && <PlayerDashboard player={player} />}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f2eb' }}>
      <div style={{ borderBottom: '1px solid rgba(15,14,13,0.12)', background: '#f5f2eb', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 48, gap: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0f0e0d', fontFamily: "'Helvetica Neue', Arial, sans-serif", flexShrink: 0 }}>
            Scouting
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Søk spiller..."
            style={{ flex: 1, maxWidth: 220, fontSize: 12, padding: '5px 10px', borderRadius: 6, border: '0.5px solid rgba(15,14,13,0.2)', background: 'transparent', color: '#0f0e0d', outline: 'none', fontFamily: 'inherit' }}
          />
          <span style={{ fontSize: 11, color: '#9a8f7f', marginLeft: 'auto', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            {filtered.length} spillere
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 24px 64px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {POS_GROUPS.map(g => (
            <button key={g.id} onClick={() => setPosFilter(g.id)} style={{
              cursor: 'pointer', fontSize: 12, padding: '5px 12px', borderRadius: 6,
              border: posFilter === g.id ? '1.5px solid #0f0e0d' : '0.5px solid rgba(15,14,13,0.2)',
              background: posFilter === g.id ? 'rgba(15,14,13,0.06)' : 'transparent',
              color: posFilter === g.id ? '#0f0e0d' : '#7a7060',
              fontWeight: posFilter === g.id ? 500 : 400, fontFamily: 'inherit',
            }}>{g.label}</button>
          ))}
          <span style={{ fontSize: 11, color: 'rgba(15,14,13,0.25)', alignSelf: 'center', margin: '0 2px' }}>|</span>
          {VERDICTS.map(v => (
            <button key={v} onClick={() => setVerdictFilter(v)} style={{
              cursor: 'pointer', fontSize: 12, padding: '5px 12px', borderRadius: 6,
              border: verdictFilter === v ? '1.5px solid #0f0e0d' : '0.5px solid rgba(15,14,13,0.2)',
              background: verdictFilter === v ? 'rgba(15,14,13,0.06)' : 'transparent',
              color: verdictFilter === v ? '#0f0e0d' : '#7a7060',
              fontWeight: verdictFilter === v ? 500 : 400, fontFamily: 'inherit',
            }}>{v}</button>
          ))}
        </div>

        <div style={{ border: '1px solid rgba(15,14,13,0.12)', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 90px 65px 50px 60px 55px 55px 55px 130px', padding: '8px 16px', background: 'rgba(15,14,13,0.04)', borderBottom: '1px solid rgba(15,14,13,0.1)' }}>
            {['Spiller','Liga','Min','Mål','xG','G/90','Pass%','Duel%','Verdict'].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a7060', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{h}</div>
            ))}
          </div>
          {filtered.map((p, i) => (
            <div
              key={p.id}
              onClick={() => { setSelectedId(p.id); setView('dashboard') }}
              style={{
                display: 'grid', gridTemplateColumns: '1.4fr 90px 65px 50px 60px 55px 55px 55px 130px',
                padding: '11px 16px', cursor: 'pointer',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(15,14,13,0.07)' : 'none',
                transition: 'background .1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,14,13,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#0f0e0d' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#9a8f7f', marginTop: 1 }}>{p.pos} · {p.nat}</div>
              </div>
              <div style={{ fontSize: 11, color: '#7a7060', alignSelf: 'center' }}>{p.league.split('/')[0]}</div>
              <div style={{ fontSize: 12, color: '#0f0e0d', alignSelf: 'center' }}>{Math.round(p.mins)}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: p.goals >= 10 ? '#185FA5' : '#0f0e0d', alignSelf: 'center' }}>{p.goals}</div>
              <div style={{ fontSize: 12, color: '#7a7060', alignSelf: 'center' }}>{p.xG}</div>
              <div style={{ fontSize: 12, fontWeight: p.g90 >= 0.45 ? 600 : 400, color: p.g90 >= 0.45 ? '#3B6D11' : p.g90 >= 0.25 ? '#0f0e0d' : '#9a8f7f', alignSelf: 'center' }}>{p.g90}</div>
              <div style={{ fontSize: 12, color: p.passPct >= 80 ? '#3B6D11' : '#0f0e0d', alignSelf: 'center' }}>{p.passPct}%</div>
              <div style={{ fontSize: 12, color: p.duelPct >= 55 ? '#3B6D11' : p.duelPct >= 40 ? '#0f0e0d' : '#C0392B', alignSelf: 'center' }}>{p.duelPct}%</div>
              <div style={{ alignSelf: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', padding: '3px 7px', border: `1px solid ${p.vc}`, color: p.vc, borderRadius: 2, whiteSpace: 'nowrap', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                  {p.verdict}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
