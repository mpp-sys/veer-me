import React, { useState, useEffect } from 'react';
import ProgressBar from './shared/ProgressBar.jsx';
import Button from './shared/Button.jsx';
import { useUser } from '../context/UserContext.jsx';

const FIELDS = [
  {
    key: 'role',
    label: 'Current role / what you do',
    placeholder: 'e.g. Senior Marketing Manager, freelance copywriter, finance analyst...',
    type: 'input',
  },
  {
    key: 'strength',
    label: 'Your biggest strength',
    placeholder: 'e.g. I\'m exceptional at synthesising complex information into clear narratives...',
    type: 'input',
  },
  {
    key: 'energiser',
    label: 'What energises you most at work',
    placeholder: 'e.g. Solving novel problems, connecting people, building things from scratch...',
    type: 'input',
  },
  {
    key: 'worry',
    label: 'What you\'re most worried about',
    placeholder: 'e.g. Being made redundant, losing my identity, not knowing what comes next...',
    type: 'input',
  },
];

export default function DeepProfiling({ onNext }) {
  const { userProfile, updateProfile } = useUser();
  const [form, setForm] = useState({
    role: userProfile.role || '',
    strength: userProfile.strength || '',
    energiser: userProfile.energiser || '',
    worry: userProfile.worry || '',
  });
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const isComplete = Object.values(form).every(v => v.trim().length > 0);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (!isComplete) return;
    updateProfile(form);
    onNext();
  };

  return (
    <div className="min-h-screen bg-mair-gradient flex flex-col relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-indigo-600/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full bg-violet-600/8 blur-[80px] pointer-events-none" />

      <ProgressBar step={3} totalSteps={4} />

      <div className={`flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-2xl mx-auto w-full transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Shift message */}
        <div className="glass-card p-5 mb-8 w-full animate-slide-in">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-mair-highlight text-sm font-semibold">Shift</span>
                <div className="shift-dot" />
              </div>
              <p className="text-white/90 text-sm md:text-base leading-relaxed">
                To give you the best guidance, I need to get to know you. Answer honestly — everything you share stays completely private.
              </p>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6 w-full animate-slide-up delay-100">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Tell me about yourself
          </h2>
          <p className="text-mair-secondary text-sm">4 quick questions — no right answers</p>
        </div>

        {/* Form */}
        <div className="w-full space-y-4 mb-8">
          {FIELDS.map((field, i) => (
            <div key={field.key} className={`animate-slide-up delay-${(i + 2) * 100}`}>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {field.label}
                <span className="text-mair-indigo ml-1">*</span>
              </label>
              <input
                type="text"
                value={form[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                onFocus={() => setFocused(field.key)}
                onBlur={() => setFocused(null)}
                placeholder={field.placeholder}
                className="mair-input w-full px-4 py-3.5 text-sm md:text-base"
              />
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div className="w-full mb-6 animate-slide-up delay-600">
          <div className="flex items-center gap-2 text-mair-secondary/60 text-xs">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your answers are private and used only to personalise Shift's guidance</span>
          </div>
        </div>

        {/* CTA */}
        <div className="w-full animate-slide-up delay-700">
          <Button
            onClick={handleNext}
            disabled={!isComplete}
            variant="primary"
            size="lg"
            fullWidth
          >
            Meet Shift
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
            </svg>
          </Button>
          {!isComplete && (
            <p className="text-center text-mair-secondary/50 text-xs mt-3">
              Please answer all 4 questions to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
