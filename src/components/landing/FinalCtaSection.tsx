import { ArrowRight } from 'lucide-react';
import ButtonLink from '@/components/ui/ButtonLink';

export default function FinalCtaSection() {
  return (
    <section className="border-t border-navy-800 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-navy-700 bg-navy-900 px-6 py-14 text-center sm:px-12 sm:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl text-white sm:text-4xl">
            Check it before you share it.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-[1.5] text-neutral-300">
            Bring a claim, a paragraph or a link. FACTS will show what is current, what has changed and what the
            evidence cannot yet support.
          </p>
          <div className="mt-10 flex justify-center">
            <ButtonLink to="/verify" size="lg" icon={ArrowRight}>
              Start a verification
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
