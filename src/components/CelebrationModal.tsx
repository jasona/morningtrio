'use client';

import { Button } from '@/components/ui/button';
import { PartyPopper, Star } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const celebrationMessages = [
  "All 3 done! Great work! 🎉",
  "You crushed it today! ⭐",
  "Mission accomplished! 🚀",
  "Top 3 complete! Amazing! ✨",
  "You're on fire today! 🔥",
];

const confettiData = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: (i * 17) % 100,
  delay: (i * 0.01) % 0.5,
  duration: 1 + (i * 0.02) % 1,
  colorIndex: i % 5,
}));

const colors = ['#f97316', '#fbbf24', '#fb923c', '#fdba74', '#fed7aa'];

export function CelebrationModal({ isOpen, onClose }: CelebrationModalProps) {
  if (!isOpen) return null;

  const message = celebrationMessages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiData.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full animate-confetti"
            style={{
              left: `${particle.x}%`,
              top: '-20px',
              backgroundColor: colors[particle.colorIndex],
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 bg-card rounded-2xl p-8 shadow-xl max-w-sm mx-4 animate-in zoom-in-95 duration-200 text-center space-y-6">
        <div className="relative">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse-slow">
            <PartyPopper className="size-10 text-primary animate-bounce-slow" />
          </div>
          <Star className="absolute -top-2 -right-2 size-6 text-amber-400 animate-spin-slow" />
          <Star className="absolute -bottom-1 -left-3 size-4 text-amber-400 animate-spin-slow" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{message}</h2>
          <p className="text-sm text-muted-foreground">
            You&apos;ve completed all your must-do tasks for today.
            Take a moment to celebrate!
          </p>
        </div>

        <Button onClick={onClose} size="lg" className="w-full">
          Keep Going
        </Button>
      </div>
    </div>
  );
}
