import { useEffect, useState } from 'react';
import { ImportTab } from './features/import/ImportTab';
import { initBridgeClient, setExtensionSize } from './bridge-client';

export function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Initialize bridge communication with parent extension
    initBridgeClient();

    // Set initial size (ignore errors when not in iframe)
    setExtensionSize(500).catch(() => {});

    // Mark ready after a short delay
    setTimeout(() => setReady(true), 100);
  }, []);

  if (!ready) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#666' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <ImportTab />
    </div>
  );
}
