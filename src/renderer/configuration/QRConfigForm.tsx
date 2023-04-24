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
import React, { useState, useEffect, SyntheticEvent } from 'react';
import {
  Form,
  Button,
  Modal,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { QRSettings } from 'renderer/types';
import PropTypes from 'prop-types';
import { Gear, GearFill } from 'react-bootstrap-icons';
import { Knob, KnobChangeEvent } from 'primereact/knob';
import FileTypeSelector from 'renderer/components/FileTypeSelector';
import { ChangeEvent } from 'react';

export default function QRConfigForm({
  show,
  qrSettings,
  sizeCallback,
  extensionCallback,
  xParentCallback,
  onHide,
  dark
}: {
  show: boolean;
  qrSettings: QRSettings;
  sizeCallback: (size: number) => void;
  extensionCallback: (value: string) => void;
  xParentCallback: (value: boolean) => void;
  onHide: (value: boolean) => void;
  dark: boolean;
}): JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(show);
  const [myQRSettings, setMyQRSettings] = useState<QRSettings>(qrSettings);
  const [initSize, setInitSize] = useState<number>(220);
  const [initExtension, setInitExtension] = useState<string>('png');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    console.log('QRConfigForm useEffect showConfig: ', showConfig);
    setShowConfig(show);
    console.log('QRConfigForm useEffect show: ', show);
  }, [show]);

  useEffect(() => {
    setDarkMode(dark);
  }, [dark]);

  useEffect(() => {
    setMyQRSettings(qrSettings);
    setInitSize(qrSettings.QRProps?.size ? qrSettings.QRProps.size : 220);
    setInitExtension(qrSettings.QRType);
  }, [qrSettings]);

  const onSizeChange = (event: KnobChangeEvent) => {
    const qSet: QRSettings = { ...myQRSettings };
    const qProp = { ...qSet.QRProps };
    qProp.size = event.value;
    qSet.QRProps = qProp;
    setMyQRSettings(qSet);
    sizeCallback(event.value);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setShowConfig(false);
    window.electronAPI
      .getMainConfig()
      .then((config: string) => {
        const mainConfig = JSON.parse(config);
        mainConfig.QRSettings = myQRSettings;
        window.electronAPI
          .saveMainConfig(JSON.stringify(mainConfig))
          .then(() => {
            return '';
          })
          .catch((error: unknown) => {
            console.log(`Error: ${error}`);
          });
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
    onHide(true);
  };

  const handleCancel = () => {
    sizeCallback(initSize | 220);
    extensionCallback(initExtension);
    setShowConfig(false);
    onHide(false);
  };

  function handleExtChange(selectedFileType: string): void {
    const qSet: QRSettings = { ...myQRSettings };
    qSet.QRType = selectedFileType;
    setMyQRSettings(qSet);
    extensionCallback(selectedFileType);
    console.log(`Selected File Type: ${selectedFileType}`);
  }

  function onXparentChange(value: boolean) {
    console.log(`XParent: ${value}`)
    const qSet: QRSettings = { ...myQRSettings };
    qSet.XParent = value;
    setMyQRSettings(qSet);
  }

  return (
    <Modal
      show={showConfig}
      onHide={handleCancel}
      size="lg"
      dialogClassName="modal-90w"
      width="90vw"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>QR Code Configuration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm="4" style={{ paddingLeft: '1rem', paddingRight: '0px' }}>
              <Form.Group controlId="formBasicCheckbox">
                <OverlayTrigger
                  placement="auto"
                  delay={{ show: 250, hide: 300 }}
                  rootClose
                  overlay={
                    <Tooltip id="qrcode-tooltip">
                      Current size of the QR Code.
                    </Tooltip>
                  }
                >
                  <Form.Label
                    size="lg"
                    style={{ fontSize: 'large', marginTop: '15px' }}
                  >
                    Size: {myQRSettings.QRProps?.size}
                  </Form.Label>
                </OverlayTrigger>
              </Form.Group>
            </Col>
            <Col sm="5" style={{ paddingLeft: '-1rem' }}>
              <OverlayTrigger
                placement="auto"
                delay={{ show: 250, hide: 400 }}
                rootClose
                overlay={
                  <Tooltip id="qrcode-tooltip">
                    Adjust the size of your QR Code.
                  </Tooltip>
                }
              >
                <Knob
                  size={55}
                  name="eyeRadius-0-0"
                  className="p-knob"
                  value={
                    myQRSettings.QRProps?.size ? myQRSettings.QRProps.size : 220
                  }
                  min={100}
                  max={500}
                  strokeWidth={11}
                  textColor={darkMode ? 'white' : 'black'}
                  onChange={(e) => {
                    onSizeChange(e);
                  }}
                  valueColor={'#0B3665'}
                  rangeColor={'#21C6DC'}
                />
              </OverlayTrigger>
            </Col>
          </Row>
          <Row>
            <Col
              sm="4"
              style={{
                paddingLeft: '1rem',
                paddingRight: '0px',
                paddingTop: '15px',
              }}
            >
              <Form.Label size="lg" style={{ fontSize: 'large' }}>
                File Extension:{' '}
              </Form.Label>
            </Col>
            <Col sm="7" style={{ paddingLeft: '1rem' }}>
              <FileTypeSelector
                onSelectionChange={handleExtChange}
                setXparent={onXparentChange}
                fileType={myQRSettings.QRType}
                isXparent={myQRSettings.XParent}
              />
            </Col>
          </Row>
          {myQRSettings.QRType === 'svg' ? (
            <Row style={{ paddingTop: '15px' }} className={myQRSettings.QRType === 'svg' ? 'fade-component in' : 'fade-component'}>
              <Col sm="4" style={{ paddingLeft: '1rem' }}>
                <Form.Label size="lg" style={{ fontSize: 'large' }}>
                  Transparent Background:{' '}
                </Form.Label>
              </Col>
              <Col sm="6" style={{ paddingLeft: '1rem' }}>
                <div className="round">
                  <input
                    type="checkbox"
                    checked={myQRSettings.XParent}
                    id="checkbox"
                    onChange={(e) => {
                      const qSet: QRSettings = { ...myQRSettings };
                      console.log(`XParent: ${e.target.checked}`)
                      qSet.XParent = e.target.checked;
                      setMyQRSettings(qSet);
                      // onXparentChange(e);
                    }}
                  />
                  <label for="checkbox"></label>
                </div>
              </Col>
            </Row>
          ) : null}
          <Form.Group as={Row} style={{ margin: 'auto' }}>
            <Col sm={8}>&nbsp;</Col>
            <Col sm={1}>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Col>
            <Col sm={1}>&nbsp;</Col>
            <Col sm={1}>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
            {/* <Col sm={3}>&nbsp;</Col> */}
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

QRConfigForm.propTypes = {
  show: PropTypes.bool.isRequired,
  qrSettings: PropTypes.shape({
    QRType: PropTypes.string,
    QRProps: PropTypes.shape({
      size: PropTypes.number,
    }).isRequired,
  }).isRequired,
  sizeCallback: PropTypes.func.isRequired,
  extensionCallback: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};
