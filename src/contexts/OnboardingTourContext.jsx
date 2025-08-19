import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OnboardingTourContext = createContext();

export const useOnboardingTour = () => {
  const context = useContext(OnboardingTourContext);
  if (!context) {
    throw new Error('useOnboardingTour must be used within an OnboardingTourProvider');
  }
  return context;
};

export const OnboardingTourProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Tour steps configuration
  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to QueueDroid!',
      content: "Let's get you started with a quick tour of the main features.",
      target: null,
      route: '/dashboard',
      action: null
    },
    {
      id: 'create-exchange',
      title: 'Step 1: Create an Exchange',
      content: 'First, create an exchange to organize your messaging channels.',
      target: '[data-tour="create-exchange"]',
      route: '/dashboard/exchange',
      action: 'highlight-nav'
    },
    {
      id: 'add-device',
      title: 'Step 2: Add a Device',
      content: 'Connect your devices to start sending messages through your exchange.',
      target: '[data-tour="add-device"]',
      route: '/dashboard/exchange',
      action: 'highlight-button'
    },
    {
      id: 'send-message',
      title: 'Step 3: Send Your First Message',
      content: 'Now you can send messages through your configured exchange and device.',
      target: '[data-tour="send-message"]',
      route: '/dashboard',
      action: 'highlight-button'
    },
    {
      id: 'api-keys',
      title: 'Optional: API Keys',
      content: 'Generate API keys to integrate QueueDroid with your applications.',
      target: '[data-tour="api-keys"]',
      route: '/dashboard/api-keys',
      action: 'highlight-nav'
    },
    {
      id: 'complete',
      title: 'Tour Complete!',
      content: "You're all set! Explore the dashboard and start messaging.",
      target: null,
      route: '/dashboard',
      action: null
    }
  ];

  // Check if user has completed onboarding before
  useEffect(() => {
    const completed = localStorage.getItem('onboarding-completed');
    if (completed) {
      setIsCompleted(true);
    }
  }, []);

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
    navigate('/dashboard');
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      const nextStepData = tourSteps[nextStepIndex];
      setCurrentStep(nextStepIndex);

      if (nextStepData.route && nextStepData.route !== location.pathname) {
        navigate(nextStepData.route);
      }
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      const prevStepData = tourSteps[prevStepIndex];
      setCurrentStep(prevStepIndex);

      if (prevStepData.route && prevStepData.route !== location.pathname) {
        navigate(prevStepData.route);
      }
    }
  };

  const skipTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem('onboarding-completed', 'true');
    setIsCompleted(true);
  };

  const completeTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem('onboarding-completed', 'true');
    setIsCompleted(true);
    navigate('/dashboard');
  };

  const resetTour = () => {
    localStorage.removeItem('onboarding-completed');
    setIsCompleted(false);
    setIsActive(false);
    setCurrentStep(0);
  };

  const getCurrentStep = () => {
    return tourSteps[currentStep];
  };

  const value = {
    isActive,
    currentStep,
    isCompleted,
    tourSteps,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    resetTour,
    getCurrentStep
  };

  return <OnboardingTourContext.Provider value={value}>{children}</OnboardingTourContext.Provider>;
};
