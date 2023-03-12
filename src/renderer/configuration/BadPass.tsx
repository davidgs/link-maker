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
import { Modal, Button } from 'react-bootstrap';
import { ExclamationOctagon } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

export default function BadPass({
  show,
  errorMessage,
  callback
}: {
  show: boolean;
  errorMessage: string;
  callback: () => void;
}): JSX.Element {
  const [showBadPass, setShowBadPass] = useState<boolean>(false);

  useEffect(() => {
    setShowBadPass(show);
  }, [show]);


  const handleClose = () => {
    setShowBadPass(false);
    callback();
  };

  return (
    <Modal show={showBadPass} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <h1 style={{ color: 'red', textAlign: 'center' }}>
            <ExclamationOctagon /> Warning
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {errorMessage}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

BadPass.propTypes = {
  show: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};
