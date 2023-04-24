
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
import { useState } from 'react';
import PropTypes from 'prop-types';
import MainHeader from './MainHeader';
import SideNav from './SideNav';
import LinkForm from './LinkForm';
import ConfigEditor from './configuration/ConfigEditor';
import { MainSettings, UtmParams } from './types';
import JsonEditor from './configuration/JsonEditor';
import Footer from './Footer';

export default function MainPage() {
  const [editConfig, setEditConfig] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [editJson, setEditJson] = useState(false);
  const [jsonProp, setJsonProp] = useState<MainSettings | UtmParams | null>(null);
  const [configType, setConfigType] = useState<string>('');

  const toggleJson = (val: boolean) => {
    console.log(`Toggle JSON: ${val}`);
    setEditJson(val);
  };

  const getDarkMode = () => {
    window.electronAPI
      .getDarkMode()
      .then((response: string) => {
        const d: boolean = JSON.parse(response);
        setDarkMode(d);
        d === true ? setDarkMode(true) : setDarkMode(false);
        d ? window.document
            .getElementsByTagName('html')[0]
            .setAttribute('data-bs-theme', 'dark') : window.document
            .getElementsByTagName('html')[0]
            .setAttribute('data-bs-theme', 'light');
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  const updateDarkMode = (dark: boolean) => {
    window.electronAPI
      .saveDarkMode(dark)
      .then((response: string) => {
        const d: boolean = JSON.parse(response);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
    dark ? window.document
          .getElementsByTagName('html')[0]
          .setAttribute('data-bs-theme', 'dark') : window.document
          .getElementsByTagName('html')[0]
          .setAttribute('data-bs-theme', 'light');
    setDarkMode(dark);
  };

  getDarkMode();

  const toggleConfig = (val: boolean) => {
    setEditConfig(val);
  };

  window?.electron?.ipcRenderer?.on('editMainJSON', (event: string) => {
    console.log(`Raw JSON Message: ${event}`);
    setConfigType('Main');
    const js: MainSettings = JSON.parse(event);
    setJsonProp(js);
    setEditJson(true);
    // const m: CardData = JSON.parse(message.toString());
    // setUpdateText(event as string);
    console.log(`Formatted JSON Message: ${js}`);
  });

  window?.electron?.ipcRenderer?.on('editUTMJSON', (event: string) => {
    console.log(`Raw JSON Message: ${event}`);
    setConfigType('UTM');
    const js: MainSettings = JSON.parse(event);
    setJsonProp(js);
    setEditJson(true);
  });

  return (
    <div className="content">
      <div className="aside-column">
        <SideNav
          callback={toggleConfig}
          dark={darkMode}
          propogateDarkMode={updateDarkMode}
        />
      </div>
      <div className="main-column">
        <MainHeader dark={darkMode} />
        <LinkForm dark={darkMode} />
        {/* <Footer dark={darkMode} /> */}
      </div>
      <ConfigEditor showMe={editConfig} dark={darkMode} callback={toggleConfig} />
      <JsonEditor type={configType} json={jsonProp} show={editJson} callback={toggleJson} />
    </div>
  );
}

MainPage.propTypes = {
  dark: PropTypes.bool,
  propogateDarkMode: PropTypes.func,
};
