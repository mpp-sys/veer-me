import React, { useState, useEffect } from 'react';
import ProgressBar from './shared/ProgressBar.jsx';
import SelectionCard from './shared/SelectionCard.jsx';
import Button from './shared/Button.jsx';
import { useUser } from '../context/UserContext.jsx';
import { callShift } from '../hooks/useShift.js';
import { buildSituationResponsePrompt } from '../utils/shiftPrompts.js';

const HORIZON_OPTIONS = [
  {
    value: '1-month',
    emoji: '⚡',
    title: 'Intervention — I need help now',
    subtitle: '1 month horizon · Immediate action needed',
  },
  {
    value: '6-months',
    emoji: '📅',
    title: 'Transition — I\'m planning ahead',
    subtitle: '6 month horizon · Structured transition',
  },
  {
    value: '12-months',
    emoji: '🌱',
    title: 'Reinvention — I\'m thinking long-term',
    subtitle: '12 month horizon · Deep transformation',
  },
];

const FALLBACK_RESPONSES = {
  'at-risk': "What you're feeling is real — and the fact that you're here means you're already a step ahead of most. Uncertainty about AI's impact on your work isn't a sign of weakness; it's a signal to act with intention. Let's figure out your timeline together.",
  'reinvent': "A full career reinvention takes courage, and the fact you're naming that desire is significant. You're not starting from zero — you're starting from experience. Let's think about the pace that works for you.",
  'opportunity': "That mindset — seeing AI as an opening rather than a threat — is exactly the kind of clarity that leads to real advantage. You're asking the right question. Now let's get specific about your timeline.",
};

export default function TimeHorizon({ onNext }) {
  const { userProfile, updateProfile } = useUser();
  const [selected, setSelected] = useState(userProfile.horizon);
  const [shiftResponse, setShiftResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Fetch Shift's response to the situation choice
  useEffect(() => {
    if (!userProfile.situation) return;

    const fetchResponse = async () => {
      setIsLoading(true);
      try {
        const prompt = buildSituationResponsePrompt(userProfile.situation);
        const response = await callShift(
          [{ role: 'user', content: prompt }],
          null, // no profile yet
          200
        );
        setShiftResponse(response);
      } catch (err) {
        console.error('Shift API error:', err);
        // Graceful fallback
        setShiftResponse(FALLBACK_RESPONSES[userProfile.situation] || FALLBACK_RESPONSES['reinvent']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponse();
  }, [userProfile.situation]);

  const handleNext = () => {
    if (!selected) return;
    updateProfile({ horizon: selected });
    onNext();
  };

  return (
    <div className="min-h-screen bg-mair-gradient flex flex-col relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-indigo-600/8 blur-[80px] pointer-events-none" />

      <ProgressBar step={2} totalSteps={4} />

      <div className={`flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-2xl mx-auto w-full transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Shift response to situation */}
        <div className="glass-card p-5 mb-8 w-full animate-slide-in">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-mair-highlight text-sm font-semibold">Shift</span>
                <div className="shift-dot" />
              </div>

              {isLoading ? (
                <div className="flex items-center gap-1.5 py-1">
                  <div className="typing-dot" style={{ animationDelay: '0ms' }} />
                  <div className="typing-dot" style={{ animationDelay: '200ms' }} />
                  <div className="typing-dot" style={{ animationDelay: '400ms' }} />
                </div>
              ) : (
                <p className="text-white/90 text-sm md:text-base leading-relaxed animate-fade-in">
                  {shiftResponse}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6 w-full animate-slide-up delay-100">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            How urgent is this for you?
          </h2>
          <p className="text-mair-secondary text-sm">This will shape the pace of your plan</p>
        </div>

        {/* Selection cards */}
        <div className="w-full space-y-3 mb-8">
          {HORIZON_OPTIONS.map((option, i) => (
            <div key={option.value} className={`animate-slide-up delay-${(i + 2) * 100}`}>
              <SelectionCard
                emoji={option.emoji}
                title={option.title}
                subtitle={option.subtitle}
                value={option.value}
                selected={selected === option.value}
                onSelect={setSelected}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="w-full animate-slide-up delay-500">
          <Button
            onClick={handleNext}
            disabled={!selected}
            variant="primary"
            size="lg"
            fullWidth
          >
            Continue
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
