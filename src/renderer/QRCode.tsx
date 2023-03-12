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
  useRef,
  KeyboardEventHandler,
} from 'react';
import { QRCode, IProps } from 'react-qrcode-logo';
import { Button, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { ClipboardData, Clipboard2CheckFill } from 'react-bootstrap-icons';
import uuid from 'react-uuid';
import QRConfigForm from './configuration/QRConfigForm';
import logo from '../../assets/images/logo-mark_fill.png';
import { defaultQRSettings, DefaultQRStyle, QRSettings } from './types';
import { Gear, GearFill, Download } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import potrace from 'potrace';

export default function QCode({
  link,
  ext,
  qrOnly,
  dark
}: {
  link: string;
  ext: string;
  qrOnly: boolean;
  dark: boolean;
}) {
  const [fileExt, setFileExt] = useState<string>('png');
  const [dataLink, setDataLink] = useState<string>('https://example.com/');
  const [copied, setCopied] = useState<boolean>(false);
  const [qrSettings, setQRSettings] = useState<QRSettings>(defaultQRSettings);
  const [qrSize, setQRSize] = useState<number>(220);
  const [qrState, setQrState] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(dark);
  const [darkIconClass, setDarkIconClass] = useState<string>('copy-icon header-stuff');
  const [iconButtonClass, setIconButtonClass] = useState<string>('button-icon header-stuff');
  const [darkClass, setDarkClass] = useState<string>('header-stuff');
  const ref = useRef(null);

  useEffect(() => {
    setDarkMode(dark);
    dark ? setDarkIconClass('copy-icon header-stuff-dark') : setDarkClass('copy-icon header-stuff');
    dark ? setIconButtonClass('button-icon header-stuff-dark') : setIconButtonClass('button-icon header-stuff');
    dark ? setDarkClass('header-stuff-dark') : setDarkClass('header-stuff');
  }, [dark]);

  useEffect(() => {
    window.electronAPI
      .getQRSettings()
      .then((result) => {
        const qrS: QRSettings = JSON.parse(result);
        const qr = {...qrS.QRProps};
        qr.logoImage = logo;
        setQRSettings(qrS);
        setFileExt(qrS.QRType);
        setQRSize(qrS.QRProps?.size ? qrS.QRProps.size : 220);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
   }, []);

   const saveSVG = () => {
      const canvas = document.getElementById(
        'react-qrcode-logo'
      ) as HTMLCanvasElement;
      const params = {
        background: qrSettings.QRProps?.bgColor,
        color: '#0B263E',
      };
      const dataURL = canvas?.toDataURL(`image/${fileExt}`);
      // const a = document.createElement('a');
      // a.href = dataURL;
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
    if(qrSettings.QRType === 'svg') {
      saveSVG();
      return;
    }
    const canvas = document.getElementById(
      'react-qrcode-logo'
    ) as HTMLCanvasElement;
    const dataURL = canvas?.toDataURL(`image/${fileExt}`);
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `qrcode-${uuid()}.${fileExt}`;
    a.click();
  };

  const showConfigWindow = () => {
    setShowConfig(!showConfig);
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

  const updateQRProps = (link: string) => {
    const qSet: QRSettings = {...qrSettings};
    const qrProps: IProps = {...qSet.QRProps};
    qrProps.value = link;
    qrProps.logoImage = logo;
    qSet.QRProps = qrProps;
    setQRSettings(qSet);
  };

  useEffect(() => {
    setDataLink(link);
    updateQRProps(link);
    setCopied(false);
  }, [link]);

  useEffect(() => {
    setQrState(qrOnly);
  }, [qrOnly]);

  return (
    <div>
      <div className="alert-columns">
        <div className="alert-column1">
          {copied && (
            <OverlayTrigger
              delay={{ show: 250, hide: 400 }}
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
              delay={{ show: 250, hide: 400 }}
              rootClose
              overlay={
                <Tooltip id="alert-tooltip">
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
            delay={{ show: 250, hide: 400 }}
            rootClose
            overlay={
              <Tooltip id="alert-tooltip">
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
              delay={{ show: 250, hide: 400 }}
              rootClose
              overlay={
                <Tooltip id="qrcode-tooltip">
                  Click the QR Code or the &lsquo;Download&rsquo; button to save
                  the QR Code
                </Tooltip>
              }
            >
              <div
                ref={ref}
                onClick={onDownloadClick}
                onKeyDown={null as unknown as KeyboardEventHandler}
                role="button"
                tabIndex={-1}
              >
                <QRCode
                  id="react-qrcode-logo"
                  value={qrSettings.QRProps.value}
                  size={qrSize}
                  bgColor={qrSettings.QRProps.bgColor}
                  fgColor={qrSettings.QRProps.fgColor}
                  logoImage={qrSettings.QRProps.logoImage}
                  qrStyle={qrSettings.QRProps.qrStyle}
                  logoWidth={qrSettings.QRProps.logoWidth}
                  logoHeight={qrSettings.QRProps.logoHeight}
                  logoOpacity={qrSettings.QRProps.logoOpacity}
                  eyeColor={qrSettings.QRProps.eyeColor}
                  eyeRadius={qrSettings.QRProps.eyeRadius}
                  quietZone={qrSettings.QRProps.quietZone}
                  enableCORS={qrSettings.QRProps.enableCORS}
                  ecLevel={qrSettings.QRProps.ecLevel}
                />
              </div>
            </OverlayTrigger>
          </Row>
          <Row style={{ textAlign: 'center', margin: 'auto' }}>
            <Col sm="8"  />
            <Col sm="2">
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip id='download-qr-tooltip'>Download your QR Code</Tooltip>}
              >
                <Button
                  variant={darkMode ? 'icon-only-dark' : 'icon-only'}
                  size="sm"
                  onClick={onDownloadClick}
                  className={darkClass}
                >
                  <Download
                    className={darkClass}
                    color={darkMode ? '#adb5bd' : '#0B263E'}
                  />
                </Button>
              </OverlayTrigger>
            </Col>
            <Col sm="2">
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip id='adjust-qr-tooltip'>Adjust your QR Code</Tooltip>}
              >
                <Button
                  variant={darkMode ? 'icon-only-dark' : 'icon-only'}
                  size="sm"
                  onClick={showConfigWindow}
                  className={darkClass}
                >
                  {darkMode ? (
                    <Gear className={darkClass} />
                  ) : (
                    <GearFill className={darkClass} />
                  )}
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
        </div>
        <QRConfigForm
          show={showConfig}
          qrSettings={qrSettings}
          sizeCallback={setQRSize}
          extensionCallback={setFileExt}
          onHide={showConfigWindow}
        />
      </div>
    </div>
  );
}

QCode.propTypes = {
  link : PropTypes.string.isRequired,
  ext : PropTypes.string.isRequired,
  qrOnly : PropTypes.bool.isRequired,
  dark: PropTypes.bool.isRequired
};
