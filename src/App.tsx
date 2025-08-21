import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Visualize from './pages/Visualize';
import Compare from './pages/Compare';
import Glossary from './pages/Glossary';
import About from './pages/About';
import NotFound from './pages/NotFound';

function Nav() {
  return (
    <nav className="p-4 flex gap-4 bg-slate-200 dark:bg-slate-800">
      {['Home','Explore','Visualize','Compare','Glossary','About'].map((name)=>{
        const path = name=== 'Home' ? '/' : `/${name.toLowerCase()}`;
        return <Link key={name} to={path} className="hover:underline">{name}</Link>;
      })}
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/visualize" element={<Visualize />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
