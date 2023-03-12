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
import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import { FloatingLabel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { UtmObj, UtmKeyValue } from './types';

export default function UTMChoice({
  valueChanged,
  targetType,
  enabled,
  id,
  settings,
  selected,
}: {
  valueChanged: (value: string) => void;
  targetType: string;
  enabled: boolean;
  id: string;
  settings: UtmObj;
  selected: string;
}): JSX.Element {
  const [label, setLabel] = useState<string>('');
  const [values, setValues] = useState<UtmKeyValue[]>([{ key: '', value: '' }]);
  const [tooltip, setTooltip] = useState<string>('');
  const [ariaLabel, setAriaLabel] = useState<string>('');
  const [errorLabel, setErrorLabel] = useState<string>('');
  const [showName, setShowName] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [enableChoice, setEnableChoice] = useState<boolean>(true);
  const [choices, setChoices] = useState<JSX.Element[]>([]);
  const [displayValue, setDisplayValue] = useState<string>('');
  const ref = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
  function getGroups(vals: UtmKeyValue[]): JSX.Element[] {
    // eslint-disable-next-line no-undef
    const groups: JSX.Element[] = [];
    const def = enableChoice ? 'Choose one ...' : 'Choose a Term first';
    groups.push(
      <option key={`${targetType}-default`} value="">
        {def}
      </option>
    );
    // eslint-disable-next-line array-callback-return
    vals.map((val: UtmKeyValue) => {
      groups.push(
        <option key={`${targetType}-${val.key}`} id={val.key} value={val.value}>
          {val.value}
        </option>
      );
    });
    return groups;
  }

  const selectedValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target?.value === 'Choose one ...') {
      valueChanged('');
      return;
    }
    if (e.target?.value === 'Choose a Term first') {
      valueChanged('');
      return;
    }
    setDisplayValue(e.target?.value);
  };

  const setDisplayString = (value: string): string => {
    const disp = settings.value.find((val) => val.key === value);
    if (disp) {
      return disp.value;
    }
    return '';
  };

  // get the configuration
  useEffect(() => {
    setAriaLabel(settings.ariaLabel);
    setLabel(settings.label);
    setErrorLabel(settings.error);
    setShowName(settings.showName);
    setTooltip(settings.tooltip);
    setValues(settings.value);
    setChoices(getGroups(settings.value));
    setDisplayValue(setDisplayString(selected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, selected]);

  useEffect(() => {
    setEnableChoice(enabled);
  }, [enabled]);

  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
      <FloatingLabel label={showName ? `${label} (${targetType})` : label}>
        <Form.Select
          required
          ref={ref}
          aria-label={showName ? `${ariaLabel} (${targetType})` : ariaLabel}
          id={targetType}
          disabled={!enableChoice}
          onChange={(eventKey) => {
            if (eventKey.target.value === 'Choose one ...') {
              valueChanged('');
              return;
            }
            if (eventKey.target.value === 'Choose a Term first') {
              valueChanged('');
              return;
            }
            valueChanged(
              eventKey.target[eventKey.target.selectedIndex].id // value.replace(/ /g, '-').toLowerCase()
            );
            selectedValue(eventKey);
          }}
          value={displayValue}
        >
          {choices}
        </Form.Select>
      </FloatingLabel>
    </OverlayTrigger>
  );
}

UTMChoice.propTypes = {
  valueChanged: PropTypes.func.isRequired,
  targetType: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    ariaLabel: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    showName: PropTypes.bool.isRequired,
    tooltip: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  selected: PropTypes.string.isRequired,
};
