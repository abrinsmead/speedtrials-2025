'use client';

import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';

interface ExplainThisProps {
  topic: string;
  context: Record<string, unknown>;
  className?: string;
}

export function ExplainThis({ topic, context, className }: ExplainThisProps) {
  // Provide context to the copilot
  useCopilotReadable({
    description: `Context for ${topic}`,
    value: context,
  });

  // Define the explain action
  useCopilotAction({
    name: `explain-${topic.toLowerCase().replace(/\s+/g, '-')}`,
    description: `Explain ${topic}`,
    parameters: [],
    handler: async () => {
      // The action will trigger the copilot to explain the topic
      // based on the provided context
    },
  });

  const handleExplain = () => {
    // Open the chat sidebar and send a message
    const event = new CustomEvent('copilot:explain', {
      detail: {
        topic,
        prompt: `Please explain ${topic} in the context of drinking water safety and compliance.`,
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleExplain}
      className={className}
      title={`Get help understanding ${topic}`}
    >
      <HelpCircle className="h-4 w-4" />
      <span className="ml-1 hidden sm:inline">Explain This</span>
    </Button>
  );
}
