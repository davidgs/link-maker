/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BitlyConfig } from './types';

export default function BitlyCheck({
  useMe,
  bitlyEnabled,
  valueChanged,
  targetType,
}: {
  useMe: boolean;
  bitlyEnabled: boolean;
  valueChanged: (value: boolean) => void;
  targetType: string;
}): JSX.Element {
  const [ariaLabel, setAriaLabel] = useState('');
  const [label, setLabel] = useState('');
  const [tooltip, setTooltip] = useState('');

  // get the configuration
  useEffect(() => {
    window.electronAPI
      .getParams(targetType)
      .then((response: string) => {
        const c: BitlyConfig = JSON.parse(response);
        setAriaLabel(c.ariaLabel);
        setLabel(c.label);
        setTooltip(c.tooltip);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, [targetType]);

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 300 }}
      overlay={<Tooltip id="bitly-tooltip">{tooltip}</Tooltip>}
    >
      <Form.Check
        type="switch"
        id="bitly-switch"
        key={`${targetType}-switch`}
        label={label}
        aria-label={ariaLabel}
        checked={useMe}
        disabled={!bitlyEnabled}
        style={{ float: 'left' }}
        onChange={(e) => {
          valueChanged(e.target.checked);
        }}
      />
    </OverlayTrigger>
  );
}

BitlyCheck.propTypes = {
  valueChanged: PropTypes.func.isRequired,
  targetType: PropTypes.string.isRequired,
  useMe: PropTypes.bool.isRequired,
  bitlyEnabled: PropTypes.bool.isRequired,
};
