import React, { useState, useEffect } from 'react';
import ProgressBar from './shared/ProgressBar.jsx';
import Button from './shared/Button.jsx';
import { useUser } from '../context/UserContext.jsx';
import { callShift } from '../hooks/useShift.js';
import { buildIntroMessagePrompt, isNonsensicalProfile } from '../utils/shiftPrompts.js';

const NONSENSE_MESSAGE = `I can see you're here to have a bit of fun — and that's okay. Fun matters.

But Shift works best when you're ready to be honest with yourself.

Come back when you're ready to take your reinvention seriously. I'll be here.`;

const FALLBACK_INTRO = (profile) => {
  if (isNonsensicalProfile(profile)) return NONSENSE_MESSAGE;

  return `I've read what you shared, and I want to acknowledge something: you came here with honesty. That matters.

What you're navigating — the uncertainty, the pressure to adapt — is real. And the fact that you're here means you're already choosing agency over paralysis.

You're not behind. You're at the beginning of something deliberate.

What would it mean for you if, in six months, you were known for something new — something that didn't exist in your career before?`;
};

export default function ShiftIntro({ onNext }) {
  const { userProfile, updateProfile } = useUser();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchIntro = async () => {
      setIsLoading(true);
      try {
        const prompt = buildIntroMessagePrompt(userProfile);
        const response = await callShift(
          [{ role: 'user', content: prompt }],
          userProfile,
          500
        );
        setMessage(response);
        updateProfile({ shiftIntroMessage: response });
      } catch (err) {
        console.error('Shift API error:', err);
        const fallback = FALLBACK_INTRO(userProfile);
        setMessage(fallback);
        updateProfile({ shiftIntroMessage: fallback });
      } finally {
        setIsLoading(false);
        setTimeout(() => setTextVisible(true), 200);
      }
    };

    fetchIntro();
  }, []);

  // Format message into paragraphs
  const renderMessage = (text) => {
    if (!text) return null;
    return text.split('\n\n').filter(Boolean).map((para, i) => (
      <p key={i} className="text-white/90 text-base md:text-lg leading-relaxed mb-4 last:mb-0">
        {para}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-mair-gradient flex flex-col relative overflow-hidden">
      {/* Decorative orbs — brighter here for the reveal moment */}
      <div className="absolute top-[-15%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/12 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full bg-violet-600/12 blur-[90px] pointer-events-none" />

      <ProgressBar step={4} totalSteps={4} />

      <div className={`flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-2xl mx-auto w-full transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* Moment headline */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <svg className="w-4 h-4 text-mair-highlight" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <span className="text-mair-highlight text-sm font-medium">Shift has read your profile</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Your first coaching message
          </h1>
        </div>

        {/* Shift message card */}
        <div className="w-full glass-card p-6 md:p-8 mb-8 relative">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-t-2xl" />

          {/* Shift header */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-indigo">
              <span className="text-white font-bold">S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-mair-highlight font-semibold">Shift</span>
                <div className="shift-dot" />
              </div>
              <p className="text-mair-secondary text-xs">Your Veer.me reinvention companion</p>
            </div>
          </div>

          {/* Message content */}
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="typing-dot" style={{ animationDelay: '0ms' }} />
                <div className="typing-dot" style={{ animationDelay: '200ms' }} />
                <div className="typing-dot" style={{ animationDelay: '400ms' }} />
                <span className="text-mair-secondary text-sm ml-1">Shift is preparing your message...</span>
              </div>
              {/* Skeleton lines */}
              <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-4/5" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-full mt-4" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
            </div>
          ) : (
            <div className={`transition-all duration-700 ${textVisible ? 'opacity-100' : 'opacity-0'}`}>
              {renderMessage(message)}
            </div>
          )}
        </div>

        {/* Step complete badge */}
        {!isLoading && (
          <div className="flex items-center gap-2 mb-6 animate-fade-in">
            <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
              <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-mair-secondary text-sm">Profile complete · Step 4 of 4</span>
          </div>
        )}

        {/* CTA */}
        <div className="w-full">
          <Button
            onClick={onNext}
            disabled={isLoading}
            variant="primary"
            size="lg"
            fullWidth
            className="animate-slide-up delay-300"
          >
            {isLoading ? 'Preparing your dashboard...' : 'Start talking to Shift'}
            {!isLoading && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
