import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const OnboardingTour = ({ steps, pageName }) => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if this specific page's tour has been completed
    const tourCompleted = localStorage.getItem(`${pageName}TourCompleted`);
    if (!tourCompleted) {
      setRun(true);
    }
  }, [pageName]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Mark this specific page's tour as completed
      localStorage.setItem(`${pageName}TourCompleted`, 'true');
      setRun(false);
    }
  };

  const tourStyles = {
    options: {
      backgroundColor: '#ffffff',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      primaryColor: 'rgb(88,28,135)',
      textColor: '#333',
      zIndex: 1000,
    },
    tooltipContainer: {
      textAlign: 'left',
    },
    buttonNext: {
      backgroundColor: 'rgb(88,28,135)',
      fontSize: '14px',
      padding: '8px 16px',
      borderRadius: '20px',
    },
    buttonBack: {
      color: 'rgb(88,28,135)',
      marginRight: '10px',
    },
    buttonSkip: {
      color: '#666',
    },
    spotlight: {
      backgroundColor: 'transparent',
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={tourStyles}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour'
      }}
      floaterProps={{
        disableAnimation: true
      }}
    />
  );
};

export default OnboardingTour; 