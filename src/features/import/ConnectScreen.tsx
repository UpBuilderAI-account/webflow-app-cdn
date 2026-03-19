import { useState, useCallback } from 'react';

interface ConnectScreenProps {
  onConnect: (token: string) => Promise<void>;
  validating: boolean;
  error: string | null;
}

export function ConnectScreen({ onConnect, validating, error }: ConnectScreenProps) {
  const [token, setToken] = useState('');

  const handleConnect = useCallback(() => {
    if (token.trim()) onConnect(token.trim());
  }, [token, onConnect]);

  return (
    <div className="content center vcenter">
      <div className="connect-inner">
        <div className="input-group">
          <input
            type="text"
            className="input-field input-field-lg"
            placeholder="Paste your export token..."
            autoComplete="off"
            spellCheck={false}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleConnect(); }}
          />
        </div>

        <button
          className="btn btn-primary"
          disabled={!token.trim() || validating}
          onClick={handleConnect}
        >
          {validating ? 'Validating...' : 'Connect'}
        </button>

        {error && (
          <div className="error-text text-center" style={{ marginTop: 12 }}>{error}</div>
        )}
      </div>
    </div>
  );
}
