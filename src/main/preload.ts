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
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { QRSettings, UtmParams } from '../renderer/types';

export type Channels = 'message';
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
  | 'set-passwd'
  | 'get-main-config'
  | 'save-main-config'
  | 'load-file'
  | 'save-file';

export type electronAPI = {
  getQRConfig: () => Promise<string>;
  saveQRConfig: (params: string) => Promise<string>;
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
  getMainConfig: () => Promise<string>;
  saveMainConfig: (config: string) => Promise<string>;
  loadFile: (file: string) => Promise<string>;
  saveFile: (file: string, data: string, fType: string) => Promise<string>;
};

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;


contextBridge.exposeInMainWorld('electronAPI', {
  getQRConfig: () => {
    return ipcRenderer.invoke('get-qr-settings');
  },
  saveQRConfig: (params: string) => {
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
  },
  getMainConfig: () => {
    return ipcRenderer.invoke('get-main-config');
  },
  saveMainConfig: (config: string) => {
    return ipcRenderer.invoke('save-main-config', config);
  },
  loadFile: (file: string) => {
    return ipcRenderer.invoke('load-file', file);
  },
  saveFile: (file: string, data: string, fType: string) => {
    return ipcRenderer.invoke('save-file', file, data, fType);
  },
});

// Path: src/main/preload.ts

declare global {
  interface Window {
    electronAPI: {
      getQRConfig: () => Promise<string>;
      saveQRConfig: (params: string) => Promise<string>;
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
      getMainConfig: () => Promise<string>;
      saveMainConfig: (config: string) => Promise<string>;
      loadFile: (file: string) => Promise<string>
      saveFile: (file: string, data: string, fType: string) => Promise<string>
    };
  }
}
