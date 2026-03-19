import type { ImportStep, ProjectContext } from '../../bridge-client';
import { DesignGrid } from '../../components/DesignGrid';
import { FontWarning } from '../../components/FontWarning';
import { DebugLog } from '../../components/DebugLog';

interface DoneScreenProps {
  steps: ImportStep[];
  fonts: string[];
  waitingForPaste: boolean;
  lastFailed: boolean;
  context: ProjectContext;
  onContinue: () => void;
  onRetry: () => void;
  onImportAnother: () => void;
}

function buildSubtitle(steps: ImportStep[]): string {
  const parts: string[] = [];
  for (const s of steps) {
    if (s.status !== 'done' || !s.count) continue;
    const total = s.count.split('/')[1] || s.count;
    if (s.id === 'assets') parts.push(`${total} images`);
    else if (s.id === 'variables') parts.push(`${total} variables`);
    else if (s.id === 'xscp') parts.push(`${total} design${Number(total) !== 1 ? 's' : ''}`);
    else if (s.id === 'bind') parts.push(`${total} bindings`);
    else if (s.id === 'cms') parts.push(`${total} collections`);
  }
  return parts.join(' \u00B7 ');
}

export function DoneScreen({
  steps, fonts, waitingForPaste, lastFailed,
  context,
  onContinue, onRetry, onImportAnother,
}: DoneScreenProps) {
  const designs = context.designs || [];

  if (waitingForPaste) {
    return (
      <div className="content">
        <h2 className="title" style={{ color: 'var(--accent)' }}>Paste into Webflow</h2>
        <p className="description">
          Design copied to clipboard. Paste it into the Webflow canvas (Ctrl+V / Cmd+V), then click Continue.
        </p>

        <DesignGrid designs={designs} />
        <FontWarning fonts={fonts} />
        <DebugLog />

        <div className="btn-group">
          <button className="btn btn-primary" onClick={onContinue}>Continue</button>
        </div>
      </div>
    );
  }

  const title = lastFailed ? 'Import incomplete' : 'Import complete';
  const titleColor = lastFailed ? 'var(--error)' : 'var(--accent)';
  const subtitle = buildSubtitle(steps);

  return (
    <div className="content">
      <h2 className="title" style={{ color: titleColor }}>{title}</h2>
      {subtitle && <p className="description">{subtitle}</p>}

      <DesignGrid designs={designs} />
      <FontWarning fonts={fonts} />
      <DebugLog />

      <div className="btn-group">
        {lastFailed && (
          <button className="btn btn-primary" onClick={onRetry}>Retry Import</button>
        )}
        <button className="btn btn-ghost" onClick={onImportAnother}>Import Another</button>
      </div>
    </div>
  );
}
