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
  FloatingLabel,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import jsSHA from 'jssha';
import PropTypes from 'prop-types';
import BadPass from './BadPass';
import PassChecker from './PassChecker';
import { Check } from 'react-bootstrap-icons';

export default function PasswordForm({
  show,
  callback,
}: {
  show: boolean;
  callback: (value: boolean) => void;
}): JSX.Element {
  const [password, setPassword] = useState<string>('');
  const [matchPass, setMatchPass] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [badPass, setBadPass] = useState<boolean>(false);
  const [passError, setPassError] = useState<string>("Passwords don't match!");
  const [configPass, setConfigPass] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(true);
  const numRegEx = /^(?=.*[0-9])/;
  const upperRegEx = /^(?=.*[A-Z])/;
  const lowerRegEx = /^(?=.*[a-z])/;
  const specialRegEx = /^(?=.*[!@#$%^&*\(\)_+={[}\]|\\:;<,>\.\?\/])/;
  const lengthRegEx = /^(?=.{8,16})/;
  const [lenGood, setLenGood] = useState<boolean>(false);
  const [numGood, setNumGood] = useState<boolean>(false);
  const [upperGood, setUpperGood] = useState<boolean>(false);
  const [lowerGood, setLowerGood] = useState<boolean>(false);
  const [specialGood, setSpecialGood] = useState<boolean>(false);
  const [changePass, setChangePass] = useState<boolean>(false);
  const [passGood, setPassGood] = useState<boolean>(false);

  const goodCheck = (
    <Check
      className="text-success"
      size={20}
      style={{ alignItems: 'center', color: 'green' }}
    />
  );

  const badCheck = (
    <Check
      className="text-danger"
      size={20}
      style={{ alignItems: 'center', color: 'red' }}
    />
  );

  useEffect(() => {
    setShowPassword(show);
    if (show) {
      setPassword('');
      setMatchPass('');
      setBadPass(false);
      setLenGood(false);
      setNumGood(false);
      setUpperGood(false);
      setLowerGood(false);
      setSpecialGood(false);
      setValid(false);
    }
  }, [show]);

  useEffect(() => {
    window.electronAPI
      .checkPass()
      .then((response: string) => {
        const s = JSON.parse(response);
        if (s === '') {
          setConfigPass(true);
        } else {
          setConfigPass(false);
          setAdminPassword(s);
          setPassGood(false);
          setChangePass(false);
        }
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, []);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const shaObj = new jsSHA('SHA-512', 'TEXT');
    shaObj.update(password);
    const hash = shaObj.getHash('HEX');
    if (hash === adminPassword) {
      callback(true);
      return;
    } else if (hash !== adminPassword) {
      setPassError('Password Incorrect!');
      setBadPass(true);
      // callback(false);
    }
  };

  const handleSubmitNew = (event: SyntheticEvent) => {
    event.preventDefault();
    const shaObj = new jsSHA('SHA-512', 'TEXT');
    const matchObj = new jsSHA('SHA-512', 'TEXT');
    shaObj.update(newPassword);
    matchObj.update(matchPass);
    const hash = shaObj.getHash('HEX');
    const matchHash = matchObj.getHash('HEX');
    if (hash === matchHash) {
      window.electronAPI
        .setPass(hash)
        .then((response: string) => {
          callback(true);
          setNewPassword('');
          setPassGood(false);
          setMatchPass('');
          setBadPass(false);
          setLenGood(false);
          setNumGood(false);
          setUpperGood(false);
          setLowerGood(false);
          setSpecialGood(false);
          setValid(false);
          setConfigPass(false);
          setChangePass(false);
          return '';
        })
        .catch((error: unknown) => {
          console.log(`Error: ${error}`);
        });
      callback(true);
    } else {
      setPassError("Passwords don't match!");
      setBadPass(true);
      // callback(false);
    }
  };

  const checkPassword = (event: SyntheticEvent) => {
    const pass = (event.target as HTMLInputElement).value;
    setPassword(pass);
    setLenGood(lengthRegEx.test(pass));
    setNumGood(numRegEx.test(pass));
    setUpperGood(upperRegEx.test(pass));
    setLowerGood(lowerRegEx.test(pass));
    setSpecialGood(specialRegEx.test(pass));
  };

  const checkRawMatch = (event: SyntheticEvent) => {
    const pass = (event.target as HTMLInputElement).value;
    setMatchPass(pass);
    if (pass === newPassword) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const checkPassMatch = (p: string) => {
    const shaObj = new jsSHA('SHA-512', 'TEXT');
    shaObj.update(p);
    const hash = shaObj.getHash('HEX');
    if (hash === adminPassword) {
      setPassGood(true);
    } else {
      // callback(false);
    }
  };

  const handleCancel = () => {
    setShowPassword(false);
    setPassGood(false);
    setNewPassword('');
    setMatchPass('');
    setBadPass(false);
    setLenGood(false);
    setNumGood(false);
    setUpperGood(false);
    setLowerGood(false);
    setSpecialGood(false);
    setValid(false);
    setConfigPass(false);
    setChangePass(false);
    callback(false);
  };

  return (
    <Modal
      show={showPassword}
      onHide={handleCancel}
      size="xl"
      dialogClassName="modal-90w"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {configPass ? 'Set Initial Password' : 'Configuration Password'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={configPass || changePass ? handleSubmitNew : handleSubmit} noValidate>
          {/* password field */}
          {!configPass ? (<Form.Group controlId="formBasicPassword">
            <FloatingLabel label="Password">
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  checkPassMatch(event.target.value);
                }}
              />
              <Form.Control.Feedback type="invalid">
                You must provide a valid password.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Form.Group>) : null}
          {!configPass ? (
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="pass-tooltip">Change the Admin Password</Tooltip>
              }
            >
              <Form.Check
                type="checkbox"
                id="pass-check"
                label={`Change Admin Password`}
                aria-label={`Change the Admin Password`}
                disabled={!passGood}
                checked={changePass}
                onChange={(e) => {
                  setChangePass(e.target.checked);
                }}
              />
            </OverlayTrigger>
          ) : null }
          {configPass || changePass ? (
            <>
              <Form.Group controlId="formBasicPassword">
                <FloatingLabel label="New Password">
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      checkPassword(event);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide a valid password.
                  </Form.Control.Feedback>
                </FloatingLabel>
                <PassChecker
                  len={lenGood}
                  num={numGood}
                  upper={upperGood}
                  lower={lowerGood}
                  special={specialGood}
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <FloatingLabel label="Confirm Password">
                  <Form.Control
                    type="password"
                    value={matchPass}
                    onChange={(event) => checkRawMatch(event)}
                  />
                </FloatingLabel>
              </Form.Group>
              {valid ? goodCheck : badCheck} Passwords match.
              <p />
            </>
          ) : (
            <></>
          )}
          <Form.Group as={Row}>
            <Col sm={4}>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
            <Col sm={4}>&nbsp;</Col>
            <Col sm={4}>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <BadPass
        show={badPass}
        errorMessage={passError}
        callback={handleCancel}
      />
    </Modal>
  );
}

PasswordForm.propTypes = {
  show: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};
