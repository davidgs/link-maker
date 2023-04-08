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
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import {
  FloatingLabel,
  FormControl,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { UtmObj } from './types';

function UTMTextField({
  valueChanged,
  targetType,
  enableMe,
  qrOnly,
  value,
}: {
  valueChanged: (value: string) => void;
  targetType: string;
  enableMe: boolean;
  qrOnly: boolean;
  value: string;
}): JSX.Element {
  const [ariaLabel, setAriaLabel] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [errorLabel, setErrorLabel] = useState<string>('');
  const [showName, setShowName] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<string>('');
  const [enableChoice, setEnableChoice] = useState<boolean>(true);
  const [tType, setTType] = useState<string>(targetType);
  const [qrOnlyState, setQrOnlyState] = useState<boolean>(qrOnly);
  const [myValue, setMyValue] = useState<string>(value || '');

  // get the configuration
  useEffect(() => {
    window.electronAPI
      .getParams(targetType)
      .then((response: string) => {
        const c: UtmObj = JSON.parse(response);
        setAriaLabel(c.ariaLabel);
        setLabel(c.label);
        setErrorLabel(c.error);
        setShowName(c.showName);
        setTooltip(c.tooltip);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
    setTType(targetType);
  }, [targetType]);

  useEffect(() => {
    if (value && value !== 'https://www.example.com/') {
      setMyValue(value);
      setEnableChoice(true);
    }
  }, [value]);

  useEffect(() => {
    setEnableChoice(enableMe);
  }, [enableMe]);

  useEffect(() => {
    setQrOnlyState(qrOnly);
  }, [qrOnly]);

  return (
    <>
    <style type="text/css">
        {`
    .form-floating-txt:not(.form-control:disabled)::before  {
      background-color: var(--bs-secondary-bg);
    }`}</style>
      <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 300 }}
      overlay={<Tooltip id={`${targetType}-tooltip`}>{tooltip}</Tooltip>}>
        <FloatingLabel
          label={
            // eslint-disable-next-line no-nested-ternary
            qrOnly
              ? `Enter Data to encode`
              : showName
              ? `${label} (${tType})`
              : `${label}`
          }
          className={!enableChoice ? 'form-control-dgs form-floating-txt' : ''}
          style={{ backgroundColor: 'none' }}
        >
          <FormControl
            required
            className={'form-control-dgs form-control'}
            type="text"
            disabled={!enableChoice}
            id={`${targetType}-target`}
            aria-label={ariaLabel}
            aria-describedby={tooltip}
            value={myValue}
            onChange={(eventKey) => {
              if (!qrOnlyState) {
                setMyValue(eventKey.target.value);
                valueChanged(
                  eventKey.target.value.replace(/ /g, '-').toLowerCase()
                );
              } else {
                valueChanged(eventKey.target.value);
              }
            }}
          />
        </FloatingLabel>
      </OverlayTrigger>
      <Form.Control.Feedback type="invalid">{errorLabel}</Form.Control.Feedback>
    </>
  );
}

UTMTextField.propTypes = {
  valueChanged: PropTypes.func.isRequired,
  targetType: PropTypes.string.isRequired,
  enableMe: PropTypes.bool.isRequired,
};

export default UTMTextField;
