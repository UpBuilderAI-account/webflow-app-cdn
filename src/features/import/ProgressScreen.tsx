import type { ImportStep } from '../../bridge-client';

interface ProgressScreenProps {
  steps: ImportStep[];
}

export function ProgressScreen({ steps }: ProgressScreenProps) {
  const totalSteps = steps.length;
  const doneSteps = steps.filter(s => s.status === 'done' || s.status === 'skipped').length;
  const runningStep = steps.find(s => s.status === 'running');

  // Calculate progress: use asset-level count if available (e.g. "3/12"), else step-level
  let percent = 0;
  let countText: string | null = null;

  if (runningStep?.count) {
    const parts = runningStep.count.split('/');
    if (parts.length === 2) {
      const current = parseInt(parts[0], 10);
      const total = parseInt(parts[1], 10);
      if (total > 0) {
        // Blend: completed steps + fraction of current step
        percent = Math.round(((doneSteps + current / total) / totalSteps) * 100);
        countText = `${current}/${total}`;
      }
    }
  }

  if (!countText) {
    percent = totalSteps > 0
      ? Math.round(((doneSteps + (runningStep ? 0.5 : 0)) / totalSteps) * 100)
      : 0;
  }

  const statusText = runningStep?.detail || runningStep?.label || 'Importing...';

  return (
    <div className="content center vcenter">
      <div className="connect-inner">
        <p className="progress-status">{statusText}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        {countText && (
          <p className="progress-text text-center">{countText}</p>
        )}
      </div>
    </div>
  );
}
