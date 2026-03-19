/**
 * BRIDGE CLIENT
 * Communicates with parent Webflow extension via postMessage.
 * All Webflow API operations happen in the parent - this is pure UI.
 */

export interface ProjectContext {
  projectId: string;
  designId: string;
  projectName: string;
  designName: string;
  assetCount: number;
  variableCount: number;
  cmsCount: number;
  siteConnected: boolean;
  siteId: string | null;
  siteName: string | null;
  designs: Array<{ id: string; name: string }>;
}

export interface ImportStep {
  id: string;
  status: 'waiting' | 'running' | 'done' | 'skipped' | 'error' | 'paused';
  label: string;
  detail?: string;
  count?: string;
}

export interface ImportOptions {
  syncAssets: boolean;
  createVariables: boolean;
  bindVariables: boolean;
  createCms: boolean;
}

export interface ImportResult {
  success: boolean;
  steps: ImportStep[];
  fonts?: string[];
  waitingForPaste?: boolean;
}

type MessageHandler = (payload: any) => void;

let messageId = 0;
const pendingRequests = new Map<string, { resolve: (data: any) => void; reject: (error: Error) => void }>();
const messageHandlers = new Map<string, MessageHandler>();

/**
 * Initialize bridge communication with parent
 */
export function initBridgeClient(): void {
  window.addEventListener('message', handleMessage);
  sendToParent({ type: 'BRIDGE_READY' });
  console.log('[BridgeClient] Initialized');
}

/**
 * Handle messages from parent extension
 */
function handleMessage(event: MessageEvent): void {
  const message = event.data;
  if (!message || !message.type) return;

  console.log('[BridgeClient] Received:', message.type);

  // Handle responses to our requests
  if (message.type === 'BRIDGE_RESPONSE' && message.id) {
    const pending = pendingRequests.get(message.id);
    if (pending) {
      pendingRequests.delete(message.id);
      if (message.payload?.success) {
        pending.resolve(message.payload.data);
      } else {
        pending.reject(new Error(message.payload?.error || 'Unknown error'));
      }
    }
    return;
  }

  // Handle push messages from parent
  const handler = messageHandlers.get(message.type);
  if (handler) {
    handler(message.payload);
  }
}

/**
 * Send message to parent extension
 */
function sendToParent(message: { type: string; id?: string; payload?: any }): void {
  window.parent.postMessage(message, '*');
}

/**
 * Send request to parent and wait for response
 */
async function request<T = any>(type: string, payload?: any): Promise<T> {
  const id = `req_${++messageId}`;

  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });
    sendToParent({ type, id, payload });

    // Timeout after 60s
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        reject(new Error('Request timeout'));
      }
    }, 60000);
  });
}

/**
 * Register handler for push messages from parent
 */
export function onMessage(type: string, handler: MessageHandler): () => void {
  messageHandlers.set(type, handler);
  return () => messageHandlers.delete(type);
}

// ============================================================================
// BRIDGE API
// ============================================================================

/**
 * Validate token and get project context
 */
export async function validateToken(token: string): Promise<ProjectContext> {
  const result = await request<{ context: ProjectContext }>('VALIDATE_TOKEN', { token });
  return result.context;
}

/**
 * Disconnect / clear token
 */
export async function disconnect(): Promise<void> {
  await request('DISCONNECT');
}

/**
 * Start import process
 */
export async function startImport(options: ImportOptions): Promise<ImportResult> {
  return request<ImportResult>('START_IMPORT', { options });
}

/**
 * Continue import after user pastes
 */
export async function continueAfterPaste(): Promise<ImportResult> {
  return request<ImportResult>('CONTINUE_AFTER_PASTE');
}

/**
 * Copy specific design to clipboard
 */
export async function copyDesign(designId?: string): Promise<{ fonts?: string[] }> {
  return request('COPY_DESIGN', { designId });
}

/**
 * Set extension panel size
 */
export async function setExtensionSize(height: number): Promise<void> {
  await request('SET_SIZE', { height });
}
