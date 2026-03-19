import { useState, useCallback } from 'react';
import { copyDesign } from '../bridge-client';
import { CheckIcon } from '../utils/icons';

interface Design {
  id: string;
  name: string;
}

interface DesignGridProps {
  designs: Design[];
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export function DesignGrid({ designs }: DesignGridProps) {
  const [copiedDesigns, setCopiedDesigns] = useState<Set<string>>(new Set());
  const [recentlyCopied, setRecentlyCopied] = useState<Set<string>>(new Set());
  const [copyingDesigns, setCopyingDesigns] = useState<Set<string>>(new Set());

  const handleCopy = useCallback(async (designId: string) => {
    if (copyingDesigns.has(designId)) return;

    setCopyingDesigns(prev => new Set([...prev, designId]));

    try {
      // Copy via bridge (handles both API call and clipboard in parent)
      await copyDesign(designId);

      setCopyingDesigns(prev => { const next = new Set(prev); next.delete(designId); return next; });
      setCopiedDesigns(prev => new Set([...prev, designId]));
      setRecentlyCopied(prev => new Set([...prev, designId]));

      setTimeout(() => {
        setRecentlyCopied(prev => { const next = new Set(prev); next.delete(designId); return next; });
      }, 2000);
    } catch {
      setCopyingDesigns(prev => { const next = new Set(prev); next.delete(designId); return next; });
    }
  }, [copyingDesigns]);

  if (designs.length === 0) return null;

  return (
    <>
      <div className="section-label">Copy each design, paste in Webflow (Ctrl+V)</div>
      <div className="design-grid">
        {designs.map(d => {
          const isCopied = copiedDesigns.has(d.id);
          const isRecent = recentlyCopied.has(d.id);
          const isCopying = copyingDesigns.has(d.id);

          return (
            <div key={d.id} className="design-row">
              <div className="design-info">
                <span className={`design-name${isCopied ? ' copied' : ''}`}>{d.name}</span>
              </div>
              <div className="design-actions">
                {isCopied && (
                  <CheckIcon className="design-check-icon" />
                )}
                <button
                  className={`design-copy-btn${isRecent ? ' copied' : ''}`}
                  disabled={isCopying}
                  onClick={() => handleCopy(d.id)}
                >
                  {isCopying ? (
                    <span>Copying...</span>
                  ) : isRecent ? (
                    <span>Copied</span>
                  ) : (
                    <>
                      <CopyIcon />
                      <span>{isCopied ? 'Copy again' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
