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
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { ExclamationOctagon } from 'react-bootstrap-icons';

export default function DireWarning({
  show,
  onHide,
  onConfirm,
}: {
  show: boolean;
  onHide: (value: boolean) => void;
  onConfirm: (value: boolean) => void;
}): JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(false);

  useEffect(() => {
    setShowConfig(show);
  }, [show]);

  const handleConfirm = () => {
    setShowConfig(false);
    onConfirm(true);
  };

  const handleClose = () => {
    setShowConfig(false);
    onHide(true);
  };

  return (
    <Modal show={showConfig} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <h1 style={{ color: 'red', textAlign: 'center' }}><ExclamationOctagon /> Warning</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          This will delete all the links in your history!
          <br />
          This cannot be undone!
          <br />
          Are you sure you want to continue?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

DireWarning.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
