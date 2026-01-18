import { Sunrise, GripVertical, PartyPopper, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Sunrise,
    title: 'Morning Planning Ritual',
    description:
      'Start each day with a simple question: What are your 3 must-do tasks? Build a habit of focused intention.',
  },
  {
    icon: GripVertical,
    title: 'Drag & Drop Prioritization',
    description:
      'Easily reorder and prioritize your tasks. Move items between your top 3 and backlog with a simple drag.',
  },
  {
    icon: PartyPopper,
    title: 'Celebrate Completion',
    description:
      'Complete all 3 must-do tasks and enjoy a satisfying celebration. Small wins build momentum.',
  },
  {
    icon: RefreshCw,
    title: 'Fresh Start Each Day',
    description:
      "Yesterday's unfinished tasks? Review and decide what still matters. Every morning is a clean slate.",
  },
];

export function Features() {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple by Design
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No complex features. No overwhelming options. Just what you need to focus.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-background p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
