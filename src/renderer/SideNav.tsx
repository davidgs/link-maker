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
import './hyde.css';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Button,
} from 'react-bootstrap';
import PasswordForm from './configuration/PasswordForm';
import StarTree from '../../assets/images/NewLinkerLogo.png';
import { Lightbulb, LightbulbFill, Gear, GearFill } from 'react-bootstrap-icons';
import { defaultMainSettings, MainSettings } from './types';
import PropTypes from 'prop-types';
import ImgElement from './components/ImgElement';
import spinner from '../../assets/images/loading.png';

export default function SideNav({
  callback,
  dark,
  propogateDarkMode,
}: {
  callback: (value: boolean) => void;
  dark: boolean;
  propogateDarkMode: (value: boolean) => void;
}) {
  const [showPasswd, setShowPasswd] = useState(false);
  const [darkMode, setDarkMode] = useState(dark);
  const [mainConfig, setMainConfig] = useState<MainSettings>(defaultMainSettings);
  const [mainImage, setMainImage] = useState<string>('');
  const [updateText, setUpdateText] = useState<string>('');

  const passwdVisible = (show: boolean) => {
    setShowPasswd(show);
  };

  window?.electron?.ipcRenderer?.on('message', (event) => {
    console.log(`Raw Message: ${event}`);

    // const m: CardData = JSON.parse(message.toString());
    setUpdateText(event as string);
    console.log(`Formatted Message: ${event}`);
  });

  useEffect(() => {
    window.electronAPI
      .getMainConfig()
      .then((response: string) => {
        const config = JSON.parse(response);
        setMainConfig(config);
        if(config.brandImageFile !== undefined && config.brandImageFile !== null && config.brandImageFile !== '') {
          window.electronAPI
            .loadFile(config.brandImageFile)
            .then((response: string) => {
              const fType = config.brandImageFile.split('.').pop();
              const image = Buffer.from(response, 'base64').toString('base64');
              setMainImage(`data:image/${fType};base64,${image}`);
            })
            .catch((error: unknown) => {
              console.log(`Error: ${error}`);
            });
        }})
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, []);


  useEffect(() => {
    setDarkMode(dark);
  }, [dark]);

  const saveDarkMode = (darkB: boolean) => {
    propogateDarkMode(darkB);
  };

  const toggleDark = () => {
    saveDarkMode(!darkMode);
  };
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      <aside className="theme-base-09 sidebar">
        <p />
        <p />
        <div style={{ textAlign: 'center' }}>
          <a href="https://davidgs.com/" target="_blank" rel="noreferrer">
            {mainImage ? (
              <ImgElement
                byteString={mainImage}
                width={mainConfig.brandWidth as number}
                height={mainConfig.brandHeight as number}
                alt="UTM Linker Logo"
              />
            ) : (
              <img
                src={StarTree}
                alt="UTM Linker Logo"
                width={
                  mainConfig.brandWidth > 0
                    ? `${mainConfig.brandWidth}px`
                    : '75%'
                }
                height={
                  mainConfig.brandHeight > 0
                    ? `${mainConfig.brandHeight}px`
                    : 'auto'
                }
              />
            )}
          </a>
        </div>
        <p />
        <div className="container sidebar-sticky">
          <div className="sidebar-about">
            <div>
              <p className="lead">
                Developed By:
                <br />
                <span className="sidebar-contact">
                  <a href="mailto:davidgs@startree.ai?Subject=UTM Link Builder">
                    David G. Simmons
                  </a>
                </span>
              </p>
            </div>
          </div>
          <nav>
            <ul className="sidebar-nav">
              <li>
                • <a href="https://davidgs.com">Home</a>{' '}
              </li>
              <li>
                • <a href="https://github.com/davidgs/"> Github </a>
              </li>
            </ul>
          </nav>
          <p>
            &copy; David G. Simmons 2023
            <br />
            All rights reserved
          </p>
          <Form>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: "row" }}>
              <div style={{ width: '10%', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 300 }}
                  overlay={
                    <Tooltip id="config-tooltip">
                      Turn {darkMode ? 'off' : 'on'} Dark Mode
                    </Tooltip>
                  }
                >
                <Button
                  type="button"
                  size={'sm'}
                  onClick={toggleDark}
                  className="btn"
                  style={{
                    backgroundColor: '#0A1C2E',
                    borderColor: '#0A1C2E',
                  }}
                >
                  {darkMode ? (
                    <LightbulbFill size={20} />
                  ) : (
                    <Lightbulb size={20} />
                  )}
                </Button>
                </OverlayTrigger>
              </div>
              <div style={{ width: '80%', textAlign: 'left', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="update-container" style={{marginTop: '10px'}}>
                  {
                    updateText !== '' && updateText.startsWith('Checking') ? (
                      <div style={{textAlign: 'left'}}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <img src={spinner} alt="spinner" width="10px" className='glyphicon-refresh-animate' style={{paddingTop: '-.25rem'}}/> {updateText}
                      </div>
                    ) : <div id={updateText.length > 25 ? "update-text" : "udt"}>{updateText}</div>}
                </div>
            </div>
              <div style={{ width: '10%', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 300 }}
                  overlay={
                    <Tooltip id="config-tooltip">
                      Edit the Configuration of fields, images and the QR Code
                    </Tooltip>
                  }
                >
                  <Button
                    variant={'config-btn-icon-only-dark'}
                    className="configSwitch"
                    id="custom-switch"
                    style={{ opacity: 1.0, zIndex: 1000}}
                    key="config-switch"
                    aria-label="Edit Configuration"
                    onClick={(e) => {
                      passwdVisible(!showPasswd);
                    }}
                    size={'sm'}
                  >
                    {dark ? <GearFill size={20} /> : <Gear size={20} />}
                  </Button>
                </OverlayTrigger>
              </div>
              <Col sm={1} />
            </div>
          </Form>
        </div>
      </aside>
      <PasswordForm
        show={showPasswd}
        darkMode={darkMode}
        callback={(value: boolean) => {
          callback(value);
          setShowPasswd(false);
        }}
      />
    </div>
  );
}

SideNav.propTypes = {
  callback: PropTypes.func.isRequired,
  dark: PropTypes.bool.isRequired,
  propogateDarkMode: PropTypes.func.isRequired,
};
