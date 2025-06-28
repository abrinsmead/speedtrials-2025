'use client';

import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CopilotChat } from '@copilotkit/react-ui';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import '@copilotkit/react-ui/styles.css';

export function CopilotChatSimple() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
    };

    window.addEventListener('copilot:open', handleOpenEvent);
    return () => {
      window.removeEventListener('copilot:open', handleOpenEvent);
    };
  }, []);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        aria-label="Open chat"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>SDWIS Assistant</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-80px)]">
            <CopilotChat
              labels={{
                initial:
                  'Hi! I can help explain water quality data, violations, and compliance information. Ask me anything about the water systems in Georgia.',
                placeholder: 'Ask about water quality, violations...',
              }}
              className="h-full"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
