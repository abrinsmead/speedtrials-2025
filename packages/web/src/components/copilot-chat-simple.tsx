'use client';

import { useState } from 'react';
import { MessageSquare, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CopilotChat } from '@copilotkit/react-ui';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import '@copilotkit/react-ui/styles.css';

export function CopilotChatSimple() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  const handleRestart = () => {
    console.log('Restart button clicked, current key:', chatKey);
    setChatKey(prev => prev + 1);
    console.log('New key will be:', chatKey + 1);
  };

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
          <SheetHeader className="p-4 border-b relative">
            <SheetTitle>SDWIS Assistant</SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestart}
              className="absolute right-12 top-4 h-8 w-8 p-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              title="Restart chat"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <div className="h-[calc(100vh-80px)]">
            <CopilotChat
              key={chatKey}
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
