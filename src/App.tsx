import { useEffect } from 'react';
import { ImportTab } from './features/import/ImportTab';
import { initBridgeClient, setExtensionSize } from './bridge-client';

export function App() {
  useEffect(() => {
    // Initialize bridge communication with parent extension
    initBridgeClient();

    // Set initial size (ignore errors when not in iframe)
    setExtensionSize(500).catch(() => {});
  }, []);

  return (
    <div className="container">
      <ImportTab />
    </div>
  );
}
