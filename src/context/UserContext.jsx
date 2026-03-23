import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState({
    situation: null,       // 'at-risk' | 'reinvent' | 'opportunity'
    horizon: null,         // '1-month' | '6-months' | '12-months'
    role: '',              // current role / what they do
    strength: '',          // biggest strength
    energiser: '',         // what energises them
    worry: '',             // what they're worried about
    shiftIntroMessage: '', // the personalised first message from Shift
  });

  const updateProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setUserProfile({
      situation: null,
      horizon: null,
      role: '',
      strength: '',
      energiser: '',
      worry: '',
      shiftIntroMessage: '',
    });
  };

  return (
    <UserContext.Provider value={{ userProfile, updateProfile, resetProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
