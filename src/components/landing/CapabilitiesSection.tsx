import { FileSearch, Sparkles, Split } from 'lucide-react';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';

const CAPABILITIES = [
  {
    title: 'Claim extraction',
    description: 'Long passages are broken into individual statements so each one is checked on its own.',
    icon: FileSearch,
  },
  {
    title: 'Freshness checks',
    description: 'Time-sensitive facts are compared against publication dates to catch information that has changed.',
    icon: Sparkles,
  },
  {
    title: 'Contradiction detection',
    description: 'Sources that disagree with each other are surfaced side by side instead of being averaged away.',
    icon: Split,
  },
];

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="scroll-mt-20 border-t border-navy-800 bg-navy-900/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Capabilities"
          title="Built to show its reasoning"
          description="Every verdict links back to the evidence that produced it, with nothing invented along the way."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {CAPABILITIES.map((capability) => {
            const Icon = capability.icon;
            return (
              <Card key={capability.title} className="p-6 transition-colors duration-300 hover:border-navy-500">
                <Icon className="h-6 w-6 text-accent-300" aria-hidden />
                <h3 className="mt-5 text-lg text-white">{capability.title}</h3>
                <p className="mt-3 text-sm leading-[1.5] text-neutral-300">{capability.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
