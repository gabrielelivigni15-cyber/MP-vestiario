import React, { useState } from 'react'
import './styles.css'
import Dashboard from './pages/Dashboard'
import Articoli from './pages/Articoli'
import Personale from './pages/Personale'
import Assegna from './pages/Assegna'
import Statistiche from './pages/Statistiche'
import { Button } from './components/ui/button'

const NAV = ['Dashboard','Articoli','Personale','Assegna','Statistiche']

export default function App(){
  const [tab,setTab] = useState('Dashboard')
  const render = () => {
    switch(tab){
      case 'Articoli': return <Articoli/>
      case 'Personale': return <Personale/>
      case 'Assegna': return <Assegna/>
      case 'Statistiche': return <Statistiche/>
      default: return <Dashboard goTo={(t)=>setTab(t)}/>
    }
  }
  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <img src="/logo-medipower.png" alt="MediPower"/>
          <div>
            <div>MP Vestiario <span className="small">— powered by MediPower</span></div>
            <div className="subtitle">Our energy, Your Power</div>
          </div>
        </div>
        <div><Button variant="ghost" onClick={()=>window.location.reload()}>Refresh</Button></div>
      </header>
      <aside className="sidebar">
        {NAV.map(n => (<button key={n} onClick={()=>setTab(n)} className={`nav-btn ${tab===n?'active':''}`}>{n}</button>))}
        <div className="footer-note">MP Vestiario © MediPower</div>
      </aside>
      <main className="content">{render()}</main>
    </div>
  )
}
