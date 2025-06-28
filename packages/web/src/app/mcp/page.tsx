import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Download, Code, Terminal, Book, Github, ArrowRight } from 'lucide-react';

export default function MCPPage() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>MCP for Claude Desktop</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Model Context Protocol for Claude Desktop</h1>
          <Badge variant="secondary">Beta</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          Access Georgia drinking water data directly from Claude Desktop with our MCP server
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Quick Start
            </CardTitle>
            <CardDescription>Get up and running in minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Install Claude Desktop</h4>
              <p className="text-sm text-muted-foreground">
                Download the latest version of Claude Desktop from Anthropic
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Install our MCP Server</h4>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                npm install -g @sdwis/mcp-server
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Configure Claude Desktop</h4>
              <p className="text-sm text-muted-foreground">
                Add our server to your Claude Desktop settings
              </p>
            </div>
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Installation Guide
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Features
            </CardTitle>
            <CardDescription>What you can do with our MCP</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                </div>
                <div>
                  <p className="font-medium">Query Water Systems</p>
                  <p className="text-sm text-muted-foreground">
                    Search and analyze water systems by location, size, or status
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                </div>
                <div>
                  <p className="font-medium">Violation Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    Get insights on compliance violations and trends
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                </div>
                <div>
                  <p className="font-medium">Inspection Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Access detailed site inspection data and evaluations
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                </div>
                <div>
                  <p className="font-medium">Real-time Data</p>
                  <p className="text-sm text-muted-foreground">
                    Always get the latest Q1 2025 drinking water data
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Example Usage
          </CardTitle>
          <CardDescription>Try these queries in Claude Desktop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="font-mono text-sm mb-2">
                &quot;Show me all water systems in Fulton County with active violations&quot;
              </p>
              <p className="text-sm text-muted-foreground">
                Returns a list of water systems with their violation details
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="font-mono text-sm mb-2">
                &quot;Which water systems failed their last inspection?&quot;
              </p>
              <p className="text-sm text-muted-foreground">
                Analyzes site visit data to find systems with major deficiencies
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="font-mono text-sm mb-2">
                &quot;Create a compliance report for systems serving over 10,000 people&quot;
              </p>
              <p className="text-sm text-muted-foreground">
                Generates a comprehensive report for large water systems
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Learn how to use all features of our MCP server
            </p>
            <Button variant="outline" className="w-full">
              View Docs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Open Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Contribute to the project or report issues on GitHub
            </p>
            <Button variant="outline" className="w-full">
              View on GitHub
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              API Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Detailed API documentation for developers
            </p>
            <Button variant="outline" className="w-full">
              API Docs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
