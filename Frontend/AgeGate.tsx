import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const ageOk = localStorage.getItem('age-ok');
    if (!ageOk) {
      setIsOpen(true);
    } else {
      onConfirm();
    }
  }, [onConfirm]);

  const handleConfirm = () => {
    localStorage.setItem('age-ok', '1');
    setIsOpen(false);
    onConfirm();
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Age Verification</DialogTitle>
          <DialogDescription>
            You must be 21 years or older to access this site.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            By confirming, you certify that you are 21 years of age or older and agree to our terms of service.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleDeny}
              className="flex-1"
            >
              I'm Under 21
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
            >
              I'm 21 or Older
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
