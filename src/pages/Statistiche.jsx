import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'

export default function Statistiche(){
  const [top,setTop] = useState([])
  useEffect(()=>{
    (async ()=>{
      const { data } = await supabase
        .from('assegnazioni')
        .select('articolo:articoli (nome), id_articolo')
      const cnt = {}
      ;(data||[]).forEach(r => { cnt[r.id_articolo] = (cnt[r.id_articolo]||0)+1 })
      const out = Object.entries(cnt).map(([id,qty])=>({id, qty, nome:(data||[]).find(d=>d.id_articolo==id)?.articolo?.nome}))
      out.sort((a,b)=>b.qty-a.qty)
      setTop(out.slice(0,6))
    })()
  },[])
  return (
    <div className="grid">
      <section className="card">
        <h3 style={{marginTop:0}}>Articoli più assegnati</h3>
        <table className="table"><thead><tr><th>Articolo</th><th>Assegnazioni</th></tr></thead>
        <tbody>{top.map(r => <tr key={r.id}><td>{r.nome||'-'}</td><td><span className="badge">{r.qty}</span></td></tr>)}</tbody></table>
      </section>
      <section className="card">
        <h3 style={{marginTop:0}}>Suggerimento riordino</h3>
        <p className="small">Mantieni scorta minima 5 per gli articoli ad alta rotazione.</p>
        <Button variant="ghost" onClick={()=>alert('Suggerimenti generati!')}>Genera suggerimenti</Button>
      </section>
    </div>
  )
}
