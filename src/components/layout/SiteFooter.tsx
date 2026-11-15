import { Link } from 'react-router-dom';
import Logo from '@/components/brand/Logo';

const FOOTER_LINKS = [
  { to: '/dashboard', label: 'Workspace' },
  { to: '/reports/sample', label: 'Sample report' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-navy-800 bg-navy-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-[1.5] text-neutral-300">
            Don&apos;t just trust the answer. Verify it. FACTS shows what the evidence can and cannot establish.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-navy-900">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-neutral-400 sm:px-6">
          &copy; {new Date().getFullYear()} FACTS. Verification reports describe the evidence found at the time of
          checking.
        </p>
      </div>
    </footer>
  );
}
