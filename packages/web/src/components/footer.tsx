import Link from 'next/link';
import { Droplet } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto mt-16 border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Droplet className="h-5 w-5" />
              Georgia Drinking Water
            </h3>
            <p className="text-sm text-muted-foreground">
              Monitoring water quality and compliance across Georgia&apos;s public water systems.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/glossary" className="text-muted-foreground hover:text-primary">
                  Water Quality Glossary
                </Link>
              </li>
              <li>
                <Link href="/systems" className="text-muted-foreground hover:text-primary">
                  Find Your Water System
                </Link>
              </li>
              <li>
                <Link href="/violations" className="text-muted-foreground hover:text-primary">
                  Understanding Violations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://epd.georgia.gov/watershed-protection-branch/drinking-water-permitting-and-compliance-program"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  Georgia EPD
                </a>
              </li>
              <li>
                <a
                  href="https://www.epa.gov/ground-water-and-drinking-water"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  EPA Drinking Water
                </a>
              </li>
              <li>
                <a
                  href="https://www.epa.gov/sdwa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  Safe Drinking Water Act
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Georgia EPD Drinking Water</li>
              <li>Phone: (404) 651-5154</li>
              <li>
                <a href="mailto:EPDcomments@dnr.ga.gov" className="hover:text-primary">
                  EPDcomments@dnr.ga.gov
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            Data sourced from EPA&apos;s Safe Drinking Water Information System (SDWIS). Last
            updated: Q1 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
