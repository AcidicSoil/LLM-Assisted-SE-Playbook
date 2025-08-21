import { useState } from 'react';

export default function FilterDrawer() {
  const [open,setOpen] = useState(false);
  return (
    <div>
      <button onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="filters" className="border p-2">Filters</button>
      {open && (
        <div id="filters" className="p-2 border mt-2">
          <p>Filter UI placeholder</p>
        </div>
      )}
    </div>
  );
}
