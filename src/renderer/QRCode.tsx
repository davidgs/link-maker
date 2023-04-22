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
import React, {
  useEffect,
  useState,
  // useRef,
  KeyboardEventHandler,
} from 'react';
import { QRCode } from 'react-qrcode-logo';
import { OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { ClipboardData, Clipboard2CheckFill } from 'react-bootstrap-icons';
import uuid from 'react-uuid';
import { MainSettings, QRSettings } from './types';
import PropTypes from 'prop-types';
import potrace from 'potrace';

export default function QCode({
  link,
  dark,
  settings
}: {
  link: string;
  dark: boolean;
  settings: MainSettings;
}) {
  const [dataLink, setDataLink] = useState<string>('https://example.com/');
  const [copied, setCopied] = useState<boolean>(false);
  const [mySettings, setMySettings] = useState<MainSettings>(settings);
  const [qrState, setQrState] = useState<boolean>(false);
  const [qrImage, setQrImage] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(dark);
  const [darkIconClass, setDarkIconClass] = useState<string>(
    'copy-icon header-stuff'
  );
  const [iconButtonClass, setIconButtonClass] = useState<string>(
    'button-icon header-stuff'
  );
  const [darkClass, setDarkClass] = useState<string>('header-stuff');
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
      background: mySettings.QRSettings.QRProps?.bgColor,
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

  // Copy link to the clipboard and change the icon to a checkmark
  function copyMe(): void {
    setCopied(!copied);
    navigator.clipboard
      .writeText(dataLink)
      .then(null, null)
      // eslint-disable-next-line no-console
      .catch((err) => console.error('Error: ', err));
  }

  useEffect(() => {
    setDataLink(link);
    setCopied(false);
  }, [link]);


  return (
    <div>
      <div className="alert-columns">
        <div className="alert-column1">
          {copied && (
            <OverlayTrigger
              delay={{ show: 250, hide: 300 }}
              rootClose
              overlay={
                <Tooltip id="alert-tooltip">
                  You have successfully copied the link!
                </Tooltip>
              }
            >
              <Clipboard2CheckFill
                className={darkIconClass}
                style={{
                  fontSize: '2rem',
                  color: darkMode ? '#adb5bd' : '#0B263E',
                }}
              />
            </OverlayTrigger>
          )}
          {!copied && (
            <OverlayTrigger
              placement="auto"
              delay={{ show: 250, hide: 300 }}
              rootClose
              overlay={
                <Tooltip id="alert-copied-tooltip">
                  Click here to copy your link!
                </Tooltip>
              }
            >
              <ClipboardData
                className={darkIconClass}
                style={{
                  fontSize: '2rem',
                  color: darkMode ? '#adb5bd' : '#0B263E',
                }}
                tabIndex={0}
                cursor="pointer"
                role="button"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={copyMe}
                // eslint-disable-next-line react/jsx-no-bind
                onKeyDown={null as unknown as KeyboardEventHandler}
                title="Click to copy your link!"
              />
            </OverlayTrigger>
          )}
        </div>
        <div className="alert-column2">
          <OverlayTrigger
            placement="auto"
            delay={{ show: 250, hide: 300 }}
            rootClose
            overlay={
              <Tooltip id="alert-copy-link-tooltip">
                {qrState
                  ? 'This data is encoded in the QR Code'
                  : 'Click here to copy your link!'}
              </Tooltip>
            }
          >
            <div
              onClick={copyMe}
              onKeyDown={null as unknown as KeyboardEventHandler}
              role="button"
              tabIndex={0}
            >
              <strong style={{ cursor: 'pointer' }} className={darkClass}>
                {link}
              </strong>
            </div>
          </OverlayTrigger>
        </div>
        <div className="alert-column3">
          <Row style={{ margin: 'auto' }}>
            <OverlayTrigger
              placement="auto"
              delay={{ show: 250, hide: 300 }}
              rootClose
              overlay={
                <Tooltip id="qrcode-tooltip">
                  Click the QR Code or the &lsquo;Download&rsquo; button to save
                  the QR Code
                </Tooltip>
              }
            >
              <div
                // ref={ref}
                onClick={onDownloadClick}
                onKeyDown={null as unknown as KeyboardEventHandler}
                role="button"
                tabIndex={-1}
              >
                <QRCode
                  id="react-qrcode-logo"
                  value={mySettings.QRSettings.QRProps.value}
                  size={mySettings.QRSettings.QRProps.size}
                  bgColor={mySettings.QRSettings.QRProps.bgColor}
                  fgColor={mySettings.QRSettings.QRProps.fgColor}
                  logoImage={qrImage}
                  qrStyle={mySettings.QRSettings.QRProps.qrStyle}
                  logoWidth={mySettings.QRSettings.QRProps.logoWidth}
                  logoHeight={mySettings.QRSettings.QRProps.logoHeight}
                  logoOpacity={mySettings.QRSettings.QRProps.logoOpacity}
                  eyeColor={mySettings.QRSettings.QRProps.eyeColor}
                  eyeRadius={mySettings.QRSettings.QRProps.eyeRadius}
                  quietZone={mySettings.QRSettings.QRProps.quietZone}
                  enableCORS={mySettings.QRSettings.QRProps.enableCORS}
                  ecLevel={mySettings.QRSettings.QRProps.ecLevel}
                  logoPadding={mySettings.QRSettings.QRProps.logoPadding}
                  logoPaddingStyle={
                    mySettings.QRSettings.QRProps.logoPaddingStyle
                  }
                />
              </div>
            </OverlayTrigger>
          </Row>
        </div>
      </div>
    </div>
  );
}

QCode.propTypes = {
  link: PropTypes.string.isRequired,
  dark: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired,
};
