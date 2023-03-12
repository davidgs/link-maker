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
import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import uuid from 'react-uuid';
import PropTypes from 'prop-types';
import { LinkData } from './types';

export default function HistoryChooser({
  history,
  dark,
  callback,
}: {
  history: LinkData[];
  dark: boolean;
  callback: (value: string) => void;
}): JSX.Element {
  const [historyList, setHistoryList] = useState<LinkData[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(dark);
  const [darkClass, setDarkClass] = useState<string>('header-stuff');
  const [textStyle, setTextStyle] = useState<string>(`style={{ color: '#adb5bd'}}`);
  const lightStyle = { color: '#0B3665' };
  const displayValue = 'History...';
  useEffect(() => {
    setHistoryList(history);
  }, [history]);

  useEffect(() => {
    setDarkMode(dark);
    dark ? setDarkClass('header-stuff-dark') : setDarkClass('header-stuff');
    dark ? setTextStyle(`style={{ color: '#adb5bd'}}`) : setTextStyle(`style={{ color: '#0B3665'}}`);
  }, [dark]);

  const items = historyList.map((item: LinkData) => {
    return (
      <Dropdown.Item
        color={darkMode ? '#adb5bd' : '#0B3665'}
        id={`${item.uuid}`}
        key={`${item.uuid}`}
        value={item.uuid}
        eventKey={item.uuid}
        className={darkClass}
      >
        {item.shortLink ? item.shortLink : item.longLink}
      </Dropdown.Item>
    );
  });

  const valueChanged = (eventKey: string) => {
    callback(eventKey as string);
  };

  return (
    <>
      <OverlayTrigger
        placement="auto"
        overlay={<Tooltip>All of your saved links</Tooltip>}
      >
        <DropdownButton
          variant={darkMode ? 'icon-only-dark' : 'icon-only'}
          size="sm"
          color={darkMode ? '#adb5bd' : '#0B3665'}
          className={darkClass}
          id="dropdown-basic-button"
          title={displayValue}
          onSelect={(eventKey) => {
            valueChanged(eventKey as string);
          }}
        >
          <Dropdown.Item
            style={{ color: 'red' }}
            id={`clear-list-${uuid()}`}
            key={`clear-list-${uuid()}`}
            eventKey={'clear-history'}
            value={'clear-history'}
          >
            Clear History
          </Dropdown.Item>
          {items}
        </DropdownButton>
      </OverlayTrigger>
    </>
  );
}

HistoryChooser.propTypes = {
  history: PropTypes.arrayOf(PropTypes.object).isRequired,
  dark: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};
