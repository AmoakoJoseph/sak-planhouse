import { useEffect, useCallback, useState } from 'react';

interface ScreenshotProtectionOptions {
  enabled?: boolean;
  blurOnFocusLoss?: boolean;
  disableRightClick?: boolean;
  disableF12?: boolean;
  disablePrintScreen?: boolean;
  disableSelection?: boolean;
  showWarnings?: boolean;
  onViolationDetected?: (type: string) => void;
}

const defaultOptions: ScreenshotProtectionOptions = {
  enabled: true,
  blurOnFocusLoss: true,
  disableRightClick: true,
  disableF12: true,
  disablePrintScreen: true,
  disableSelection: false,
  showWarnings: true,
};

export const useScreenshotProtection = (options: ScreenshotProtectionOptions = {}) => {
  const [isProtected, setIsProtected] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const config = { ...defaultOptions, ...options };

  const showViolationWarning = useCallback((type: string) => {
    if (config.showWarnings) {
      const messages = {
        screenshot: 'Screenshot attempts are not allowed on this page.',
        devtools: 'Developer tools are disabled for security reasons.',
        rightclick: 'Right-click is disabled on this page.',
        selection: 'Text selection is disabled for security.',
        print: 'Printing is disabled on this page.',
        recording: 'Screen recording is not permitted.',
      };
      
      const message = messages[type as keyof typeof messages] || 'Security violation detected.';
      
      // Create a non-intrusive toast-like warning
      const warning = document.createElement('div');
      warning.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ef4444;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-family: system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 10000;
          animation: slideIn 0.3s ease-out;
        ">
          🚫 ${message}
        </div>
      `;
      
      // Add animation styles
      if (!document.getElementById('screenshot-protection-styles')) {
        const styles = document.createElement('style');
        styles.id = 'screenshot-protection-styles';
        styles.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          .screenshot-protected {
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            pointer-events: auto;
          }
          .screenshot-protected img,
          .screenshot-protected canvas,
          .screenshot-protected video {
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
            pointer-events: none !important;
          }
        `;
        document.head.appendChild(styles);
      }
      
      document.body.appendChild(warning);
      
      // Remove warning after 3 seconds
      setTimeout(() => {
        if (warning.parentNode) {
          warning.style.animation = 'slideOut 0.3s ease-in';
          setTimeout(() => {
            if (warning.parentNode) {
              warning.parentNode.removeChild(warning);
            }
          }, 300);
        }
      }, 3000);
    }
    
    setViolationCount(prev => prev + 1);
    config.onViolationDetected?.(type);
  }, [config]);

  const preventScreenshot = useCallback((e: KeyboardEvent) => {
    // Disable Print Screen
    if (e.key === 'PrintScreen' && config.disablePrintScreen) {
      e.preventDefault();
      showViolationWarning('screenshot');
      return false;
    }
    
    // Disable F12 (Developer Tools)
    if (e.key === 'F12' && config.disableF12) {
      e.preventDefault();
      showViolationWarning('devtools');
      return false;
    }
    
    // Disable common developer tool shortcuts
    if (config.disableF12 && e.ctrlKey && (e.shiftKey || e.altKey)) {
      if (
        e.key === 'I' || // Ctrl+Shift+I
        e.key === 'J' || // Ctrl+Shift+J
        e.key === 'C' || // Ctrl+Shift+C
        e.key === 'K'    // Ctrl+Shift+K (Firefox)
      ) {
        e.preventDefault();
        showViolationWarning('devtools');
        return false;
      }
    }

    // Additional Mac shortcuts
    if (config.disableF12 && e.metaKey && e.altKey) {
      if (e.key === 'I' || e.key === 'J' || e.key === 'C') {
        e.preventDefault();
        showViolationWarning('devtools');
        return false;
      }
    }

    return true;
  }, [config.disableF12, config.disablePrintScreen, showViolationWarning]);

  const preventRightClick = useCallback((e: MouseEvent) => {
    if (config.disableRightClick) {
      e.preventDefault();
      showViolationWarning('rightclick');
      return false;
    }
    return true;
  }, [config.disableRightClick, showViolationWarning]);

  const preventSelection = useCallback((e: Event) => {
    if (config.disableSelection) {
      e.preventDefault();
      showViolationWarning('selection');
      return false;
    }
    return true;
  }, [config.disableSelection, showViolationWarning]);

  const handleVisibilityChange = useCallback(() => {
    if (config.blurOnFocusLoss && document.hidden) {
      // Add blur overlay when tab loses focus
      let blurOverlay = document.getElementById('blur-overlay');
      if (!blurOverlay) {
        blurOverlay = document.createElement('div');
        blurOverlay.id = 'blur-overlay';
        blurOverlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: system-ui, sans-serif;
          font-size: 24px;
          font-weight: 600;
        `;
        blurOverlay.innerHTML = '🔐 Content Protected - Return to Tab';
        document.body.appendChild(blurOverlay);
      }
    } else {
      // Remove blur overlay when tab gains focus
      const blurOverlay = document.getElementById('blur-overlay');
      if (blurOverlay) {
        blurOverlay.remove();
      }
    }
  }, [config.blurOnFocusLoss]);

  const detectScreenRecording = useCallback(() => {
    // Detect screen recording attempts (basic detection)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Check for media recording APIs
      if ('mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        (navigator.mediaDevices as any).getDisplayMedia = function(...args: any[]) {
          showViolationWarning('recording');
          return Promise.reject(new Error('Screen recording is not permitted'));
        };
      }
    }
  }, [showViolationWarning]);

  const enableProtection = useCallback(() => {
    if (!config.enabled) return;

    setIsProtected(true);

    // Add protection class to body
    document.body.classList.add('screenshot-protected');
    
    // Disable text selection if configured
    if (config.disableSelection) {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }

    // Add event listeners
    document.addEventListener('keydown', preventScreenshot);
    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Detect and prevent common screenshot methods
    detectScreenRecording();

    // Disable drag and drop for images
    document.addEventListener('dragstart', (e) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
        showViolationWarning('screenshot');
      }
    });

    // Disable print
    window.addEventListener('beforeprint', (e) => {
      e.preventDefault();
      showViolationWarning('print');
      return false;
    });

    // Monitor for developer tools (basic detection)
    let devtools = { open: false };
    setInterval(() => {
      if (config.disableF12) {
        const threshold = 160;
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          if (!devtools.open) {
            devtools.open = true;
            showViolationWarning('devtools');
          }
        } else {
          devtools.open = false;
        }
      }
    }, 1000);

  }, [
    config,
    preventScreenshot,
    preventRightClick,
    preventSelection,
    handleVisibilityChange,
    detectScreenRecording,
    showViolationWarning,
  ]);

  const disableProtection = useCallback(() => {
    setIsProtected(false);

    // Remove protection class
    document.body.classList.remove('screenshot-protected');
    
    // Reset styles
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';

    // Remove event listeners
    document.removeEventListener('keydown', preventScreenshot);
    document.removeEventListener('contextmenu', preventRightClick);
    document.removeEventListener('selectstart', preventSelection);
    document.removeEventListener('visibilitychange', handleVisibilityChange);

    // Remove blur overlay if present
    const blurOverlay = document.getElementById('blur-overlay');
    if (blurOverlay) {
      blurOverlay.remove();
    }
  }, [preventScreenshot, preventRightClick, preventSelection, handleVisibilityChange]);

  useEffect(() => {
    if (config.enabled) {
      enableProtection();
    } else {
      disableProtection();
    }

    return () => {
      disableProtection();
    };
  }, [config.enabled, enableProtection, disableProtection]);

  return {
    isProtected,
    violationCount,
    enableProtection,
    disableProtection,
  };
};