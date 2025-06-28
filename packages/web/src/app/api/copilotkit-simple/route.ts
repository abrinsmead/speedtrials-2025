import { CopilotBackend, AnthropicAdapter } from '@copilotkit/backend';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const copilotKit = new CopilotBackend();

  const anthropicAdapter = new AnthropicAdapter({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: 'claude-3-5-sonnet-20241022',
  });

  return copilotKit.response(req, anthropicAdapter);
}
