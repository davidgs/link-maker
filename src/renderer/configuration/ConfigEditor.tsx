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
import { Accordion, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { UtmParams, defaultUTMParams, UtmKeyValue } from '../types';
import PillArea from './pills/PillArea';

export default function ConfigEditor({
  showMe,
  callback,
}: {
  showMe: boolean;
  callback: (value: boolean) => void;
}): JSX.Element {
  const [show, setShow] = useState(false);
  const [config, setConfig] = useState<UtmParams>(defaultUTMParams);
  const [baseVal, setBaseVal] = useState('');
  const [termVal, setTermVal] = useState('');
  const [teamVal, setTeamVal] = useState('');
  const [contentVal, setContentVal] = useState('');
  const [sourceVal, setSourceVal] = useState('');
  const [campaignVal, setCampaignVal] = useState('');
  const [keyVal, setKeyVal] = useState('');
  const [campValid, setCampValid] = useState(true);
  const [teamValid, setTeamValid] = useState(true);
  const [sourceValid, setSourceValid] = useState(true);
  const [regionVal, setRegionVal] = useState('');
  const [regValid, setRegValid] = useState(true);
  const [mediumVal, setMediumVal] = useState('');
  const [medValid, setMedValid] = useState(true);
  const [targetValidated, setTargetValidated] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // get the configuration
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    setShow(showMe);
  }, [showMe]);

  const deletePillValue = (value: string, type: string) => {
    switch (type) {
      case 'utm_target':
        const newB = Object.entries(config.utm_bases);
        const bLen = newB.length;
        const entries: UtmKeyValue[] = newB[bLen - 1][1] as UtmKeyValue[];
        for (let i = 0; i < entries.length; i += 1) {
          if (entries[i].value === value) {
            entries.splice(i, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newBase = {
            ...newConfig.utm_bases,
          };
          newBase.value = entries;
          newConfig.utm_bases = newBase;
          return newConfig;
        });
        break;
      case 'utm_term':
        const newT = Object.entries(config.utm_term);
        const tLen = newT.length;
        const tEntries: UtmKeyValue[] = newT[tLen - 1][1] as UtmKeyValue[];
        for (let t = 0; t < tEntries.length; t += 1) {
          if (tEntries[t].value === value) {
            tEntries.splice(t, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTerm = {
            ...newConfig.utm_term,
          };
          newTerm.value = tEntries;
          newConfig.utm_term = newTerm;
          return newConfig;
        });
        break;
      case 'utm_medium':
        const newM = Object.entries(config.utm_medium);
        const mLen = newM.length;
        const mEntries: UtmKeyValue[] = newM[mLen - 1][1] as UtmKeyValue[];
        for (let n = 0; n < mEntries.length; n += 1) {
          if (mEntries[n].value === value) {
            mEntries.splice(n, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newMed = {
            ...newConfig.utm_medium,
          };
          newMed.value = mEntries;
          newConfig.utm_medium = newMed;
          return newConfig;
        });
        break;
      case 'utm_source':
        const newS = Object.entries(config.utm_source);
        const sLen = newS.length;
        const sEntries: UtmKeyValue[] = newS[sLen - 1][1] as UtmKeyValue[];
        for (let n = 0; n < sEntries.length; n += 1) {
          if (sEntries[n].value === value) {
            sEntries.splice(n, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newSource = {
            ...newConfig.utm_source,
          };
          newSource.value = sEntries;
          newConfig.utm_source = newSource;
          return newConfig;
        });
        break;
      case 'utm_content':
        const newC = Object.entries(config.utm_content);
        const cLen = newC.length;
        const cEntries: UtmKeyValue[] = newC[cLen - 1][1] as UtmKeyValue[];
        for (let n = 0; n < cEntries.length; n += 1) {
          if (cEntries[n].value === value) {
            cEntries.splice(n, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newCont = {
            ...newConfig.utm_content,
          };
          newCont.value = cEntries;
          newConfig.utm_content = newCont;
          return newConfig;
        });
        break;
      case 'utm_keyword':
        const newK = Object.entries(config.utm_keyword);
        const kLen = newK.length;
        const kEntries: UtmKeyValue[] = newK[kLen - 1][1] as UtmKeyValue[];
        for (let n = 0; n < kEntries.length; n += 1) {
          if (kEntries[n].value === value) {
            kEntries.splice(n, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newKey = {
            ...newConfig.utm_keyword,
          };
          newKey.value = mEntries;
          newConfig.utm_keyword = newKey;
          return newConfig;
        });
        break;
      case 'utm_campaign':
        const newCam = Object.entries(config.utm_campaign);
        const camLen = newCam.length;
        const camEntries: UtmKeyValue[] = newCam[camLen - 1][1] as UtmKeyValue[];
        for (let n = 0; n < camEntries.length; n += 1) {
          if (camEntries[n].value === value) {
            camEntries.splice(n, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newCa = {
            ...newConfig.utm_campaign,
          };
          newCa.value = camEntries;
          newConfig.utm_keyword = newCa;
          return newConfig;
        });
        break;
      case 'team_name':
        const newTea = Object.entries(config.team_name);
        const len = newTea.length;
        const teaEntries: UtmKeyValue[] = newTea[len - 1][1] as UtmKeyValue[];
        for (let tn = 0; tn < teaEntries.length; tn += 1) {
          if (teaEntries[tn].value === value) {
            teaEntries.splice(tn, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTeam = {
            ...newConfig.team_name,
          };
          newTeam.value = teaEntries;
          newConfig.team_name = newTeam;
          return newConfig;
        });
        break;
      case 'region_name':
        const newReg = Object.entries(config.region_name);
        const gLen = newReg.length;
        const rEntries: UtmKeyValue[] = newReg[gLen - 1][1] as UtmKeyValue[];
        for (let i = 0; i < rEntries.length; i += 1) {
          if (rEntries[i].value === value) {
            rEntries.splice(i, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTeam = {
            ...newConfig.region_name,
          };
          newTeam.value = rEntries;
          newConfig.region_name = newTeam;
          return newConfig;
        });
        break;
      default:
        break;
    }
  };

  const addPill = (event: SyntheticEvent, type: string) => {
    const target = event.target as HTMLInputElement;
    switch (type) {
      case 'utm_target':
        setBaseVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        setBaseVal('');
        const newTar = config.utm_bases.value;
        const newTarPill = {
          key: target?.value?.replace(/,/g, ''),
          value: target?.value?.replace(/,/g, ''),
        };
        newTar.push(newTarPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newBase = {
            ...newConfig.utm_bases,
          };
          newBase.value = newTar;
          newConfig.utm_bases = newBase;
          return newConfig;
        });
        break;
      case 'utm_term':
        setTermVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        if (target?.value.indexOf('=') === -1) {
          setSourceValid(false);
          return;
        }
        setTermVal('');
        const newTrm = config.utm_term.value;
        const newTrmPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
          value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
        };
        newTrm.push(newTrmPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTerm = {
            ...newConfig.utm_term,
          };
          newTerm.value = newTrm;
          newConfig.utm_term = newTerm;
          return newConfig;
        });
        break;
      case 'utm_medium':
        setMediumVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        if (target?.value.indexOf('=') === -1) {
          setMedValid(false);
          return;
        }
        setMediumVal('');
        const newMeds = config.utm_medium.value;
        const newMedPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
          value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
        };
        newMeds.push(newMedPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newMed = {
            ...newConfig.utm_medium,
          };
          newMed.value = newMeds;
          newConfig.utm_medium = newMed;
          return newConfig;
        });
        break;
      case 'utm_source':
        setSourceVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        if (target?.value.indexOf('=') === -1) {
          setSourceValid(false);
          return;
        }
        setSourceVal('');
        const newSou = config.utm_source.value as UtmKeyValue[];
        const newSouPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
          value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
        };
        newSou.push(newSouPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newSource = {
            ...newConfig.utm_source,
          };
          newSource.value = newSou;
          newConfig.utm_source = newSource;
          return newConfig;
        });
        break;
      case 'utm_content':
        setContentVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        if (target?.value.indexOf('=') === -1) {
          setTeamValid(false);
          return;
        }
        setContentVal('');
        const newCont = config.utm_content.value as UtmKeyValue[];
        const newContPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
          value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
        };
        newCont.push(newContPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newSource = {
            ...newConfig.utm_content,
          };
          newSource.value = newCont;
          newConfig.utm_content = newSource;
          return newConfig;
        });
        break;
      case 'utm_keyword':
        setKeyVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        setKeyVal('');
        if (target?.value.indexOf('=') === -1) {
          setTeamValid(false);
          return;
        }
        setTeamVal('');
        const newKey = config.utm_keyword.value as UtmKeyValue[];
        const newKeyPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
          value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
        };
        newKey.push(newKeyPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newKeyW = {
            ...newConfig.utm_keyword,
          };
          newKeyW.value = newKey;
          newConfig.utm_source = newKeyW;
          return newConfig;
        });
        break;
      case 'utm_campaign':
        setCampaignVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        setCampaignVal('');
        if (target?.value.indexOf('=') === -1) {
          setTeamValid(false);
          return;
        }
        setTeamVal('');
        const newCam = config.utm_campaign.value as UtmKeyValue[];
        const newCamPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
          value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
        };
        newCam.push(newCamPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newCamp = {
            ...newConfig.utm_campaign,
          };
          newCamp.value = newCam;
          newConfig.utm_campaign = newCamp;
          return newConfig;
        });
        break;
      case 'team_name':
        setTeamVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        if (target?.value.indexOf('=') === -1) {
          setTeamValid(false);
          return;
        }
        setTeamVal('');
        const newTm = config.team_name.value as UtmKeyValue[];
        const newTmPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
          value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
        };
        newTm.push(newTmPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTeam = {
            ...newConfig.team_name,
          };
          newTeam.value = newTm;
          newConfig.team_name = newTeam;
          return newConfig;
        });
        break;
      case 'region_name':
        setRegionVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        if (target?.value.indexOf('=') === -1) {
          setRegValid(false);
          return;
        }
        setRegionVal('');
        const newR = config.region_name.value;
        const newRPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1],
          value: target?.value?.replace(/,/g, '').split('=')[0],
        };
        newR.push(newRPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTeam = {
            ...newConfig.region_name,
          };
          newTeam.value = newR;
          newConfig.region_name = newTeam;
          return newConfig;
        });
        break;
      default:
        break;
    }
  };

  const setFieldValue = (event: ChangeEvent, type: string) => {
    const target = event.target as HTMLInputElement;
    const ind = target?.value.indexOf('(');
    const nv =
      target?.value.indexOf('(') > -1
        ? target?.value.substring(0, target?.value.indexOf('(') - 1).trim()
        : target?.value;
    switch (type) {
      case 'utm_target':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newVal = {
            ...newConfig.utm_target,
          };
          newVal.label = nv;
          newConfig.utm_target = newVal;
          return newConfig;
        });
        break;
      case 'utm_term':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newVal = {
            ...newConfig.utm_term,
          };
          newVal.label = nv;
          newConfig.utm_term = newVal;
          return newConfig;
        });
        break;
      case 'utm_medium':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newVal = {
            ...newConfig.utm_medium,
          };
          newVal.label = nv;
          newConfig.utm_medium = newVal;
          return newConfig;
        });
        break;
      case 'utm_source':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newSou = {
            ...newConfig.utm_source,
          };
          newSou.label = nv;
          newConfig.utm_source = newSou;
          return newConfig;
        });
        break;
      case 'utm_content':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newCon = {
            ...newConfig.utm_content,
          };
          newCon.label = nv;
          newConfig.utm_content = newCon;
          return newConfig;
        });
        break;
      case 'utm_keyword':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newKey = {
            ...newConfig.utm_keyword,
          };
          newKey.label = nv;
          newConfig.utm_keyword = newKey;
          return newConfig;
        });
        break;
      case 'utm_campaign':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newCamp = {
            ...newConfig.utm_campaign,
          };
          newCamp.label = nv;
          newConfig.utm_campaign = newCamp;
          return newConfig;
        });
        break;
      case 'team_name':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newVal = {
            ...newConfig.team_name,
          };
          newVal.label = nv;
          newConfig.team_name = newVal;
          return newConfig;
        });
        break;
      case 'region_name':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newReg = {
            ...newConfig.region_name,
          };
          newReg.label = nv;
          newConfig.region_name = newReg;
          return newConfig;
        });
        break;
      case 'bitly_config':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newBit = {
            ...newConfig.bitly_config,
          };
          newBit.label = nv;
          newConfig.bitly_config = newBit;
          return newConfig;
        });
        break;
      default:
        break;
    }
  };
  /* handle closing without saving */
  const handleCancel = () => {
    handleClose();
    callback(false);
  };

  const handleRadioChange = (event: ChangeEvent) => {
    event.persist();
    const target = event.target as HTMLInputElement;
    // setItem(prevState => ({
    //   ...prevState,
    //   kindOfStand: e.target.value
    // }));
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
        callDone();
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  return (
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
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <strong>Bit.ly Configuration</strong>
                  </Accordion.Header>
                  <Accordion.Body id="bitly">
                    <Form noValidate validated={targetValidated}>
                {/*
                  - bitly token
                  label: string;
  ariaLabel: string;
  tooltip: string;
  error: string;
  bitlyToken: string;
  bitlyDomain: string;
  bitlyAddr: string;
  bitlyEnabled: boolean;
                  - Header Image
                  - QR Code Logo Image
                  - QR Code Design
                 */}
                { config.bitly_config.useValue ? (
                  <>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="bitly_config-label"
                    placeholder="Enter Bitly Switch label"
                    value={`${config.bitly_config.label}`}
                    onChange={(e) => {
                      setFieldValue(e, 'bitly_config');
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="bitly_config-tooltip"
                    placeholder="Enter utm_source field tooltip"
                    value={config.bitly_config.tooltip}
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
                    value={config.bitly_config.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.bitly_config };
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
                      value={config.bitly_config.bitlyToken}
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
                      value={config.bitly_config.bitlyDomain}
                      required
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
                  // key="show-utm_source"
                  label="Enable using Bit.ly?"
                  checked={config.bitly_config.useValue}
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
                {/* <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <strong>Configure Images</strong>
                  </Accordion.Header>
                  <Accordion.Body id="images">
                    <Form noValidate validated={targetValidated}>
                { config.bitly_config.useValue ? (
                  <>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="bitly_config-label"
                    placeholder="Enter Bitly Switch label"
                    value={`${config.bitly_config.label}`}
                    onChange={(e) => {
                      setFieldValue(e, 'bitly_config');
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="bitly_config-tooltip"
                    placeholder="Enter utm_source field tooltip"
                    value={config.bitly_config.tooltip}
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
                    value={config.bitly_config.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.bitly_config };
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
                      value={config.bitly_config.bitlyToken}
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
                      value={config.bitly_config.bitlyDomain}
                      required
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
                  // key="show-utm_source"
                  label="Enable using Bit.ly?"
                  checked={config.bitly_config.useValue}
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
                </Accordion.Item> */}
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
          {/* utm configuration */}
          {/* UTM Target */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <strong>utm_target</strong>
            </Accordion.Header>
            <Accordion.Body id="utm_target">
              <Form noValidate validated={targetValidated}>
                <Form.Group>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_target_label"
                    id="utm_target-label"
                    placeholder="Enter utm_target field label"
                    value={
                      config.utm_target.showName
                        ? `${config.utm_target.label} (utm_target)`
                        : `${config.utm_target.label}`
                    }
                    onChange={(e) => {
                      setFieldValue(e, 'utm_target');
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    // key="show-utm_target"
                    id="utm_target-show"
                    label="Show 'utm_target' in Field Label?"
                    checked={config.utm_target.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTarget = {
                          ...newConfig.utm_target,
                        };
                        newTarget.showName = e.target.checked;
                        newConfig.utm_target = newTarget;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_target_tooltip"
                    id="utm_target-tooltip"
                    placeholder="Enter utm_target field tooltip"
                    value={config.utm_target.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTarget = {
                          ...newConfig.utm_target,
                        };
                        newTarget.tooltip = e.target.value;
                        newConfig.utm_target = newTarget;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_target_aria"
                    id="utm_target-aria"
                    placeholder="Enter utm_target field ARIA (Accessibility) label"
                    required
                    value={config.utm_target.ariaLabel}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTarget = {
                          ...newConfig.utm_target,
                        };
                        newTarget.ariaLabel = e.target.value;
                        newConfig.utm_target = newTarget;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_target_error"
                    id="utm_target-error"
                    placeholder="Enter utm_target field tooltip"
                    value={config.utm_target.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTarget = {
                          ...newConfig.utm_target,
                        };
                        newTarget.error = e.target.value;
                        newConfig.utm_target = newTarget;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_target-restrict_bases"
                    // key="restrict-bases"
                    label="Restrict base URLs for utm_targets?"
                    checked={config.restrict_bases}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        newConfig.restrict_bases = e.target.checked;
                        return newConfig;
                      });
                    }}
                  />
                  {config.restrict_bases && (
                    <Form.Group>
                      <Form.Label>
                        <strong>Base URLs</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        // key="utm_target-bases"
                        id="utm_target-bases"
                        placeholder="Enter comma-separated list of URLs to use for restricted utm_target bases"
                        value={baseVal}
                        required
                        pattern="/^(http[s]*)|(^ftp):\/\/ /"
                        onChange={(eventKey) => {
                          addPill(eventKey, 'utm_target');
                        }}
                      />
                      <PillArea
                        pills={config.utm_bases.value}
                        type="utm_target"
                        callback={deletePillValue}
                      />
                    </Form.Group>
                  )}
                </Form.Group>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Source */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <strong>utm_source</strong>
            </Accordion.Header>
            <Accordion.Body id="utm_source">
              <Form.Group>
                { config.utm_source.useValue ? (
                  <>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_source_label"
                    id="utm_source-label"
                    placeholder="Enter utm_source field label"
                    value={
                      config.utm_source.showName
                        ? `${config.utm_source.label} (utm_source)`
                        : `${config.utm_source.label}`
                    }
                    onChange={(e) => {
                      setFieldValue(e, 'utm_source');
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_source-show"
                    // key="show-utm_source"
                    label="Show 'utm_source' in Field Label?"
                    checked={config.utm_source.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.showName = e.target.checked;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_source_tooltip"
                    id="utm_source-tooltip"
                    placeholder="Enter utm_source field tooltip"
                    value={config.utm_source.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.tooltip = e.target.value;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_source-aria"
                    placeholder="Enter utm_source field ARIA (Accessibility) label"
                    value={config.utm_source.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.ariaLabel = e.target.value;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_source_error"
                    id="utm_source-error"
                    placeholder="Enter utm_source field error mesage"
                    value={config.utm_source.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.error = e.target.value;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  { config.utm_source.isChooser ? (
                    <>
                    <Form.Label>
                      <strong>Source Values</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter comma-separated list of key=value pairs to use"
                      value={sourceVal}
                      required
                      id="utm_source-values"
                      isInvalid={!sourceValid}
                      onChange={(eventKey) => {
                        addPill(eventKey, 'utm_source');
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      You must provide a key=value pair.
                    </Form.Control.Feedback>
                    <PillArea
                      pills={config.utm_source.value}
                      type="utm_source"
                      callback={deletePillValue}
                    />
                    </> ) : (
                      <></>
                    )}
                </>
                ) : (
                  <></>
                )}
              </Form.Group>
              <Form.Check
                  type="checkbox"
                  id="utm_source-use"
                  // key="show-utm_source"
                  label="Use 'utm_source' value?"
                  checked={config.utm_source.useValue}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newSource = { ...newConfig.utm_source };
                      newSource.useValue = e.target.checked;
                      newConfig.utm_source = newSource;
                      return newConfig;
                    });
                  }}
              />
              { config.utm_source.useValue ? (
                  <Form.Group>
                    <Form.Check
                    inline
                    type="radio"
                    value='utm_source-chooser'
                    id="utm_source-use-chooser"
                    // key="show-utm_source"
                    label="Use Chooser"
                    checked={config.utm_source.isChooser}
                    onChange={(e) => {
                      console.log(`e.target.checked: ${e.target.checked}`)
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.isChooser = e.target.checked;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    value='utm_source-text'
                    id="utm_source-use-text"
                    // key="show-utm_source"
                    label="Use Text Input"
                    checked={!config.utm_source.isChooser}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.isChooser = !e.target.checked;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  </Form.Group>
                ) : (
                  <></>
                )
              }
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Medium */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <strong>utm_medium</strong>
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group>
                {config.utm_medium.useValue ? (
                  <>
                  <Form.Label>
                  <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_medium-label"
                    // key="utm_medium-label"
                    placeholder="Enter utm_medium field label"
                    value={
                      config.utm_medium.showName
                        ? `${config.utm_medium.label} (utm_medium)`
                        : `${config.utm_medium.label}`
                    }
                    onChange={(e) => {
                      setFieldValue(e, 'utm_medium');
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    // key="show-utm_medium"
                    id="show-utm-medium"
                    label="Show 'utm_medium' in Field Label?"
                    checked={config.utm_medium.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newMedium = { ...newConfig.utm_medium };
                        newMedium.showName = e.target.checked;
                        newConfig.utm_medium = newMedium;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_medium-tooltip"
                    id="utm_medium-tooltip"
                    placeholder="Enter utm_medium field tooltip"
                    value={config.utm_medium.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newMedium = { ...newConfig.utm_medium };
                        newMedium.tooltip = e.target.value;
                        newConfig.utm_medium = newMedium;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_medium-aria"
                    id="utm_medium-aria"
                    placeholder="Enter utm_medium field ARIA (Accessibility) label"
                    value={config.utm_medium.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newMedium = { ...newConfig.utm_medium };
                        newMedium.ariaLabel = e.target.value;
                        newConfig.utm_medium = newMedium;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_medium-error"
                    id="utm_medium-error"
                    placeholder="Enter utm_medium field error mesage"
                    value={config.utm_medium.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newMedium = { ...newConfig.utm_medium };
                        newMedium.error = e.target.value;
                        newConfig.utm_medium = newMedium;
                        return newConfig;
                      });
                    }}
                  />
                {config.utm_medium.isChooser ? (
                  <>
                <Form.Label>
                  <strong>Medium Values</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_medium-values"
                  placeholder="Enter comma-separated list of values to use"
                  value={mediumVal}
                  required
                  id="utm_medium-values"
                  isInvalid={!medValid}
                  onChange={(eventKey) => {
                    addPill(eventKey, 'utm_medium');
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  You must provide a key=value pair.
                </Form.Control.Feedback>
                <PillArea
                  pills={config.utm_medium.value}
                  type="utm_medium"
                  callback={deletePillValue}
                />
                </>
                ) : (
                  <></>
                )}
                </>) : (
                  <></>
                )}
              </Form.Group>
              <Form.Check
                  type="checkbox"
                  id="utm_source-use"
                  // key="show-utm_source"
                  label="Use 'utm_medium' value?"
                  checked={config.utm_medium.useValue}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newSource = { ...newConfig.utm_medium };
                      newSource.useValue = e.target.checked;
                      newConfig.utm_medium = newSource;
                      return newConfig;
                    });
                  }}
              />
              { config.utm_source.useValue ? (
                  <Form.Group>
                    <Form.Check
                    inline
                    type="radio"
                    value='utm_medium-chooser'
                    id="utm_medium-use-chooser"
                    // key="show-utm_source"
                    label="Use Chooser"
                    checked={config.utm_medium.isChooser}
                    onChange={(e) => {
                      console.log(`e.target.checked: ${e.target.checked}`)
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_medium };
                        newSource.isChooser = e.target.checked;
                        newConfig.utm_medium = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    value='utm_medium-text'
                    id="utm_medium-use-text"
                    // key="show-utm_source"
                    label="Use Text Input"
                    checked={!config.utm_medium.isChooser}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_medium };
                        newSource.isChooser = !e.target.checked;
                        newConfig.utm_medium = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  </Form.Group>
                ) : (
                  <></>
                )
              }
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Campaign */}
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <strong>utm_campaign</strong>
            </Accordion.Header>
            <Accordion.Body id="utm_campaign">
              {config.utm_campaign.useValue ? (
                <>
              <Form.Group>
                <Form.Label>
                  <strong>Label</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_campaign_label"
                  id="utm_campaign-label"
                  placeholder="Enter utm_campaign field label"
                  value={
                    config.utm_campaign.showName
                      ? `${config.utm_campaign.label} (utm_campaign)`
                      : `${config.utm_campaign.label}`
                  }
                  onChange={(e) => {
                    setFieldValue(e, 'utm_campaign');
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="utm_campaign-show"
                  // key="show-utm_campaign"
                  label="Show 'utm_campaign' in Field Label?"
                  checked={config.utm_campaign.showName}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCampaign = {
                        ...newConfig.utm_campaign,
                      };
                      newCampaign.showName = e.target.checked;
                      newConfig.utm_campaign = newCampaign;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ToolTip Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_campaign_tooltip"
                  id="utm_campaign-tooltip"
                  placeholder="Enter utm_campaign field tooltip"
                  value={config.utm_campaign.tooltip}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCampaign = {
                        ...newConfig.utm_campaign,
                      };
                      newCampaign.tooltip = e.target.value;
                      newConfig.utm_campaign = newCampaign;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ARIA (Accessibility) Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_campaign_aria"
                  id="utm_campaign-aria"
                  required
                  placeholder="Enter utm_campaign field ARIA (Accessibility) label"
                  value={config.utm_campaign.ariaLabel}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCampaign = {
                        ...newConfig.utm_campaign,
                      };
                      newCampaign.ariaLabel = e.target.value;
                      newConfig.utm_campaign = newCampaign;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Error Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_campaign_error"
                  id="utm_campaign-error"
                  placeholder="Enter utm_campaign field error message"
                  value={config.utm_campaign.error}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCampaign = {
                        ...newConfig.utm_campaign,
                      };
                      newCampaign.error = e.target.value;
                      newConfig.utm_campaign = newCampaign;
                      return newConfig;
                    });
                  }}
                />
                {config.utm_campaign.isChooser ? (
                  <>
                  <Form.Label>
                    <strong>Campaign Values</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_medium-values"
                    placeholder="Enter comma-separated list of values to use"
                    value={campaignVal}
                    required
                    id="utm_medium-values"
                    isInvalid={!campValid}
                    onChange={(eventKey) => {
                      addPill(eventKey, 'utm_campaign');
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide a key=value pair.
                  </Form.Control.Feedback>
                  <PillArea
                    pills={config.utm_campaign.value}
                    type="utm_campaign"
                    callback={deletePillValue}
                  />
                  </>
                ) : (
                  <></>
                )}
              </Form.Group>
              </> ) : (
                <></>
              )}
              <Form.Check
                  type="checkbox"
                  id="utm_campaign-use"
                  // key="show-utm_source"
                  label="Use 'utm_campaign' value?"
                  checked={config.utm_campaign.useValue}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newSource = { ...newConfig.utm_campaign };
                      newSource.useValue = e.target.checked;
                      newConfig.utm_campaign = newSource;
                      return newConfig;
                    });
                  }}
              />
              {config.utm_campaign.useValue ? (
                <>
                <Form.Check
                  type="radio"
                  inline
                  id="utm_campaign-chooser"
                  // key="show-utm_source"
                  label="Use Chooser"
                  checked={config.utm_campaign.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newRegion = { ...newConfig.utm_campaign };
                      newRegion.isChooser = e.target.checked;
                      newConfig.utm_campaign = newRegion;
                      return newConfig;
                    });
                  }}
                />
              <Form.Check
                  type="radio"
                  inline
                  id="utm_campaign-chooser"
                  // key="show-utm_source"
                  label="Use Text Input"
                  checked={!config.utm_campaign.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newRegion = { ...newConfig.utm_campaign };
                      newRegion.isChooser = !e.target.checked;
                      newConfig.utm_campaign = newRegion;
                      return newConfig;
                    });
                  }}
                />
                </>
              ) : (
                <></>
              )}
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Term */}
          <Accordion.Item eventKey="5">
              <Accordion.Header>
                <strong>utm_term</strong>
              </Accordion.Header>
              <Accordion.Body id="utm_term">
              {config.utm_term.useValue ? (
              <>
                <Form.Group>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_term-label"
                    placeholder="Enter utm_term field label"
                    value={
                      config.utm_term.showName
                        ? `${config.utm_term.label} (utm_term)`
                        : `${config.utm_term.label}`
                    }
                    onChange={(e) => {
                      setFieldValue(e, 'utm_term');
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_term-show"
                    label="Show 'utm_term' in Field Label?"
                    checked={config.utm_term.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.showName = e.target.checked;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_term-tooltip"
                    placeholder="Enter utm_term field tooltip"
                    value={config.utm_term.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.tooltip = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_term-aria"
                    placeholder="Enter utm_term field ARIA (Accessibility) label"
                    value={config.utm_term.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.ariaLabel = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_term-error"
                    placeholder="Enter utm_term field error mesage"
                    value={config.utm_term.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.error = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  { config.utm_term.isChooser ? (
                    <>
                    <Form.Label>
                    <strong>Terms</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter comma-separated list of terms to use"
                    value={termVal}
                    required
                    id="utm_term-values"
                    onChange={(eventKey) => {
                      addPill(eventKey, 'utm_term');
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide at least one term.
                  </Form.Control.Feedback>
                  <PillArea
                    pills={config.utm_term.value}
                    type="utm_term"
                    callback={deletePillValue}
                  />
                  </> ) : (
                    <></>
                  )}
                </Form.Group>
                </>
              ) : (
                <></>
              )}
              <Form.Check
                  type="checkbox"
                  id="utm_term-use"
                  // key="show-utm_source"
                  label="Use 'utm_term' value?"
                  checked={config.utm_term.useValue}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTerm = { ...newConfig.utm_term };
                      newTerm.useValue = e.target.checked;
                      newConfig.utm_term = newTerm;
                      return newConfig;
                    });
                  }}
              />
              { config.utm_term.useValue ? (
                <>
                <Form.Check
                  type="radio"
                  inline
                  id="utm_term-chooser"
                  // key="show-utm_source"
                  label="Use Chooser"
                  checked={config.utm_term.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newRegion = { ...newConfig.utm_term };
                      newRegion.isChooser = e.target.checked;
                      newConfig.utm_term = newRegion;
                      return newConfig;
                    });
                  }}
                />
                <Form.Check
                  type="radio"
                  inline
                  id="utm_term-text"
                  // key="show-utm_source"
                  label="Use Text Input"
                  checked={!config.utm_term.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newRegion = { ...newConfig.utm_term };
                      newRegion.isChooser = !e.target.checked;
                      newConfig.utm_term = newRegion;
                      return newConfig;
                    });
                  }}
                />
                </>
              ) : (
                <></>
              )
              }
              </Accordion.Body>
          </Accordion.Item>
          {/* UTM Content */}
          <Accordion.Item eventKey="6">
              <Accordion.Header>
                <strong>utm_content</strong>
              </Accordion.Header>
              <Accordion.Body id="utm_content">
              {config.utm_content.useValue ? (
              <>
                <Form.Group>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_content-label"
                    placeholder="Enter utm_content field label"
                    value={
                      config.utm_content.showName
                        ? `${config.utm_content.label} (utm_content)`
                        : `${config.utm_content.label}`
                    }
                    onChange={(e) => {
                      setFieldValue(e, 'utm_content');
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_content-show"
                    label="Show 'utm_content' in Field Label?"
                    checked={config.utm_content.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newCont = { ...newConfig.utm_content };
                        newCont.showName = e.target.checked;
                        newConfig.utm_content = newCont;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_content-tooltip"
                    placeholder="Enter utm_content field tooltip"
                    value={config.utm_content.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newCont = { ...newConfig.utm_content };
                        newCont.tooltip = e.target.value;
                        newConfig.utm_content = newCont;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_content-aria"
                    placeholder="Enter utm_content field ARIA (Accessibility) label"
                    value={config.utm_content.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newCont = { ...newConfig.utm_content };
                        newCont.ariaLabel = e.target.value;
                        newConfig.utm_content = newCont;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_content-error"
                    placeholder="Enter utm_content field error mesage"
                    value={config.utm_content.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newCont = { ...newConfig.utm_content };
                        newCont.error = e.target.value;
                        newConfig.utm_content = newCont;
                        return newConfig;
                      });
                    }}
                  />
                  { config.utm_content.isChooser ? (
                    <>
                    <Form.Label>
                    <strong>Content</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter comma-separated list of key=value pairs to use"
                    value={termVal}
                    required
                    id="utm_content-values"
                    onChange={(eventKey) => {
                      addPill(eventKey, 'utm_content');
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide at least one content value.
                  </Form.Control.Feedback>
                  <PillArea
                    pills={config.utm_content.value}
                    type="utm_content"
                    callback={deletePillValue}
                  />
                  </> ) : (
                    <></>
                  )}
                </Form.Group>
                </>
              ) : (
                <></>
              )}
              <Form.Check
                  type="checkbox"
                  id="utm_content-use"
                  label="Use 'utm_content' value?"
                  checked={config.utm_content.useValue}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCont = { ...newConfig.utm_content };
                      newCont.useValue = e.target.checked;
                      newConfig.utm_content = newCont;
                      return newConfig;
                    });
                  }}
              />
              { config.utm_content.useValue ? (
                <>
                <Form.Check
                  type="radio"
                  inline
                  id="utm_content-chooser"
                  label="Use Chooser"
                  checked={config.utm_content.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCont = { ...newConfig.utm_content };
                      newCont.isChooser = e.target.checked;
                      newConfig.utm_content = newCont;
                      return newConfig;
                    });
                  }}
                />
                <Form.Check
                  type="radio"
                  inline
                  id="utm_content-text"
                  // key="show-utm_source"
                  label="Use Text Input"
                  checked={!config.utm_content.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCont = { ...newConfig.utm_content };
                      newCont.isChooser = !e.target.checked;
                      newConfig.utm_content = newCont;
                      return newConfig;
                    });
                  }}
                />
                </>
              ) : (
                <></>
              )
              }
              </Accordion.Body>
          </Accordion.Item>
          {/* UTM Keyword */}
          <Accordion.Item eventKey="7">
              <Accordion.Header>
                <strong>utm_keyword</strong>
              </Accordion.Header>
              <Accordion.Body id="utm_keyword">
              {config.utm_keyword.useValue ? (
              <>
                <Form.Group>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_keyword-label"
                    placeholder="Enter utm_keyword field label"
                    value={
                      config.utm_keyword.showName
                        ? `${config.utm_keyword.label} (utm_keyword)`
                        : `${config.utm_keyword.label}`
                    }
                    onChange={(e) => {
                      setFieldValue(e, 'utm_keyword');
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_keyword-show"
                    label="Show 'utm_keyword' in Field Label?"
                    checked={config.utm_keyword.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newKey = { ...newConfig.utm_keyword };
                        newKey.showName = e.target.checked;
                        newConfig.utm_keyword = newKey;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_keyword-tooltip"
                    placeholder="Enter utm_keyword field tooltip"
                    value={config.utm_keyword.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newKey = { ...newConfig.utm_keyword };
                        newKey.tooltip = e.target.value;
                        newConfig.utm_keyword = newKey;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_keyword-aria"
                    placeholder="Enter utm_keyword field ARIA (Accessibility) label"
                    value={config.utm_keyword.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newKey = { ...newConfig.utm_keyword };
                        newKey.ariaLabel = e.target.value;
                        newConfig.utm_keyword = newKey;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_keyword-error"
                    placeholder="Enter utm_keyword field error mesage"
                    value={config.utm_keyword.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newKey = { ...newConfig.utm_keyword };
                        newKey.error = e.target.value;
                        newConfig.utm_keyword = newKey;
                        return newConfig;
                      });
                    }}
                  />
                  { config.utm_keyword.isChooser ? (
                    <>
                    <Form.Label>
                    <strong>Keywords</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter comma-separated list of keyword key=value pairs to use"
                    value={termVal}
                    required
                    id="utm_keyword-values"
                    onChange={(eventKey) => {
                      addPill(eventKey, 'utm_keyword');
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide at least one keyword.
                  </Form.Control.Feedback>
                  <PillArea
                    pills={config.utm_keyword.value}
                    type="utm_keyword"
                    callback={deletePillValue}
                  />
                  </> ) : (
                    <></>
                  )}
                </Form.Group>
                </>
              ) : (
                <></>
              )}
              <Form.Check
                  type="checkbox"
                  id="utm_keyword-use"
                  label="Use 'utm_keyword' value?"
                  checked={config.utm_keyword.useValue}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newKey = { ...newConfig.utm_keyword };
                      newKey.useValue = e.target.checked;
                      newConfig.utm_keyword = newKey;
                      return newConfig;
                    });
                  }}
              />
              { config.utm_keyword.useValue ? (
                <>
                <Form.Check
                  type="radio"
                  inline
                  id="utm_keyword-chooser"
                  label="Use Chooser"
                  checked={config.utm_keyword.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newKey = { ...newConfig.utm_keyword };
                      newKey.isChooser = e.target.checked;
                      newConfig.utm_keyword = newKey;
                      return newConfig;
                    });
                  }}
                />
                <Form.Check
                  type="radio"
                  inline
                  id="utm_keyword-text"
                  // key="show-utm_source"
                  label="Use Text Input"
                  checked={!config.utm_keyword.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newKey = { ...newConfig.utm_keyword };
                      newKey.isChooser = !e.target.checked;
                      newConfig.utm_keyword = newKey;
                      return newConfig;
                    });
                  }}
                />
                </>
              ) : (
                <></>
              )
              }
              </Accordion.Body>
          </Accordion.Item>
          {/* UTM Team */}
          <Accordion.Item eventKey="8">
            <Accordion.Header>
              <strong>team_name</strong>
            </Accordion.Header>
            <Accordion.Body id="team_name">
              {config.team_name.useValue ? (
                <>
                <Form.Group>
                <Form.Label>
                  <strong>Label</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="team_name-label"
                  placeholder="Enter team_name field label"
                  value={
                    config.team_name.showName
                      ? `${config.team_name.label} (team_name)`
                      : `${config.team_name.label}`
                  }
                  onChange={(e) => {
                    setFieldValue(e, 'team_name');
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="team_name-show"
                  label="Show 'team_name' in Field Label?"
                  checked={config.team_name.showName}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.showName = e.target.checked;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ToolTip Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="team_name-tooltip"
                  placeholder="Enter team_name field tooltip"
                  value={config.team_name.tooltip}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.tooltip = e.target.value;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ARIA (Accessibility) Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="team_name-aria"
                  placeholder="Enter team_name field ARIA (Accessibility) label"
                  value={config.team_name.ariaLabel}
                  required
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.ariaLabel = e.target.value;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Error Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="team_name-error"
                  placeholder="Enter team_name field error mesage"
                  value={config.team_name.error}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.error = e.target.value;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                {config.team_name.isChooser ? (
                  <>
                  <Form.Label>
                  <strong>Teams</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter comma-separated list of key=value pairs for teams to use"
                  value={teamVal}
                  isInvalid={!teamValid}
                  required
                  id="team_name-values"
                  onChange={(eventKey) => {
                    addPill(eventKey, 'team_name');
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  You must provide at least one key=value pair for a team.
                </Form.Control.Feedback>
                <PillArea
                  pills={config.team_name.value}
                  type="team_name"
                  callback={deletePillValue}
                />
                </>) : (
                  <></>
                )}
              </Form.Group>
              </> ) : (
                <></>
              )}
              <Form.Check
                  type="checkbox"
                  id="team_name-use"
                  // key="show-utm_source"
                  label="Use 'team_name' value?"
                  checked={config.team_name.useValue}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.useValue = e.target.checked;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
              />
              {config.team_name.useValue ? (
                <>
                <Form.Check
                  type="radio"
                  inline
                  id="team_name-chooser"
                  // key="show-utm_source"
                  label="Use Chooser"
                  checked={config.team_name.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.isChooser = e.target.checked;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Check
                  type="radio"
                  inline
                  id="team_name-chooser"
                  // key="show-utm_source"
                  label="Use Text Input"
                  checked={!config.team_name.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.isChooser = !e.target.checked;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                </>) : (
                  <></>
                )}
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Region */}
          <Accordion.Item eventKey="9">
            <Accordion.Header>
              <strong>region_name</strong>
            </Accordion.Header>
            <Accordion.Body id="region_name">
              { config.region_name.useValue ? (
                <>
                <Form.Group>
                <Form.Label>
                  <strong>Label</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="region_name-label"
                  placeholder="Enter region_name field label"
                  value={
                    config.region_name.showName
                      ? `${config.region_name.label} (region_name)`
                      : `${config.region_name.label}`
                  }
                  onChange={(e) => {
                    setFieldValue(e, 'region_name');
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="region_name-show"
                  label="Show 'region_name' in Field Label?"
                  checked={config.region_name.showName}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.region_name };
                      newTeam.showName = e.target.checked;
                      newConfig.region_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ToolTip Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="region_name-tooltip"
                  placeholder="Enter region_name field tooltip"
                  value={config.region_name.tooltip}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.region_name };
                      newTeam.tooltip = e.target.value;
                      newConfig.region_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ARIA (Accessibility) Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="region_name-aria"
                  placeholder="Enter region_name field ARIA (Accessibility) label"
                  value={config.region_name.ariaLabel}
                  required
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.region_name };
                      newTeam.ariaLabel = e.target.value;
                      newConfig.region_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Error Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="region_name-error"
                  placeholder="Enter region_name field error mesage"
                  value={config.region_name.error}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.region_name };
                      newTeam.error = e.target.value;
                      newConfig.region_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                {config.region_name.isChooser ? (
                  <>
                <Form.Label>
                  <strong>Regions</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter comma-separated list of key=value pairs for regions to use"
                  value={regionVal}
                  isInvalid={!regValid}
                  required
                  id="region_name-values"
                  onChange={(eventKey) => {
                    addPill(eventKey, 'region_name');
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  You must provide a key=value pair for a region.
                </Form.Control.Feedback>
                <PillArea
                  pills={config.region_name.value}
                  type="region_name"
                  callback={deletePillValue}
                />
                </>) : (
                  <></>
                )}

                </Form.Group>
                </> ) : (
                <></>
              )}
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  id="region_name-use"
                  // key="show-utm_source"
                  label="Use 'region_name' value?"
                  checked={config.region_name.useValue}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConf = { ...prevConfig };
                      const newS = { ...newConf.region_name };
                      newS.useValue = e.target.checked;
                      newConf.region_name = newS;
                      return newConf;
                    });
                  }}
              />
                {config.region_name.useValue ? (
                  <>
                  <Form.Check
                  type="radio"
                  inline
                  id="region_name-chooser"
                  // key="show-utm_source"
                  label="Use Chooser"
                  checked={config.region_name.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newRegion = { ...newConfig.region_name };
                      newRegion.isChooser = e.target.checked;
                      newConfig.region_name = newRegion;
                      return newConfig;
                    });
                  }}
                />
                <Form.Check
                  type="radio"
                  inline
                  id="region_name-chooser"
                  // key="show-utm_source"
                  label="Use Text Input"
                  checked={!config.region_name.isChooser}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newRegion = { ...newConfig.region_name };
                      newRegion.isChooser = !e.target.checked;
                      newConfig.region_name = newRegion;
                      return newConfig;
                    });
                  }}
                />
                </>) : (
                  <></>
                )}
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
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
                  checked={config.show_country}
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
  );
}

ConfigEditor.propTypes = {
  showMe: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};
