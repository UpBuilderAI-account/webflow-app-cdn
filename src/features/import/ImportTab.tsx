import { useImport } from './useImport';
import { ConnectScreen } from './ConnectScreen';
import { ReadyScreen } from './ReadyScreen';
import { ProgressScreen } from './ProgressScreen';
import { DoneScreen } from './DoneScreen';

export function ImportTab() {
  const {
    state,
    connectToken, disconnect,
    startImport, continueAfterPaste, retryImport, importAnother,
  } = useImport();

  return (
    <div className="content">
      {state.screen === 'connect' && (
        <ConnectScreen
          onConnect={connectToken}
          validating={state.validating}
          error={state.tokenError}
        />
      )}
      {state.screen === 'ready' && state.context && (
        <ReadyScreen
          context={state.context}
          onImport={startImport}
          onDisconnect={disconnect}
        />
      )}
      {state.screen === 'progress' && (
        <ProgressScreen steps={state.steps} />
      )}
      {state.screen === 'done' && state.context && (
        <DoneScreen
          steps={state.steps}
          fonts={state.fonts}
          waitingForPaste={state.waitingForPaste}
          lastFailed={state.lastFailed}
          context={state.context}
          onContinue={continueAfterPaste}
          onRetry={retryImport}
          onImportAnother={importAnother}
        />
      )}
    </div>
  );
}
