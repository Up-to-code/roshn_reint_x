"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader, AlertCircle, Save, X, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<boolean>;
}

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export function SaveModal({ isOpen, onClose, onSave }: SaveModalProps) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const modalTitleRef = useRef<HTMLHeadingElement>(null);
  const successTimerRef = useRef<NodeJS.Timeout>();

  // Reset status when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
      setProgress(0);
      
      // Focus the modal title for accessibility when it opens
      setTimeout(() => {
        modalTitleRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  // Simulate progress during save
  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    
    if (status === 'saving') {
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressTimer);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(progressTimer);
    }
  }, [status]);

  const handleSave = async () => {
    setStatus('saving');
    setErrorMessage('');
    setProgress(0);
    
    try {
      const success = await onSave();
      setProgress(100);
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Save failed:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save settings');
    }
  };

  const handleClose = () => {
    if (status !== 'saving') {
      onClose();
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage('');
    setProgress(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && status !== 'saving') {
      handleClose();
    }
    if (e.key === 'Enter' && status === 'idle') {
      handleSave();
    }
  };

  // Auto-close on success after delay
  useEffect(() => {
    if (status === 'success') {
      successTimerRef.current = setTimeout(() => {
        onClose();
      }, 2500);
      return () => {
        if (successTimerRef.current) {
          clearTimeout(successTimerRef.current);
        }
      };
    }
  }, [status, onClose]);

  const getTitle = () => {
    switch (status) {
      case 'idle': return 'Save Changes';
      case 'saving': return 'Saving Changes';
      case 'success': return 'Success!';
      case 'error': return 'Oops! Something went wrong';
      default: return 'Save Changes';
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'idle': return 'Are you sure you want to save these changes to your global settings?';
      case 'saving': return 'We\'re saving your changes. This will just take a moment...';
      case 'success': return 'Your settings have been successfully saved and applied.';
      case 'error': return errorMessage || 'Something went wrong while saving your changes.';
      default: return '';
    }
  };

  const getAriaLive = () => {
    switch (status) {
      case 'saving': return 'assertive';
      case 'success': return 'assertive';
      case 'error': return 'assertive';
      default: return 'off';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal 
      onClose={handleClose} 
    >
      <div 
        className="space-y-6 p-1" // Added padding for better spacing
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        aria-live={getAriaLive()}
      >
        {/* Status Icon with better spacing */}
        <div className="flex justify-center px-2 py-1"> {/* Added padding */}
          <div 
            className={cn(
              "relative flex size-20 items-center justify-center rounded-full transition-all duration-500",
              status === 'idle' && "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
              status === 'saving' && "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
              status === 'success' && "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
              status === 'error' && "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            )}
            aria-hidden="true"
          >
            {status === 'idle' && (
              <Save className="size-8" />
            )}
            {status === 'saving' && (
              <div className="relative">
                <Loader className="size-8 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{progress}%</span>
                </div>
              </div>
            )}
            {status === 'success' && (
              <CheckCircle className="size-8" />
            )}
            {status === 'error' && (
              <AlertCircle className="size-8" />
            )}
          </div>
        </div>

        {/* Progress Bar with better spacing */}
        {status === 'saving' && (
          <div className="space-y-3 px-2"> {/* Added padding */}
            <div 
              className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Saving progress"
            >
              <div 
                className="h-full bg-orange-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground"> {/* Increased text size */}
              Saving your configuration... {progress}% complete
            </p>
          </div>
        )}

        {/* Content with better typography and spacing */}
        <div className="space-y-3 px-2 text-center"> {/* Added padding and gap */}
          <h3 
            id="modal-title"
            ref={modalTitleRef}
            tabIndex={-1}
            className="text-lg font-semibold text-foreground" // Better typography
          >
            {getTitle()}
          </h3>
          <p 
            id="modal-description"
            className={cn(
              "leading-relaxed text-muted-foreground transition-all duration-300", // Better line height
              status === 'success' && "text-green-600 dark:text-green-400",
              status === 'error' && "text-red-600 dark:text-red-400"
            )}
          >
            {getDescription()}
          </p>
        </div>

        {/* Actions with better spacing */}
        <div className="flex gap-4 px-1 py-2"> {/* Added padding and increased gap */}
          {status === 'idle' && (
            <>
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1 px-6 py-3" // Better padding
                size="lg"
                aria-label="Cancel saving changes"
              >
                <X className="mr-2 size-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="flex-1 px-6 py-3" // Better padding
                size="lg"
                autoFocus // Focus the save button by default
                aria-label="Confirm save changes"
              >
                <Save className="mr-2 size-4" />
                Save Now
              </Button>
            </>
          )}

          {status === 'saving' && (
            <Button 
              variant="outline" 
              disabled
              className="w-full px-6 py-3" // Better padding
              size="lg"
              aria-live="polite"
              aria-label="Saving in progress"
            >
              <Loader className="mr-2 size-4 animate-spin" />
              Saving... Please wait
            </Button>
          )}

          {status === 'success' && (
            <Button 
              onClick={handleClose}
              className="w-full px-6 py-3" // Better padding
              size="lg"
              variant="secondary"
              aria-label="Continue after successful save"
            >
              <CheckCircle className="mr-2 size-4" />
              Awesome! Continue
            </Button>
          )}

          {status === 'error' && (
            <>
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1 px-6 py-3" // Better padding
                size="lg"
                aria-label="Close error message"
              >
                <X className="mr-2 size-4" />
                Close
              </Button>
              <Button 
                onClick={handleRetry}
                className="flex-1 px-6 py-3" // Better padding
                size="lg"
                 aria-label="Retry saving changes"
              >
                <RotateCcw className="mr-2 size-4" />
                Try Again
              </Button>
            </>
          )}
        </div>

        {/* Additional Info with better spacing */}
        {status === 'success' && (
          <div className="mx-2 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"> {/* Added margin */}
            <p className="text-center text-sm leading-tight text-green-700 dark:text-green-300"> {/* Better text size */}
              ✓ Settings applied successfully • ✓ Configuration saved • ✓ Changes are now live
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="mx-2 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"> {/* Added margin */}
            <p className="text-center text-sm leading-tight text-red-700 dark:text-red-300"> {/* Better text size */}
              Don&apos;t worry, your changes are still safe in the editor. 
              Try saving again or check your internet connection.
            </p>
          </div>
        )}

        {/* Keyboard shortcut hints */}
        <div className="border-t border-border px-2 pt-2">
          <p className="text-center text-xs text-muted-foreground">
            {status === 'idle' && "Press Enter to save or Escape to cancel"}
            {status === 'saving' && "Saving in progress... Please wait"}
            {status === 'success' && "Settings saved successfully!"}
            {status === 'error' && "Press Escape to close or Tab to retry"}
          </p>
        </div>
      </div>
    </Modal>
  );
}