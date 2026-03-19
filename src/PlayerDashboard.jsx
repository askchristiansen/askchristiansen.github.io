import { useState } from 'react'
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
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

function Leg({ items }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8, fontSize: 12, color: '#666' }}>
      {items.map(({ color, label }) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 7, borderRadius: 2, background: color, display: 'inline-block' }} />
          {label}
        </span>
      ))}
    </div>
  )
}

function STitle({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: '0 0 6px' }}>{children}</div>
}
function Div() { return <div style={{ borderTop: '0.5px solid #e0e0e0', margin: '20px 0' }} /> }
function Box({ color, text }) {
  return (
    <div style={{ borderLeft: `3px solid ${color}`, borderRadius: '0 8px 8px 0', background: '#f5f5f3', padding: '10px 14px', fontSize: 12, color: '#1a1a1a', lineHeight: 1.6, marginBottom: 8 }}>
      {text}
    </div>
  )
}

export default function PlayerDashboard({ player }) {
  const p = player
  const n90 = p.mins / 90
  const gDiff = +(p.goals - p.xG).toFixed(2)
  const gDiffStr = gDiff > 0 ? `+${gDiff}` : `${gDiff}`
  const gDiffColor = gDiff > 1.5 ? CRED : gDiff > 0 ? CAMBER : CGREEN

  const per90Data = [
    { cat: 'Mål/90',      val: p.g90   },
    { cat: 'xG/90',       val: p.xg90  },
    { cat: 'Skuddass/90', val: p.sa90  },
    { cat: 'Touch felt/90',val:p.tpa90 },
    { cat: 'Prog.runs/90', val: p.pr90  },
    { cat: 'Intercept/90', val: p.inter90 },
  ].filter(d => d.val > 0)

  const effData = [
    { cat: 'Pasningsnøyaktighet', val: p.passPct },
    { cat: 'Duellseier',          val: p.duelPct },
    { cat: 'Dribleseier',         val: Math.min(p.dribPct, 100) },
  ]

  const radarData = [
    { stat: 'Mål/90',      v: Math.min((p.g90 / 0.8) * 10, 10) },
    { stat: 'xG/90',       v: Math.min((p.xg90 / 0.6) * 10, 10) },
    { stat: 'Pressing',    v: Math.min((p.inter90 / 7) * 10, 10) },
    { stat: 'Pasning',     v: Math.min((p.passPct / 95) * 10, 10) },
    { stat: 'Dueller',     v: Math.min((p.duelPct / 70) * 10, 10) },
    { stat: 'Prog. runs',  v: Math.min((p.pr90 / 3.5) * 10, 10) },
  ]

  // Comparison with top scorer in same pos group
  const isDefender = ['CB', 'LCB', 'LCB3', 'RCB'].some(x => p.pos.includes('CB') || p.pos.includes('LCB'))

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 48 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Mål"           value={p.goals}         sub={`${p.g90}/90 · ${Math.round(p.mins)} min`} color={CBLUE} />
        <KPI label="Assists"       value={p.assists}       sub={`xG: ${p.xG}`} />
        <KPI label="G – xG"        value={gDiffStr}        sub="Overperformance"  color={gDiffColor} />
        <KPI label="Pasningsnøyaktighet" value={p.passPct + '%'} sub="alle pasninger" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Duellseier"    value={p.duelPct + '%'} sub="bakkedueller"     color={p.duelPct >= 55 ? CGREEN : p.duelPct >= 45 ? CAMBER : CRED} />
        <KPI label="Touch i felt/90" value={p.tpa90}      sub="per 90 min"       color={CBLUE} />
        <KPI label="Prog. runs/90" value={p.pr90}         sub="per 90 min"       color={CBLUE} />
        <KPI label="Interceptions/90" value={p.inter90}   sub="per 90 min"       color={p.inter90 >= 4 ? CGREEN : CGRAY} />
      </div>

      {/* Per90 chart */}
      <STitle>Nøkkeltall per 90 min</STitle>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={per90Data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="cat" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="val" fill={CBLUE} radius={[3,3,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <Div />

      {/* Efficiency bars */}
      <STitle>Effektivitet</STitle>
      <div style={{ marginBottom: 20 }}>
        {effData.map(({ cat, val }) => {
          const color = val >= 75 ? CGREEN : val >= 55 ? CBLUE : val >= 40 ? CAMBER : CRED
          return (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 3 }}>
                <span>{cat}</span>
                <span style={{ fontWeight: 600, color }}>{val.toFixed(1)}%</span>
              </div>
              <div style={{ height: 7, background: '#eee', borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                <div style={{ width: Math.min(val, 100) + '%', height: '100%', background: color, borderRadius: 3 }} />
              </div>
            </div>
          )
        })}
      </div>

      <Div />

      {/* Radar */}
      <STitle>Spillerprofil</STitle>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="stat" tick={{ fontSize: 12 }} />
          <Radar name={p.name} dataKey="v" stroke={CBLUE} fill={CBLUE} fillOpacity={0.25} strokeWidth={2} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>

      <Div />

      {/* Auto-generated insights */}
      {p.g90 > 0.45 && (
        <Box color={CGREEN} text={`${p.name} scorer ${p.g90}/90 — blant de mest produktive i datasettet for sin posisjon.`} />
      )}
      {Math.abs(gDiff) > 2 && gDiff > 0 && (
        <Box color={CRED} text={`G–xG på ${gDiffStr} indikerer regresjonsrisiko — scoringen overstiger forventet nivå betydelig.`} />
      )}
      {Math.abs(gDiff) > 2 && gDiff < 0 && (
        <Box color={CBLUE} text={`G–xG på ${gDiffStr} indikerer underperformance — spilleren genererer mer enn han konverterer. Potensial for oppsving.`} />
      )}
      {p.duelPct < 35 && (
        <Box color={CRED} text={`Duellseier på ${p.duelPct}% er lavt — kan bli utfordret i mer fysisk intensive ligaer.`} />
      )}
      {p.inter90 > 4 && (
        <Box color={CGREEN} text={`${p.inter90} interceptions per 90 er høyt — sterk pressing-profil og aktiv i ballerobring.`} />
      )}
      {p.losses90 > 12 && (
        <Box color={CAMBER} text={`Balltap i eget halvt: ${p.losses90}/90. Høyt — kan bli kostbart i mer pressingintensive ligaer.`} />
      )}
      {p.pr90 > 2.0 && (
        <Box color={CBLUE} text={`${p.pr90} progressive runs per 90 — høyt volum. Sterk bæreprofil.`} />
      )}
      {p.tpa90 > 4.0 && (
        <Box color={CBLUE} text={`${p.tpa90} touches i straffesparksfeltet per 90 — svært aktiv i siste tredjedel.`} />
      )}
    </div>
  )
}
