import { useState, useCallback } from 'react';
import type { ProjectContext, ImportOptions } from '../../bridge-client';
import { ChevronDownIcon } from '../../utils/icons';

interface ReadyScreenProps {
  context: ProjectContext;
  onImport: (options: ImportOptions) => Promise<void>;
  onDisconnect: () => void;
}

export function ReadyScreen({ context, onImport, onDisconnect }: ReadyScreenProps) {
  const designs = context.designs || [];
  const count = designs.length || 1;
  const names = designs.length > 0 ? designs.map(d => d.name) : [context.designName];

  const [tagsOpen, setTagsOpen] = useState(false);
  const [syncAssets, setSyncAssets] = useState(context.assetCount > 0);
  const [createVariables, setCreateVariables] = useState(context.variableCount > 0);
  const [createCms, setCreateCms] = useState(false);

  const handleImport = useCallback(() => {
    onImport({
      syncAssets,
      createVariables,
      bindVariables: createVariables,
      createCms,
    });
  }, [onImport, syncAssets, createVariables, createCms]);

  return (
    <div className="content">
      <div
        className={`design-header${tagsOpen ? ' open' : ''}`}
        onClick={() => setTagsOpen(o => !o)}
      >
        <h2 className="title">Import {count} design{count !== 1 ? 's' : ''}</h2>
        <ChevronDownIcon />
      </div>

      <div className={`design-list${tagsOpen ? ' open' : ''}`}>
        {names.map(n => <span key={n} className="design-tag">{n}</span>)}
      </div>

      <div className="section-label">Options</div>
      <div className="card import-options mb-20">
        <div className={`option-row${context.assetCount === 0 ? ' disabled' : ''}`}>
          <label>
            <input
              type="checkbox"
              checked={syncAssets}
              disabled={context.assetCount === 0}
              onChange={e => setSyncAssets(e.target.checked)}
            />
            Import images
          </label>
          <span className="option-count">{context.assetCount}</span>
        </div>
        <div className={`option-row${context.variableCount === 0 ? ' disabled' : ''}`}>
          <label>
            <input
              type="checkbox"
              checked={createVariables}
              disabled={context.variableCount === 0}
              onChange={e => setCreateVariables(e.target.checked)}
            />
            Import color variables
          </label>
          <span className="option-count">{context.variableCount}</span>
        </div>
        <div className={`option-row${context.cmsCount === 0 ? ' disabled' : ''}`}>
          <label>
            <input
              type="checkbox"
              checked={createCms}
              disabled={context.cmsCount === 0}
              onChange={e => setCreateCms(e.target.checked)}
            />
            Import CMS collections
          </label>
          <span className="option-count">{context.cmsCount}</span>
        </div>
      </div>

      <div className="btn-group">
        <button className="btn btn-primary" onClick={handleImport}>Import</button>
        <button className="btn btn-danger-ghost" onClick={onDisconnect}>Disconnect</button>
      </div>
    </div>
  );
}
