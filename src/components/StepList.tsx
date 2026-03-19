import type { ImportStep } from '../bridge-client';
import { CheckIcon, SpinnerIcon, WaitIcon, ErrorIcon, SkipIcon, PausedIcon } from '../utils/icons';

interface StepListProps {
  steps: ImportStep[];
}

function StepIcon({ status }: { status: string }) {
  switch (status) {
    case 'done': return <CheckIcon />;
    case 'running': return <SpinnerIcon />;
    case 'error': return <ErrorIcon />;
    case 'skipped': return <SkipIcon />;
    case 'paused': return <PausedIcon />;
    default: return <WaitIcon />;
  }
}

export function StepList({ steps }: StepListProps) {
  return (
    <div className="card mb-16">
      {steps.map(step => (
        <div key={step.id} className="design-row" style={{ opacity: step.status === 'waiting' ? 0.4 : 1 }}>
          <StepIcon status={step.status} />
          <span className="design-name" style={{ marginLeft: 8 }}>
            {step.label}
            {step.detail && <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}> — {step.detail}</span>}
          </span>
          {step.count && <span className="option-count">{step.count}</span>}
        </div>
      ))}
    </div>
  );
}
