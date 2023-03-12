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
import React from 'react';
import PropTypes from 'prop-types';
import './hyde.css';

export default function MainHeader({dark} : {dark: boolean}) {
  const [darkMode, setDarkMode] = React.useState(dark);
  const [darkClass, setDarkClass] = React.useState('post-title header-stuff');

  React.useEffect(() => {
    setDarkMode(dark);
    dark ? setDarkClass('post-title header-stuff-dark') : setDarkClass('post-title header-stuff');
  }, [dark]);

  return (
    <main className="content">
      <div className="posts">
        <article className="post">
          <h4
            className={darkClass}
            style={{ textAlign: 'center' }}
          >
            UTM Link Builder and QR Code Generator
          </h4>
          <p className={darkClass} style={{ textAlign: 'center' }}>
            Posting a link back to a web resource?
            <br />
            Create a trackable link and make it count!
          </p>
        </article>
      </div>
    </main>
  );
}

MainHeader.propTypes = {
  dark: PropTypes.bool.isRequired,
};
