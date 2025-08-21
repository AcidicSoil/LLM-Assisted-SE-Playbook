import { ReactNode } from 'react';

interface Props { open:boolean; onClose:()=>void; children:ReactNode; }
export default function Modal({open,onClose,children}:Props) {
  if(!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-4 rounded">
        <button onClick={onClose} className="float-right">×</button>
        {children}
      </div>
    </div>
  );
}
