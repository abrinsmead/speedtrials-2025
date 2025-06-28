import Link from 'next/link';
import { HamburgerMenu } from './hamburger-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg">SDWIS Georgia</span>
        </Link>
        <HamburgerMenu />
      </div>
    </header>
  );
}
