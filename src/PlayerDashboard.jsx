import { useState } from 'react'
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { benchmarks, getBenchmarkKey, compareVsBenchmark, statConfig, radarStats } from './playerData'

// ── Colours ──────────────────────────────────────────────────────────────────
const CBLUE  = '#185FA5'
const CGREEN = '#3B6D11'
const CRED   = '#C0392B'
const CAMBER = '#B07517'
const CGRAY  = '#888'

// ── Viking context data per position ─────────────────────────────────────────
const VIKING_ENV = {
  CB: [
    { cat: 'xG mot/kamp',      vik: 0.81 },
    { cat: 'Prog. pass/kamp',  vik: 59   },
    { cat: 'Possession %',     vik: 52   },
    { cat: 'Press. intensity', vik: 7.2  },
  ],
  CF: [
    { cat: 'xG/kamp',          vik: 1.92 },
    { cat: 'Skudd/kamp',       vik: 15.4 },
    { cat: 'Mål/kamp',         vik: 2.53 },
    { cat: 'Angrep m/skudd',   vik: 31   },
  ],
  WING: [
    { cat: 'xG/kamp',          vik: 1.92 },
    { cat: 'Prog. pass/kamp',  vik: 59   },
    { cat: 'Possession %',     vik: 52   },
    { cat: 'Crosser/kamp',     vik: 18   },
  ],
  CM: [
    { cat: 'Prog. pass/kamp',  vik: 59   },
    { cat: 'PPDA',             vik: 8.1  },
    { cat: 'Possession %',     vik: 52   },
    { cat: 'Rec. 3rd/kamp',    vik: 22   },
  ],
}

// ── Risk scores per benchmark type ────────────────────────────────────────────
function getRiskFactors(player, benchKey) {
  const b = benchmarks[benchKey]
  const s = player.stats
  const factors = []

  const xgDiff = s.xG > 0 ? ((s.goals - s.xG) / s.xG) * 100 : 0
  if (Math.abs(xgDiff) > 20) {
    factors.push({
      label: 'xG-overperformance (regresjon)',
      score: Math.min(90, Math.abs(xgDiff)),
      color: xgDiff > 20 ? CRED : CGREEN,
    })
  }

  if (s.duelWin < b.stats.duelWin - 10) {
    factors.push({ label: 'Duellsvakhet vs benchmark', score: Math.round(b.stats.duelWin - s.duelWin) * 2, color: CAMBER })
  }
  if (s.passAcc < 75) {
    factors.push({ label: 'Pasningsnøyaktighet (lav)', score: Math.round((80 - s.passAcc) * 3), color: CAMBER })
  }
  if (s.aerialWin < 40 && ['CB','CF'].includes(benchKey)) {
    factors.push({ label: 'Svak i luftdueller', score: Math.round((50 - s.aerialWin) * 2), color: CRED })
  }
  if (s.interceptions > b.stats.interceptions * 1.3) {
    factors.push({ label: 'Høy pressing-intensitet', score: 30, color: CGREEN })
  }
  if (factors.length < 3) {
    factors.push({ label: 'Ligakvalitet (skalering)', score: 45, color: CGRAY })
    factors.push({ label: 'Alder / adaptasjonstid', score: player.age < 21 ? 35 : 25, color: CGRAY })
  }
  return factors.slice(0, 5)
}

function getRiskLevel(factors) {
  const avg = factors.reduce((s, f) => s + f.score, 0) / factors.length
  if (avg > 60) return { label: 'HØY', color: CRED, pos: '75%' }
  if (avg > 35) return { label: 'MIDDELS', color: CAMBER, pos: '50%' }
  return { label: 'LAV', color: CGREEN, pos: '25%' }
}

// ── Shared components ─────────────────────────────────────────────────────────
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

// ── Oversikt tab ──────────────────────────────────────────────────────────────
function Oversikt({ player, bench, benchKey }) {
  const s = player.stats
  const cfgMap = Object.fromEntries(statConfig.map(x => [x.key, x]))

  // Key per90 bars — position-specific
  const per90Keys = {
    CB:   ['passAcc','duelWin','aerialWin','interceptions','progRuns','recoveriesOpp'],
    CF:   ['goals','shots','shotAssists','touchesPenArea','progRuns','interceptions'],
    WING: ['goals','assists','dribbles','progRuns','shotAssists','interceptions'],
    CM:   ['passAcc','interceptions','duelWin','progRuns','shotAssists','recoveriesOpp'],
  }[benchKey] || ['goals','assists','passAcc','duelWin','interceptions','progRuns']

  const per90Data = per90Keys.map(k => ({
    cat: cfgMap[k]?.label ?? k,
    spiller: +(s[k] ?? 0).toFixed(2),
    benchmark: +(bench.stats[k] ?? 0).toFixed(2),
  }))

  // League context — xG/kamp proxy
  const leagueXG = {
    'Norway. Eliteserien': 1.35, 'Sweden. Allsvenskan': 1.32,
    'Denmark. Superliga': 1.28, 'England. League One': 1.20,
    'Finland. Veikkausliiga': 1.18, 'Netherlands. Eerste Divisie': 1.22,
    'Scotland. Premiership': 1.25, 'Bulgaria. First League': 1.10,
    'Hungary. NB I': 1.08, 'Lithuania. A Lyga': 1.05,
  }
  const leagueVal = leagueXG[player.league] ?? 1.15
  const ligaCtx = [
    { lag: player.club, val: leagueVal, fill: CBLUE },
    { lag: 'Viking FK', val: 1.92, fill: CGRAY },
    { lag: 'Eliteserien', val: 1.35, fill: CGRAY },
    { lag: 'Allsvenskan', val: 1.32, fill: CGRAY },
  ]

  const ratingColor = { better: CGREEN, similar: CAMBER, weaker: CRED }
  const overallKeys = per90Keys.slice(0, 4)
  let better = 0, weaker = 0
  overallKeys.forEach(k => {
    const r = compareVsBenchmark(s[k] ?? 0, bench.stats[k] ?? 0)
    if (r === 'better') better++
    if (r === 'weaker') weaker++
  })
  const overall = better >= 3 ? 'better' : weaker >= 3 ? 'weaker' : 'similar'
  const overallLabel = { better: 'Bedre', similar: 'På nivå', weaker: 'Svakere' }[overall]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Minutter"       value={s.minutes?.toLocaleString() ?? '—'} sub={`${s.matches ?? '—'} kamper`} />
        <KPI label="Mål / 90"       value={s.goals?.toFixed(2) ?? '—'}         sub={`Benchmark: ${bench.stats.goals?.toFixed(2)}`} color={s.goals >= bench.stats.goals ? CGREEN : CAMBER} />
        <KPI label="Pass accuracy"  value={s.passAcc?.toFixed(1) + '%'}        sub={`Benchmark: ${bench.stats.passAcc?.toFixed(1)}%`} color={s.passAcc >= bench.stats.passAcc ? CGREEN : CAMBER} />
        <KPI label="vs. Benchmark"  value={overallLabel}                        sub={bench.fullName} color={ratingColor[overall]} />
      </div>

      <STitle>Nøkkeltall per 90 — spiller vs benchmark</STitle>
      <Leg items={[{ color: CBLUE, label: player.name }, { color: CGRAY, label: bench.name }]} />
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={per90Data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="cat" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="spiller"   name={player.name} fill={CBLUE} radius={[3,3,0,0]} />
          <Bar dataKey="benchmark" name={bench.name}  fill={CGRAY} radius={[3,3,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <Div />

      <STitle>Ligakontekst — lagets xG per kamp</STitle>
      <Leg items={[{ color: CBLUE, label: player.club }, { color: CGRAY, label: 'Sammenligning' }]} />
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={ligaCtx} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="lag" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} domain={[0, 2.5]} />
          <Tooltip formatter={v => [v.toFixed(2), 'xG/kamp']} />
          <Bar dataKey="val" radius={[3,3,0,0]}>
            {ligaCtx.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Effektivitet tab ──────────────────────────────────────────────────────────
function Effektivitet({ player, bench, benchKey }) {
  const s = player.stats
  const axes = radarStats[benchKey] ?? radarStats.CB

  const effBars = [
    { label: 'Pass accuracy',    val: s.passAcc ?? 0,    bench: bench.stats.passAcc ?? 0,    max: 100 },
    { label: 'Duel win %',       val: s.duelWin ?? 0,    bench: bench.stats.duelWin ?? 0,    max: 100 },
    { label: 'Aerial win %',     val: s.aerialWin ?? 0,  bench: bench.stats.aerialWin ?? 0,  max: 100 },
    { label: 'Dribble success %',val: s.dribbleSucc ?? 0,bench: bench.stats.dribbleSucc ?? 0,max: 100 },
  ]

  // Normalise radar to max of the two
  const radarData = axes.map(key => {
    const pv = s[key] ?? 0
    const bv = bench.stats[key] ?? 0
    const mx = Math.max(pv, bv, 0.01)
    return {
      stat: statConfig.find(x => x.key === key)?.label ?? key,
      spiller: Math.round((pv / mx) * 100),
      benchmark: Math.round((bv / mx) * 100),
    }
  })

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Dribble success" value={(s.dribbleSucc ?? 0).toFixed(1) + '%'} sub={`Benchmark: ${(bench.stats.dribbleSucc ?? 0).toFixed(1)}%`} color={s.dribbleSucc >= bench.stats.dribbleSucc ? CGREEN : CRED} />
        <KPI label="Pass accuracy"   value={(s.passAcc ?? 0).toFixed(1) + '%'}    sub={`Benchmark: ${(bench.stats.passAcc ?? 0).toFixed(1)}%`}    color={s.passAcc >= bench.stats.passAcc ? CGREEN : CAMBER} />
        <KPI label="Duel win %"      value={(s.duelWin ?? 0).toFixed(1) + '%'}    sub={`Benchmark: ${(bench.stats.duelWin ?? 0).toFixed(1)}%`}    color={s.duelWin >= bench.stats.duelWin ? CGREEN : CRED} />
        <KPI label="Aerial win %"    value={(s.aerialWin ?? 0).toFixed(1) + '%'}  sub={`Benchmark: ${(bench.stats.aerialWin ?? 0).toFixed(1)}%`}  color={s.aerialWin >= bench.stats.aerialWin ? CGREEN : CRED} />
      </div>

      <STitle>Effektivitetsprofil — spiller vs benchmark</STitle>
      <div style={{ marginBottom: 20 }}>
        {effBars.map(({ label, val, bench: bv, max }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 3 }}>
              <span>{label}</span>
              <span style={{ fontWeight: 600, color: val >= bv ? CGREEN : val >= bv * 0.88 ? CAMBER : CRED }}>
                {val.toFixed(1)}% <span style={{ color: '#aaa', fontWeight: 400 }}>/ {bv.toFixed(1)}%</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ flex: 1, height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (val / max) * 100)}%`, height: '100%', background: CBLUE, borderRadius: 3 }} />
              </div>
              <div style={{ flex: 1, height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (bv / max) * 100)}%`, height: '100%', background: CGRAY, borderRadius: 3 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Div />

      <STitle>Spillerprofil — radar vs benchmark (normalisert)</STitle>
      <Leg items={[{ color: CBLUE, label: player.name }, { color: CGRAY, label: bench.name + ' (benchmark)' }]} />
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="stat" tick={{ fontSize: 11 }} />
          <Radar name={player.name} dataKey="spiller"   stroke={CBLUE} fill={CBLUE} fillOpacity={0.25} strokeWidth={2} />
          <Radar name={bench.name}  dataKey="benchmark" stroke={CGRAY} fill={CGRAY} fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="4 2" />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Risikovurdering tab ───────────────────────────────────────────────────────
function Risikovurdering({ player, bench, benchKey }) {
  const s = player.stats
  const factors = getRiskFactors(player, benchKey)
  const risk = getRiskLevel(factors)

  const xgBar = [
    { n: 'Mål/90', v: s.goals ?? 0, f: CBLUE },
    { n: 'xG/90',  v: s.xG ?? 0,   f: CGRAY },
    { n: 'Diff',   v: Math.abs((s.goals ?? 0) - (s.xG ?? 0)), f: (s.goals ?? 0) > (s.xG ?? 0) ? CRED : CGREEN },
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="G–xG diff."    value={((s.goals ?? 0) - (s.xG ?? 0)).toFixed(2) + '/90'} sub="Overperformance" color={(s.goals ?? 0) > (s.xG ?? 0) ? CRED : CGREEN} />
        <KPI label="Duell vs bench" value={((s.duelWin ?? 0) - (bench.stats.duelWin ?? 0)).toFixed(1) + '%'} sub="Diff. fra benchmark" color={(s.duelWin ?? 0) >= (bench.stats.duelWin ?? 0) ? CGREEN : CRED} />
        <KPI label="Risikonivå"    value={risk.label} sub="Samlet vurdering" color={risk.color} />
        <KPI label="Alder"         value={player.age ?? '—'} sub="år" color={player.age < 22 ? CGREEN : CGRAY} />
      </div>

      <STitle>xG vs faktisk mål (per 90)</STitle>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={xgBar} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="n" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="v" radius={[4,4,0,0]}>
            {xgBar.map((d, i) => <Cell key={i} fill={d.f} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Div />

      <STitle>Risikomåler</STitle>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0 20px' }}>
        <span style={{ fontSize: 11, color: '#888' }}>LAV</span>
        <div style={{ flex: 1, height: 8, background: 'linear-gradient(to right, #2a7a3e, #b8920f, #c0392b)', position: 'relative', borderRadius: 4 }}>
          <div style={{ position: 'absolute', top: '50%', left: risk.pos, transform: 'translate(-50%,-50%)', width: 16, height: 16, background: '#1a1a1a', border: '2.5px solid white', borderRadius: '50%' }} />
        </div>
        <span style={{ fontSize: 11, color: '#888' }}>HØY</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: risk.color, whiteSpace: 'nowrap' }}>{risk.label}</span>
      </div>

      <STitle>Risikofordeling</STitle>
      <div style={{ marginTop: 8 }}>
        {factors.map(({ label, score, color }) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 3 }}>
              <span>{label}</span>
              <span style={{ color, fontWeight: 600 }}>{Math.round(score)}/100</span>
            </div>
            <div style={{ height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: Math.min(score, 100) + '%', height: '100%', background: color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Viking-fit / Projeksjon tab ───────────────────────────────────────────────
function VikingFit({ player, bench, benchKey }) {
  const s = player.stats
  const [kamper,  setKamper]  = useState(22)
  const [konv,    setKonv]    = useState(Math.round((s.goals ?? 0.3) / Math.max(s.xG ?? 0.3, 0.01) * 85))
  const [xgAndel, setXgAndel] = useState(benchKey === 'CF' ? 18 : benchKey === 'WING' ? 12 : 6)
  const vikXG = 1.92

  const totalXG = +((vikXG * (xgAndel / 100)) * kamper).toFixed(1)
  const goals   = Math.max(0, Math.round(totalXG * (konv / 100)))
  const lo      = Math.round(goals * 0.8)
  const hi      = Math.round(goals * 1.2)

  const envData = (VIKING_ENV[benchKey] ?? VIKING_ENV.CB).map(d => ({
    ...d,
    spiller: d.vik * (leagueScale[player.league] ?? 0.7),
  }))

  const projData = [
    { n: 'Faktisk nå', v: +(s.goals * 26).toFixed(1), f: CBLUE },
    { n: 'Konservativt', v: lo, f: CGRAY },
    { n: 'Sentralt', v: goals, f: CGREEN },
    { n: 'Optimistisk', v: hi, f: CAMBER },
  ]

  const rateComp = [
    { cat: 'Pass %',   spiller: s.passAcc ?? 0,    vik: bench.stats.passAcc ?? 0   },
    { cat: 'Duel %',   spiller: s.duelWin ?? 0,    vik: bench.stats.duelWin ?? 0   },
    { cat: 'Aerial %', spiller: s.aerialWin ?? 0,  vik: bench.stats.aerialWin ?? 0 },
    { cat: 'Prog/90',  spiller: (s.progRuns ?? 0) * 10, vik: (bench.stats.progRuns ?? 0) * 10 },
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        <KPI label="Proj. mål (sesong)" value={`${lo}–${hi}`}       sub={`Sentralt: ${goals}`}           color={CBLUE}  />
        <KPI label="Proj. xG"           value={totalXG}              sub="Basert på Viking xG/kamp"        color={CGREEN} />
        <KPI label="Proj. G/90"         value={kamper > 0 ? (goals/kamper).toFixed(2) : '—'} sub={`vs ${(s.goals ?? 0).toFixed(2)} nå`} color={CAMBER} />
      </div>

      <STitle>Juster projeksjon</STitle>
      <div style={{ background: '#f5f5f3', borderRadius: 8, padding: 16, marginBottom: 20 }}>
        {[
          { label: 'Kamper fra start',      min: 10, max: 30, val: kamper,  set: setKamper,  fmt: v => v + ' kamper' },
          { label: 'Konverteringsrate',     min: 15, max: 60, val: konv,    set: setKonv,    fmt: v => v + '%'       },
          { label: 'xG-andel av Viking',    min: 3,  max: 30, val: xgAndel, set: setXgAndel, fmt: v => v + '%'       },
        ].map(({ label, min, max, val, set, fmt }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, fontSize: 13, color: '#555' }}>
            <span style={{ minWidth: 200 }}>{label}</span>
            <input type="range" min={min} max={max} value={val} step={1}
              onChange={e => set(+e.target.value)} style={{ flex: 1 }} />
            <span style={{ fontWeight: 500, color: '#1a1a1a', minWidth: 70, textAlign: 'right' }}>{fmt(val)}</span>
          </div>
        ))}
      </div>

      <STitle>Projeksjon vs faktisk</STitle>
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={projData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="n" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="v" radius={[4,4,0,0]}>
            {projData.map((d, i) => <Cell key={i} fill={d.f} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Div />

      <STitle>Ratesammenligning — spiller vs Viking-benchmark</STitle>
      <Leg items={[{ color: CBLUE, label: player.name }, { color: CGREEN, label: bench.name + ' (Viking)' }]} />
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={rateComp} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="cat" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="spiller" name={player.name} fill={CBLUE}  radius={[3,3,0,0]} />
          <Bar dataKey="vik"     name={bench.name}  fill={CGREEN} radius={[3,3,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <Div />
      <Box color={CBLUE}  text={`Viking FK produserer 1.92 xG/kamp — ${(leagueScale[player.league] ?? 0.7) < 0.85 ? `${player.club} er i en svakere ligakontekst (${player.league}), noe som gir oppskalering.` : `${player.club} er i sammenlignbar ligakontekst.`}`} />
      <Box color={CGREEN} text={`Benchmark: ${bench.fullName} (${bench.position}, Viking FK). Spiller scorer ${compareVsBenchmark(s.passAcc ?? 0, bench.stats.passAcc ?? 0) === 'better' ? 'over' : compareVsBenchmark(s.passAcc ?? 0, bench.stats.passAcc ?? 0) === 'similar' ? 'på nivå med' : 'under'} benchmark på pasningsnøyaktighet.`} />
      <Box color={CAMBER} text="Projeksjon er modellbasert. Tilpasningsperiode, spilletid og skader er ikke kvantifisert." />
    </div>
  )
}

const leagueScale = {
  'Norway. Eliteserien': 1.0,
  'Sweden. Allsvenskan': 0.95,
  'Denmark. Superliga': 0.90,
  'England. League One': 0.85,
  'Scotland. Premiership': 0.88,
  'Netherlands. Eerste Divisie': 0.82,
  'Finland. Veikkausliiga': 0.78,
  'Bulgaria. First League': 0.72,
  'Hungary. NB I': 0.70,
  'Lithuania. A Lyga': 0.68,
  'Denmark. 1st Division': 0.80,
}

// ── Main PlayerDashboard ──────────────────────────────────────────────────────
export default function PlayerDashboard({ player, onClose }) {
  const [active, setActive] = useState('oversikt')

  const benchKey = getBenchmarkKey(player.position)
  const bench    = benchKey ? benchmarks[benchKey] : null

  if (!bench) {
    return (
      <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
        <button onClick={onClose} style={{ marginBottom: 16, background: '#1f2937', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>← Tilbake</button>
        <p>Ingen benchmark tilgjengelig for posisjon: {player.position}</p>
      </div>
    )
  }

  const fitLabel = (() => {
    let b = 0, w = 0
    ;['passAcc','duelWin','interceptions','progRuns'].forEach(k => {
      const r = compareVsBenchmark(player.stats[k] ?? 0, bench.stats[k] ?? 0)
      if (r === 'better') b++
      if (r === 'weaker') w++
    })
    if (b >= 3) return { label: 'STRONG FIT',      color: CGREEN }
    if (w >= 3) return { label: 'DEVELOPMENT FIT', color: CRED   }
    return            { label: 'CONDITIONAL FIT',  color: CBLUE  }
  })()

  const tabs = [
    { id: 'oversikt',    label: 'Oversikt',        comp: Oversikt       },
    { id: 'effektivitet',label: 'Effektivitet',     comp: Effektivitet   },
    { id: 'risiko',      label: 'Risikovurdering',  comp: Risikovurdering},
    { id: 'projeksjon',  label: 'Viking-fit',       comp: VikingFit      },
  ]
  const Comp = tabs.find(t => t.id === active).comp

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 48 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>
          {player.flag ?? ''} {player.fullName ?? player.name}
        </span>
        <span style={{ fontSize: 13, color: '#888' }}>
          {player.club} · {player.league} · {player.position}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '4px 10px', border: `1.5px solid ${fitLabel.color}`, color: fitLabel.color, borderRadius: 2 }}>
          {fitLabel.label}
        </span>
        <span style={{ fontSize: 12, color: '#888' }}>
          {player.nationality} · {player.age ?? '—'} år · Benchmark: {bench.fullName}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            cursor: 'pointer', fontSize: 13, padding: '7px 16px', borderRadius: 8,
            border: active === t.id ? '1.5px solid #333' : '0.5px solid #ccc',
            background: active === t.id ? '#f0f0ee' : 'transparent',
            color: active === t.id ? '#1a1a1a' : '#666',
            fontWeight: active === t.id ? 500 : 400,
            transition: 'all .15s',
          }}>{t.label}</button>
        ))}
      </div>

      <Comp player={player} bench={bench} benchKey={benchKey} />
    </div>
  )
}
