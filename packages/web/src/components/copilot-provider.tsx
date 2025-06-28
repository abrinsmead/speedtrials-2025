'use client';

import { CopilotKit } from '@copilotkit/react-core';
import { CopilotChatSimple } from './copilot-chat-simple';

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      {children}
      <CopilotChatSimple />
    </CopilotKit>
  );
}
