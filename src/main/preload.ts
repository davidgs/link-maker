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
import { contextBridge, ipcRenderer } from 'electron';
import { QRSettings, UtmParams } from '../renderer/types';

export type Channels = 'utm-builder';
export type Events =
  | 'get-qr-settings'
  | 'save-qr-settings'
  | 'save-link'
  | 'clear-history'
  | 'get-links'
  | 'get-config'
  | 'get-params'
  | 'save-config'
  | 'check-passwd'
  | 'set-passwd';

export type electronAPI = {
  getQRSettings: () => Promise<string>;
  saveQRSettings: (params: string) => Promise<string>;
  saveLink: (linkData: string) => Promise<string>;
  saveSVG: (svgData: string) => Promise<string>;
  clearHistory: () => Promise<string>;
  getLinks: () => Promise<string>;
  getConfig: () => Promise<string>;
  getParams: (key: string) => Promise<string>;
  saveConfig: (key: string) => Promise<string>;
  checkPass: () => Promise<string>;
  setPass: (pass: string) => Promise<string>;
  clearForm: () => void;
  saveDarkMode: (darkMode: boolean) => void;
  getDarkMode: () => Promise<boolean>;
};

contextBridge.exposeInMainWorld('electronAPI', {
  getQRSettings: () => {
    return ipcRenderer.invoke('get-qr-settings');
  },
  saveQRSettings: (params: string) => {
    return ipcRenderer.invoke('save-qr-settings', params);
  },
  saveLink: (linkData: string) => {
    return ipcRenderer.invoke('save-link', linkData);
  },
  clearHistory: () => {
    return ipcRenderer.invoke('clear-history');
  },
  getLinks: () => {
    return ipcRenderer.invoke('get-links');
  },
  getConfig: () => {
    return ipcRenderer.invoke('get-config');
  },
  getParams: (key: string) => {
    return ipcRenderer.invoke('get-params', key);
  },
  saveConfig: (key: string) => {
    return ipcRenderer.invoke('save-config', key);
  },
  saveSVG: (svgData: string) => {
    return ipcRenderer.invoke('save-svg', svgData);
  },
  checkPass: () => {
    return ipcRenderer.invoke('check-passwd');
  },
  setPass: (pass: string) => {
    return ipcRenderer.invoke('set-passwd', pass);
  },
  clearForm: () => {
    return ipcRenderer.invoke('clear-form');
  },
  saveDarkMode: (darkMode: boolean) => {
    return ipcRenderer.invoke('save-dark-mode', darkMode);
  },
  getDarkMode: () => {
    return ipcRenderer.invoke('get-dark-mode');
  }
});

// Path: src/main/preload.ts

declare global {
  interface Window {
    electronAPI: {
      getQRSettings: () => Promise<string>;
      saveQRSettings: (params: string) => Promise<string>;
      saveLink: (linkData: string) => Promise<string>;
      saveSVG: (svgData: string) => Promise<string>;
      clearHistory: () => Promise<string>;
      getLinks: () => Promise<string>;
      getConfig: () => Promise<string>;
      getParams: (key: string) => Promise<string>;
      saveConfig: (key: string) => Promise<string>;
      checkPass: () => Promise<string>;
      setPass: (pass: string) => Promise<string>;
      clearForm: () => Promise<string>;
      saveDarkMode: (darkMode: boolean) => Promise<string>;
      getDarkMode: () => Promise<string>;
    };
  }
}
