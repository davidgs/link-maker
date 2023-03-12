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
import { QRSettings, defaultQRSettings } from 'renderer/types';
import PropTypes from 'prop-types';
import { Gear, GearFill } from 'react-bootstrap-icons';

export default function QRConfigForm({
  show,
  qrSettings,
  sizeCallback,
  extensionCallback,
  onHide,
}: {
  show: boolean;
  qrSettings: QRSettings;
  sizeCallback: (size: number) => void;
  extensionCallback: (value: string) => void;
  onHide: (value: boolean) => void;
}): JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [myQRSettings, setMyQRSettings] = useState<QRSettings>(qrSettings);
  const [initSize, setInitSize] = useState<number>(220);
  const [initExtension, setInitExtension] = useState<string>('png');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setShowConfig(show);
  }, [show]);

  

  useEffect(() => {
    setMyQRSettings(qrSettings);
    setInitSize(qrSettings.QRProps?.size ? qrSettings.QRProps.size : 220);
    setInitExtension(qrSettings.QRType);
  }, [qrSettings]);

  const onExtensionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const qSet: QRSettings = {...myQRSettings};
    qSet.QRType = event.target.id.split('-')[2];
    setMyQRSettings(qSet);
  };

  const onSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const qSet: QRSettings = {...myQRSettings};
    const qProp = {...qSet.QRProps};
    qProp.size = parseInt(event.target.value, 10);
    qSet.QRProps = qProp;
    setMyQRSettings(qSet);
    sizeCallback(parseInt(event.target.value, 10));
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setShowConfig(false);
    window.electronAPI
      .saveQRSettings(JSON.stringify(myQRSettings))
      .then(() => {
        return '';
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

  return (
    <Modal
      show={showConfig}
      onHide={handleCancel}
      size="lg"
      dialogClassName="modal-40w"
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
                  delay={{ show: 250, hide: 400 }}
                  rootClose
                  overlay={
                    <Tooltip id="qrcode-tooltip">
                      Current size of the QR Code.
                    </Tooltip>
                  }
                >
                  <Form.Label size="lg" style={{ fontSize: 'large' }}>
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
                <Form.Range
                  value={
                    myQRSettings.QRProps?.size ? myQRSettings.QRProps.size : 220
                  }
                  min={150}
                  max={1000}
                  step={10}
                  onChange={(e) => {
                    onSizeChange(e);
                  }}
                />
              </OverlayTrigger>
            </Col>
          </Row>
          <Row>
            <Col sm="4" style={{ paddingLeft: '1rem', paddingRight: '0px' }}>
              <Form.Label size="lg" style={{ fontSize: 'large' }}>
                File Extension:{' '}
              </Form.Label>
            </Col>
            <Col sm="6" style={{ paddingLeft: '1rem' }}>
              <div key="inline-radio" className="mb-3">
                <OverlayTrigger
                  placement="auto"
                  overlay={<Tooltip>Download as a PNG</Tooltip>}
                >
                  <Form.Check
                    inline
                    label=".png"
                    name="group1"
                    type="radio"
                    id="inline-radio-png"
                    style={{ marginRight: '.5rem' }}
                    onChange={(e) => {
                      onExtensionChange(e);
                    }}
                    checked={myQRSettings.QRType === 'png'}
                  />
                </OverlayTrigger>
                <OverlayTrigger
                  placement="auto"
                  overlay={<Tooltip>Download as a JPG</Tooltip>}
                >
                  <Form.Check
                    inline
                    label=".jpg"
                    name="group1"
                    type="radio"
                    id="inline-radio-jpg"
                    style={{ marginRight: '.5rem' }}
                    onChange={onExtensionChange}
                    checked={myQRSettings.QRType === 'jpg'}
                  />
                </OverlayTrigger>
                <OverlayTrigger
                  placement="auto"
                  overlay={<Tooltip>Download as a JPG</Tooltip>}
                >
                  <Form.Check
                    inline
                    label=".svg"
                    name="group1"
                    type="radio"
                    id="inline-radio-svg"
                    style={{ marginRight: '.5rem' }}
                    onChange={onExtensionChange}
                    checked={myQRSettings.QRType === 'svg'}
                  />
                </OverlayTrigger>
              </div>
            </Col>
          </Row>
          <Form.Group as={Row} style={{margin: 'auto'}}>
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
