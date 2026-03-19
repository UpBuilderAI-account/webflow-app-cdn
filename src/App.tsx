import { useEffect } from 'react';
import { ImportTab } from './features/import/ImportTab';
import { initBridgeClient, setExtensionSize } from './bridge-client';

export function App() {
  useEffect(() => {
    // Initialize bridge communication with parent extension
    initBridgeClient();

    // Set initial size
    setExtensionSize(500).catch(console.error);
  }, []);

  return (
    <div className="container">
      <ImportTab />
    </div>
  );
}
