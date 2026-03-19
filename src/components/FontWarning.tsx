import { WarningIcon } from '../utils/icons';

interface FontWarningProps {
  fonts: string[];
}

export function FontWarning({ fonts }: FontWarningProps) {
  if (fonts.length === 0) return null;

  return (
    <div className="font-warning mb-16">
      <div className="font-warning-title">
        <WarningIcon />
        Add these fonts in Webflow
      </div>
      <div className="font-warning-list">
        {fonts.map(f => <div key={f}>{f}</div>)}
      </div>
    </div>
  );
}
