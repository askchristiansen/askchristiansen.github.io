import { PLAYERS, getPer90, getGxGDiff, getShotAccPct, getDribSuccPct } from './playerData.js'
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'

const CBLUE  = '#185FA5'
const CRED   = '#C0392B'
const CGREEN = '#3B6D11'
const CAMBER = '#B07517'
const CGRAY  = '#888'

function KPI({ label, value, sub, color }) {
  return (
    <div style={{ background: '#f0f0ee', borderRadius: 8, padding: '12px 16px' }}>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: color || '#1a1a1a', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

function STitle({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: '16px 0 8px' }}>{children}</div>
}

function Div() {
  return <div style={{ borderTop: '0.5px solid #e0e0e0', margin: '20px 0' }} />
}

function BarStat({ label, val, max, color }) {
  const pct = Math.min((val / max) * 100, 100)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600, color }}>{typeof val === 'number' ? val.toFixed(1) : val}{label.includes('%') ? '' : ''}</span>
      </div>
      <div style={{ height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
        <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </div>
  )
}

export default function PlayerCard({ playerId }) {
  const p = PLAYERS.find(x => x.id === playerId)
  if (!p) return null

  const n90 = p.mins / 90
  const gPer90 = (p.goals / n90).toFixed(2)
  const xgPer90 = (p.xG / n90).toFixed(2)
  const gxg = getGxGDiff(p)
  const shotAcc = getShotAccPct(p)
  const dribAcc = getDribSuccPct(p)

  // Comparison data — all attackers for context
  const attackers = PLAYERS.filter(x => ['CF','AMF','LW','RW','LWF','RWF','LAMF'].includes(x.position) && x.mins > 800)
  const compData = attackers.map(x => ({
    name: x.shortName,
    g90: +(x.goals / (x.mins/90)).toFixed(2),
    isCurrent: x.id === playerId,
  })).sort((a,b) => b.g90 - a.g90)

  const radarData = [
    { stat: 'Mål/90',     v: Math.min((p.goals/n90)/0.6 * 10, 10) },
    { stat: 'Skuddvol.',  v: p.shots > 0 ? Math.min((p.shots/n90)/2.5 * 10, 10) : 0 },
    { stat: 'Pasning%',   v: p.passAcc > 0 ? (p.passAcc / 100) * 10 : 0 },
    { stat: 'Duell%',     v: (p.duelWin / 100) * 10 },
    { stat: 'Luftkamp%',  v: (p.aerialWin / 100) * 10 },
    { stat: 'Pressing',   v: Math.min(p.intercepts90 / 7 * 10, 10) },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 48 }}>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Mål" value={p.goals} sub={`${gPer90}/90 · ${p.apps} kamper`} color={CBLUE} />
        <KPI label="Assists" value={p.assists} sub={`${p.mins} min`} />
        <KPI label="xG" value={p.xG.toFixed(2)} sub={`${xgPer90}/90`} />
        <KPI
          label="G – xG"
          value={gxg >= 0 ? `+${gxg.toFixed(2)}` : gxg.toFixed(2)}
          sub={gxg > 2 ? 'Over expectation' : gxg < -1 ? 'Under expectation' : 'On track'}
          color={gxg > 1 ? CGREEN : gxg < -1 ? CRED : CGRAY}
        />
      </div>

      {/* Efficiency bars */}
      <STitle>Effektivitet</STitle>
      {p.passAcc > 0 && <BarStat label="Pasningsnøyaktighet %" val={p.passAcc} max={100} color={CBLUE} />}
      {p.duelWin > 0 && <BarStat label="Duellseier %" val={p.duelWin} max={100} color={p.duelWin > 50 ? CGREEN : p.duelWin > 40 ? CAMBER : CRED} />}
      {p.aerialWin > 0 && <BarStat label="Hodekamp %" val={p.aerialWin} max={100} color={p.aerialWin > 50 ? CGREEN : p.aerialWin > 35 ? CAMBER : CRED} />}
      {shotAcc > 0 && <BarStat label="Skudd på mål %" val={shotAcc} max={100} color={CAMBER} />}
      {dribAcc > 0 && <BarStat label="Dribleseier %" val={dribAcc} max={100} color={CBLUE} />}

      <Div />

      {/* Defensive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        <KPI label="Interceptions / 90" value={p.intercepts90.toFixed(2)} color={p.intercepts90 > 3 ? CGREEN : CGRAY} />
        <KPI label="Balltap eget halvt / 90" value={p.lossOH90.toFixed(1)} color={p.lossOH90 > 12 ? CRED : p.lossOH90 > 9 ? CAMBER : CGREEN} />
        {p.touchesPA90 > 0 && <KPI label="Touches i felt / 90" value={p.touchesPA90.toFixed(2)} color={CBLUE} />}
      </div>

      <Div />

      {/* Radar */}
      <STitle>Spillerprofil</STitle>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="stat" tick={{ fontSize: 11 }} />
          <Radar name={p.shortName} dataKey="v" stroke={CBLUE} fill={CBLUE} fillOpacity={0.25} strokeWidth={2} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>

      <Div />

      {/* Attacker comparison */}
      {['CF','AMF','LW','RW','LWF','RWF','LAMF'].includes(p.position) && (
        <>
          <STitle>Mål/90 — sammenligning med andre angripere</STitle>
          <ResponsiveContainer width="100%" height={Math.max(compData.length * 28 + 40, 200)}>
            <BarChart data={compData} layout="vertical" margin={{ top: 4, right: 50, bottom: 0, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 'dataMax + 0.1']} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={v => [v, 'Mål/90']} />
              <Bar dataKey="g90" radius={[0,3,3,0]}>
                {compData.map((d, i) => <Cell key={i} fill={d.isCurrent ? CBLUE : '#d0d0d0'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  )
}
