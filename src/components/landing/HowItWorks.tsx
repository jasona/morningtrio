const steps = [
  {
    number: '1',
    title: 'Plan Your Morning',
    description: 'Each day starts with a quick planning session. Review yesterday\'s unfinished tasks and decide what matters today.',
  },
  {
    number: '2',
    title: 'Pick Your Top 3',
    description: 'Choose exactly 3 must-do tasks. Not 5, not 10—just 3. This constraint forces focus on what truly matters.',
  },
  {
    number: '3',
    title: 'Focus & Complete',
    description: 'Work through your top 3 with clarity. No distractions from an overwhelming list of "someday" tasks.',
  },
  {
    number: '4',
    title: 'Celebrate!',
    description: 'Finish all 3? Enjoy the celebration! Building this daily habit creates compound productivity over time.',
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A simple 4-step ritual to transform your daily productivity
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-auto mt-2 h-12 w-0.5 bg-border" />
                )}
              </div>
              <div className="pb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
