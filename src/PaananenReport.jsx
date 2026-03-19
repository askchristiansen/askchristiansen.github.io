export default function ScoutingReport() {

  function StatGrid({ cells, borderTop }) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cells.length}, 1fr)`,
        border: '1px solid rgba(15,14,13,0.15)',
        borderTop: borderTop ? 'none' : '1px solid rgba(15,14,13,0.15)',
      }}>
        {cells.map((c, i) => (
          <div key={i} style={{
            padding: '16px 14px',
            borderRight: i < cells.length - 1 ? '1px solid rgba(15,14,13,0.15)' : 'none',
            borderBottom: '1px solid rgba(15,14,13,0.15)',
            background: c.dark ? '#0f0e0d' : 'transparent',
          }}>
            <div style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: c.sm ? 20 : 30,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: c.dark ? '#f5f2eb' : (c.color || '#0f0e0d'),
            }}>
              {c.value}
            </div>
            <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 10, color: c.dark ? 'rgba(245,242,235,0.55)' : '#7a7060', marginTop: 5 }}>
              {c.label}
            </div>
            {c.sub && (
              <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 10, color: c.dark ? 'rgba(245,242,235,0.45)' : '#9a8f7f', marginTop: 2 }}>
                {c.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  function Section({ title, children }) {
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#7a7060',
          borderBottom: '1px solid rgba(15,14,13,0.15)',
          paddingBottom: 6, marginBottom: 16,
        }}>
          {title}
        </div>
        {children}
      </div>
    )
  }

  function BarRow({ label, pct, color }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 48px', alignItems: 'center', gap: 12, marginBottom: 11 }}>
        <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 11, color: '#7a7060', textAlign: 'right' }}>{label}</div>
        <div style={{ height: 6, background: 'rgba(15,14,13,0.07)', border: '1px solid rgba(15,14,13,0.1)' }}>
          <div style={{ width: pct + '%', height: '100%', background: color }} />
        </div>
        <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 11, fontWeight: 700, color: '#0f0e0d' }}>{pct}%</div>
      </div>
    )
  }

  function SignalCard({ title, color, items }) {
    return (
      <div style={{ background: 'rgba(15,14,13,0.03)', border: '1px solid rgba(15,14,13,0.12)', padding: 16 }}>
        <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: 10 }}>
          {title}
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ fontSize: 11.5, color: '#5a5550', lineHeight: 1.7, paddingLeft: 12, position: 'relative', marginBottom: 6 }}>
            <span style={{ position: 'absolute', left: 0, color: 'rgba(15,14,13,0.2)' }}>—</span>
            {item}
          </div>
        ))}
      </div>
    )
  }

  function ContextBox({ borderColor, children }) {
    const isBlue = borderColor === '#1a5cd4'
    return (
      <div style={{
        borderLeft: `3px solid ${borderColor || '#d4451a'}`,
        padding: '14px 18px',
        background: isBlue ? 'rgba(26,92,212,0.04)' : 'rgba(212,69,26,0.04)',
        fontSize: 12, color: '#4a4540', lineHeight: 1.85, marginTop: 10,
      }}>
        {children}
      </div>
    )
  }

  function Tag({ children, color }) {
    return (
      <span style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
        padding: '4px 10px', border: `1px solid ${color || 'rgba(15,14,13,0.2)'}`,
        color: color || '#7a7060', borderRadius: 1, display: 'inline-block',
      }}>
        {children}
      </span>
    )
  }

  function MetaRow({ label, value }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(15,14,13,0.08)', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <span style={{ fontSize: 11, color: '#7a7060' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0f0e0d', textAlign: 'right' }}>{value}</span>
      </div>
    )
  }

  const prose = { fontSize: 12.5, color: '#4a4540', lineHeight: 1.85 }
  const b = { color: '#0f0e0d' }

  return (
    <div style={{ maxWidth: 820, fontFamily: 'Georgia, serif', fontSize: 13, lineHeight: 1.6, color: '#0f0e0d' }}>

      {/* Header */}
      <div style={{
        borderTop: '3px solid #0f0e0d', borderBottom: '1px solid rgba(15,14,13,0.15)',
        padding: '16px 0 14px', marginBottom: 32,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a7060', marginBottom: 8 }}>
            Scouting Report · 17.03.2026
          </div>
          <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 40, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', color: '#0f0e0d' }}>
            Kasper Paananen
          </div>
          <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 11, color: '#7a7060', marginTop: 8 }}>
            FIN · 23 år (16.03.2003) · SJK · Veikkausliiga 2025 · Venstrefot
          </div>
        </div>
        <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 16px', border: '1.5px solid #d4451a', color: '#d4451a', borderRadius: 2, whiteSpace: 'nowrap' }}>
          Conditional Fit
        </div>
      </div>

      {/* Nøkkeltall */}
      <Section title="Nøkkeltall — 2025-sesongen">
        <StatGrid cells={[
          { value: '18',    label: 'Mål',            sub: '0.55 / 90',           dark: true },
          { value: '+5.2',  label: 'G minus xG',     sub: 'Overperformance',     color: '#d4451a' },
          { value: '2945',  label: 'Minutter',       sub: '34 kamper' },
          { value: '3.24',  label: 'Touches i felt', sub: 'per 90',              color: '#1a5cd4' },
        ]} />
        <StatGrid borderTop cells={[
          { value: '0.92',  label: 'Skuddassister / 90', sm: true },
          { value: '76',    label: 'Skudd totalt',       sub: '43% på mål', sm: true },
          { value: '1.86',  label: 'Interceptions / 90', sm: true },
          { value: '55.6%', label: 'Dribleseier',        sub: '35 av 63 forsøk', sm: true },
        ]} />
      </Section>

      {/* Spillerprofil */}
      <Section title="Spillerprofil">
        <p style={prose}>
          Paananen er en <strong style={b}>venstrefotet angripende midtbanespiller</strong> som trives best i det høyre halvrommet. Han henter ballen bredt på høyre side, bærer den diagonalt innover og avslutter med venstrefoten fra 12–22 meter. Han beveger seg mye uten ball og går aktivt ned i banen for å få ballen — han er ingen kantspiller som venter på innlegg.
        </p>
        <p style={{ ...prose, marginTop: 12 }}>
          Han skaper mye på egenhånd, men søker avslutning også i situasjoner der en pasning til medspiller hadde vært et bedre valg. I SJKs åpne spill fungerte dette godt. I en liga med tettere forsvar og mer tid under press vil <strong style={b}>beslutningskvaliteten bli satt på prøve</strong>.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
          <Tag color="#1a5cd4">Invertert høyrekant</Tag>
          <Tag color="#1a5cd4">Halvromsoffensiv</Tag>
          <Tag color="#1a5cd4">Transisjonsspiller</Tag>
          <Tag color="#1a5cd4">Andreangrepsspiss</Tag>
          <Tag color="#d4451a">Ikke ren 9er</Tag>
          <Tag color="#d4451a">Ikke kantspiller</Tag>
        </div>
      </Section>

      {/* Effektivitet */}
      <Section title="Effektivitet — prosentmål">
        <BarRow label="Dribleseier"          pct={55.6} color="#1a5cd4" />
        <BarRow label="Pasningsnøyaktighet"  pct={75.0} color="#1a5cd4" />
        <BarRow label="Skudd på mål"         pct={43.4} color="#7a7060" />
        <BarRow label="Duellseier"           pct={40.6} color="#7a7060" />
        <BarRow label="Hodekampseier"        pct={37.3} color="#b8920f" />
      </Section>

      {/* Signaler */}
      <Section title="Signaler">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <SignalCard title="Styrker" color="#1a5cd4" items={[
            <><strong>Egengenerert angrepsspill</strong> — skaper sjanser uten servicebehov</>,
            <><strong>Klinisk avslutning</strong> — konsistent overperformance mot xG tyder på over gjennomsnittlig avslutningsevne, selv om omfanget neppe vedvarer</>,
            <><strong>Feltaktivitet</strong> — 3.24 touches per 90 i straffesparksfeltet</>,
            <><strong>Pressingbidrag</strong> — 1.86 interceptions og 3.18 ball-recoveries per 90 i motstanders halvdel</>,
            <><strong>Anvendelig</strong> — kan brukes som invertert kant, høy 10er eller andreangrepsspiss</>,
          ]} />
          <SignalCard title="Bekymringer" color="#d4451a" items={[
            <><strong>Regresjonsrisiko</strong> — overperformance av denne størrelsen normaliseres typisk over tid</>,
            <><strong>Balltap i egen halvdel</strong> — 10.6 per 90 er høyt, nevnes ikke i standardrapporter</>,
            <><strong>Duellsvakhet</strong> — 40.6% seier i bakkedueller er lavt for en front-profil</>,
            <><strong>Kontekstavhengig</strong> — SJK spilte åpent og transisjonsorientert (PPDA ~11.8)</>,
            <><strong>Skuddvalg</strong> — prioriterer eget forsøk fremfor samspill i mange situasjoner</>,
          ]} />
        </div>
      </Section>

      {/* Kontekstuell kalibrering */}
      <Section title="Kontekstuell kalibrering">
        <ContextBox>
          SJK spilte i 2025 med mye åpent rom og raske overganger — et format som passer Paananen godt. Han fikk tid og plass til å bære ballen og avslutte fra distanse. I en liga med tettere forsvar, høyere tempo og lag som styrer ball mer, vil han ha <strong style={b}>færre slike sjanser</strong>. Det største spørsmålet ved et eventuelt ligaskifte er om han klarer å ta de samme valgene raskere og i mindre rom.
        </ContextBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', marginTop: 16 }}>
          <div>
            <MetaRow label="Konkurranser"          value="Veikkausliiga + UECL Q" />
            <MetaRow label="Europeisk eksponering"  value="2 kamper mot KÍ" />
            <MetaRow label="Heatmap-dominans"       value="Høyre halvrom" />
            <MetaRow label="Primærfot"              value="Venstre" />
          </div>
          <div>
            <MetaRow label="Optimal rolle"             value="Invertert høyrekant / 10er" />
            <MetaRow label="Systemkrav"                value="Åpent, transisjonsfokus" />
            <MetaRow label="Ikke optimal som"          value="Ren 9er / kantspiller" />
            <MetaRow label="Forventet G/90 (ny liga)"  value="~0.35–0.42" />
          </div>
        </div>
      </Section>

      {/* Risikovurdering */}
      <Section title="Risikovurdering">
        <p style={prose}>
          Samlet risiko vurderes som <strong style={{ color: '#d4451a' }}>middels–høy</strong>, primært knyttet til xG-overperformance og kontekstavhengig output. Risikonivået reduseres vesentlig dersom kjøper anvender ham i et transisjonsorientert system med rom i baklinjen til motstanderne.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0 20px' }}>
          <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 10, color: '#7a7060' }}>LAV</span>
          <div style={{ flex: 1, height: 8, background: 'linear-gradient(to right, #2a7a3e, #b8920f, #c0392b)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '63%', transform: 'translate(-50%,-50%)', width: 16, height: 16, background: '#0f0e0d', border: '2.5px solid #f5f2eb', borderRadius: '50%' }} />
          </div>
          <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 10, color: '#7a7060' }}>HØY</span>
          <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 11, fontWeight: 800, color: '#d4451a', whiteSpace: 'nowrap' }}>MIDDELS–HØY</span>
        </div>
      </Section>

      {/* Systemkrav */}
      <Section title="Systemkrav for optimal bruk">
        <p style={prose}>Paananen er ikke en spiller som passer i alle systemer. Han gir mest tilbake i lag som spiller med tempo i overgangene og gir angriperne frihet til å bære ballen fremover.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
          <SignalCard title="Passer i system med" color="#1a5cd4" items={[
            'Raske overganger og rom bak motstanderens forsvar',
            'Frihet til å bære ballen fra høyre halvrom',
            'Medspillere som trekker forsvarere og skaper rom',
            'Tålmodighet med en ung spiller i utvikling',
          ]} />
          <SignalCard title="Passer ikke i system med" color="#d4451a" items={[
            'Streng posisjonsdisiplin og mange faste strukturer',
            'Krav om høy pasningshastighet i tett forsvar',
            'Rollen som ren 9er eller tradisjonell kantspiller',
            'Forventning om umiddelbar høy målproduksjon',
          ]} />
        </div>
      </Section>

      {/* Konklusjon */}
      <Section title="Konklusjon">
        <ContextBox borderColor="#1a5cd4">
          <strong>Anbefalt — med kontekstuelle forbehold.</strong> Paananen er en av de mest produktive angrepsprofiler i Veikkausliiga 2025 og viser indikasjoner på over gjennomsnittlig avslutningsevne utover xG-forventning. Viktigste risikofaktor er ikke talentet, men systempassform: han trenger åpne strukturer og rom i halvrom for å gjenta output. Kjøpes riktig — riktig liga, riktig rolle, realistiske forventninger til målproduksjon i et første år — representerer han svært god verdi på dette tidspunktet i karrieren.
          <br /><br />
          <em>Left-footed inverted attacker generating high shot volume through carries into the right half-space, combining above-average finishing with context-dependent efficiency in transition-dominant systems.</em>
        </ContextBox>
      </Section>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(15,14,13,0.15)', paddingTop: 14, marginTop: 32, display: 'flex', justifyContent: 'space-between', fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 10, color: '#9a8f7f' }}>
        <span>Datagrunnlag: Wyscout · 34 kamper · 2945 min · Veikkausliiga + UECL 2025</span>
        <span>Generert 17.03.2026</span>
      </div>
    </div>
  )
}
