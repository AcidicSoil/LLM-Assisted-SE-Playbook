import { ReactNode } from 'react';
export default function Tooltip({text,children}:{text:string;children:ReactNode}) {
  return <span className="relative group">{children}<span className="hidden group-hover:block absolute bg-black text-white text-xs p-1 rounded">{text}</span></span>;
}
