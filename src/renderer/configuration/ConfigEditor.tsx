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
import { useState, useEffect, ChangeEvent, SyntheticEvent } from 'react';
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
import RangeSlider from 'react-bootstrap-range-slider';
import { IProps } from 'react-qrcode-logo';
import { SketchPicker } from 'react-color';
import NumberSpinner from './NumberSpinner';
import PropTypes from 'prop-types';
import { RGBColor } from 'react-color';
import {
  UtmParams,
  defaultUTMParams,
  QRSettings,
  defaultQRSettings,
  UtmObj,
  MainSettings,
  defaultMainSettings,
} from '../types';
import UTMAccordianItem from './UTMAccordianItem';

export default function ConfigEditor({
  showMe,
  callback,
}: {
  showMe: boolean;
  callback: (value: boolean) => void;
}): JSX.Element {
  const [show, setShow] = useState(false);
  const [config, setConfig] = useState<UtmParams>(defaultUTMParams);
  const [targetValidated, setTargetValidated] = useState(false);
  const [mainConfig, setMainConfig] =
    useState<MainSettings>(defaultMainSettings);
  const [isQrAspectLocked, setIsQrAspectLocked] = useState(false);
  const [isMainAspectLocked, setIsMainAspectLocked] = useState(false);
  const [qrImgAspect, setQrImgAspect] = useState(1);
  const [mainImgAspect, setMainImgAspect] = useState(1);
  const [displayForeColorPicker, setDisplayForeColorPicker] = useState(false);
  const [displayEyeColorPicker, setDisplayEyeColorPicker] = useState(false);
  const [displayBackColorPicker, setDisplayBackColorPicker] = useState(false);
  const [showQRLogo, setShowQRLogo] = useState(false);
  const [showMainLogo, setShowMainLogo] = useState(false);
  const [logoImage, setLogoImage] = useState(mainConfig?.QRSettings.QRProps.logoImage);
  const [mainLogoImage, setMainLogoImage] = useState(mainConfig.brandImage);
  const [mainLogoChanged, setMainLogoChanged] = useState(false);
  const [qrLogoChanged, setQrLogoChanged] = useState(false);

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

  const setLockQRAspectRatio = () => {
    setIsQrAspectLocked(!isQrAspectLocked);
  };
  const setLockMainAspectRatio = () => {
    setIsMainAspectLocked(!isMainAspectLocked);
  };
  const setAspectRatio = (width: number, height: number, which: string) => {
    if (which === 'qr') {
      setQrImgAspect(width / height);
    } else {
      setMainImgAspect(width / height);
    }
  };

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

  // get the utm_props configuration
  useEffect(() => {
    getUTMProps();
  }, []);

  const getMainProps = () => {
    window.electronAPI
      .getMainConfig()
      .then((response: string) => {
        const c: MainSettings = JSON.parse(response);
        setMainConfig(c);
        const q = c.QRSettings;
        const fg = q.QRProps.fgColor || 'rgba(66, 11, 95, 1)';
        // rgba(255, 255, 255, 1)
        const frgb = fg
          .substring(fg.indexOf('(') + 1, fg.indexOf(')'))
          .split(',');
        const newF = {
          r: parseInt(frgb[0], 10),
          g: parseInt(frgb[1], 10),
          b: parseInt(frgb[2], 10),
          a: parseInt(frgb[3], 10),
        };
        setForeColor(newF);

        const bg = q.QRProps.bgColor || 'rgba(255, 255, 255, 1)';
        const brgb = bg
          .substring(bg.indexOf('(') + 1, bg.indexOf(')')).split(',');
        const newB = {
          r: parseInt(brgb[0], 10),
          g: parseInt(brgb[1], 10),
          b: parseInt(brgb[2], 10),
          a: parseInt(brgb[3], 10),
        };
        setBackColor(newB);

        const ec = q.QRProps.eyeColor as string || 'rgba(66, 11, 95, 1)';
        const rgb = ec.substring(ec.indexOf('(') + 1, ec.indexOf(')')).split(',');
        const newColor = {
          r: parseInt(rgb[0], 10),
          g: parseInt(rgb[1], 10),
          b: parseInt(rgb[2], 10),
          a: parseInt(rgb[3], 10),
        };
        setEyeColor(newColor);
        if (c.brandImage !== '') {
          const f = new Image();
          f.src = c.brandImage;
          f.onload = () => {
            setAspectRatio(f.width, f.height, 'main');
            setMainLogoImage(f.src);
            setShowMainLogo(true);
          };
        }
        if (c.QRSettings.QRProps.logoImage !== '') {
          const f = new Image();
          f.src = c.QRSettings.QRProps?.logoImage as string || '';
          f.onload = () => {
            setAspectRatio(f.width, f.height, 'qr');
            setLogoImage(f.src);
            setShowQRLogo(true);
          };
        }
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };
  // get the main_config configuration
  useEffect(() => {
    getMainProps();
  }, []);

  const updateAspectRatio = (
    event: SyntheticEvent, //React.ChangeEvent<HTMLInputElement>,
    setting: string,
    which: string
  ) => {
    const ev = event as React.ChangeEvent<HTMLInputElement>;
    const v = event.target?.value as string;
    if (v !== '') {
      if (which === 'qr') {
        if (isQrAspectLocked) {
          setMainConfig((prevState) => {
            const p = { ...prevState };
            const q = { ...p.QRSettings };
            (q.QRProps.logoHeight = parseInt(v, 10)),
              (q.QRProps.logoWidth = (parseInt(v, 10) * qrImgAspect).toFixed(
                0
              ) as unknown as number);
            p.QRSettings = q;
            return p;
          });
        } else if (setting === 'logoHeight') {
          setMainConfig((prevState) => {
            const p = { ...prevState };
            const q = { ...p.QRSettings };
            q.QRProps.logoHeight = parseInt(event.target.value, 10);
            p.QRSettings = q;
            return p;
          });
        } else {
          setMainConfig((prevState) => {
            const r = { ...prevState };
            const q = { ...r.QRSettings };
            q.QRProps.logoWidth = parseInt(event.target.value, 10);
            r.QRSettings = q;
            return r;
          });
        }
      } else {
        if (isMainAspectLocked) {
          setMainConfig((prevState) => {
            const p = { ...prevState };
            (p.brandHeight = parseInt(v, 10)),
              (p.brandWidth = (parseInt(v, 10) * qrImgAspect).toFixed(
                0
              ) as unknown as number);
            return p;
          });
        } else if (setting === 'logoHeight') {
          setMainConfig((prevState) => {
            const q = { ...prevState };
            q.brandHeight = parseInt(event.target.value, 10);
            return q;
          });
        } else {
          setMainConfig((prevState) => {
            const r = { ...prevState };
            r.brandWidth = parseInt(event.target.value, 10);
            return r;
          });
        }
      }
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

  useEffect(() => {
    setShow(showMe);
    if (showMe) {
      getMainProps();
      getUTMProps();
    }
  }, [showMe]);

  /* handle closing without saving */
  const handleCancel = () => {
    handleClose();
    callback(false);
  };

  const setMainFileName = (result: SyntheticEvent) => {
    const read = new FileReader();
    read.readAsDataURL(result.target.files[0]);
    read.onloadend = () => {
      const fi = new Image();
      fi.src = read.result as string;
      fi.onload = () => {
        const h = fi.height;
        const w = fi.width;
        setMainConfig((prevMainConfig) => {
          const con = { ...prevMainConfig };
          con.brandImage = fi.src;
          con.brandHeight = h;
          con.brandWidth = w;
          con.brandOpacity = 10.0;
          return con;
        });
        setAspectRatio(w, h, 'main');
        setIsMainAspectLocked(true);
        setShowMainLogo(true);
      };
    };
    setMainLogoChanged(true);
  };

  const setQRFileName = (result: SyntheticEvent) => {
    const read = new FileReader();
    read.readAsDataURL(result.target.files[0]);
    read.onloadend = () => {
      const fi = new Image();
      fi.src = read.result as string;
      fi.onload = () => {
        const h = fi.height;
        const w = fi.width;
        setMainConfig((prevQrConfig) => {
          const c = { ...prevQrConfig };
          const con = { ...c.QRSettings };
          con.QRProps.logoImage = fi.src;
          con.QRProps.logoHeight = h;
          con.QRProps.logoWidth = w;
          con.QRProps.logoOpacity = 10.0;
          c.QRSettings = con;
          return c;
        });
        setAspectRatio(w, h, 'qr');
        setIsQrAspectLocked(true);
        setShowQRLogo(true);
      };
    };
    setQrLogoChanged(true);
  };
  function callDone() {
    callback(false);
  }
  /* handle the save button */
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

  // Handle the Foreground Color Change
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

  // Handle clicking on the Background Color
  const handleBackColorClick = () => {
    setDisplayBackColorPicker(!displayBackColorPicker);
  };

  // Handle closing the background Color Picker
  const handleBackColorClose = () => {
    setDisplayBackColorPicker(false);
  };

  // Handle the Background Color Change
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
  // Handle the Eye Color Change
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
                              placeholder="Enter utm_source field tooltip"
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
                          <Col sm={8}>
                            <Form.Group controlId="formFile" className="mb-3">
                              <Form.Label>Choose Main Image</Form.Label>
                              <Form.Control
                                type="file"
                                onChange={setMainFileName}
                                accept=".png,.jpg,.jpeg"
                              />
                            </Form.Group>
                          </Col>
                          {showMainLogo ? (
                            <Col sm={4}>
                              <img
                                src={mainConfig.brandImage as string}
                                alt="Main Logo"
                                style={{
                                  width: `${mainConfig.brandWidth}px`,
                                  height: `${mainConfig.brandHeight}px`,
                                  opacity: mainConfig.brandOpacity
                                    ? mainConfig.brandOpacity / 10
                                    : 1,
                                }}
                                // height={mainConfig.brandHeight as number}
                                // width={mainConfig.brandWidth as number}
                                // style={{ opacity: `"${mainConfig.brandOpacity as number}"` }}
                              />
                            </Col>
                          ) : null}
                        </Row>
                        {/* Show Main Logo */}
                        <Form.Group as={Row}>
                          <Col lg="2">
                            <Form.Label>Show Logo</Form.Label>
                          </Col>
                          <Col lg="2">
                            <Form.Check
                              type="switch"
                              id="custom-switch"
                              label=""
                              checked={showMainLogo}
                              onChange={(e) => {
                                // setLogoImage(
                                //   e.target.checked ? mainConfig.brandImage : ''
                                // );
                                setShowMainLogo(e.target.checked);
                              }}
                            />
                          </Col>
                          <Col lg="8" />
                        </Form.Group>
                        {/* Main Logo Height */}
                        <Form.Group as={Row}>
                          <Col lg="2">
                            <Form.Label>Logo Height</Form.Label>
                          </Col>
                          <Col lg="2">
                            <Form.Control
                              defaultValue={mainConfig.brandHeight}
                              value={mainConfig.brandHeight}
                              onChange={(e) => {
                                updateAspectRatio(e, 'logoWidth', 'qr');
                              }}
                              disabled={!showMainLogo}
                            />
                          </Col>
                          <Col lg="6">
                            <RangeSlider
                              value={mainConfig.brandHeight || 20}
                              min={5}
                              max={300}
                              onChange={(e) => {
                                updateAspectRatio(e, 'logoHeight', 'main');
                                setMainConfig((prevMainConfig) => {
                                  const qp = { ...prevMainConfig };
                                  qp.brandHeight = parseInt(e.target.value, 10);
                                  return qp;
                                });
                              }}
                              disabled={!showMainLogo}
                            />
                          </Col>
                        </Form.Group>
                        {/*  Main Logo Lock Aspect */}
                        <Form.Group as={Row}>
                          <Col lg="8" />
                          <Col lg="4">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Lock Aspect Ratio</Tooltip>}
                            >
                              <Button
                                variant="outline-secondary"
                                style={{ width: '20%' }}
                                onClick={setLockMainAspectRatio}
                                disabled={!showMainLogo}
                              >
                                {isMainAspectLocked ? locked : unlocked}
                              </Button>
                            </OverlayTrigger>
                          </Col>
                        </Form.Group>
                        {/*  Main Logo Width */}
                        <Form.Group as={Row}>
                          <Col lg="2">
                            <Form.Label>Logo Width</Form.Label>
                          </Col>
                          <Col lg="2">
                            <Form.Control
                              defaultValue={mainConfig.brandWidth}
                              value={mainConfig.brandWidth}
                              disabled={!showMainLogo}
                              onChange={(e) => {
                                updateAspectRatio(e, 'logoWidth', 'main');
                              }}
                            />
                          </Col>
                          <Col lg="6">
                            <RangeSlider
                              value={mainConfig.brandWidth}
                              min={5}
                              max={300}
                              disabled={!showMainLogo}
                              onChange={(e) => {
                                updateAspectRatio(e, 'logoWidth', 'main');
                              }}
                            />
                          </Col>
                        </Form.Group>
                        {/*  Main Logo Opacity */}
                        <Form.Group as={Row}>
                          <Col lg="4">
                            <Form.Label>Logo Opacity</Form.Label>
                          </Col>
                          <Col lg="6">
                            <RangeSlider
                              value={
                                mainConfig.brandOpacity
                                  ? mainConfig.brandOpacity
                                  : 10
                              }
                              min={0}
                              max={10}
                              disabled={!showMainLogo}
                              onChange={(e) => {
                                const opacity = parseInt(e.target.value, 10);
                                setMainConfig((prevMainConfig) => {
                                  const Op = { ...prevMainConfig };
                                  Op.brandOpacity = opacity;
                                  return Op;
                                });
                              }}
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
                                  The Main Logo Change will be reflected after
                                  restarting the application.
                                </p>
                              </Alert>
                            </Col>
                          </Row>
                        ) : null}
                      </Form>
                    </Accordion.Body>
                  </Accordion.Item>
                  {/* QR Code Configuration */}
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>
                      <strong>Configure QR Code</strong>
                    </Accordion.Header>
                    <Accordion.Body id="qr">
                      <Form.Label>
                        <strong>Colors:</strong>
                      </Form.Label>
                      <Form.Group as={Row}>
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
                            <div style={{
                              width: '36px',
                              height: '14px',
                              borderRadius: '2px',
                              backgroundColor: `rgba(${foreColor.r}, ${foreColor.g}, ${foreColor.b}, ${foreColor.a})`,
                            }} />
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
                                color={mainConfig.QRSettings.QRProps.fgColor}
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
                      <Form.Group as={Row}>
                        <Col lg="6">
                          <Form.Label>
                            <strong>QR Code Style</strong>
                          </Form.Label>
                        </Col>
                        <Col lg="6">
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
                      </Form.Group>
                      <hr />
                      <Form.Group as={Row}>
                        <Col lg="6">
                          <Form.Label>
                            <strong>Error Correction: </strong>
                          </Form.Label>
                        </Col>
                        <Col lg="6">
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
                      </Form.Group>
                      <hr />
                      <Form.Group as={Row}>
                        <Col sm="6">
                          <Form.Label>
                            <strong>Quiet Zone:</strong>
                          </Form.Label>
                        </Col>
                        <Col lg="6">
                          <NumberSpinner
                            min={0}
                            max={50}
                            step={1}
                            style={{ width: '100%' }}
                            value={
                              mainConfig.QRSettings.QRProps.quietZone as number
                            }
                            callback={(value: number) => {
                              setMainConfig((prevQrConfig) => {
                                const qp = { ...prevQrConfig };
                                const qps = { ...qp.QRSettings };
                                qps.QRProps.quietZone = value;
                                qp.QRSettings = qps;
                                return qp;
                              });
                            }}
                          />
                        </Col>
                      </Form.Group>
                      <hr />
                      <Row>
                        <Col sm={8}>
                          <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Choose Image</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={setQRFileName}
                              accept=".png,.jpg,.jpeg"
                            />
                          </Form.Group>
                        </Col>
                        {showQRLogo ? (
                          <Col sm={4}>
                            <img
                              src={mainConfig.QRSettings.QRProps.logoImage}
                              alt="QR Code logo"
                              style={{
                                width: `${mainConfig.QRSettings.QRProps.logoWidth}px`,
                                height: `${mainConfig.QRSettings.QRProps.logoHeight}px`,
                                opacity: mainConfig.QRSettings.QRProps
                                  .logoOpacity
                                  ? mainConfig.QRSettings.QRProps.logoOpacity /
                                    10
                                  : 1,
                              }}
                            />
                          </Col>
                        ) : null}
                      </Row>
                      <Form.Group as={Row}>
                        <Col lg="2">
                          <Form.Label>Show Logo</Form.Label>
                        </Col>
                        <Col lg="2">
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            label=""
                            checked={showQRLogo}
                            onChange={(e) => {
                              setLogoImage(
                                e.target.checked
                                  ? mainConfig.QRSettings.QRProps.logoImage
                                  : ''
                              );
                              setShowQRLogo(e.target.checked);
                            }}
                          />
                        </Col>
                        <Col lg="8" />
                      </Form.Group>

                      <Form.Group as={Row}>
                        <Col lg="2">
                          <Form.Label>Logo Height</Form.Label>
                        </Col>
                        <Col lg="2">
                          <Form.Control
                            defaultValue={
                              mainConfig.QRSettings.QRProps.logoHeight
                            }
                            value={mainConfig.QRSettings.QRProps.logoHeight}
                            onChange={(e) => {
                              updateAspectRatio(e, 'logoWidth', 'qr');
                            }}
                            disabled={!showQRLogo}
                          />
                        </Col>
                        <Col lg="6">
                          <RangeSlider
                            value={
                              mainConfig.QRSettings.QRProps.logoHeight as number
                            }
                            min={5}
                            max={300}
                            onChange={(e) => {
                              updateAspectRatio(e, 'logoHeight', 'qr');
                              setMainConfig((prevQrConfig) => {
                                const qp = { ...prevQrConfig };
                                const q = { ...qp.QRSettings };
                                q.QRProps.logoHeight = parseInt(
                                  e.target.value,
                                  10
                                );
                                qp.QRSettings = q;
                                return qp;
                              });
                            }}
                            disabled={!showQRLogo}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Col lg="8" />
                        <Col lg="4">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Lock Aspect Ratio</Tooltip>}
                          >
                            <Button
                              variant="outline-secondary"
                              style={{ width: '20%' }}
                              onClick={setLockQRAspectRatio}
                              disabled={!showQRLogo}
                            >
                              {isQrAspectLocked ? locked : unlocked}
                            </Button>
                          </OverlayTrigger>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Col lg="2">
                          <Form.Label>Logo Width</Form.Label>
                        </Col>
                        <Col lg="2">
                          <Form.Control
                            defaultValue={
                              mainConfig.QRSettings.QRProps.logoWidth
                            }
                            value={mainConfig.QRSettings.QRProps.logoWidth}
                            disabled={!showQRLogo}
                            onChange={(e) => {
                              updateAspectRatio(e, 'logoWidth', 'qr');
                            }}
                          />
                        </Col>
                        <Col lg="6">
                          <RangeSlider
                            value={
                              mainConfig.QRSettings.QRProps.logoWidth as number
                            }
                            min={5}
                            max={300}
                            disabled={!showQRLogo}
                            onChange={(e) => {
                              updateAspectRatio(e, 'logoWidth', 'qr');
                            }}
                          />
                        </Col>
                      </Form.Group>
                      {/* Logo Opacity */}
                      <Form.Group as={Row}>
                        <Col lg="4">
                          <Form.Label>Logo Opacity</Form.Label>
                        </Col>
                        <Col lg="6">
                          <RangeSlider
                            value={
                              mainConfig.QRSettings.QRProps.logoOpacity
                                ? mainConfig.QRSettings.QRProps.logoOpacity * 10
                                : 10
                            }
                            min={0}
                            max={10}
                            disabled={!showQRLogo}
                            onChange={(e) => {
                              setMainConfig((prevQrConfig) => {
                                const Op = { ...prevQrConfig };
                                const Qp = { ...Op.QRSettings };
                                Qp.QRProps.logoOpacity =
                                  parseInt(e.target.value, 10) / 10;
                                Op.QRSettings = Qp;
                                return Op;
                              });
                            }}
                          />
                        </Col>
                      </Form.Group>
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
                                const qr = { ...rc.QRSettings };
                                qr.QRProps.removeQrCodeBehindLogo =
                                  e.target.checked;
                                rc.QRSettings = qr;
                                return rc;
                              });
                            }}
                          />
                        </Col>
                      </Form.Group>
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
