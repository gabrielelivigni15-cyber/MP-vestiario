# MP Vestiario — MediPower

Grafica moderna (rosso MediPower), pronto per Vercel + Supabase.

## Installazione
```bash
npm i
npm run dev
```

## Variabili ambiente (Vercel)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Tabelle attese (Supabase)
- `articoli` → id, nome, tipo, taglia, quantita (int), fornitore, codice_fornitore, foto_url
- `personale` → id, nome, qualifica, tshirt, pantaloni, gilet, note
- `assegnazioni` → id, id_persona, id_articolo, data_consegna
