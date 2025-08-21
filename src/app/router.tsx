import { Routes, Route } from 'react-router-dom';
import Shell from './shell';
import HomePage from '../pages/HomePage';
import ExplorerPage from '../features/explorer/ExplorerPage';
import ComparePage from '../features/compare/ComparePage';
import PromptLabPage from '../features/prompts/PromptLabPage';
import NotFound from '../pages/NotFound';

export default function AppRouter() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorerPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/prompts" element={<PromptLabPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
