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

import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';
import uuid from 'react-uuid';
import PropTypes from 'prop-types';
import potrace from 'potrace';
import { MainSettings, QRSettings } from 'renderer/types';

export default function DownloadButton({ dark, settings }: { dark: boolean, settings: MainSettings }) {
  const [darkMode, setDarkMode] = useState<boolean>(dark);
  const [darkIconClass, setDarkIconClass] = useState<string>(
    'copy-icon header-stuff'
  );
  const [iconButtonClass, setIconButtonClass] = useState<string>(
    'button-icon header-stuff'
  );
  const [darkClass, setDarkClass] = useState<string>('header-stuff');
  const [mySettings, setMySettings] = useState<MainSettings>(settings);
  // const ref = useRef(null);

  useEffect(() => {
    setDarkMode(dark);
    if (dark) {
      setDarkIconClass('copy-icon header-stuff-dark');
      setIconButtonClass('button-icon header-stuff-dark');
      setDarkClass('header-stuff-dark');
    } else {
      setDarkClass('copy-icon header-stuff');
      setIconButtonClass('button-icon header-stuff');
      setDarkClass('header-stuff');
    }
  }, [dark]);

  useEffect(() => {
    setMySettings(settings);
  }, [settings]);

  const saveSVG = () => {
    const canvas = document.getElementById(
      'react-qrcode-logo'
    ) as HTMLCanvasElement;
    const params = {
      background: mySettings.QRSettings.XParent ? "none" : mySettings.QRSettings.QRProps?.bgColor,
      color: mySettings.QRSettings.QRProps?.fgColor,
    };
    const dataURL = canvas?.toDataURL(`image/${mySettings.QRSettings.QRType}`);
    potrace.trace(dataURL, params, function (err: any, svg: any) {
      if (err) throw err;
      window.electronAPI
        .saveSVG(svg)
        .then((result) => {
          return '';
        })
        .catch((error: unknown) => {
          console.log(`Error: ${error}`);
        });
    });
  };

  const onDownloadClick = () => {
    if (mySettings.QRSettings.QRType === 'svg') {
      saveSVG();
      return;
    }
    const canvas = document.getElementById(
      'react-qrcode-logo'
    ) as HTMLCanvasElement;
    const dataURL = canvas?.toDataURL(`image/${mySettings.QRSettings.QRType}`);
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `qrcode-${uuid()}.${mySettings.QRSettings.QRType}`;
    a.click();
  };

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="download-qr-tooltip">Download your QR Code</Tooltip>
      }
    >
      <Button
        variant={darkMode ? 'icon-only-dark' : 'icon-only'}
        size="sm"
        onClick={onDownloadClick}
        className={darkClass}
        style={{ float: 'right', alignItems: 'center' }}
      >
        <Download
          className={darkClass}
          color={darkMode ? '#adb5bd' : '#0B263E'}
        />
      </Button>
    </OverlayTrigger>
  );
}

DownloadButton.propTypes = {
  dark: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired,
};
