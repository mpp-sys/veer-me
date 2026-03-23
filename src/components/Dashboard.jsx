import React, { useState, useEffect } from 'react';
import ShiftChat from './ShiftChat.jsx';
import ProgressCard from './ProgressCard.jsx';
import MilestoneCard from './MilestoneCard.jsx';
import { useUser } from '../context/UserContext.jsx';
import { callShift } from '../hooks/useShift.js';
import { buildWeeklyFocusPrompt } from '../utils/shiftPrompts.js';

const HORIZON_CONFIG = {
  '1-month': { label: '1 Month', color: 'from-red-500 to-orange-500', icon: '⚡', desc: 'Intervention track', milestones: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
  '6-months': { label: '6 Months', color: 'from-blue-500 to-indigo-500', icon: '📅', desc: 'Transition track', milestones: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'] },
  '12-months': { label: '12 Months', color: 'from-green-500 to-teal-500', icon: '🌱', desc: 'Reinvention track', milestones: ['Q1', 'Q2', 'Q3', 'Q4'] },
};

function ReinventionPathCard({ userProfile }) {
  const config = HORIZON_CONFIG[userProfile.horizon] || HORIZON_CONFIG['6-months'];
  const currentStep = 1; // Always at step 1 for demo

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} bg-opacity-20 flex items-center justify-center text-sm`}>
          {config.icon}
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">My Reinvention Path</h3>
          <p className="text-mair-secondary text-xs">{config.desc}</p>
        </div>
      </div>

      <div className="flex-1">
        {/* Timeline */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            {config.milestones.map((m, i) => (
              <div key={m} className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all
                  ${i < currentStep
                    ? `bg-gradient-to-br ${config.color} text-white shadow-lg`
                    : i === currentStep
                    ? 'border-2 border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border border-white/20 text-white/20'
                  }`}
                >
                  {i < currentStep ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-mair-secondary/60 text-xs text-center leading-none">{m}</span>
              </div>
            ))}
          </div>

          {/* Progress line */}
          <div className="absolute top-3 left-3 right-3 h-0.5 bg-white/10 -z-10">
            <div
              className={`h-full bg-gradient-to-r ${config.color} transition-all duration-700`}
              style={{ width: `${(currentStep / (config.milestones.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 pt-3 border-t border-white/8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs">Current status</p>
              <p className="text-white font-medium text-sm mt-0.5">Journey started</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${config.color} bg-opacity-20 text-white`}>
              {config.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeeklyFocusCard({ userProfile }) {
  const [focus, setFocus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFocus = async () => {
      setIsLoading(true);
      try {
        const prompt = buildWeeklyFocusPrompt(userProfile);
        const result = await callShift(
          [{ role: 'user', content: prompt }],
          userProfile,
          100
        );
        setFocus(result.trim());
      } catch (err) {
        console.error('Weekly focus error:', err);
        // Contextual fallback
        const fallbacks = {
          'at-risk': `Map 3 tasks in your current ${userProfile.role || 'role'} that AI cannot automate — starting with your ${userProfile.strength || 'core strength'}.`,
          'reinvent': `Write a one-page vision of who you are professionally in 12 months, anchored in your strength: ${userProfile.strength || 'what you do best'}.`,
          'opportunity': `Identify one AI tool relevant to ${userProfile.role || 'your field'} and spend 30 minutes learning how it amplifies ${userProfile.strength || 'your strength'}.`,
        };
        setFocus(fallbacks[userProfile.situation] || 'Identify one AI tool in your field and explore how it could amplify your existing strengths this week.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFocus();
  }, []);

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
          <svg className="w-4 h-4 text-mair-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-sm">This Week's Focus</h3>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-3 bg-white/5 rounded animate-pulse w-full" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-5/6" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-4/5" />
          </div>
        ) : (
          <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-xl p-3 animate-fade-in">
            <div className="flex items-start gap-2">
              <span className="text-mair-indigo mt-0.5">→</span>
              <p className="text-white/90 text-sm leading-relaxed">{focus}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          <div className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0" />
          <span className="text-mair-secondary/50 text-xs">Mark as done when complete</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState('chat'); // mobile: 'chat' | 'dashboard'

  return (
    <div className="min-h-screen bg-mair-bg flex flex-col">
      {/* Top nav */}
      <nav className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/8 bg-mair-bg/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <span className="text-white font-bold">Veer.me</span>
        </div>

        {/* Profile summary */}
        <div className="hidden md:flex items-center gap-3">
          {userProfile.role && (
            <span className="text-mair-secondary text-sm">
              {userProfile.role}
            </span>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/8">
            <div className="shift-dot" />
            <span className="text-mair-highlight text-xs font-medium">Shift is active</span>
          </div>
        </div>

        {/* Mobile tab toggle */}
        <div className="flex md:hidden gap-1 p-1 bg-white/5 rounded-full">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-500 text-white'
                : 'text-mair-secondary'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-500 text-white'
                : 'text-mair-secondary'
            }`}
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>

        {/* Left panel — Shift Chat */}
        <div className={`
          ${activeTab === 'chat' ? 'flex' : 'hidden'}
          md:flex flex-col
          w-full md:w-[45%] lg:w-[40%]
          border-r border-white/8
          bg-mair-bg
        `}>
          <ShiftChat />
        </div>

        {/* Right panel — Dashboard cards */}
        <div className={`
          ${activeTab === 'dashboard' ? 'flex' : 'hidden'}
          md:flex flex-col
          flex-1
          overflow-y-auto custom-scrollbar
          bg-gradient-to-br from-mair-bg via-[#0f1428] to-mair-bg
          p-4 md:p-6
          gap-4
        `}>
          {/* Dashboard header */}
          <div className="mb-2">
            <h2 className="text-white font-bold text-lg">
              Your Reinvention Dashboard
            </h2>
            <p className="text-mair-secondary text-sm">
              {userProfile.horizon === '1-month' && 'Intervention mode · Moving fast'}
              {userProfile.horizon === '6-months' && 'Transition mode · Steady progress'}
              {userProfile.horizon === '12-months' && 'Reinvention mode · Playing the long game'}
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Reinvention Path */}
            <div className="sm:col-span-2">
              <ReinventionPathCard userProfile={userProfile} />
            </div>

            {/* This Week's Focus */}
            <WeeklyFocusCard userProfile={userProfile} />

            {/* Progress Check */}
            <ProgressCard />

            {/* Milestone */}
            <div className="sm:col-span-2">
              <MilestoneCard />
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-mair-secondary/30 text-xs pb-2 pt-4">
            Veer.me prototype · Powered by Shift · Data is session-only
          </div>
        </div>
      </div>
    </div>
  );
}
