import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'

export default function Assegna(){
  const [persone,setPersone] = useState([])
  const [articoli,setArticoli] = useState([])
  const [form,setForm] = useState({ id_persona:null, id_articolo:null, data_consegna:new Date().toISOString().slice(0,10) })
  const [rows,setRows] = useState([])

  async function load(){
    const { data: p } = await supabase.from('personale').select('id, nome').order('nome')
    const { data: a } = await supabase.from('articoli').select('id, nome').order('nome')
    const { data: r } = await supabase.from('assegnazioni').select('id, persona:personale (nome), articolo:articoli (nome), data_consegna').order('id')
    setPersone(p||[]); setArticoli(a||[]); setRows(r||[])
  }
  useEffect(()=>{ load() },[])

  async function add(){
    const { error } = await supabase.from('assegnazioni').insert([{
      id_persona: form.id_persona,
      id_articolo: form.id_articolo,
      data_consegna: form.data_consegna
    }])
    if(!error) load(); else alert(error.message)
  }

  return (
    <div className="card grid grid-2">
      <div className="grid" style={{gap:12}}>
        <select value={form.id_persona||''} onChange={e=>setForm({...form, id_persona:parseInt(e.target.value)})}>
          <option value="">Seleziona persona…</option>
          {persone.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <select value={form.id_articolo||''} onChange={e=>setForm({...form, id_articolo:parseInt(e.target.value)})}>
          <option value="">Seleziona articolo…</option>
          {articoli.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
        <input className="input" type="date" value={form.data_consegna} onChange={e=>setForm({...form, data_consegna:e.target.value})}/>
        <div><Button onClick={add}>Assegna</Button></div>
      </div>

      <div className="card" style={{gridColumn:'1 / -1'}}>
        <table className="table">
          <thead><tr><th>ID</th><th>Dipendente</th><th>Articolo</th><th>Data</th></tr></thead>
          <tbody>
            {rows.map(r => <tr key={r.id}><td>{r.id}</td><td>{r.persona?.nome}</td><td>{r.articolo?.nome}</td><td>{r.data_consegna}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
