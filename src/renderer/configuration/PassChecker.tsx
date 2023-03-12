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
import { Check } from 'react-bootstrap-icons';

export default function PassChecker({
  len,
  num,
  upper,
  lower,
  special,
}: {
  len: boolean;
  num: boolean;
  upper: boolean;
  lower: boolean;
  special: boolean;
}): JSX.Element {
  const [lenGood, setLenGood] = useState<boolean>(false);
  const [numGood, setNumGood] = useState<boolean>(false);
  const [upperGood, setUpperGood] = useState<boolean>(false);
  const [lowerGood, setLowerGood] = useState<boolean>(false);
  const [specialGood, setSpecialGood] = useState<boolean>(false);

  const goodCheck = (
    <Check className="text-success" size={20} style={{ color: 'green' }} />
  );

  const badCheck = (
    <Check
      className="text-danger"
      size={20}
      style={{ alignItems: 'center', color: 'red' }}
    />
  );

  useEffect(() => {
    setLenGood(len);
    setNumGood(num);
    setUpperGood(upper);
    setLowerGood(lower);
    setSpecialGood(special);
  }, [len, num, upper, lower, special]);

  return (
    <>
      {lenGood ? goodCheck : badCheck} Password must be 8-16 characters long.
      <br />
      {numGood ? goodCheck : badCheck} Password must contain at least one
      number.
      <br />
      {upperGood ? goodCheck : badCheck} Password must contain at least one
      uppercase letter.
      <br />
      {lowerGood ? goodCheck : badCheck} Password must contain at least one
      lowercase letter.
      <br />
      {specialGood ? goodCheck : badCheck} Password must contain at least one
      special character.
      <p /> 
    </>
  );
}

PassChecker.propTypes = {
  len: PropTypes.bool.isRequired,
  num: PropTypes.bool.isRequired,
  upper: PropTypes.bool.isRequired,
  lower: PropTypes.bool.isRequired,
  special: PropTypes.bool.isRequired,
};
