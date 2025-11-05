import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'

export default function Articoli(){
  const empty = { nome:'', tipo:'T-shirt/Polo', taglia:'M', quantita:1, fornitore:'', codice_fornitore:'', foto_url:'' }
  const [form,setForm] = useState(empty)
  const [rows,setRows] = useState([])

  async function load(){
    const { data } = await supabase.from('articoli').select('*').order('id',{ascending:true})
    setRows(data||[])
  }
  useEffect(()=>{ load() },[])

  async function add(){
    const { error } = await supabase.from('articoli').insert([form])
    if(!error){ setForm(empty); load() } else alert(error.message)
  }
  async function del(id){
    if(!confirm('Eliminare articolo?')) return
    const { error } = await supabase.from('articoli').delete().eq('id',id)
    if(!error) load(); else alert(error.message)
  }

  return (
    <div className="grid" style={{gap:18}}>
      <div className="card grid grid-3">
        <input className="input" placeholder="Nome capo" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})}/>
        <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}>
          <option>T-shirt/Polo</option><option>Pantaloni</option><option>Gilet/Giubbotto</option>
        </select>
        <input className="input" placeholder="Taglia" value={form.taglia} onChange={e=>setForm({...form, taglia:e.target.value})}/>
        <input className="input" type="number" placeholder="Q.tà" value={form.quantita} onChange={e=>setForm({...form, quantita:parseInt(e.target.value||'0')})}/>
        <input className="input" placeholder="Fornitore" value={form.fornitore} onChange={e=>setForm({...form, fornitore:e.target.value})}/>
        <input className="input" placeholder="Codice fornitore" value={form.codice_fornitore} onChange={e=>setForm({...form, codice_fornitore:e.target.value})}/>
        <input className="input" placeholder="URL foto (opzionale)" value={form.foto_url} onChange={e=>setForm({...form, foto_url:e.target.value})}/>
        <div style={{display:'flex', alignItems:'center'}}><Button onClick={add}>+ Aggiungi</Button></div>
      </div>
      <div className="card">
        <table className="table"><thead><tr><th>ID</th><th>Nome</th><th>Tipo</th><th>Taglia</th><th>Q.tà</th><th>Fornitore</th><th>Foto</th><th>Azioni</th></tr></thead>
          <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.nome}</td><td>{r.tipo}</td><td>{r.taglia}</td><td>{r.quantita}</td><td>{r.fornitore}</td>
              <td>{r.foto_url ? <img src={r.foto_url} alt="" style={{height:36,borderRadius:6}}/> : <span className="small">-</span>}</td>
              <td><Button variant="ghost" onClick={()=>del(r.id)}>Elimina</Button></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
