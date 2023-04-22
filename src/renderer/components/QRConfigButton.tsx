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
import { Gear, GearFill } from 'react-bootstrap-icons';
import QRConfigForm from 'renderer/configuration/QRConfigForm';
import { MainSettings, QRSettings } from 'renderer/types';

export default function QRConfigButton(
  {dark, settings, callback}: {dark: boolean, settings: MainSettings, callback: (settings: MainSettings) => void}
): JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [darkIconClass, setDarkIconClass] = useState<string>('copy-icon');
  const [iconButtonClass, setIconButtonClass] = useState<string>('button-icon');
  const [darkClass, setDarkClass] = useState<string>('');
  const [mainConfig, setMainConfig] = useState<MainSettings>(settings);


  const showConfigWindow = () => {
    setShowConfig(!showConfig);
  };

  const setQRSize = (size: number) => {
    const qrS: MainSettings = { ...mainConfig } as MainSettings;
    qrS.QRSettings.QRProps.size = size;
    setMainConfig(qrS);
    callback(qrS);
  };

  const setFileExt = (ext: string) => {
    const qrS: MainSettings = { ...mainConfig } as MainSettings;
    qrS.QRSettings.QRType = ext;
    setMainConfig(qrS);
    callback(qrS);
  };

  useEffect(() => {
    setDarkMode(dark);
    if (dark) {
      setDarkIconClass('header-stuff-dark');
      setIconButtonClass('button-icon header-stuff-dark');
      setDarkClass('header-stuff-dark');
    } else {
      setDarkClass('header-stuff');
      setIconButtonClass('button-icon header-stuff');
      setDarkClass('header-stuff');
    }
  }, [dark]);

  return (
    <div>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="adjust-qr-tooltip">Adjust your QR Code</Tooltip>}
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
      <QRConfigForm
        show={showConfig}
        qrSettings={mainConfig.QRSettings as QRSettings}
        sizeCallback={setQRSize}
        extensionCallback={setFileExt}
        onHide={showConfigWindow}
        dark={darkMode}
      />
    </div>
  );
}
