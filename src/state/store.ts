import create from 'zustand';
import { Dataset, Node } from '../../types/schema';

interface DatasetSlice {
  dataset: Dataset | null;
  load: () => Promise<void>;
}
interface UISlice {
  query: string;
  setQuery: (q:string)=>void;
  pins: string[];
  togglePin: (id:string)=>void;
}

export const useStore = create<DatasetSlice & UISlice>((set,get)=>({
  dataset: null,
  async load() {
    if (get().dataset) return;
    const res = await fetch('/data/playbook.json');
    const data = await res.json();
    set({ dataset: data });
  },
  query: '',
  setQuery: (q)=>set({query:q}),
  pins: [],
  togglePin: (id)=>set(s=>({pins: s.pins.includes(id)? s.pins.filter(p=>p!==id): [...s.pins,id]})),
}));

export const selectNodes = () => useStore.getState().dataset?.nodes ?? [];
export const getNode = (id:string):Node|undefined => useStore.getState().dataset?.nodes.find(n=>n.id===id);
