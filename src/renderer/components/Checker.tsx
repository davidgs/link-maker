import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import uuid from 'react-uuid';

export default function Checker({
  state,
  label,
  tooltip,
  disabled,
  callback,
}: {
  state: boolean;
  label: string;
  tooltip: string;
  disabled: boolean;
  callback: (value: boolean) => void;
}): JSX.Element {
  const [stateValue, setStateValue] = useState<boolean>(state);
  const myuid = uuid();
  useEffect(() => {
    setStateValue(state);
  }, [state]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingTop: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '200px',
          fontSize: '14px',
          paddingTop: '2px'
        }}
      >
        <strong>{label}</strong>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '10px',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '50px',
        }}
      >
        <OverlayTrigger
          placement="auto"
          delay={{ show: 250, hide: 300 }}
          overlay={<Tooltip id="qr-only-tooltip">{tooltip}</Tooltip>}
        >
          <div className="round">
            <input
              type="checkbox"
              checked={stateValue}
              id={`checkbox-${myuid}`}
              disabled={disabled}
              onChange={(e) => {
                callback(e.target.checked);
              }}
            />
            <label htmlFor={`checkbox-${myuid}`}></label>
          </div>
        </OverlayTrigger>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '20px',
        }}
      />
    </div>
  );
}
