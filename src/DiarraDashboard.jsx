import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'

const C23  = '#3B6D11'
const C24  = '#B07517'
const C25  = '#185FA5'
const CRED = '#C0392B'
const CVIK = '#185FA5'
const COLORS = [C23, C24, C25]

const seasonData = [
  { sesong: '2023 (12.pl)', maal: 9, xg: 7.91, diff: 1.09  },
  { sesong: '2024 (14.pl)', maal: 5, xg: 7.27, diff: -2.27 },
  { sesong: '2025 (nedrykk)', maal: 7, xg: 5.93, diff: 1.07 },
]

const contextData = [
  { lag: 'FKH 2023', xg: 0.92, fill: '#888' },
  { lag: 'FKH 2024', xg: 0.85, fill: '#888' },
  { lag: 'FKH 2025', xg: 0.77, fill: CRED  },
  { lag: 'Viking 2025', xg: 1.92, fill: CVIK },
]

const per90Data = [
  { cat: 'Mål/90',       s23: 0.40, s24: 0.25, s25: 0.38 },
  { cat: 'Skudd/90',     s23: 1.59, s24: 1.57, s25: 1.59 },
  { cat: 'Dribl/90',     s23: 1.58, s24: 1.51, s25: 0.55 },
  { cat: 'Touch felt/90',s23: 3.4,  s24: 3.2,  s25: 2.1  },
  { cat: 'Konv% /10',    s23: 3.7,  s24: 1.8,  s25: 2.4  },
]

const vikingData = [
  { cat: 'xG/kamp',          fkh: 0.77, vik: 1.92 },
  { cat: 'Skudd/kamp /2',    fkh: 4.15, vik: 7.7  },
  { cat: 'Mål/kamp',         fkh: 0.57, vik: 2.53 },
  { cat: 'Angrep m/skudd /5',fkh: 2.0,  vik: 6.2  },
]

const radarData = [
  { stat: 'Mål/90',       s23: 8,   s25: 7.6 },
  { stat: 'Skudd på mål', s23: 5.8, s25: 5.2 },
  { stat: 'Driblinger',   s23: 7.9, s25: 2.8 },
  { stat: 'Touch i felt', s23: 8.5, s25: 5.3 },
  { stat: 'Konv.rate',    s23: 7.4, s25: 4.8 },
  { stat: 'Luftdueller',  s23: 8.6, s25: 8.0 },
]

const bars = [
  { label: 'Driblinger/90',     vals: [1.58, 1.51, 0.55], max: 2.0  },
  { label: 'Touch i felt/90',   vals: [3.4,  3.2,  2.1],  max: 4.0  },
  { label: 'Konverteringsrate', vals: [0.37, 0.18, 0.24], max: 0.40, pct: true },
  { label: 'Skudd på mål %',    vals: [0.58, 0.43, 0.52], max: 0.65, pct: true },
]

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
function Div() {
  return <div style={{ borderTop: '0.5px solid #e0e0e0', margin: '20px 0' }} />
}
function Box({ color, text }) {
  return (
    <div style={{ borderLeft: `3px solid ${color}`, borderRadius: '0 8px 8px 0', background: '#f5f5f3', padding: '10px 14px', fontSize: 12, color: '#1a1a1a', lineHeight: 1.6, marginBottom: 8 }}>
      {text}
    </div>
  )
}

function StatBar({ label, vals, max, pct }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{label}</div>
      {vals.map((v, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i], flexShrink: 0 }} />
          <div style={{ flex: 1, background: '#eee', borderRadius: 3, height: 6, overflow: 'hidden' }}>
            <div style={{ width: `${(v / max) * 100}%`, background: COLORS[i], height: 6, borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 12, color: '#333', width: 42, textAlign: 'right' }}>
            {pct ? `${Math.round(v * 100)}%` : v}
          </div>
        </div>
      ))}
    </div>
  )
}

function Oversikt() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Mål totalt (3 sesonger)" value="21"    sub="72 kamper · 5 491 min" />
        <KPI label="Beste mål/90"            value="0.40"  sub="2023 — 9 mål på 12.plass"        color={C23}  />
        <KPI label="xG over 3 år"            value="21.11" sub="Scoret akkurat på xG" />
        <KPI label="Projeksjon Viking"        value="14–16" sub="mål per sesong estimert"          color={CVIK} />
      </div>

      <STitle>Mål og xG per sesong</STitle>
      <Leg items={[{ color: '#aaa', label: 'xG (forventet)' }, { color: C23, label: '2023' }, { color: C24, label: '2024' }, { color: C25, label: '2025' }]} />
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={seasonData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="sesong" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={[0, 11]} />
          <Tooltip />
          <Bar dataKey="maal" name="Mål" radius={[3,3,0,0]}>
            {seasonData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Bar>
          <Line data={seasonData} type="monotone" dataKey="xg" name="xG" stroke="#bbb" strokeWidth={2} dot={{ r: 4, fill: '#bbb' }} />
        </BarChart>
      </ResponsiveContainer>

      <Div />

      <STitle>Lagets xG for — kontekst</STitle>
      <Leg items={[{ color: '#bbb', label: 'FKH snitt xG/kamp' }, { color: CRED, label: 'FKH 2025' }, { color: CVIK, label: 'Viking 2025' }]} />
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={contextData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="lag" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={[0, 2.5]} />
          <Tooltip formatter={v => [v.toFixed(2), 'xG/kamp']} />
          <Bar dataKey="xg" name="xG/kamp" radius={[3,3,0,0]}>
            {contextData.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function Sesonger() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="2023 · 12. plass" value="9 mål" sub="xG 7.91 · +1.09 over" color={C23}  />
        <KPI label="2024 · 14. plass" value="5 mål" sub="xG 7.27 · –2.27 under" color={CRED} />
        <KPI label="2025 · Nedrykk"   value="7 mål" sub="xG 5.93 · +1.07 over"  color={C25}  />
        <KPI label="Trend" value="Over → Under → Over" sub="xG-konvertering" />
      </div>

      <STitle>Nøkkeltall per 90 min</STitle>
      <Leg items={[{ color: C23, label: '2023' }, { color: C24, label: '2024' }, { color: C25, label: '2025' }]} />
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={per90Data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="cat" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="s23" name="2023" fill={C23} radius={[2,2,0,0]} />
          <Bar dataKey="s24" name="2024" fill={C24} radius={[2,2,0,0]} />
          <Bar dataKey="s25" name="2025" fill={C25} radius={[2,2,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <Div />

      <STitle>xG-differanse per sesong</STitle>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={seasonData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="sesong" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={v => [(v > 0 ? '+' : '') + v.toFixed(2), 'mål over/under xG']} />
          <ReferenceLine y={0} stroke="#ccc" />
          <Bar dataKey="diff" name="±xG" radius={[3,3,0,0]}>
            {seasonData.map((d, i) => <Cell key={i} fill={d.diff >= 0 ? COLORS[i] : CRED} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function Spillerprofil() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Skudd på mål %"    value="52%"  sub="Best 2023: 58%" />
        <KPI label="Luftdueller vunnet" value="~40%" sub="Konsistent alle sesonger" />
        <KPI label="Assists (3 sesonger)" value="1"  sub="Én på 72 kamper" color={CRED} />
        <KPI label="Gule kort 2025"    value="1"    sub="Ned fra 6 i 2024" color={C23} />
      </div>

      <STitle>Offensiv aktivitet per 90 — trend over år</STitle>
      <Leg items={[{ color: C23, label: '2023' }, { color: C24, label: '2024' }, { color: C25, label: '2025' }]} />
      <div style={{ marginBottom: 20 }}>
        {bars.map(b => <StatBar key={b.label} {...b} />)}
      </div>

      <Div />

      <STitle>Radar — spillerprofil 2023 vs 2025</STitle>
      <Leg items={[{ color: C23, label: '2023' }, { color: C25, label: '2025' }]} />
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="stat" tick={{ fontSize: 11 }} />
          <Radar name="2023" dataKey="s23" stroke={C23} fill={C23} fillOpacity={0.2} strokeWidth={2} />
          <Radar name="2025" dataKey="s25" stroke={C25} fill={C25} fillOpacity={0.2} strokeWidth={2} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

function VikingFit() {
  const [games, setGames]   = useState(26)
  const [conv,  setConv]    = useState(24)
  const [share, setShare]   = useState(19)

  const totalXG = +(1.92 * (share / 100) * games).toFixed(1)
  const goals   = Math.round(totalXG * (conv / 100) / 0.24)
  const lo = Math.round(goals * 0.8)
  const hi = Math.round(goals * 1.2)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Vikings xG/kamp"     value="1.92"  sub="FKH hadde 0.77"              color={CVIK} />
        <KPI label="Oppskaleringsfaktor" value="×2.49" sub="mer offensivt miljø"          color={CVIK} />
        <KPI label="Sentralt estimat"    value="14–16" sub="mål per sesong"               color={CVIK} />
        <KPI label="Kontraktsstatus"     value="Gratis" sub="utgår des. 2026" />
      </div>

      <STitle>Juster projeksjon</STitle>
      <div style={{ background: '#f5f5f3', borderRadius: 8, padding: 16, marginBottom: 20 }}>
        {[
          { label: 'Kamper fra start',  min: 20, max: 30, val: games, set: setGames, fmt: v => v           },
          { label: 'Konverteringsrate', min: 15, max: 40, val: conv,  set: setConv,  fmt: v => v + '%'     },
          { label: 'xG-andel av laget', min: 10, max: 30, val: share, set: setShare, fmt: v => v + '%'     },
        ].map(({ label, min, max, val, set, fmt }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, fontSize: 13, color: '#555' }}>
            <span style={{ minWidth: 170 }}>{label}</span>
            <input type="range" min={min} max={max} value={val} step={1} onChange={e => set(+e.target.value)} style={{ flex: 1 }} />
            <span style={{ fontWeight: 500, color: '#1a1a1a', minWidth: 44, textAlign: 'right' }}>{fmt(val)}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#eef3fa', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Projiserte mål</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: CVIK, lineHeight: 1 }}>{goals}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Intervall: {lo}–{hi}</div>
        </div>
        <div style={{ background: '#eef3fa', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Projisert xG</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: CVIK, lineHeight: 1 }}>{totalXG}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Basert på Vikings 1.92 xG/kamp</div>
        </div>
      </div>

      <Div />

      <STitle>Offensivt miljø — FKH vs Viking 2025</STitle>
      <Leg items={[{ color: CRED, label: 'FKH 2025 (nedrykk)' }, { color: CVIK, label: 'Viking 2025 (seriemester)' }]} />
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={vikingData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="cat" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="fkh" name="FKH 2025"   fill={CRED} radius={[2,2,0,0]} />
          <Bar dataKey="vik" name="Viking 2025" fill={CVIK} radius={[2,2,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <Div />
      <Box color={C23}  text="Viking skapte 2.5× mer enn FKH per kamp. Med Diarras konverteringsevne fra 2023 er 18+ mål ikke urealistisk i dette systemet." />
      <Box color={C24}  text="Viking spiller pressingfotball. Diarras arbeidsrate er middels — men han trenger ikke være pressingleder for å score 15 mål." />
      <Box color={CVIK} text="Kontrakten utgår desember 2026. Lav risiko, høy potensiell oppside. Nær null overgangssum." />
    </div>
  )
}

const TABS = [
  { id: 'oversikt',     label: 'Oversikt',     comp: Oversikt     },
  { id: 'sesonger',     label: 'Sesonger',     comp: Sesonger     },
  { id: 'spillerprofil',label: 'Spillerprofil',comp: Spillerprofil },
  { id: 'viking',       label: 'Viking-fit',   comp: VikingFit    },
]

export default function DiarraDashboard() {
  const [active, setActive] = useState('oversikt')
  const Comp = TABS.find(t => t.id === active).comp

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Sory Diarra</span>
        <span style={{ fontSize: 13, color: '#888' }}>FKH · Eliteserien 2023–2025</span>
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
