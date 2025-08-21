import { useEffect, useRef } from 'react';
import { useStore } from '../state/store';

export default function SearchBar() {
  const q = useStore(s=>s.query);
  const setQ = useStore(s=>s.setQuery);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(()=>{
    const handler = (e:KeyboardEvent)=>{ if(e.key==='/' && ref.current){ e.preventDefault(); ref.current.focus(); }};
    window.addEventListener('keydown', handler);
    return ()=>window.removeEventListener('keydown', handler);
  },[]);
  return (
    <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="border p-2 rounded w-full" aria-label="Search" />
  );
}
