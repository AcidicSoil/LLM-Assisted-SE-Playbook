import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import CommandPalette from '../components/CommandPalette';
import { ReactNode, useEffect } from 'react';
import { useStore } from './store';
import { loadPlaybook } from '../data/repo';

export default function Shell({ children }: { children: ReactNode }) {
  const setPlaybook = useStore((s) => s.setPlaybook);

  useEffect(() => {
    loadPlaybook().then(setPlaybook).catch(console.error);
  }, [setPlaybook]);

  return (
    <div className="min-h-full flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <nav className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
        <div className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/prompts">Prompts</Link>
        </div>
        <ThemeToggle />
      </nav>
      <main id="main" className="flex-1 p-4">
        {children}
      </main>
      <CommandPalette />
    </div>
  );
}
