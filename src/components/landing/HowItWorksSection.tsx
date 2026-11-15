import { ClipboardList, Globe, Scale, Split } from 'lucide-react';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';

const STEPS = [
  {
    title: 'Submit',
    description: 'Paste text, a single claim or the address of an article. Anything unclear is flagged before analysis begins.',
    icon: ClipboardList,
  },
  {
    title: 'Extract claims',
    description: 'Each factual statement is separated and tagged with its entities, dates, figures and time sensitivity.',
    icon: Split,
  },
  {
    title: 'Research live sources',
    description: 'Searches look for current web evidence that supports or contradicts every claim, with sources kept intact.',
    icon: Globe,
  },
  {
    title: 'Receive a verdict',
    description: 'Each claim gets a clear category, an explanation of the evidence and a suggested correction where needed.',
    icon: Scale,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-navy-800 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From a sentence to a defensible report"
          description="FACTS works through a clear sequence so you can see how each conclusion was reached."
        />

        <ol className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title}>
                <Card className="group flex h-full flex-col p-6 transition-colors duration-300 hover:border-brand-700 hover:bg-navy-900">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-navy-600 bg-navy-800 transition-colors group-hover:border-brand-600">
                      <Icon className="h-5 w-5 text-brand-300" aria-hidden />
                    </span>
                    <span className="text-sm font-medium text-neutral-400">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-[1.5] text-neutral-300">{step.description}</p>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
