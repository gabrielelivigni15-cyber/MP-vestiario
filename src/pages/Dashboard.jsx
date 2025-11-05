import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { exportToExcel } from '../lib/exportExcel'

export default function Dashboard({goTo}){
  const [kpi,setKpi] = useState({articoli:0, persone:0, low:0, valore:0})
  const [top,setTop] = useState([])        // top capi assegnati
  const [byTipo,setByTipo] = useState([])  // quantità per tipo
  const [loading,setLoading] = useState(true)

  async function load(){
    setLoading(true)

    // KPI
    const { count: aCount } = await supabase.from('articoli').select('*',{count:'exact', head:true})
    const { count: pCount } = await supabase.from('personale').select('*',{count:'exact', head:true})
    const { data: lowData } = await supabase.from('articoli').select('id, quantita').lte('quantita',5)
    const { data: valData } = await supabase.from('articoli').select('quantita, prezzo_unitario')
    const valore = (valData||[]).reduce((s,r)=>s + (Number(r.quantita||0)*Number(r.prezzo_unitario||0)),0)

    // Top assegnati
    const { data: ass } = await supabase
      .from('assegnazioni')
      .select('id_articolo, articolo:articoli(nome)')
    const cnt = {}
    ;(ass||[]).forEach(r => { cnt[r.id_articolo] = (cnt[r.id_articolo]||0)+1 })
    const top5 = Object.entries(cnt)
      .map(([id,qty]) => ({ id, qty, nome: (ass||[]).find(x=>x.id_articolo==id)?.articolo?.nome || '—' }))
      .sort((a,b)=>b.qty-a.qty)
      .slice(0,5)

    // Quantità per tipo
    const { data: byTipoRows } = await supabase.from('articoli').select('tipo, quantita')
    const perTipo = {}
    ;(byTipoRows||[]).forEach(r => { perTipo[r.tipo||'Altro'] = (perTipo[r.tipo||'Altro']||0) + (r.quantita||0) })
    const byTipoArr = Object.entries(perTipo).map(([tipo, q]) => ({ tipo, q }))

    setKpi({ articoli: aCount||0, persone: pCount||0, low:(lowData||[]).length, valore: Number(valore.toFixed(2)) })
    setTop(top5)
    setByTipo(byTipoArr)
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  async function exportInventario(){
    const { data } = await supabase.from('articoli').select('id, nome, tipo, taglia, quantita, prezzo_unitario, fornitore, codice_fornitore, foto_url')
    exportToExcel('inventario-vestiario', data||[])
  }

  // Mini chart: barre SVG orizzontali
  function BarChart({data, maxLabel='q'}){
    const max = Math.max(1, ...data.map(d=>d.q))
    return (
      <div style={{display:'grid', gap:8}}>
        {data.map((d,i)=>(
          <div key={i} style={{display:'grid', gridTemplateColumns:'160px 1fr 60px', gap:8, alignItems:'center'}}>
            <div className="small" title={d.tipo||d.nome} style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{d.tipo||d.nome}</div>
            <div style={{height:10, background:'#f0f2f6', borderRadius:999}}>
              <div style={{height:'100%', width:`${(d.q/max)*100}%`, background:'#C00000', borderRadius:999}}/>
            </div>
            <div className="small" style={{textAlign:'right'}}>{d.q}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid" style={{gap:18}}>
      {/* KPI */}
      <div className="grid grid-3">
        <section className="card kpi">
          <div className="label">Articoli totali</div>
          <div className="value">{loading? '…' : kpi.articoli}</div>
          <span className="small">Tutte le tipologie presenti</span>
        </section>
        <section className="card kpi">
          <div className="label">Personale</div>
          <div className="value">{loading? '…' : kpi.persone}</div>
          <span className="small">Dipendenti censiti</span>
        </section>
        <section className="card kpi">
          <div className="label">Da riordinare</div>
          <div className="value" style={{color:'#C00000'}}>{loading? '…' : kpi.low}</div>
          <span className="small">Scorta ≤ 5</span>
        </section>
      </div>

      <section className="card grid grid-2">
        <div>
          <h3 style={{marginTop:0}}>Quantità per tipo</h3>
          <BarChart data={byTipo}/>
        </div>
        <div>
          <h3 style={{marginTop:0}}>Più assegnati</h3>
          <BarChart data={top.map(t=>({tipo:t.nome, q:t.qty}))}/>
        </div>
      </section>

      <section className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div className="label">Valore totale magazzino</div>
          <div className="value">€ {loading? '…' : kpi.valore.toLocaleString('it-IT',{minimumFractionDigits:2})}</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <Button onClick={exportInventario}>Scarica inventario Excel</Button>
          <Button variant="ghost" onClick={()=>goTo('Articoli')}>Gestisci articoli</Button>
          <Button variant="ghost" onClick={()=>goTo('Personale')}>Gestisci personale</Button>
          <Button variant="ghost" onClick={()=>goTo('Assegna')}>Assegnazioni</Button>
        </div>
      </section>
    </div>
  )
}
