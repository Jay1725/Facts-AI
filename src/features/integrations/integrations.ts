import type { LucideIcon } from 'lucide-react';
import { Plug, Database, Search, Sparkles } from 'lucide-react';

export type ConnectionState = 'not_configured' | 'not_tested' | 'connected' | 'unavailable' | 'error';

export interface IntegrationInfo {
  id: string;
  name: string;
  purpose: string;
  setupNote: string;
  state: ConnectionState;
  icon: LucideIcon;
}

export const INTEGRATIONS: IntegrationInfo[] = [
  {
    id: 'tavily',
    name: 'Live web research',
    purpose: 'Searches the web and collects current sources for each claim.',
    setupNote: 'Needs a Tavily API key, which is added in your project environment settings.',
    state: 'not_configured',
    icon: Search,
  },
  {
    id: 'bifrost',
    name: 'AI gateway (Bifrost)',
    purpose: 'Routes every AI request through one secure gateway you control.',
    setupNote: 'Needs the gateway address, an access key and a model name.',
    state: 'not_configured',
    icon: Plug,
  },
  {
    id: 'model',
    name: 'AI model',
    purpose: 'Extracts claims and analyzes evidence before a verdict is written.',
    setupNote: 'Set up with your model provider inside the AI gateway.',
    state: 'not_configured',
    icon: Sparkles,
  },
  {
    id: 'database',
    name: 'Database',
    purpose: 'Stores accounts, profiles and verification history so you can reopen past reports.',
    setupNote: 'Accounts and saved reports are stored in Supabase. Each user can only read and change their own data.',
    state: 'not_tested',
    icon: Database,
  },
];
