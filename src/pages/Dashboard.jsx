import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { exportToExcel } from '../lib/exportExcel'

export default function Dashboard({goTo}){
  const [kpi,setKpi] = useState({articoli:0, persone:0, low:0})
  const [loading,setLoading] = useState(true)

  async function load(){
    setLoading(true)
    const { count: aCount } = await supabase.from('articoli').select('*',{count:'exact', head:true})
    const { count: pCount } = await supabase.from('personale').select('*',{count:'exact', head:true})
    const { data: lowData } = await supabase.from('articoli').select('id, nome, quantita').lte('quantita',5)
    setKpi({ articoli: aCount||0, persone: pCount||0, low: (lowData||[]).length })
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  async function exportInventario(){
    const { data } = await supabase.from('articoli').select('id, nome, tipo, taglia, quantita, fornitore, foto_url')
    exportToExcel('inventario-vestiario', data||[])
  }

  return (
    <div className="grid grid-3">
      <section className="card kpi"><div className="label">Articoli totali</div><div className="value">{loading? '…' : kpi.articoli}</div><span className="small">Tutte le tipologie presenti</span></section>
      <section className="card kpi"><div className="label">Personale</div><div className="value">{loading? '…' : kpi.persone}</div><span className="small">Dipendenti censiti</span></section>
      <section className="card kpi"><div className="label">Da riordinare</div><div className="value">{loading? '…' : kpi.low}</div><span className="small">Scorta ≤ 5</span></section>
      <section className="card" style={{gridColumn:'1 / -1'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 style={{margin:0}}>Azioni rapide</h3>
          <div style={{display:'flex', gap:10}}>
            <Button onClick={exportInventario}>Scarica inventario Excel</Button>
            <Button variant="ghost" onClick={()=>goTo('Articoli')}>Gestisci articoli</Button>
            <Button variant="ghost" onClick={()=>goTo('Personale')}>Gestisci personale</Button>
          </div>
        </div>
        <p className="small" style={{marginTop:8}}>Suggerimento: verifica i capi sotto scorta e pianifica un riordino.</p>
      </section>
    </div>
  )
}
