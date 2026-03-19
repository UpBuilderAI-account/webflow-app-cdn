import { useState, useCallback, useEffect } from 'react';
import {
  initBridgeClient,
  onMessage,
  validateToken,
  disconnect as bridgeDisconnect,
  startImport as bridgeStartImport,
  continueAfterPaste as bridgeContinueAfterPaste,
  type ProjectContext,
  type ImportStep,
  type ImportOptions,
} from '../../bridge-client';

export type ImportScreen = 'connect' | 'ready' | 'progress' | 'done';

export interface ImportState {
  screen: ImportScreen;
  context: ProjectContext | null;
  steps: ImportStep[];
  fonts: string[];
  waitingForPaste: boolean;
  lastFailed: boolean;
  tokenError: string | null;
  validating: boolean;
}

export interface UseImportReturn {
  state: ImportState;
  connectToken: (token: string) => Promise<void>;
  disconnect: () => void;
  startImport: (options: ImportOptions) => Promise<void>;
  continueAfterPaste: () => Promise<void>;
  retryImport: () => Promise<void>;
  importAnother: () => void;
}

export function useImport(): UseImportReturn {
  const [state, setState] = useState<ImportState>({
    screen: 'connect',
    context: null,
    steps: [],
    fonts: [],
    waitingForPaste: false,
    lastFailed: false,
    tokenError: null,
    validating: false,
  });

  const [lastOptions, setLastOptions] = useState<ImportOptions | null>(null);

  // Initialize bridge and listen for messages from parent
  useEffect(() => {
    initBridgeClient();

    // Listen for token status from parent
    const unsubTokenValid = onMessage('TOKEN_VALID', (payload) => {
      setState(s => ({ ...s, screen: 'ready', context: payload.context }));
    });

    const unsubTokenInvalid = onMessage('TOKEN_INVALID', () => {
      setState(s => ({ ...s, screen: 'connect' }));
    });

    const unsubNeedToken = onMessage('NEED_TOKEN', () => {
      setState(s => ({ ...s, screen: 'connect' }));
    });

    // Listen for import progress updates
    const unsubProgress = onMessage('IMPORT_PROGRESS', (payload) => {
      setState(s => ({ ...s, steps: payload.steps }));
    });

    return () => {
      unsubTokenValid();
      unsubTokenInvalid();
      unsubNeedToken();
      unsubProgress();
    };
  }, []);

  const connectToken = useCallback(async (token: string) => {
    setState(s => ({ ...s, validating: true, tokenError: null }));
    try {
      const context = await validateToken(token);
      setState(s => ({ ...s, screen: 'ready', context, validating: false, tokenError: null }));
    } catch (error) {
      setState(s => ({
        ...s,
        validating: false,
        tokenError: error instanceof Error ? error.message : 'Invalid token',
      }));
    }
  }, []);

  const disconnect = useCallback(async () => {
    await bridgeDisconnect();
    setState({
      screen: 'connect',
      context: null,
      steps: [],
      fonts: [],
      waitingForPaste: false,
      lastFailed: false,
      tokenError: null,
      validating: false,
    });
  }, []);

  const startImport = useCallback(async (options: ImportOptions) => {
    if (!state.context) return;

    setLastOptions(options);
    setState(s => ({ ...s, screen: 'progress', steps: [], fonts: [] }));

    try {
      const result = await bridgeStartImport(options);

      if (result.waitingForPaste) {
        setState(s => ({
          ...s,
          screen: 'done',
          steps: result.steps,
          fonts: result.fonts || [],
          waitingForPaste: true,
          lastFailed: false,
        }));
      } else {
        setState(s => ({
          ...s,
          screen: 'done',
          steps: result.steps,
          fonts: result.fonts || [],
          waitingForPaste: false,
          lastFailed: !result.success,
        }));
      }
    } catch (error) {
      setState(s => ({
        ...s,
        screen: 'ready',
        lastFailed: true,
      }));
    }
  }, [state.context]);

  const continueAfterPaste = useCallback(async () => {
    setState(s => ({ ...s, screen: 'progress' }));

    try {
      const result = await bridgeContinueAfterPaste();
      setState(s => ({
        ...s,
        screen: 'done',
        steps: result.steps,
        fonts: result.fonts || [],
        waitingForPaste: false,
        lastFailed: !result.success,
      }));
    } catch (error) {
      setState(s => ({
        ...s,
        screen: 'done',
        lastFailed: true,
      }));
    }
  }, []);

  const retryImport = useCallback(async () => {
    if (lastOptions) {
      await startImport(lastOptions);
    }
  }, [lastOptions, startImport]);

  const importAnother = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return {
    state,
    connectToken,
    disconnect,
    startImport,
    continueAfterPaste,
    retryImport,
    importAnother,
  };
}
