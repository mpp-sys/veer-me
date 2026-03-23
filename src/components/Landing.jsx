import React, { useEffect, useState } from 'react';
import Button from './shared/Button.jsx';

export default function Landing({ onStart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Staggered entrance
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-animated-gradient flex flex-col relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Veer.me</span>
        </div>
        <span className="text-mair-secondary text-sm hidden sm:block">
          Dare to change direction.
        </span>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-8">
            <div className="shift-dot" />
            <span className="text-mair-highlight text-sm font-medium">Powered by Shift — your AI reinvention companion</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6 max-w-3xl mx-auto">
            <span className="text-white">Dare to</span>
            <br />
            <span className="text-gradient">change direction.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-mair-secondary text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-4">
            Reinvention isn't a crisis — it's a choice. Veer.me gives you the clarity, courage, and concrete plan to pivot with intention, built entirely around{' '}
            <span className="text-white font-medium">you</span>.
          </p>
          <p className="text-mair-secondary/70 text-base max-w-lg mx-auto mb-12">
            Meet Shift — your AI reinvention companion. No sign-up needed. Just start.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onStart}
              variant="primary"
              size="lg"
              className="glow-indigo animate-pulse-glow min-w-[220px]"
            >
              Start your reinvention
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            <span className="text-mair-secondary/50 text-sm">No sign-up · Free to start · Built for courage</span>
          </div>
        </div>

        {/* Stats strip */}
        <div className={`mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {[
            { label: 'Knowledge workers affected by AI', value: '300M+' },
            { label: 'People who feel unprepared', value: '72%' },
            { label: 'Career reinventions made with intention', value: '∞' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-gradient mb-1">{stat.value}</div>
              <div className="text-mair-secondary text-xs md:text-sm max-w-[140px] leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom visual — crossroads metaphor */}
      <div className="relative z-10 px-6 pb-10 flex justify-center">
        <div className={`transition-all duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-end justify-center gap-1">
            {/* Animated path lines representing crossroads */}
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 rounded-full bg-gradient-to-t from-indigo-500/60 to-transparent"
                style={{
                  height: `${20 + Math.abs(3 - i) * 10}px`,
                  animationDelay: `${i * 100}ms`,
                  opacity: 0.4 + (i === 3 ? 0.6 : 0),
                }}
              />
            ))}
          </div>
          <p className="text-center text-mair-secondary/40 text-xs mt-2 tracking-widest uppercase">
            Your next chapter starts here
          </p>
        </div>
      </div>
    </div>
  );
}
