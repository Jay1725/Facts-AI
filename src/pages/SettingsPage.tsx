import PageHeader from '@/components/ui/PageHeader';
import IntegrationCard from '@/components/settings/IntegrationCard';
import BifrostHealthCheck from '@/components/settings/BifrostHealthCheck';
import TavilySearchTest from '@/components/settings/TavilySearchTest';
import { INTEGRATIONS } from '@/features/integrations/integrations';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-10 animate-fade-up">
      <PageHeader
        eyebrow="Settings"
        title="Integrations"
        description="See which services FACTS depends on. A service only shows as connected after a successful test."
      />
      <ul className="grid gap-5 md:grid-cols-2">
        {INTEGRATIONS.map((integration) => (
          <li key={integration.id}>
            <IntegrationCard integration={integration} />
          </li>
        ))}
      </ul>
      <BifrostHealthCheck />
      <TavilySearchTest />
    </div>
  );
}
