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

export default function ImgElement({
  byteString,
  width,
  height,
  alt
 } : {
  byteString: string,
  width: number,
  height: number,
  alt: string,
  }
): JSX.Element {
  const [imgWidth, setImgWidth] = useState<number>(width);
  const [imgHeight, setImgHeight] = useState<number>(height);
  const [imgAlt, setImgAlt] = useState<string>(alt);
  const [imgBytes, setImgBytes] = useState<string>('');


  useEffect(() => {
    const bb = byteString;
    setImgBytes(bb);
    setImgWidth(width);
    setImgHeight(height);
    setImgAlt(alt);
  }, [byteString, width, height, alt]);

  return (
    <img
      src={imgBytes}
      alt={imgAlt}
      width={imgWidth > 0 ? `${imgWidth}px` : '75%'}
      height={imgHeight > 0 ? `${imgHeight}px` : 'auto'}
    />
  );
}

ImgElement.propTypes = {
  byteString: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string.isRequired,
};
