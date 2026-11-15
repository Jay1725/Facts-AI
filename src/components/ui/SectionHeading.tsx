interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';
  return (
    <div className={`max-w-2xl ${alignment}`}>
      <p className="text-sm font-medium text-brand-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-[1.5] text-neutral-300">{description}</p>}
    </div>
  );
}
