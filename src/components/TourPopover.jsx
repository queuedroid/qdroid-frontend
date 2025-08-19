import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, Typography, Button, IconButton, Popper, ClickAwayListener, Stack, Chip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CloseOutlined, ArrowLeftOutlined, ArrowRightOutlined, DragOutlined } from '@ant-design/icons';
import { useOnboardingTour } from '../contexts/OnboardingTourContext';

const TourPopover = () => {
  const theme = useTheme();
  const { isActive, getCurrentStep, nextStep, prevStep, skipTour, currentStep, tourSteps } = useOnboardingTour();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentStepData = getCurrentStep();

  // Drag handlers for both mobile and desktop
  const handleMouseDown = (e) => {
    // Enable dragging for all screen sizes
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault(); // Prevent text selection while dragging
  };

  const handleTouchStart = (e) => {
    // Enable dragging for all screen sizes on touch devices
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
    e.preventDefault(); // Prevent scrolling while dragging
  };

  // Add event listeners for dragging
  useEffect(() => {
    const handleDocMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Boundary checking to keep dialog within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const dialogWidth = 400; // Approximate dialog width
        const dialogHeight = 300; // Approximate dialog height

        const boundedX = Math.max(0, Math.min(newX, viewportWidth - dialogWidth));
        const boundedY = Math.max(0, Math.min(newY, viewportHeight - dialogHeight));

        setPosition({
          x: boundedX,
          y: boundedY
        });
        e.preventDefault();
      }
    };

    const handleDocMouseUp = () => {
      setIsDragging(false);
    };

    const handleDocTouchMove = (e) => {
      if (isDragging) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragStart.x;
        const newY = touch.clientY - dragStart.y;

        // Boundary checking to keep dialog within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const dialogWidth = 400; // Approximate dialog width
        const dialogHeight = 300; // Approximate dialog height

        const boundedX = Math.max(0, Math.min(newX, viewportWidth - dialogWidth));
        const boundedY = Math.max(0, Math.min(newY, viewportHeight - dialogHeight));

        setPosition({
          x: boundedX,
          y: boundedY
        });
        e.preventDefault();
      }
    };

    const handleDocTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleDocMouseMove);
      document.addEventListener('mouseup', handleDocMouseUp);
      document.addEventListener('touchmove', handleDocTouchMove, { passive: false });
      document.addEventListener('touchend', handleDocTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDocMouseMove);
      document.removeEventListener('mouseup', handleDocMouseUp);
      document.removeEventListener('touchmove', handleDocTouchMove);
      document.removeEventListener('touchend', handleDocTouchEnd);
    };
  }, [isDragging, dragStart]);

  useEffect(() => {
    if (isActive && currentStepData) {
      // Reset position when moving to a new step with a target
      if (currentStepData.target) {
        setPosition({ x: 0, y: 0 });
      }

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (currentStepData.target) {
          const targetElement = document.querySelector(currentStepData.target);
          if (targetElement) {
            setAnchorEl(targetElement);
            setIsVisible(true);

            // Scroll element into view
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });

            // Add highlight effect
            const computedStyle = window.getComputedStyle(targetElement);
            const isFixed = computedStyle.position === 'fixed';

            if (isFixed) {
              // For fixed elements, just add visual effects without changing position
              targetElement.style.boxShadow = `0 0 0 4px ${theme.palette.primary.main}40, 0 0 20px ${theme.palette.primary.main}60`;
              targetElement.style.borderRadius = '8px';
              targetElement.style.transition = 'all 0.3s ease';
              targetElement.style.zIndex = '1301';
            } else {
              // For non-fixed elements, use the original approach
              targetElement.style.position = 'relative';
              targetElement.style.zIndex = '1301';
              targetElement.style.boxShadow = `0 0 0 4px ${theme.palette.primary.main}40, 0 0 20px ${theme.palette.primary.main}60`;
              targetElement.style.borderRadius = '8px';
              targetElement.style.transition = 'all 0.3s ease';
            }
          } else {
            // If no target element, show popover in center
            setAnchorEl(null);
            setIsVisible(true);
          }
        } else {
          // No target, show in center
          setAnchorEl(null);
          setIsVisible(true);
        }
      }, 300);
    } else {
      setIsVisible(false);
      // Remove highlights from all elements
      const highlightedElements = document.querySelectorAll('[data-tour]');
      highlightedElements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el);
        const isFixed = computedStyle.position === 'fixed';

        if (isFixed) {
          // For fixed elements, only reset the visual effects we added
          el.style.boxShadow = '';
          el.style.borderRadius = '';
          el.style.transition = '';
          if (el.style.zIndex === '1301') {
            el.style.zIndex = '';
          }
        } else {
          // For non-fixed elements, reset everything
          el.style.position = '';
          el.style.zIndex = '';
          el.style.boxShadow = '';
          el.style.borderRadius = '';
          el.style.transition = '';
        }
      });
    }

    return () => {
      // Cleanup highlights
      const highlightedElements = document.querySelectorAll('[data-tour]');
      highlightedElements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el);
        const isFixed = computedStyle.position === 'fixed';

        if (isFixed) {
          el.style.boxShadow = '';
          el.style.borderRadius = '';
          el.style.transition = '';
          if (el.style.zIndex === '1301') {
            el.style.zIndex = '';
          }
        } else {
          el.style.position = '';
          el.style.zIndex = '';
          el.style.boxShadow = '';
          el.style.borderRadius = '';
          el.style.transition = '';
        }
      });
    };
  }, [isActive, currentStepData, theme.palette.primary.main]);

  if (!isActive || !currentStepData || !isVisible) {
    return null;
  }

  const handleNext = () => {
    // Remove current highlight
    if (currentStepData.target) {
      const currentElement = document.querySelector(currentStepData.target);
      if (currentElement) {
        const computedStyle = window.getComputedStyle(currentElement);
        const isFixed = computedStyle.position === 'fixed';

        if (isFixed) {
          currentElement.style.boxShadow = '';
          currentElement.style.borderRadius = '';
          if (currentElement.style.zIndex === '1301') {
            currentElement.style.zIndex = '';
          }
        } else {
          currentElement.style.position = '';
          currentElement.style.zIndex = '';
          currentElement.style.boxShadow = '';
          currentElement.style.borderRadius = '';
        }
      }
    }
    nextStep();
  };

  const handlePrev = () => {
    // Remove current highlight
    if (currentStepData.target) {
      const currentElement = document.querySelector(currentStepData.target);
      if (currentElement) {
        const computedStyle = window.getComputedStyle(currentElement);
        const isFixed = computedStyle.position === 'fixed';

        if (isFixed) {
          currentElement.style.boxShadow = '';
          currentElement.style.borderRadius = '';
          if (currentElement.style.zIndex === '1301') {
            currentElement.style.zIndex = '';
          }
        } else {
          currentElement.style.position = '';
          currentElement.style.zIndex = '';
          currentElement.style.boxShadow = '';
          currentElement.style.borderRadius = '';
        }
      }
    }
    prevStep();
  };

  const handleSkip = () => {
    // Remove current highlight
    if (currentStepData.target) {
      const currentElement = document.querySelector(currentStepData.target);
      if (currentElement) {
        const computedStyle = window.getComputedStyle(currentElement);
        const isFixed = computedStyle.position === 'fixed';

        if (isFixed) {
          currentElement.style.boxShadow = '';
          currentElement.style.borderRadius = '';
          if (currentElement.style.zIndex === '1301') {
            currentElement.style.zIndex = '';
          }
        } else {
          currentElement.style.position = '';
          currentElement.style.zIndex = '';
          currentElement.style.boxShadow = '';
          currentElement.style.borderRadius = '';
        }
      }
    }
    skipTour();
  };

  // Positioning logic for draggable tour dialog
  const isDraggedAway = position.x !== 0 || position.y !== 0;

  // Center positioning when no anchor or when dragged away
  const centerStyle = {
    position: 'fixed',
    top: isDraggedAway ? `${position.y}px` : '50%',
    left: isDraggedAway ? `${position.x}px` : '50%',
    transform: isDraggedAway ? 'none' : 'translate(-50%, -50%)',
    zIndex: 1400,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  // If dragged away from anchor, show as floating dialog
  if (!anchorEl || isDraggedAway) {
    return (
      <Box sx={centerStyle}>
        <Paper
          ref={dragRef}
          elevation={8}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          sx={{
            p: 3,
            maxWidth: 400,
            minWidth: 320,
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: 2,
            userSelect: isDragging ? 'none' : 'auto'
          }}
        >
          <TourContent
            currentStepData={currentStepData}
            currentStep={currentStep}
            totalSteps={tourSteps.length}
            onNext={handleNext}
            onPrev={handlePrev}
            onSkip={handleSkip}
            isMobile={isMobile}
            showDragHandle={true}
          />
        </Paper>
      </Box>
    );
  }

  return (
    <Popper
      open={true}
      anchorEl={anchorEl}
      placement="auto"
      sx={{ zIndex: 1400 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 10]
          }
        },
        {
          name: 'preventOverflow',
          options: {
            boundary: 'viewport',
            padding: 20
          }
        }
      ]}
    >
      <Paper
        ref={dragRef}
        elevation={8}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        sx={{
          p: 3,
          maxWidth: 350,
          minWidth: 280,
          border: `2px solid ${theme.palette.primary.main}`,
          borderRadius: 2,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto'
        }}
      >
        <TourContent
          currentStepData={currentStepData}
          currentStep={currentStep}
          totalSteps={tourSteps.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          isMobile={isMobile}
          showDragHandle={true}
        />
      </Paper>
    </Popper>
  );
};

const TourContent = ({ currentStepData, currentStep, totalSteps, onNext, onPrev, onSkip, isMobile = false, showDragHandle = false }) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <Box>
      {/* Drag Handle - Now visible on all screen sizes */}
      {showDragHandle && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 1,
            cursor: 'grab',
            '&:active': { cursor: 'grabbing' },
            '&:hover': {
              '& .drag-icon': {
                color: 'primary.main',
                transform: 'scale(1.1)'
              }
            }
          }}
        >
          {/* <DragOutlined
            className="drag-icon"
            style={{
              color: '#696969ff',
              fontSize: '1.2rem',
              transition: 'all 0.2s ease'
            }}
          /> */}
        </Box>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
            {currentStepData.title}
          </Typography>
          <Chip label={`${currentStep + 1} of ${totalSteps}`} size="small" color="primary" variant="outlined" />
        </Box>
        <IconButton size="small" onClick={onSkip} sx={{ ml: 1 }}>
          <CloseOutlined sx={{ color: '#464646ff' }} />
        </IconButton>
      </Box>

      {/* Content */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
        {currentStepData.content}
      </Typography>

      {/* Actions */}
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Box>
          {!isFirstStep && (
            <Button variant="outlined" size="small" startIcon={<ArrowLeftOutlined />} onClick={onPrev}>
              Back
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="text" size="small" onClick={onSkip}>
            Skip Tour
          </Button>
          <Button variant="contained" size="small" endIcon={!isLastStep ? <ArrowRightOutlined /> : null} onClick={onNext}>
            {isLastStep ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default TourPopover;
