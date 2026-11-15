import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import ButtonLink from '@/components/ui/ButtonLink';
import Logo from '@/components/brand/Logo';
import { useAuth } from '@/features/auth/useAuth';
import { cn } from '@/lib/classNames';

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#verdicts', label: 'Verdicts' },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors duration-300',
        scrolled || menuOpen ? 'border-navy-800 bg-navy-950/95 backdrop-blur-md' : 'border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-300 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!loading && (session ? (
            <div className="hidden sm:block">
              <ButtonLink to="/dashboard">Open workspace</ButtonLink>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink to="/sign-in" variant="ghost">
                Sign in
              </ButtonLink>
              <ButtonLink to="/sign-up">Create account</ButtonLink>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy-700 text-neutral-200 transition-colors hover:bg-navy-800 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile" className="border-t border-navy-800 bg-navy-950 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-neutral-200 hover:bg-navy-800 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            {!loading && (
              <div className="mt-2 flex flex-col gap-2 sm:hidden">
                {session ? (
                  <ButtonLink to="/dashboard" className="w-full">
                    Open workspace
                  </ButtonLink>
                ) : (
                  <>
                    <ButtonLink to="/sign-in" variant="secondary" className="w-full">
                      Sign in
                    </ButtonLink>
                    <ButtonLink to="/sign-up" className="w-full">
                      Create account
                    </ButtonLink>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
