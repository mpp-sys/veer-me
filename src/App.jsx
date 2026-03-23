import React, { useState } from 'react';
import { UserProvider } from './context/UserContext.jsx';
import Landing from './components/Landing.jsx';
import SituationAssessment from './components/SituationAssessment.jsx';
import TimeHorizon from './components/TimeHorizon.jsx';
import DeepProfiling from './components/DeepProfiling.jsx';
import ShiftIntro from './components/ShiftIntro.jsx';
import Dashboard from './components/Dashboard.jsx';

const SCREENS = {
  LANDING: 'landing',
  SITUATION: 'situation',
  HORIZON: 'horizon',
  PROFILING: 'profiling',
  SHIFT_INTRO: 'shiftIntro',
  DASHBOARD: 'dashboard',
};

function AppContent() {
  const [screen, setScreen] = useState(SCREENS.LANDING);

  const navigate = (to) => {
    window.scrollTo(0, 0);
    setScreen(to);
  };

  switch (screen) {
    case SCREENS.LANDING:
      return <Landing onStart={() => navigate(SCREENS.SITUATION)} />;

    case SCREENS.SITUATION:
      return <SituationAssessment onNext={() => navigate(SCREENS.HORIZON)} />;

    case SCREENS.HORIZON:
      return <TimeHorizon onNext={() => navigate(SCREENS.PROFILING)} />;

    case SCREENS.PROFILING:
      return <DeepProfiling onNext={() => navigate(SCREENS.SHIFT_INTRO)} />;

    case SCREENS.SHIFT_INTRO:
      return <ShiftIntro onNext={() => navigate(SCREENS.DASHBOARD)} />;

    case SCREENS.DASHBOARD:
      return <Dashboard />;

    default:
      return <Landing onStart={() => navigate(SCREENS.SITUATION)} />;
  }
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
