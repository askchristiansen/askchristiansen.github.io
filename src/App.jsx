import { useState, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { players, benchmarks, getBenchmarkKey, getOverallRating, compareVsBenchmark, coloredStats } from "./playerData";
import PlayerCard from "./PlayerCard";
import PaananenDashboard from "./PaananenDashboard";
import DiarraDashboard from "./DiarraDashboard";
import KilenDashboard from "./KilenDashboard";

const RC = { better:"#22c55e", similar:"#eab308", weaker:"#ef4444" };
const RL = { better:"↑ Bedre", similar:"~ På nivå", weaker:"↓ Svakere" };

const posGroups = {
  "Alle":null,
  "CF / Spiss":["CF"],
  "Wing / AMF":["LW","RW","LWF","RWF","LAMF","RAMF","AMF"],
  "CM / DMF":["CM","CMF","LCMF","RCMF","DMF","LDMF","RDMF"],
  "CB / Forsvar":["CB","LCB","RCB","LB","RB"],
};

const scatterAxes = {
  "Alle":         {xKey:"passAcc",  yKey:"duelWin",       xLabel:"Pass acc. %",   yLabel:"Duell %"},
  "CF / Spiss":   {xKey:"goals",    yKey:"xG",            xLabel:"Goals /90",     yLabel:"xG /90"},
  "Wing / AMF":   {xKey:"progRuns", yKey:"goals",         xLabel:"Prog. runs /90",yLabel:"Goals /90"},
  "CM / DMF":     {xKey:"passAcc",  yKey:"interceptions", xLabel:"Pass acc. %",   yLabel:"Int /90"},
  "CB / Forsvar": {xKey:"passAcc",  yKey:"duelWin",       xLabel:"Pass acc. %",   yLabel:"Duell %"},
};

const benchGroupMap = {"CF / Spiss":"CF","Wing / AMF":"WING","CM / DMF":"CM","CB / Forsvar":"CB"};

function matchesGroup(p,g){
  if(g==="Alle")return true;
  const kw=posGroups[g]; const pos=(p.position??"").toUpperCase();
  return kw.some(k=>pos.includes(k));
}

function Dot({cx,cy,payload}){
  if(!cx||!cy)return null;
  const r=getOverallRating(payload);
  return <circle cx={cx} cy={cy} r={7} fill={r?RC[r]:"#6b7280"} fillOpacity={0.85} stroke="#111827" strokeWidth={2}/>;
}

function STip({active,payload,xKey,yKey,xLabel,yLabel}){
  if(!active||!payload?.length)return null;
  const d=payload[0].payload; const r=getOverallRating(d);
  return(
    <div style={{background:"#111827",border:"1px solid #374151",borderRadius:10,padding:"10px 14px",fontSize:12,minWidth:180}}>
      <div style={{fontWeight:800,color:"#f9fafb",marginBottom:4}}>{d.fullName??d.name}</div>
      <div style={{color:"#9ca3af",marginBottom:6}}>{d.club} · {d.position}</div>
      <div style={{color:"#e5e7eb"}}>{xLabel}: <b>{(d.stats[xKey]??0).toFixed(2)}</b></div>
      <div style={{color:"#e5e7eb"}}>{yLabel}: <b>{(d.stats[yKey]??0).toFixed(2)}</b></div>
      {r&&<div style={{marginTop:6,color:RC[r],fontWeight:700}}>{RL[r]}</div>}
    </div>
  );
}

export default function App(){
  const [sel,setSel]=useState(null);
  const [grp,setGrp]=useState("Alle");
  const [q,setQ]=useState("");
  const [sk,setSk]=useState("name");
  const [sd,setSd]=useState(1);
  const [dash,setDash]=useState(null);
  const [bm,setBm]=useState(null);

  function open(p){if(p.hasDetailedDashboard)setDash(p.id);else setSel(p);}

  const axes=scatterAxes[grp]??scatterAxes["Alle"];
  const activeBench=benchGroupMap[grp]?benchmarks[benchGroupMap[grp]]:null;

  const filtered=useMemo(()=>players.filter(p=>{
    const mg=matchesGroup(p,grp);
    const ms=!q||p.name.toLowerCase().includes(q.toLowerCase())||(p.fullName??"").toLowerCase().includes(q.toLowerCase())||(p.club??"").toLowerCase().includes(q.toLowerCase());
    return mg&&ms;
  }),[grp,q]);

  const sorted=useMemo(()=>[...filtered].sort((a,b)=>{
    const av=sk==="name"?a.name:(a.stats[sk]??0);
    const bv=sk==="name"?b.name:(b.stats[sk]??0);
    if(typeof av==="string")return sd*av.localeCompare(bv);
    return sd*(av-bv);
  }),[filtered,sk,sd]);

  function ts(k){if(sk===k)setSd(d=>-d);else{setSk(k);setSd(-1);}}

  const cols=[
    {l:"G/90",k:"goals"},{l:"A/90",k:"assists"},{l:"xG/90",k:"xG"},
    {l:"Pass%",k:"passAcc"},{l:"Duell%",k:"duelWin"},{l:"Luft%",k:"aerialWin"},
    {l:"Int/90",k:"interceptions"},{l:"Prog/90",k:"progRuns"},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#0a0f1a",color:"#f9fafb",fontFamily:"system-ui,sans-serif"}}>
      <div style={{borderBottom:"1px solid #1f2937",padding:"20px 32px",display:"flex",alignItems:"center",gap:16}}>
        <div>
          <h1 style={{margin:0,fontSize:22,fontWeight:900}}>⚡ Viking FK — Scouting Platform</h1>
          <p style={{margin:0,fontSize:13,color:"#6b7280"}}>{players.length} spillere · Benchmark vs. Viking FK-kader</p>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:16}}>
          {Object.entries(RL).map(([r,l])=>(
            <span key={r} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:RC[r]}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:RC[r]}}/>  {l}
            </span>
          ))}
        </div>
      </div>

      <div style={{padding:"24px 32px"}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
          {Object.keys(posGroups).map(g=>(
            <button key={g} onClick={()=>setGrp(g)} style={{background:grp===g?"#1d4ed8":"#1f2937",color:grp===g?"#fff":"#9ca3af",border:"none",borderRadius:8,padding:"6px 14px",fontSize:13,cursor:"pointer",fontWeight:grp===g?700:400}}>{g}</button>
          ))}
          <input placeholder="🔍 Søk spiller / klubb..." value={q} onChange={e=>setQ(e.target.value)}
            style={{marginLeft:"auto",background:"#1f2937",border:"1px solid #374151",borderRadius:8,padding:"6px 14px",color:"#f9fafb",fontSize:13,outline:"none",minWidth:200}}/>
        </div>

        <div style={{background:"#111827",borderRadius:14,padding:"20px 20px 10px",marginBottom:24,border:"1px solid #1f2937"}}>
          <div style={{fontSize:13,color:"#6b7280",marginBottom:12,fontWeight:600}}>
            {axes.xLabel} vs {axes.yLabel}
            {activeBench&&<span style={{color:"#4b5563",fontWeight:400}}> · Stiplede linjer = {activeBench.name}</span>}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart margin={{top:10,right:20,bottom:20,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
              <XAxis type="number" dataKey={d=>d.stats[axes.xKey]??0} tick={{fill:"#6b7280",fontSize:11}}
                label={{value:axes.xLabel,position:"insideBottom",offset:-10,fill:"#4b5563",fontSize:11}}/>
              <YAxis type="number" dataKey={d=>d.stats[axes.yKey]??0} tick={{fill:"#6b7280",fontSize:11}}
                label={{value:axes.yLabel,angle:-90,position:"insideLeft",fill:"#4b5563",fontSize:11}}/>
              {activeBench&&<>
                <ReferenceLine x={activeBench.stats[axes.xKey]} stroke="#374151" strokeDasharray="4 3" strokeWidth={1.5}/>
                <ReferenceLine y={activeBench.stats[axes.yKey]} stroke="#374151" strokeDasharray="4 3" strokeWidth={1.5}/>
              </>}
              <Tooltip content={<STip xKey={axes.xKey} yKey={axes.yKey} xLabel={axes.xLabel} yLabel={axes.yLabel}/>}/>
              <Scatter data={filtered} shape={<Dot/>} onClick={d=>open(d)} style={{cursor:"pointer"}}/>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div style={{background:"#111827",borderRadius:14,border:"1px solid #1f2937",overflow:"hidden"}}>
          <div style={{padding:"12px 20px",borderBottom:"1px solid #1f2937",fontSize:13,color:"#6b7280"}}>{sorted.length} spillere vist</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{borderBottom:"1px solid #1f2937"}}>
                  {[{l:"Spiller",k:"name"},{l:"Klubb",k:null},{l:"Pos",k:null},{l:"Min",k:"minutes"},...cols,{l:"Vs. Viking",k:null}].map(({l,k})=>(
                    <th key={l} onClick={()=>k&&ts(k)} style={{padding:"10px 14px",textAlign:"left",color:"#6b7280",fontWeight:600,cursor:k?"pointer":"default",userSelect:"none",whiteSpace:"nowrap",background:sk===k?"#1a2332":"transparent"}}>
                      {l}{sk===k?(sd===1?" ↑":" ↓"):""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(player=>{
                  const bk=getBenchmarkKey(player.position);
                  const bench=bk?benchmarks[bk]:null;
                  const rel=bk?(coloredStats[bk]??[]):[];
                  const rating=getOverallRating(player);
                  return(
                    <tr key={player.id} onClick={()=>open(player)} style={{borderBottom:"1px solid #1a2332",cursor:"pointer"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#1a2332"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"11px 14px",whiteSpace:"nowrap"}}>
                        <span style={{marginRight:6}}>{player.flag??""}</span>
                        <span style={{fontWeight:700,color:"#f9fafb"}}>{player.fullName??player.name}</span>
                        {player.hasDetailedDashboard&&<span style={{marginLeft:6,fontSize:10,background:"#1d4ed8",color:"#bfdbfe",padding:"1px 6px",borderRadius:99}}>DASH</span>}
                      </td>
                      <td style={{padding:"11px 14px",color:"#9ca3af"}}>{player.club}</td>
                      <td style={{padding:"11px 14px",color:"#9ca3af"}}>{player.position}</td>
                      <td style={{padding:"11px 14px",color:"#9ca3af"}}>{player.stats.minutes?.toLocaleString()??"—"}</td>
                      {cols.map(({k})=>{
                        const pv=player.stats[k]??0;
                        const bv=bench?.stats[k]??null;
                        const isPct=["passAcc","duelWin","aerialWin"].includes(k);
                        let color="#6b7280";
                        if(bench&&bv!==null&&rel.includes(k)){
                          color=RC[compareVsBenchmark(pv,bv)];
                        } else if(rel.includes(k)){
                          color="#e5e7eb";
                        }
                        return(
                          <td key={k} style={{padding:"11px 14px",color,fontWeight:rel.includes(k)?600:400}}>
                            {pv.toFixed(isPct?1:2)}{isPct?"%":""}
                          </td>
                        );
                      })}
                      <td style={{padding:"11px 14px"}}>
                        {rating?(
                          <span style={{display:"inline-flex",alignItems:"center",gap:4,color:RC[rating],fontSize:12,fontWeight:700}}>
                            <span style={{width:7,height:7,borderRadius:"50%",background:RC[rating]}}/>
                            {RL[rating]}
                          </span>
                        ):<span style={{color:"#4b5563"}}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{marginTop:24}}>
          <div style={{fontSize:12,color:"#4b5563",marginBottom:12,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>
            Viking FK — Benchmarks (klikk for detaljer)
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {Object.entries(benchmarks).map(([key,b])=>(
              <div key={key} onClick={()=>setBm(key)}
                style={{background:"#111827",border:"1px solid #1f2937",borderRadius:10,padding:"12px 16px",minWidth:180,cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="#374151"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="#1f2937"}>
                <div style={{fontSize:10,color:"#6b7280",fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>{key}</div>
                <div style={{fontWeight:800,color:"#f9fafb",marginBottom:2}}>{b.fullName}</div>
                <div style={{fontSize:12,color:"#6b7280"}}>{b.position} · {b.club}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {sel&&<PlayerCard player={sel} onClose={()=>setSel(null)}/>}

      {bm&&(()=>{
        const b=benchmarks[bm];
        return(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={()=>setBm(null)}>
            <div style={{background:"#111827",border:"1px solid #1f2937",borderRadius:16,width:"100%",maxWidth:460,padding:28,boxShadow:"0 25px 50px rgba(0,0,0,0.6)"}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div>
                  <div style={{fontSize:11,color:"#6b7280",fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Viking FK — {bm} Benchmark</div>
                  <h2 style={{margin:0,fontSize:20,fontWeight:900,color:"#f9fafb"}}>{b.fullName}</h2>
                  <div style={{color:"#6b7280",fontSize:13,marginTop:4}}>{b.position} · {b.club}</div>
                </div>
                <button onClick={()=>setBm(null)} style={{background:"none",border:"none",color:"#6b7280",fontSize:22,cursor:"pointer"}}>✕</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["Goals /90",b.stats.goals?.toFixed(2)],["Assists /90",b.stats.assists?.toFixed(2)],["xG /90",b.stats.xG?.toFixed(2)],["Pass acc.",b.stats.passAcc?.toFixed(1)+"%"],["Duel win",b.stats.duelWin?.toFixed(1)+"%"],["Aerial win",b.stats.aerialWin?.toFixed(1)+"%"],["Interceptions",b.stats.interceptions?.toFixed(2)+"/90"],["Prog. runs",b.stats.progRuns?.toFixed(2)+"/90"],["Dribble succ.",b.stats.dribbleSucc?.toFixed(1)+"%"],["Shot assists",b.stats.shotAssists?.toFixed(2)+"/90"]].map(([label,val])=>(
                  <div key={label} style={{background:"#1f2937",borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:11,color:"#6b7280",marginBottom:2}}>{label}</div>
                    <div style={{fontSize:16,fontWeight:700,color:"#f9fafb"}}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {["paananen","diarra","kilen"].map(id=>dash===id&&(
        <div key={id} style={{position:"fixed",inset:0,background:"#0a0f1a",overflowY:"auto",zIndex:1000}}>
          <button onClick={()=>setDash(null)} style={{position:"fixed",top:16,left:16,background:"#1f2937",border:"none",color:"#f9fafb",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,zIndex:1001}}>← Tilbake</button>
          {id==="paananen"&&<PaananenDashboard/>}
          {id==="diarra"&&<DiarraDashboard/>}
          {id==="kilen"&&<KilenDashboard/>}
        </div>
      ))}
    </div>
  );
}
