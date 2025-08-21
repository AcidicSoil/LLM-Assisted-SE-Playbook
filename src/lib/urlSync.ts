import { useEffect } from 'react';
import { useStore } from '../state/store';

export function useURLSync() {
  const q = useStore(s=>s.query);
  const setQ = useStore(s=>s.setQuery);
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const qp = params.get('q');
    if(qp) setQ(qp);
  },[]);
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    if(q) params.set('q', q); else params.delete('q');
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null,'',url);
  },[q]);
}
