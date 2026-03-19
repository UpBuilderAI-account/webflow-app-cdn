interface ProgressBarProps {
  percent: number;
  text?: string;
}

export function ProgressBar({ percent, text }: ProgressBarProps) {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      {text && <p className="progress-text">{text}</p>}
    </div>
  );
}
