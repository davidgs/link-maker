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
import { Lightbulb, LightbulbFill } from 'react-bootstrap-icons';
import { defaultMainSettings, MainSettings } from './types';
import PropTypes from 'prop-types';
import ImgElement from './components/ImgElement';

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

  const passwdVisible = (show: boolean) => {
    setShowPasswd(show);
  };

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
        <div style={{ textAlign: 'center'}}>
        <a href="https://davidgs.com/" target="_blank" rel="noreferrer">
          {mainImage ? (
            <ImgElement byteString={mainImage} width={mainConfig.brandWidth as number} height={mainConfig.brandHeight as number} alt='UTM Linker Logo'/> ) : (
            <img src={StarTree} alt="UTM Linker Logo" width={mainConfig.brandWidth > 0 ? `${mainConfig.brandWidth}px` : "75%"} height={mainConfig.brandHeight > 0 ? `${mainConfig.brandHeight}px` : 'auto'} />
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
            <Row>
              <Col sm={2}>
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
              </Col>
              <Col sm={2}></Col>
              <Col sm={7}>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="config-tooltip">
                      Edit the Configuration
                    </Tooltip>
                  }
                >
                  <Form.Check
                    type="switch"
                    className="configSwitch"
                    id="custom-switch"
                    key="config-switch"
                    label="Edit Configuration"
                    aria-label="Edit Configuration"
                    checked={showPasswd}
                    onChange={(e) => {
                      passwdVisible(e.target.checked);
                    }}
                  />
                </OverlayTrigger>
              </Col>
              <Col sm={1}></Col>
            </Row>
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
