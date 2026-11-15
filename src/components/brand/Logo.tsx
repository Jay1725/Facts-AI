import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
}

export default function Logo({ to = '/' }: LogoProps) {
  return (
    <Link to={to} className="group flex items-center gap-2.5 rounded-lg">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 transition-colors duration-200 group-hover:bg-brand-500">
        <ShieldCheck className="h-5 w-5 text-white" aria-hidden />
      </span>
      <span className="text-lg font-semibold tracking-tight text-white">FACTS</span>
    </Link>
  );
}
