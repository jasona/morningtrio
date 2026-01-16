import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to focus on what matters?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of people who start their day with intention.
          </p>
          <div className="mt-6">
            <Button size="lg" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </div>
            <span className="text-sm font-medium">MorningTrio</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Focus on your top 3 priorities each day.
          </p>
        </div>
      </div>
    </footer>
  );
}
