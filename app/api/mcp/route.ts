import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createServer } from '@/src/mcp/create-server'

async function handleRequest(req: Request): Promise<Response> {
  const expectedApiKey = process.env.MCP_API_KEY
  if (expectedApiKey) {
    const providedApiKey = req.headers.get('x-mcp-api-key')
    if (!providedApiKey || providedApiKey !== expectedApiKey) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  const server = createServer()
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  })
  await server.connect(transport)
  return transport.handleRequest(req)
}

export const GET = handleRequest
export const POST = handleRequest
export const DELETE = handleRequest
