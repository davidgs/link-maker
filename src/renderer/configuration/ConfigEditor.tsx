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
/* eslint-disable no-case-declarations */
import {
  useState,
  useEffect,
  ChangeEvent,
  SyntheticEvent,
} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
  Accordion,
  Col,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
  Alert,
} from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import PropTypes from 'prop-types';
import { RGBColor } from 'react-color';
import { Knob } from 'primereact/knob';
import 'primereact/resources/primereact.min.css';
import {
  UtmParams,
  defaultUTMParams,
  UtmObj,
  MainSettings,
  defaultMainSettings,
} from '../types';
import UTMAccordianItem from './UTMAccordianItem';
import {QRCode} from 'react-qrcode-logo';

declare type EyeColor = string | InnerOuterEyeColor;
declare type InnerOuterEyeColor = {
  inner: string;
  outer: string;
};
declare type CornerRadii = [number, number, number, number];

export default function ConfigEditor({
  showMe,
  dark,
  callback,
}: {
  showMe: boolean;
  dark: boolean;
  callback: (value: boolean) => void;
}): JSX.Element {
  const [show, setShow] = useState(false);
  const [config, setConfig] = useState<UtmParams>(defaultUTMParams);
  const [targetValidated, setTargetValidated] = useState(false);
  const [mainConfig, setMainConfig] =
    useState<MainSettings>(defaultMainSettings);
  const [darkMode, setDarkMode] = useState(false);
  const [isQrAspectLocked, setIsQrAspectLocked] = useState(false);
  const [isMainAspectLocked, setIsMainAspectLocked] = useState(false);
  const [qrImgAspect, setQrImgAspect] = useState(1);
  const [mainImgAspect, setMainImgAspect] = useState(1);
  const [displayForeColorPicker, setDisplayForeColorPicker] = useState(false);
  const [displayEyeColorPicker, setDisplayEyeColorPicker] = useState(false);
  const [displayBackColorPicker, setDisplayBackColorPicker] = useState(false);
  const [showQRLogo, setShowQRLogo] = useState(false);
  const [showMainLogo, setShowMainLogo] = useState(false);
  const [qrLogoImage, setQrLogoImage] = useState('');
  const [mainLogoImage, setMainLogoImage] = useState('');
  const [mainLogoChanged, setMainLogoChanged] = useState(false);
  const [qrLogoChanged, setQrLogoChanged] = useState(false);
  const darkColor = '#adb5bd';
  const lightColor = '#000000';
  const [color, setColor] = useState(darkMode ? darkColor : lightColor);

  useEffect(() => {
    setDarkMode(dark);
    setColor(dark ? darkColor : lightColor);
  }, [dark]);

  /* Update properties when eye-radius values change */
  const handleEyeRadiusChange = (e: number, index: number, corner: number) => {
    const value = e;
    const newEyeRadius: [CornerRadii, CornerRadii, CornerRadii] = [
      ...mainConfig.QRSettings.QRProps.eyeRadius,
    ];
    const newCorner: [number, number, number, number] = [
      ...(newEyeRadius[index] as [number, number, number, number]),
    ];
    newCorner[corner] = value;
    newEyeRadius[index] = newCorner;
    setMainConfig({
      ...mainConfig,
      QRSettings: {
        ...mainConfig.QRSettings,
        QRProps: {
          ...mainConfig.QRSettings.QRProps,
          eyeRadius: newEyeRadius,
        },
      },
    });
  };

  // Foreground Color
  const [foreColor, setForeColor] = useState<RGBColor>({
    r: 66,
    g: 11,
    b: 95,
    a: 1,
  });

  // Background Color
  const [backColor, setBackColor] = useState<RGBColor>({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });

  // Eye Color
  const [eyeColor, setEyeColor] = useState<RGBColor>({
    r: 66,
    g: 11,
    b: 95,
    a: 1,
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* Locked icon */
  const locked = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-lock-fill"
      viewBox="0 0 16 16"
    >
      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    </svg>
  );

  /* Unlocked icon */
  const unlocked = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-unlock"
      viewBox="0 0 16 16"
    >
      <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z" />
    </svg>
  );

  /* lock/unlock the aspect ratio of the qr logo */
  const setLockQRAspectRatio = () => {
    setIsQrAspectLocked(!isQrAspectLocked);
  };

  /* lock/unlock the aspect ratio of the main logo */
  const setLockMainAspectRatio = () => {
    setIsMainAspectLocked(!isMainAspectLocked);
  };

  /* set the aspect ratio of the image
     @param: width: the width of the image.
     @param: height: the height of the image.
     @param: which: which file to set aspect of main logo or qr logo
  */
  const setAspectRatio = (width: number, height: number, which: string) => {
    if (which === 'qr') {
      setQrImgAspect(width / height);
    } else {
      setMainImgAspect(width / height);
    }
  };

  /* Call the main process to get the utm-props configuration */
  const getUTMProps = () => {
    window.electronAPI
      .getConfig()
      .then((response: string) => {
        const c: UtmParams = JSON.parse(response);
        setConfig(c);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  /* make an rgba() color from a string */
  const makeRGBA = (color: string): RGBColor => {
    const frgb = color
      .substring(color.indexOf('(') + 1, color.indexOf(')'))
      .split(',');
    return {
      r: parseInt(frgb[0], 10),
      g: parseInt(frgb[1], 10),
      b: parseInt(frgb[2], 10),
      a: parseInt(frgb[3], 10),
    };
  };

  /* Call the main process to load the config file */
  const getMainProps = () => {
    window.electronAPI
      .getMainConfig()
      .then((response: string) => {
        const c: MainSettings = JSON.parse(response);
        setMainConfig(c);
        if (c.brandImageFile !== '' && c.brandImageFile !== undefined) {
          window.electronAPI
            .loadFile(c.brandImageFile)
            .then((response: string) => {
              const fType = c.brandImageFile.split('.').pop();
              const image = Buffer.from(response, 'base64').toString('base64');
              setMainLogoImage(`data:image/${fType};base64,${image}`);
              setShowMainLogo(true);
              setIsMainAspectLocked(true);
            })
            .catch((error: unknown) => {
              console.log(`Error: ${error}`);
            });
        }
        setForeColor(
          makeRGBA(c.QRSettings.QRProps.fgColor || 'rgba(66, 11, 95, 1)')
        );
        setBackColor(
          makeRGBA(c.QRSettings.QRProps.bgColor || 'rgba(255, 255, 255, 1)')
        );
        setEyeColor(
          makeRGBA(
            (c.QRSettings.QRProps.eyeColor as string) || 'rgba(66, 11, 95, 1)'
          )
        );
        if (
          c.QRSettings.QRImageFile !== '' &&
          c.QRSettings.QRImageFile !== undefined
        ) {
          window.electronAPI
            .loadFile(c.QRSettings.QRImageFile as string)
            .then((response: string) => {
              const fType = c.QRSettings.QRImageFile.split('.').pop();
              const image = Buffer.from(response, 'base64').toString('base64');
              setQrLogoImage(`data:image/${fType};base64,${image}`);
              setShowQRLogo(true);
              setIsQrAspectLocked(true);
              return '';
            })
            .catch((error: unknown) => {
              console.log(`Error: ${error}`);
            });
        }
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  // get the main_config and utm_config configurations
  useEffect(() => {
    getUTMProps();
    getMainProps();
  }, []);

  /* set the aspet ratio of the image
      @param: event: the event that triggered the function
      @param: setting: the setting to change
      @param: which: which file to set aspect of main logo or qr logo
  */
  const updateAspectRatio = (
    value: number, //React.ChangeEvent<HTMLInputElement>,
    setting: string,
    which: string
  ) => {
    if (!value) return;
    switch (which) {
      case 'qr':
        if (isQrAspectLocked) {
          setMainConfig((prevState) => {
            const p = { ...prevState };
            (p.QRSettings.QRProps.logoHeight = value),
              (p.QRSettings.QRProps.logoWidth = (value * qrImgAspect).toFixed(
                0
              ) as unknown as number);
            return p;
          });
        } else if (setting === 'height') {
          setMainConfig((prevState) => {
            const p = { ...prevState };
            p.QRSettings.QRProps.logoHeight = value;
            return p;
          });
        } else {
          setMainConfig((prevState) => {
            const r = { ...prevState };
            r.QRSettings.QRProps.logoWidth = value;
            return r;
          });
        }
        break;
      case 'main':
        if (isMainAspectLocked) {
          setMainConfig((prevState) => {
            const w = value * qrImgAspect;
            const p = { ...prevState };
            (p.brandHeight = value),
              (p.brandWidth = parseInt(w.toFixed(0), 10));
            return p;
          });
        } else if (setting === 'height') {
          setMainConfig((prevState) => {
            const q = { ...prevState };
            q.brandHeight = value;
            return q;
          });
        } else {
          setMainConfig((prevState) => {
            const r = { ...prevState };
            r.brandWidth = value;
            return r;
          });
        }
        break;
      default:
        break;
    }
  };

  // Styles for the Color Pickers
  const styles = {
    foreground: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${foreColor.r}, ${foreColor.g}, ${foreColor.b}, ${foreColor.a})`,
      },
    },
    background: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${backColor.r}, ${backColor.g}, ${backColor.b}, ${backColor.a})`,
      },
    },
    eye: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${eyeColor.r}, ${eyeColor.g}, ${eyeColor.b}, ${eyeColor.a})`,
      },
    },
    swatch: {
      padding: '5px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(66,11,95,.5)',
      display: 'inline-block',
      cursor: 'pointer',
    },
    popover: {
      zIndex: 2,
      position: 'absolute',
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  };

  /* handle show */
  useEffect(() => {
    setShow(showMe);
    if (showMe) {
      getMainProps();
      getUTMProps();
      setMainLogoChanged(false);
      setQrLogoChanged(false);
    }
  }, [showMe]);

  /* handle closing without saving */
  const handleCancel = () => {
    handleClose();
    callback(false);
  };

  /* handle saving the main logo file for branding
      @param: result: the result of the file read
  */
  const setMainFileName = (result: SyntheticEvent) => {
    const ev = result as React.ChangeEvent<HTMLInputElement>;
    const read = new FileReader();
    const foo = ev.target.files;
    if (foo) {
      const f = foo[0];
      if (f) {
        const fName = f.name;
        const fType = fName.split('.').pop() as string;
        read.readAsDataURL(f);
        read.onloadend = () => {
          const fi = new Image();
          fi.src = read.result as string;
          fi.onload = () => {
            const h = fi.height;
            const w = fi.width;
            setMainLogoImage(fi.src);
            const ff = fi.src as string;
            window.electronAPI
              .saveFile('main_logo', fi.src, fType)
              .then((res: string) => {
                if (res !== '') {
                  setMainConfig((prevMainConfig) => {
                    const con = { ...prevMainConfig };
                    con.brandImageFile = res;
                    con.brandHeight = h;
                    con.brandWidth = w;
                    return con;
                  });
                }
              })
              .catch((error: string) => {
                console.log(error);
              });
            setAspectRatio(w, h, 'main');
            setIsMainAspectLocked(true);
            setShowMainLogo(true);
          };
        };
        setMainLogoChanged(true);
      }
    }
  };

  /* handle saving the qr logo file for branding
      @param: result: the result of the file read
  */
  const setQRFileName = (result: SyntheticEvent) => {
    const ev = result as React.ChangeEvent<HTMLInputElement>;
    const read = new FileReader();
    const foo = ev.target.files;
    if (foo) {
      const f = foo[0];
      const fName = f.name;
    read.readAsDataURL(f);
    read.onloadend = () => {
      const fi = new Image();
      fi.src = read.result as string;
      fi.onload = () => {
        const h = fi.height;
        const w = fi.width;
        setQrLogoImage(fi.src);
        const fType = fName.split('.').pop() as string;
        window.electronAPI
          .saveFile('qr_logo', fi.src, fType)
          .then((res: string) => {
            if (res !== '') {
              setMainConfig((prevMainConfig) => {
                const con = { ...prevMainConfig };
                const q = { ...con.QRSettings };
                q.QRImageFile = res;
                q.QRProps.logoHeight = h;
                q.QRProps.logoWidth = w;
                q.QRProps.logoOpacity = 10.0;
                con.QRSettings = q;
                return con;
              });
            }
          })
          .catch((error: string) => {
            console.log(error);
          });
        setAspectRatio(w, h, 'qr');
        setIsQrAspectLocked(true);
        setShowQRLogo(true);
      };
    };
    setQrLogoChanged(true);
  }
};

  /* All done! */
  function callDone() {
    callback(false);
  }

  /* handle the save button
      @param: event: the event that triggered the save
  */
  const handleSave = (event: SyntheticEvent) => {
    const form = event.currentTarget as HTMLFormElement;
    if (form != null && form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setTargetValidated(true);
    const c = JSON.stringify(config);
    window.electronAPI
      .saveConfig(c)
      .then((response: string) => {
        return;
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
    const m = JSON.stringify(mainConfig);
    window.electronAPI
      .saveMainConfig(m)
      .then((response: string) => {
        return;
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
    callDone();
    handleClose();
  };

  // Handle clicking on the Foreground Color
  const handleForeColorClick = () => {
    setDisplayForeColorPicker(!displayForeColorPicker);
  };

  // Handle closing the Foreground Color Picker
  const handleForeColorClose = () => {
    setDisplayForeColorPicker(false);
  };

  /* Handle the Foreground Color Change
      @param: color: the color that was selected
  */
  const handleForeColorChange = (color: any) => {
    setForeColor(color.rgb);
    setMainConfig((prevQrConfig) => {
      const newFore = { ...prevQrConfig };
      const con = { ...newFore.QRSettings };
      con.QRProps.fgColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
      newFore.QRSettings = con;
      return newFore;
    });
  };

  /* Handle clicking on the Background Color */
  const handleBackColorClick = () => {
    setDisplayBackColorPicker(!displayBackColorPicker);
  };

  /* Handle closing the background Color Picker */
  const handleBackColorClose = () => {
    setDisplayBackColorPicker(false);
  };

  /* Handle the Background Color Change
      @param: color: the color that was selected
  */
  const handleBackColorChange = (color: any) => {
    setBackColor(color.rgb);
    setMainConfig((prevQrConfig) => {
      const newBack = { ...prevQrConfig };
      const con = { ...newBack.QRSettings };
      con.QRProps.bgColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
      newBack.QRSettings = con;
      return newBack;
    });
  };

  /* Handle the Eye Color Change
      @param: color: the color that was selected
  */
  const handleEyeColorChange = (color: any) => {
    setEyeColor(color.rgb);
    setMainConfig((prevQrConfig) => {
      const newEye = { ...prevQrConfig };
      const con = { ...newEye.QRSettings };
      con.QRProps.eyeColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
      newEye.QRSettings = con;
      return newEye;
    });
  };

  // Handle clicking on the Eye Color Picker
  const handleEyeColorClick = () => {
    setDisplayEyeColorPicker(!displayEyeColorPicker);
  };

  // Handle closing the Eye Color Picker
  const handleEyeColorClose = () => {
    setDisplayEyeColorPicker(false);
  };

  /* Update the UTM Parameters
      @param: type: the type of UTM parameter to update
      @param: updateConfig: the new UTM parameter
  */
  const updateConfig = (type: string, updateConfig: UtmObj | UtmParams) => {
    switch (type) {
      case 'utm_source':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          newConfig.utm_source = updateConfig as UtmObj;
          return newConfig;
        });
        break;
      case 'utm_medium':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          newConfig.utm_medium = updateConfig as UtmObj;
          return newConfig;
        });
        break;
      case 'utm_campaign':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          newConfig.utm_campaign = updateConfig as UtmObj;
          return newConfig;
        });
        break;
      case 'utm_term':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          newConfig.utm_term = updateConfig as UtmObj;
          return newConfig;
        });
        break;
      case 'utm_content':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          newConfig.utm_content = updateConfig as UtmObj;
          return newConfig;
        });
        break;
      case 'team_name':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          newConfig.team_name = updateConfig as UtmObj;
          return newConfig;
        });
        break;
      case 'region_name':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          newConfig.region_name = updateConfig as UtmObj;
          return newConfig;
        });
        break;
      case 'utm_target':
        setConfig(updateConfig as UtmParams);
      default:
        break;
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleCancel}
        size="xl"
        dialogClassName="modal-90w"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Configuration Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion>
            {/* General Config */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <strong>General Configuration</strong>
              </Accordion.Header>
              <Accordion.Body id="general">
                <Accordion>
                  {/* Bitly Configuration */}
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <strong>Bit.ly Configuration</strong>
                    </Accordion.Header>
                    <Accordion.Body id="bitly">
                      <Form noValidate validated={targetValidated}>
                        {config?.bitly_config?.useValue ? (
                          <>
                            <Form.Label>
                              <strong>Label</strong>
                            </Form.Label>
                            <Form.Control
                              size="sm"
                              type="text"
                              id="bitly_config-label"
                              placeholder="Enter Bitly Switch label"
                              value={`${config?.bitly_config?.label}`}
                              onChange={(e) => {
                                setConfig((prevConfig) => {
                                  const newConfig = { ...prevConfig };
                                  const newBit = { ...newConfig.bitly_config };
                                  newBit.label = e.target.value;
                                  newConfig.bitly_config = newBit;
                                  return newConfig;
                                });
                              }}
                            />
                            <Form.Label>
                              <strong>ToolTip Text</strong>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="bitly_config-tooltip"
                              placeholder="Enter Bit.ly field tooltip"
                              value={config?.bitly_config?.tooltip}
                              onChange={(e) => {
                                setConfig((prevConfig) => {
                                  const newConfig = { ...prevConfig };
                                  const newBit = { ...newConfig.bitly_config };
                                  newBit.tooltip = e.target.value;
                                  newConfig.bitly_config = newBit;
                                  return newConfig;
                                });
                              }}
                            />
                            <Form.Label>
                              <strong>ARIA (Accessibility) Text</strong>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="bitly_config-aria"
                              placeholder="Enter bitly switch field ARIA (Accessibility) label"
                              value={config?.bitly_config?.ariaLabel}
                              required
                              onChange={(e) => {
                                setConfig((prevConfig) => {
                                  const newConfig = { ...prevConfig };
                                  const newSource = {
                                    ...newConfig.bitly_config,
                                  };
                                  newSource.ariaLabel = e.target.value;
                                  newConfig.bitly_config = newSource;
                                  return newConfig;
                                });
                              }}
                            />
                            <Form.Label>
                              <strong>Bitly Token</strong>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="The Bit.ly API Token"
                              value={config?.bitly_config?.bitlyToken}
                              required
                              id="bitly_token-value"
                              onChange={(eventKey) => {
                                setConfig((prevConfig) => {
                                  const newConfig = { ...prevConfig };
                                  const newBit = { ...newConfig.bitly_config };
                                  newBit.bitlyToken = eventKey.target.value;
                                  newConfig.bitly_config = newBit;
                                  return newConfig;
                                });
                              }}
                            />
                            <Form.Control.Feedback type="invalid">
                              You must provide a Bit.ly Token.
                            </Form.Control.Feedback>
                            <Form.Label>
                              <strong>Bitly Domain (if any)</strong>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Your Custom Bit.ly Domain"
                              value={config?.bitly_config?.bitlyDomain}
                              id="bitly_domain-value"
                              onChange={(eventKey) => {
                                setConfig((prevConfig) => {
                                  const newConfig = { ...prevConfig };
                                  const newBit = { ...newConfig.bitly_config };
                                  newBit.bitlyDomain = eventKey.target.value;
                                  newConfig.bitly_config = newBit;
                                  return newConfig;
                                });
                              }}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                        <Form.Check
                          type="checkbox"
                          id="bitly_config-use"
                          label="Enable using Bit.ly?"
                          checked={config?.bitly_config?.useValue}
                          onChange={(e) => {
                            setConfig((prevConfig) => {
                              const newConfig = { ...prevConfig };
                              const newSource = { ...newConfig.bitly_config };
                              newSource.useValue = e.target.checked;
                              newConfig.bitly_config = newSource;
                              return newConfig;
                            });
                          }}
                        />
                      </Form>
                    </Accordion.Body>
                  </Accordion.Item>
                  {/* UI Images */}
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      <strong>Configure Images</strong>
                    </Accordion.Header>
                    <Accordion.Body id="images">
                      <Form noValidate validated={targetValidated}>
                        {/* Main Logo */}
                        <Row>
                          <Col lg={8}>
                            <Row className="mb-3">
                              <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Choose Main Image</Form.Label>
                                <Form.Control
                                  type="file"
                                  onChange={setMainFileName}
                                  accept=".png,.jpg,.jpeg"
                                />
                              </Form.Group>
                              {/* Show Main Logo */}
                              <Form.Group as={Row}>
                                <Col lg="4">
                                  <Form.Label>Show Logo</Form.Label>
                                </Col>
                                <Col lg="2">
                                  <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label=""
                                    checked={showMainLogo}
                                    onChange={(e) => {
                                      setShowMainLogo(e.target.checked);
                                    }}
                                  />
                                </Col>
                                <Col lg="6" />
                              </Form.Group>
                              {/* Main Logo Height */}
                              <Form.Group as={Row}>
                                <Col lg="4">
                                  <Form.Label style={{ marginTop: '1rem' }}>
                                    Logo Height
                                  </Form.Label>
                                </Col>
                                <Col lg="1">
                                  <Knob
                                    size={55}
                                    name="brandHeight"
                                    className="p-knob"
                                    value={
                                      mainConfig?.brandHeight as number | 5
                                    }
                                    min={5}
                                    max={300}
                                    strokeWidth={11}
                                    textColor={dark ? 'white' : 'black'}
                                    valueColor={'#0B3665'}
                                    rangeColor={'#21C6DC'}
                                    onChange={(e) => {
                                      updateAspectRatio(
                                        e.value,
                                        'height',
                                        'main'
                                      );
                                    }}
                                    disabled={!showQRLogo}
                                  />
                                </Col>
                                <Col lg="2" />
                                <Col lg="2">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip>
                                        {isMainAspectLocked ? 'Unlock' : 'Lock'}{' '}
                                        Aspect Ratio
                                      </Tooltip>
                                    }
                                  >
                                    <Button
                                      variant="outline-secondary"
                                      style={{
                                        width: '100%',
                                        fontSize: '0.6rem',
                                      }}
                                      onClick={setLockMainAspectRatio}
                                      disabled={!showMainLogo}
                                    >
                                      {isMainAspectLocked ? locked : unlocked}
                                      <br />
                                      Aspect ratio
                                    </Button>
                                  </OverlayTrigger>
                                </Col>
                                <Col lg="2">
                                  <Form.Label style={{ marginTop: '1rem' }}>
                                    Logo Width
                                  </Form.Label>
                                </Col>
                                <Col lg="1">
                                  <Knob
                                    size={55}
                                    name="brandWidth"
                                    className="p-knob"
                                    value={mainConfig.brandWidth as number | 5}
                                    min={5}
                                    max={300}
                                    strokeWidth={11}
                                    textColor={dark ? 'white' : 'black'}
                                    valueColor={'#0B3665'}
                                    rangeColor={'#21C6DC'}
                                    onChange={(e) => {
                                      updateAspectRatio(
                                        e.value,
                                        'width',
                                        'main'
                                      );
                                    }}
                                    disabled={!showQRLogo}
                                  />
                                </Col>
                              </Form.Group>
                              {/*  Main Logo Opacity */}
                              <Form.Group as={Row}>
                                <Col lg="4">
                                  <Form.Label style={{ marginTop: '1rem' }}>
                                    Logo Opacity
                                  </Form.Label>
                                </Col>
                                <Col lg="6">
                                  <Knob
                                    size={55}
                                    name="brandOpacity"
                                    className="p-knob"
                                    value={
                                      mainConfig.brandOpacity as number | 5
                                    }
                                    min={5}
                                    max={300}
                                    strokeWidth={11}
                                    textColor={dark ? 'white' : 'black'}
                                    valueColor={'#0B3665'}
                                    rangeColor={'#21C6DC'}
                                    onChange={(e) => {
                                      setMainConfig((prevConfig) => {
                                        const qp = { ...prevConfig };
                                        qp.brandOpacity = e.value;
                                        return qp;
                                      });
                                    }}
                                    disabled={!showQRLogo}
                                  />
                                </Col>
                              </Form.Group>
                              {mainLogoChanged ? (
                                <Row>
                                  <Col lg="12">
                                    <Alert variant="warning">
                                      <Alert.Heading>
                                        <strong>Warning!</strong>
                                      </Alert.Heading>
                                      <p>
                                        The Main Logo Change will be reflected
                                        after restarting the application.
                                      </p>
                                    </Alert>
                                  </Col>
                                </Row>
                              ) : null}
                            </Row>
                          </Col>
                          {showMainLogo ? (
                            <Col lg={4}>
                              <img
                                src={mainLogoImage}
                                alt="Main Logo"
                                style={{
                                  width: `${mainConfig?.brandWidth}px`,
                                  height: `${mainConfig?.brandHeight}px`,
                                  opacity: mainConfig?.brandOpacity
                                    ? mainConfig?.brandOpacity / 10
                                    : 1,
                                }}
                              />
                            </Col>
                          ) : null}
                        </Row>
                      </Form>
                    </Accordion.Body>
                  </Accordion.Item>
                  {/* QR Code Configuration */}
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>
                      <strong>Configure QR Code</strong>
                    </Accordion.Header>
                    <Accordion.Body id="qr">
                      {/* QR Colors */}
                      <Form.Label>
                        <strong>Colors:</strong>
                      </Form.Label>
                      <Form.Group as={Row}>
                        {/* Foreground Colors */}
                        <Col lg="2">
                          <Form.Label>Foreground:</Form.Label>
                        </Col>
                        <Col lg="2">
                          <div
                            style={{
                              padding: '5px',
                              background: '#fff',
                              borderRadius: '1px',
                              boxShadow: '0 0 0 1px rgba(66,11,95,.5)',
                              display: 'inline-block',
                              cursor: 'pointer',
                            }}
                            onClick={handleForeColorClick}
                          >
                            <div
                              style={{
                                width: '36px',
                                height: '14px',
                                borderRadius: '2px',
                                backgroundColor: `rgba(${foreColor.r}, ${foreColor.g}, ${foreColor.b}, ${foreColor.a})`,
                              }}
                            />
                          </div>
                          {displayForeColorPicker ? (
                            <div style={{ zIndex: 2, position: 'absolute' }}>
                              <div
                                style={{
                                  position: 'fixed',
                                  top: '0px',
                                  right: '0px',
                                  bottom: '0px',
                                  left: '0px',
                                }}
                                onClick={handleForeColorClose}
                              />
                              <SketchPicker
                                color={mainConfig?.QRSettings?.QRProps?.fgColor}
                                onChange={handleForeColorChange}
                              />
                            </div>
                          ) : null}
                        </Col>
                        {/* QR Code Background Color */}
                        <Col lg="2">
                          <Form.Label>Background:</Form.Label>
                        </Col>
                        <Col lg="2">
                          <div
                            style={styles.swatch}
                            onClick={handleBackColorClick}
                          >
                            <div style={styles.background.color} />
                          </div>
                          {displayBackColorPicker ? (
                            <div style={{ zIndex: 2, position: 'absolute' }}>
                              <div
                                style={{
                                  position: 'fixed',
                                  top: '0px',
                                  right: '0px',
                                  bottom: '0px',
                                  left: '0px',
                                }}
                                onClick={handleBackColorClose}
                              />
                              <SketchPicker
                                color={backColor as RGBColor}
                                onChange={handleBackColorChange}
                              />
                            </div>
                          ) : null}
                        </Col>
                        {/* QR Code Eye Color */}
                        <Col lg="2">
                          <Form.Label>Eye Color:</Form.Label>
                        </Col>
                        <Col lg="2">
                          <div
                            style={styles.swatch}
                            onClick={handleEyeColorClick}
                          >
                            <div style={styles.eye.color} />
                          </div>
                          {displayEyeColorPicker ? (
                            <div style={{ zIndex: 2, position: 'absolute' }}>
                              <div
                                style={{
                                  position: 'fixed',
                                  top: '0px',
                                  right: '0px',
                                  bottom: '0px',
                                  left: '0px',
                                }}
                                onClick={handleEyeColorClose}
                              />
                              <SketchPicker
                                color={eyeColor}
                                onChange={handleEyeColorChange}
                              />
                            </div>
                          ) : null}
                        </Col>
                      </Form.Group>
                      <hr />
                      {/* QR Code Style -- dots or bars */}
                      <Form.Group as={Row}>
                        <Col lg="2">
                          <Form.Label style={{ marginTop: '0.5rem' }}>
                            <strong>QR Code Style</strong>
                          </Form.Label>
                        </Col>
                        <Col lg="2">
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              const ds = e.target.value as 'dots' | 'squares';
                              setMainConfig((prevQrConfig) => {
                                const qst = { ...prevQrConfig };
                                const qr = { ...qst.QRSettings };
                                qr.QRProps.qrStyle = ds;
                                qst.QRSettings = qr;
                                return qst;
                              });
                            }}
                          >
                            <option value="dots">Dots</option>
                            <option value="squares">Squares</option>
                          </Form.Select>
                        </Col>
                        {/* QR Code Error Correction Level */}
                        <Col lg="2">
                          <Form.Label style={{ marginTop: '0.5rem' }}>
                            <strong>Error Correction: </strong>
                          </Form.Label>
                        </Col>
                        <Col lg="1">
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              const eq = e.target.value as
                                | 'L'
                                | 'M'
                                | 'Q'
                                | 'H';
                              setMainConfig((prevQrConfig) => {
                                const newEq = { ...prevQrConfig };
                                const q = { ...newEq.QRSettings };
                                q.QRProps.ecLevel = eq;
                                newEq.QRSettings = q;
                                return newEq;
                              });
                            }}
                          >
                            <option value="L">L</option>
                            <option value="M">M</option>
                            <option value="Q">Q</option>
                            <option value="H">H</option>
                          </Form.Select>
                        </Col>
                        {/* QR Code Quiet Zone */}
                        <Col lg="2">
                          <Form.Label style={{ marginTop: '0.5rem' }}>
                            <strong>Quiet Zone:</strong>
                          </Form.Label>
                        </Col>
                        <Col lg="1">
                          <Row>
                            <Col lg="8">
                              <Knob
                                size={55}
                                name="quietZone"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps?.quietZone as
                                    | number
                                    | 0
                                }
                                min={0}
                                max={50}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  setMainConfig((prevConfig) => {
                                    const qp = { ...prevConfig };
                                    const qps = { ...qp.QRSettings };
                                    qps.QRProps.quietZone = e.value;
                                    qp.QRSettings = qps;
                                    return qp;
                                  });
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col lg="3" />
                      </Form.Group>
                      <hr />
                      {/* QR Code eye styles */}
                      {/* Tops left and right */}
                      <Form.Group as={Row}>
                        <Col lg="2">
                          <Form.Label>
                            <strong>QR Eye Styles:</strong>
                          </Form.Label>
                        </Col>
                        {/* Live QR Code */}
                        <Col
                          lg="2">
                          <div
                            style={{
                              marginTop: '2rem', alignItems: 'center', justifyContent: 'center', display: 'flex'
                            }}
                          >
                            <QRCode
                              id="react-qrcode-logo"
                              value={
                                mainConfig?.QRSettings?.QRProps?.value as
                                  | string
                                  | 'https://www.google.com'
                              }
                              size={
                                mainConfig?.QRSettings?.QRProps?.size as
                                  | number
                                  | 200
                              }
                              bgColor={
                                mainConfig?.QRSettings?.QRProps?.bgColor as
                                  | string
                                  | '#FFFFFF'
                              }
                              fgColor={
                                mainConfig?.QRSettings?.QRProps?.fgColor as
                                  | string
                                  | '#000000'
                              }
                              logoImage={showQRLogo ? qrLogoImage : ''}
                              qrStyle={
                                mainConfig?.QRSettings?.QRProps?.qrStyle as
                                  | 'dots'
                                  | 'squares'
                                  | 'dots'
                              }
                              logoWidth={
                                mainConfig?.QRSettings?.QRProps?.logoWidth as
                                  | number
                                  | 80
                              }
                              logoHeight={
                                mainConfig?.QRSettings?.QRProps?.logoHeight as
                                  | number
                                  | 80
                              }
                              logoOpacity={
                                mainConfig?.QRSettings?.QRProps?.logoOpacity as
                                  | number
                                  | 0.2
                              }
                              eyeColor={
                                mainConfig?.QRSettings?.QRProps?.eyeColor as
                                  | string
                                  | '#000000'
                              }
                              eyeRadius={
                                mainConfig?.QRSettings?.QRProps?.eyeRadius
                              }
                              quietZone={
                                mainConfig?.QRSettings?.QRProps?.quietZone as
                                  | number
                                  | 0
                              }
                              enableCORS={
                                mainConfig?.QRSettings?.QRProps?.enableCORS as
                                  | boolean
                                  | false
                              }
                              ecLevel={
                                mainConfig?.QRSettings?.QRProps?.ecLevel as
                                  | 'L'
                                  | 'M'
                                  | 'Q'
                                  | 'H'
                                  | 'L'
                              }
                              logoPadding={
                                mainConfig?.QRSettings?.QRProps?.logoPadding as
                                  | number
                                  | 0
                              }
                              logoPaddingStyle={
                                mainConfig?.QRSettings?.QRProps
                                  ?.logoPaddingStyle as
                                  | 'circle'
                                  | 'square'
                                  | 'circle'
                              }
                            />
                          </div>
                        </Col>
                        <Col lg="1" />
                        {/* eye adjusters */}
                        <Col lg="7">
                          <Row>
                            <Col lg="5">
                              <Form.Label>Top Left: </Form.Label>
                            </Col>
                            <Col lg="3">
                              <Form.Label>Top Right: </Form.Label>
                            </Col>
                          </Row>
                          {/* Top Left top */}
                          <Row>
                            {/* top left, top-left */}
                            <Col
                              lg="2"
                              style={{
                                borderTop: `1px solid ${color}`,
                                borderLeft: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-0-0"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings.QRProps
                                    .eyeRadius[0][0] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 0, 0);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                            {/* top left, top-right */}
                            <Col
                              lg="2"
                              style={{
                                borderTop: `1px solid ${color}`,
                                borderRight: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-0-1"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[0][1] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 0, 1);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                            <Col lg="1" />
                            {/* Top Right top */}
                            {/* top right, top-left */}
                            <Col
                              lg="2"
                              style={{
                                borderTop: `1px solid ${color}`,
                                borderLeft: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-1-0"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[1][0] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 1, 0);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                            {/* top right, top-right */}
                            <Col
                              lg="2"
                              style={{
                                borderTop: `1px solid ${color}`,
                                borderRight: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-1-1"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[1][1] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 1, 1);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                          </Row>
                          <Row>
                            {/* top left, bottom-left */}
                            <Col
                              lg="2"
                              style={{
                                borderBottom: `1px solid ${color}`,
                                borderLeft: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-0-3"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[0][3] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 0, 3);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                            {/* top left, bottom-right */}
                            <Col
                              lg="2"
                              style={{
                                borderBottom: `1px solid ${color}`,
                                borderRight: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-0-2"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[0][2] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 0, 2);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                            <Col lg="1" />
                            {/* top right */}
                            <Col
                              lg="2"
                              style={{
                                borderLeft: `1px solid ${color}`,
                                borderBottom: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-1-3"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[1][3] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 1, 3);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                            {/* top right, bottom right */}
                            <Col
                              lg="2"
                              style={{
                                borderBottom: `1px solid ${color}`,
                                borderRight: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-1-2"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[1][2] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 1, 2);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="12">
                              <Form.Label>Bottom Left Eye:</Form.Label>
                            </Col>
                          </Row>
                          {/* Bottom Left top */}
                          <Row>
                            <Col
                              lg="2"
                              style={{
                                borderTop: `1px solid ${color}`,
                                borderLeft: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-2-0"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[2][0] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 2, 0);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                            <Col
                              lg="2"
                              style={{
                                borderTop: `1px solid ${color}`,
                                borderRight: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-2-1"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[2][1] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 2, 1);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                            <Col lg="6" />
                          </Row>
                          {/* Bottom Left bottom */}
                          <Row>
                            <Col
                              lg="2"
                              style={{
                                borderBottom: `1px solid ${color}`,
                                borderLeft: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-2-3"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[2][3] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 2, 3);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                            <Col
                              lg="2"
                              style={{
                                borderBottom: `1px solid ${color}`,
                                borderRight: `1px solid ${color}`,
                              }}
                            >
                              <Knob
                                size={55}
                                name="eyeRadius-2-2"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.eyeRadius[2][2] | 0
                                }
                                min={0}
                                max={25}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                onChange={(e) => {
                                  handleEyeRadiusChange(e.value, 2, 2);
                                }}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Form.Group>
                      <hr />
                      {/* QR Code Logo */}
                      <Row>
                        <Col sm={12}>
                          <Form.Label>
                            <strong>Qr Code Logo Image Options:</strong>
                          </Form.Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={7}>
                          <Row>
                            <Col sm={12}>
                              <Form.Group controlId="formFile" className="mb-3">
                                <Form.Control
                                  type="file"
                                  onChange={setQRFileName}
                                  accept=".png,.jpg,.jpeg"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          {/* QR Code Show */}
                          <Form.Group as={Row}>
                            <Col lg="4">
                              <Form.Label>Show Logo</Form.Label>
                            </Col>
                            <Col lg="4">
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                label=""
                                checked={showQRLogo}
                                onChange={(e) => {
                                  setShowQRLogo(e.target.checked);
                                }}
                              />
                            </Col>
                            <Col lg="8" />
                          </Form.Group>
                          {/* QR Code Logo Size */}
                          <Form.Group as={Row}>
                            <Col lg="4">
                              <Form.Label style={{ marginTop: '1rem' }}>
                                Logo Height
                              </Form.Label>
                            </Col>
                            <Col lg="2">
                              <Knob
                                size={55}
                                name="QrLogoHeight"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.logoHeight as number | 80
                                }
                                min={5}
                                max={100}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                                onChange={(e) => {
                                  updateAspectRatio(e.value, 'height', 'qr');
                                }}
                                disabled={!showQRLogo}
                              />
                            </Col>
                            <Col lg="2">
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>
                                    {isQrAspectLocked ? 'Unlock' : 'Lock'}{' '}
                                    Aspect Ratio
                                  </Tooltip>
                                }
                              >
                                <Button
                                  variant="outline-secondary"
                                  style={{ width: '100%', fontSize: '0.6rem' }}
                                  onClick={setLockQRAspectRatio}
                                  disabled={!showQRLogo}
                                >
                                  {isQrAspectLocked ? locked : unlocked} <br />
                                  Aspect Ratio
                                </Button>
                              </OverlayTrigger>
                            </Col>
                            <Col lg="3">
                              <Form.Label style={{ marginTop: '1rem' }}>
                                Logo Width
                              </Form.Label>
                            </Col>
                            <Col lg="1">
                              <Knob
                                size={55}
                                name="QrLogoWidth"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps?.logoWidth as
                                    | number
                                    | 80
                                }
                                min={5}
                                max={100}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                                onChange={(e) => {
                                  updateAspectRatio(e.value, 'width', 'qr');
                                }}
                                disabled={!showQRLogo}
                              />
                            </Col>
                          </Form.Group>
                          {/* Logo Opacity */}
                          <Form.Group as={Row}>
                            <Col lg="4">
                              <Form.Label style={{ marginTop: '1rem' }}>
                                Logo Opacity
                              </Form.Label>
                            </Col>
                            <Col lg="6">
                              <Knob
                                size={55}
                                name="QrLogoOpacity"
                                className="p-knob"
                                value={
                                  ((mainConfig?.QRSettings?.QRProps
                                    ?.logoOpacity as number) *
                                    10) |
                                  10
                                }
                                min={0}
                                max={50}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                                onChange={(e) => {
                                  setMainConfig((prevQrConfig) => {
                                    const Op = { ...prevQrConfig };
                                    Op.QRSettings.QRProps.logoOpacity =
                                      e.value / 10;
                                    return Op;
                                  });
                                }}
                                disabled={!showQRLogo}
                              />
                            </Col>
                          </Form.Group>
                          {/* Logo Padding */}
                          <Form.Group as={Row}>
                            <Col lg="4">
                              <Form.Label style={{ marginTop: '1rem' }}>
                                Logo Padding
                              </Form.Label>
                            </Col>
                            <Col lg="6">
                              <Knob
                                size={55}
                                name="QrLogoPadding"
                                className="p-knob"
                                value={
                                  mainConfig?.QRSettings?.QRProps
                                    ?.logoPadding as number | 5
                                }
                                min={0}
                                max={50}
                                strokeWidth={11}
                                textColor={dark ? 'white' : 'black'}
                                valueColor={'#0B3665'}
                                rangeColor={'#21C6DC'}
                                onChange={(e) => {
                                  setMainConfig((prevConfig) => {
                                    const qp = { ...prevConfig };
                                    qp.QRSettings.QRProps.logoPadding = e.value;
                                    return qp;
                                  });
                                }}
                                disabled={!showQRLogo}
                              />
                            </Col>
                          </Form.Group>
                          {/* Padding Style */}
                          <Form.Group as={Row}>
                            <Col lg="4">
                              <Form.Label>Padding Style</Form.Label>
                            </Col>
                            <Col lg="4">
                              <Form.Select
                                aria-label="Default select example"
                                onChange={(e) => {
                                  const eq = e.target.value as
                                    | 'circle'
                                    | 'square';
                                  setMainConfig((prevQrConfig) => {
                                    const newEq = { ...prevQrConfig };
                                    newEq.QRSettings.QRProps.logoPaddingStyle =
                                      eq;
                                    return newEq;
                                  });
                                }}
                                disabled={!showQRLogo}
                              >
                                <option value="circle">Circle</option>
                                <option value="square">Square</option>
                              </Form.Select>
                            </Col>
                          </Form.Group>
                          {/* Hide QR Behind Logo */}
                          <Form.Group as={Row}>
                            <Col lg="4">
                              <Form.Label>Hide QR Behind Logo</Form.Label>
                            </Col>
                            <Col lg="6">
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                label=""
                                checked={
                                  mainConfig.QRSettings.QRProps
                                    .removeQrCodeBehindLogo
                                }
                                disabled={!showQRLogo}
                                onChange={(e) => {
                                  setMainConfig((prevQrConfig) => {
                                    const rc = { ...prevQrConfig };
                                    rc.QRSettings.QRProps.removeQrCodeBehindLogo =
                                      e.target.checked;
                                    return rc;
                                  });
                                }}
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col lg={1} />
                        <Col sm={4}>
                          {showQRLogo ? (
                            <Col sm={4} style={{ marginTop: '1rem' }}>
                              <img
                                src={qrLogoImage}
                                alt="QR Code logo"
                                style={{
                                  width: `${mainConfig.QRSettings.QRProps.logoWidth}px`,
                                  height: `${mainConfig.QRSettings.QRProps.logoHeight}px`,
                                  opacity: mainConfig.QRSettings.QRProps
                                    .logoOpacity
                                    ? mainConfig.QRSettings.QRProps
                                        .logoOpacity / 10
                                    : 1,
                                }}
                              />
                            </Col>
                          ) : null}
                        </Col>
                      </Row>
                      {/* QR Code Logo warning */}
                      {qrLogoChanged ? (
                        <Row>
                          <Col lg="12">
                            <Alert variant="warning">
                              <Alert.Heading>
                                <strong>Warning!</strong>
                              </Alert.Heading>
                              <p>
                                The QR Code Logo Change will be reflected after
                                restarting the application.
                              </p>
                            </Alert>
                          </Col>
                        </Row>
                      ) : null}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
            {/* UTM Codes */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <strong>UTM Code Configuration</strong>
              </Accordion.Header>
              <Accordion.Body id="utm_codes">
                {/* utm configuration */}
                <Accordion>
                  {/* UTM Target */}
                  <UTMAccordianItem
                    type="utm_target"
                    itemNo="1"
                    value={config}
                    callback={updateConfig}
                  />
                  {/* UTM Source */}
                  <UTMAccordianItem
                    type="utm_source"
                    itemNo="2"
                    value={config.utm_source}
                    callback={updateConfig}
                  />
                  {/* UTM Medium */}
                  <UTMAccordianItem
                    type="utm_medium"
                    itemNo="3"
                    value={config.utm_medium}
                    callback={updateConfig}
                  />
                  {/* UTM Campaign */}
                  <UTMAccordianItem
                    type="utm_campaign"
                    itemNo="4"
                    value={config.utm_campaign}
                    callback={updateConfig}
                  />
                  {/* UTM Term */}
                  <UTMAccordianItem
                    type="utm_term"
                    itemNo="5"
                    value={config.utm_term}
                    callback={updateConfig}
                  />
                  {/* UTM Content */}
                  <UTMAccordianItem
                    type="utm_content"
                    itemNo="6"
                    value={config.utm_content}
                    callback={updateConfig}
                  />
                  {/* UTM Keyword */}
                  <UTMAccordianItem
                    type="utm_keyword"
                    itemNo="7"
                    value={config.utm_keyword}
                    callback={updateConfig}
                  />
                  {/* Team Name */}
                  <UTMAccordianItem
                    type="team_name"
                    itemNo="8"
                    value={config.team_name}
                    callback={updateConfig}
                  />
                  {/* Region Name */}
                  <UTMAccordianItem
                    type="region_name"
                    itemNo="9"
                    value={config.region_name}
                    callback={updateConfig}
                  />
                  {/* Country Selector */}
                  <Accordion.Item eventKey="10">
                    <Accordion.Header>
                      <strong>show_country</strong>
                    </Accordion.Header>
                    <Accordion.Body id="show_country">
                      <Form.Group>
                        <Form.Check
                          type="checkbox"
                          id="show_country-show"
                          label="Show Country Selector?"
                          checked={config?.show_country}
                          onChange={(e) => {
                            setConfig((prevConfig) => {
                              const newConfig = { ...prevConfig };
                              newConfig.show_country = e.target.checked;
                              return newConfig;
                            });
                          }}
                        />
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button type="button" variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ConfigEditor.propTypes = {
  showMe: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};
