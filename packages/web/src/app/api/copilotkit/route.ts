import { 
  CopilotRuntime, 
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint 
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { systemPrompt } from "@/lib/system-prompt";

const copilotKit = new CopilotRuntime({
  instructions: systemPrompt
});

const openaiAdapter = new OpenAIAdapter();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotKit,
    serviceAdapter: openaiAdapter,
    endpoint: "/api/copilotkit",
  });
  
  return handleRequest(req);
};
