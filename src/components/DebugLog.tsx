import { useRef, useEffect, useCallback, useState } from 'react';

declare global {
  interface Window {
    __debugLog?: (msg: string) => void;
    __debugLines?: string[];
  }
}

export function DebugLog() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copyLabel, setCopyLabel] = useState('Copy');
  const lines = window.__debugLines || [];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = lines.join('\n');
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [lines.length]);

  const handleCopy = useCallback(() => {
    const text = (window.__debugLines || []).join('\n');
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyLabel('Copied!');
        setTimeout(() => setCopyLabel('Copy'), 1500);
      },
      () => {
        setCopyLabel('Failed');
        setTimeout(() => setCopyLabel('Copy'), 1500);
      }
    );
  }, []);

  if (lines.length === 0) return null;

  return (
    <div className="debug-log-container">
      <div className="debug-log-header">
        <div className="section-label" style={{ marginBottom: 0 }}>Debug Log</div>
        <button className="debug-log-copy-btn" onClick={handleCopy}>{copyLabel}</button>
      </div>
      <textarea ref={textareaRef} className="debug-log-textarea" readOnly />
    </div>
  );
}
