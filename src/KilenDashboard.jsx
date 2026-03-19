import { useState } from 'react'
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line,
} from 'recharts'

const CBLUE  = '#378ADD'
const CGREEN = '#1D9E75'
const CAMBER = '#EF9F27'
const CGRAY  = '#888'
const CRED   = '#C0392B'

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

const kbkData = [
  { cat: 'Prog. runs/90', val: 3.46 },
  { cat: 'Dribbles/90',   val: 11.25 },
  { cat: 'Chances cr.',   val: 27 / 25 }, // per 90 approx
  { cat: 'Box touches/90',val: 92 / 25  },
]

const rateData = [
  { cat: 'Dribble success', kbk: 63.6, vik: 67   },
  { cat: 'Pass accuracy',   kbk: 72.5, vik: 77   },
  { cat: 'Loss after run',  kbk: 87.3, vik: 75   },
]

const monthData = [
  { m: 'Mar', goals: 0, xg: 0.04 },
  { m: 'Apr', goals: 0, xg: 0.28 },
  { m: 'May', goals: 1, xg: 0.82 },
  { m: 'Jun', goals: 1, xg: 1.17 },
  { m: 'Jul', goals: 0, xg: 0.01 },
  { m: 'Aug', goals: 0, xg: 0.40 },
  { m: 'Sep', goals: 0, xg: 0.40 },
  { m: 'Okt', goals: 2, xg: 1.27 },
  { m: 'Nov', goals: 1, xg: 0.14 },
]

const envData = [
  { cat: 'Possession %',     kbk: 44,    vik: 52    },
  { cat: 'PPDA',             kbk: 16.76, vik: 10.60 },
  { cat: 'Prog. passes/kamp',kbk: 45,    vik: 59    },
  { cat: 'Pos. attacks/kamp',kbk: 26,    vik: 32    },
]

const radarData = [
  { stat: 'Prog. runs',  kbk: 9.5, vik: 9.2 },
  { stat: 'Driblinger',  kbk: 9.8, vik: 9.5 },
  { stat: 'Sjansskaping',kbk: 7.2, vik: 8.5 },
  { stat: 'Pasning',     kbk: 6.5, vik: 7.5 },
  { stat: 'Pressing',    kbk: 6.8, vik: 7.8 },
  { stat: 'Scoring',     kbk: 5.5, vik: 7.0 },
]

function KBK() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Prog. runs / 90" value="3.46"  sub="Ligaleder"         color={CBLUE}  />
        <KPI label="Dribbles / 90"   value="11.25" sub="Ligaleder"         color={CBLUE}  />
        <KPI label="Dribble success" value="63.6%" sub="118 forsøk"                        />
        <KPI label="G – xG"          value="–0.57" sub="Output henger etter" color={CRED} />
      </div>

      <STitle>Mål og xG per måned — KBK 2025</STitle>
      <Leg items={[{ color: CBLUE, label: 'Mål' }, { color: CAMBER, label: 'xG' }]} />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={monthData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="m" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="goals" name="Mål" fill={CBLUE} radius={[3,3,0,0]} />
          <Line data={monthData} type="monotone" dataKey="xg" name="xG" stroke={CAMBER} strokeWidth={2} dot={{ r: 4, fill: CAMBER }} />
        </BarChart>
      </ResponsiveContainer>

      <Div />

      <STitle>Nøkkelrater</STitle>
      <div style={{ marginBottom: 20 }}>
        {[
          { label: 'Dribble success',       val: 63.6, color: CBLUE,  max: 100 },
          { label: 'Offensiv duel-seier',   val: 40,   color: CBLUE,  max: 100 },
          { label: 'Pasningsnøyaktighet',   val: 72.5, color: CGREEN, max: 100 },
          { label: 'Tap etter prog. run',   val: 87.3, color: CAMBER, max: 100 },
        ].map(({ label, val, color, max }) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 3 }}>
              <span>{label}</span>
              <span style={{ fontWeight: 600, color }}>{val}%</span>
            </div>
            <div style={{ height: 7, background: '#eee', borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
              <div style={{ width: val + '%', height: '100%', background: color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>

      <Div />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        <KPI label="Goals total"        value="5"    sub="xG: ~5.57" />
        <KPI label="Assists"            value="3"    sub="xA: ~1.92" />
        <KPI label="Chances created"    value="27"   sub="sesong totalt" color={CBLUE} />
      </div>

      <Div />
      <Box color={CBLUE}  text="Ligaleder i progressive runs (3.46/90) og dribbles (11.25/90) — ekstraordinært volum for en 20-åring i Eliteserien." />
      <Box color={CAMBER} text="87.3% tap etter progressive runs er kritisk høyt. Skyldes primært mangel på støttestrukturer rundt ham hos KBK, ikke bare teknisk svakhet." />
      <Box color={CGRAY}  text="G–xG på –0.57 viser at output henger etter involveringen. Mer kvalitet rundt ham vil løfte konverteringen." />
    </div>
  )
}

function VikingFit() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Proj. goals"      value="7–9"    sub="vs 5 hos KBK"         color={CBLUE}  />
        <KPI label="Proj. assists"    value="4–6"    sub="vs 3 hos KBK"         color={CBLUE}  />
        <KPI label="Proj. drib. succ" value="~67%"   sub="vs 63.6% hos KBK"                    />
        <KPI label="Tap etter run"    value="~75%"   sub="vs 87.3% hos KBK"     color={CGREEN} />
      </div>

      <STitle>Ratesammenligning — KBK faktisk vs Viking projeksjon</STitle>
      <Leg items={[{ color: CBLUE, label: 'KBK 2025 (faktisk)' }, { color: CGREEN, label: 'Viking (projeksjon)' }]} />
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={rateData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="cat" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
          <Tooltip formatter={v => [v + '%']} />
          <Bar dataKey="kbk" name="KBK 2025"       fill={CBLUE}  radius={[3,3,0,0]} />
          <Bar dataKey="vik" name="Viking proj."    fill={CGREEN} radius={[3,3,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <Div />

      <STitle>Miljøsammenligning</STitle>
      <Leg items={[{ color: CGRAY, label: 'KBK 2025' }, { color: CBLUE, label: 'Viking 2025' }]} />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={envData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="cat" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="kbk" name="KBK"   fill={CGRAY}  radius={[3,3,0,0]} />
          <Bar dataKey="vik" name="Viking" fill={CBLUE}  radius={[3,3,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <Div />

      <STitle>Spillerprofil — KBK vs Viking-projeksjon</STitle>
      <Leg items={[{ color: CBLUE, label: 'KBK 2025' }, { color: CGREEN, label: 'Viking (proj.)' }]} />
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="stat" tick={{ fontSize: 12 }} />
          <Radar name="KBK"    dataKey="kbk" stroke={CBLUE}  fill={CBLUE}  fillOpacity={0.2} strokeWidth={2} />
          <Radar name="Viking" dataKey="vik" stroke={CGREEN} fill={CGREEN} fillOpacity={0.2} strokeWidth={2} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>

      <Div />
      <Box color={CBLUE}  text="Viking spiller med ~52% ball og 59 progressive pasninger per kamp vs KBKs 44% og 45 — Kilen vil ha langt bedre støttestruktur rundt seg." />
      <Box color={CGREEN} text="Tap etter progressive runs er forventet å falle fra 87.3% til ~75% med overlappende back og midtbanespillere som støtter." />
      <Box color={CAMBER} text="Projeksjon er modellbasert og ikke en prestasjonsgaranti — men strukturell oppgradering er betydelig." />
    </div>
  )
}

const TABS = [
  { id: 'kbk',    label: 'KBK · 2025',          comp: KBK      },
  { id: 'viking', label: 'Viking-fit (projeksjon)', comp: VikingFit },
]

export default function KilenDashboard() {
  const [active, setActive] = useState('kbk')
  const Comp = TABS.find(t => t.id === active).comp

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Sander Hestetun Kilen</span>
        <span style={{ fontSize: 13, color: '#888' }}>KBK · Eliteserien 2025 · LWF / Wide progressor</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '4px 10px', border: `1.5px solid ${CBLUE}`, color: CBLUE, borderRadius: 2 }}>
          HIGH POTENTIAL
        </span>
        <span style={{ fontSize: 12, color: '#888' }}>NOR · 20 år · 187 cm</span>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            cursor: 'pointer', fontSize: 13, padding: '7px 16px', borderRadius: 8,
            border: active === t.id ? '1.5px solid #333' : '0.5px solid #ccc',
            background: active === t.id ? '#f0f0ee' : 'transparent',
            color: active === t.id ? '#1a1a1a' : '#666',
            fontWeight: active === t.id ? 500 : 400,
            transition: 'all .15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <Comp />
    </div>
  )
}
