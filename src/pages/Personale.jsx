import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'

export default function Personale(){
  const empty = { nome:'', qualifica:'', tshirt:'M', pantaloni:'M', gilet:'M', note:'' }
  const [form,setForm] = useState(empty)
  const [rows,setRows] = useState([])

  async function load(){
    const { data } = await supabase.from('personale').select('*').order('id',{ascending:true})
    setRows(data||[])
  }
  useEffect(()=>{ load() },[])

  async function add(){
    const payload = { nome:form.nome, qualifica:form.qualifica, tshirt:form.tshirt, pantaloni:form.pantaloni, gilet:form.gilet, note:form.note }
    const { error } = await supabase.from('personale').insert([payload])
    if(!error){ setForm(empty); load() } else alert(error.message)
  }
  async function del(id){
    if(!confirm('Eliminare persona?')) return
    const { error } = await supabase.from('personale').delete().eq('id',id)
    if(!error) load(); else alert(error.message)
  }

  return (
    <div className="grid" style={{gap:18}}>
      <div className="card grid grid-3">
        <input className="input" placeholder="Nome e cognome" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})}/>
        <input className="input" placeholder="Qualifica" value={form.qualifica} onChange={e=>setForm({...form, qualifica:e.target.value})}/>
        <input className="input" placeholder="T-shirt" value={form.tshirt} onChange={e=>setForm({...form, tshirt:e.target.value})}/>
        <input className="input" placeholder="Pantaloni" value={form.pantaloni} onChange={e=>setForm({...form, pantaloni:e.target.value})}/>
        <input className="input" placeholder="Gilet/Giubbotto" value={form.gilet} onChange={e=>setForm({...form, gilet:e.target.value})}/>
        <input className="input" placeholder="Note" value={form.note} onChange={e=>setForm({...form, note:e.target.value})}/>
        <div style={{display:'flex', alignItems:'center'}}><Button onClick={add}>+ Aggiungi</Button></div>
      </div>
      <div className="card">
        <table className="table"><thead><tr><th>ID</th><th>Nome</th><th>Qualifica</th><th>T-shirt</th><th>Pantaloni</th><th>Gilet</th><th>Note</th><th>Azioni</th></tr></thead>
          <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.nome}</td><td>{r.qualifica}</td><td>{r.tshirt}</td><td>{r.pantaloni}</td><td>{r.gilet}</td><td>{r.note}</td>
              <td><Button variant="ghost" onClick={()=>del(r.id)}>Elimina</Button></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
