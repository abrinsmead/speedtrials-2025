'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCopilotChat } from '@copilotkit/react-core';
import { cn } from '@/lib/utils';

export function CopilotSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatContext = useCopilotChat();
  const messages = chatContext?.messages || [];
  const appendMessage = chatContext?.appendMessage;
  const isLoading = chatContext?.isLoading || false;

  useEffect(() => {
    const handleExplainEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ topic: string; prompt: string }>;
      const { prompt } = customEvent.detail;
      setIsOpen(true);
      setTimeout(() => {
        if (appendMessage) {
          appendMessage({
            content: prompt,
            role: 'user',
          });
        }
      }, 500);
    };

    const handleOpenEvent = () => {
      setIsOpen(true);
    };

    window.addEventListener('copilot:explain', handleExplainEvent);
    window.addEventListener('copilot:open', handleOpenEvent);
    return () => {
      window.removeEventListener('copilot:explain', handleExplainEvent);
      window.removeEventListener('copilot:open', handleOpenEvent);
    };
  }, [appendMessage]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading && appendMessage) {
      appendMessage({
        content: inputValue,
        role: 'user',
      });
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center justify-between">
              <span>SDWIS Assistant</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100vh-80px)]">
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">
                    Hi! I can help explain water quality data, violations, and compliance
                    information. Ask me anything about the water systems in Georgia.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const role = message?.role || 'assistant';
                    const content =
                      typeof message === 'string'
                        ? message
                        : message?.content || message?.message || '';

                    return (
                      <div
                        key={index}
                        className={cn('flex', role === 'user' ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[80%] rounded-lg px-4 py-2',
                            role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{content}</p>
                        </div>
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about water quality, violations..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!inputValue.trim() || isLoading} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
