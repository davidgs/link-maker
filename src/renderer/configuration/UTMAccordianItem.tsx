import { useState, useEffect, SyntheticEvent } from 'react';
import { Accordion, Form } from 'react-bootstrap';
import { UtmKeyValue, UtmObj, UtmParams } from 'renderer/types';
import PillArea from './pills/PillArea';
import Checker from 'renderer/components/Checker';

export default function UTMAccordianItem({
  type,
  value,
  itemNo,
  callback,
}: {
  type: string;
  value: UtmObj | UtmParams;
  itemNo: string;
  callback: (type: string, value: UtmObj | UtmParams) => void;
}): JSX.Element {
  const [accType, setAccType] = useState<string>(type);
  const [accValue, setAccValue] = useState<UtmObj>();
  const [utmObj, setUtmObj] = useState<UtmParams>();
  const [accItemNo, setAccItemNo] = useState<string>(itemNo);
  const [kvValue, setKvValue] = useState<string>('');
  const [valValid, setValValid] = useState<boolean>(true);
  const [valKind, setValKind] = useState<string>('');

  useEffect(() => {
    setAccType(type);
    if(type !== 'utm_target'){
      console.log(`type: ${type}`)
      const f = type.split('_')[1];
      setValKind(f.charAt(0).toUpperCase() + f.slice(1));
    } else {
      console.log(`Not target type: ${type}`)
      setValKind('URL Base Targets');
    }
  }, [type]);

  useEffect(() => {
    if(value?.hasOwnProperty('restrict_bases')){
      console.log(`value: ${JSON.stringify(value)}`)
      const v = value as UtmParams;
      setUtmObj(v as UtmParams);
      setAccValue(v.utm_bases as UtmObj);
    } else {
      setAccValue(value as UtmObj);
    }
  }, [value]);

  useEffect(() => {
    setAccItemNo(itemNo);
  }, [itemNo]);

  {/* delete a pill value */}
  const deletePillValue = (value: string) => {
    const newT = Object.entries(accValue as UtmObj);
    const tLen = newT.length;
    const tEntries: UtmKeyValue[] = newT[tLen - 1][1] as UtmKeyValue[];
    for (let t = 0; t < tEntries.length; t += 1) {
      if (tEntries[t].value === value) {
        tEntries.splice(t, 1);
      }
    }
    setAccValue((prevConfig) => {
      const newConfig = { ...prevConfig as UtmObj };
      newConfig.value = tEntries;
      callback(type, newConfig);
      return newConfig;
    });
  };

  {/* add a pill value */}
  const addPill = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setKvValue(target?.value);
    if (!target?.value.includes(',')) {
      return;
    }
    if (target?.value.indexOf('=') === -1) {
      setValValid(false);
      return;
    }
    setKvValue('');
    const newTrm = accValue?.value as UtmKeyValue[];
    const newTrmPill = {
      key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
      value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
    };
    newTrm.push(newTrmPill);
    setAccValue((prevConfig) => {
      const newConfig = { ...prevConfig as UtmObj };
      newConfig.value = newTrm;
      callback(type, newConfig);
      return newConfig;
    });
  };

  return (
    <Accordion.Item eventKey={`"${accItemNo}"`}>
      <Accordion.Header>
        <strong>{accType}</strong>
      </Accordion.Header>
      <Accordion.Body id={accType}>
        <Form noValidate>
          {!utmObj && (
            <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
                  <Form.Label>{`Use '${accType}' value?`}</Form.Label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '20px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
                  <Checker
                    state={accValue?.useValue ? accValue.useValue : false}
                    disabled={false}
                    label=''
                    tooltip={`Check to enable the use of the '${accType}' value`}
                    callback={(value) => {
                    setAccValue((prevConfig) => {
                      const newConfig = { ...(prevConfig as UtmObj) };
                      newConfig.useValue = value;
                      callback(accType, newConfig);
                      return newConfig;
                    });
                  }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 'auto' }} />
              </div>
          )}
          {  accValue?.useValue ? (
          <Form.Group>
            <Form.Label>
              <strong>Label</strong>
            </Form.Label>
            <Form.Control
              type="text"
              id={`${accType}-label`}
              placeholder={`Enter ${accType} field label`}
              value={
                accValue?.showName
                  ? `${accValue?.label} (${accType})`
                  : `${accValue?.label}`
              }
              onChange={(e) => {
                setAccValue((prevConfig) => {
                  const newConfig = { ...(prevConfig as UtmObj) };
                  newConfig.label = e.target.value;
                  callback(accType, newConfig);
                  return newConfig;
                });
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
                <Form.Label>{`Show '${accType}' in Field Label?`}</Form.Label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '20px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
            <Checker
              state={accValue?.showName ? accValue.showName : false}
              disabled={false}
              label=''
              tooltip="check to show the field name in the field label"
              callback={(value) => {
                setAccValue((prevConfig) => {
                  const newConfig = { ...(prevConfig as UtmObj) };
                  newConfig.showName = value;
                  callback(accType, newConfig);
                  return newConfig;
                });
              }}
            />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 'auto' }} />
            </div>
            <Form.Label>
              <strong>ToolTip Text</strong>
            </Form.Label>
            <Form.Control
              type="text"
              id={`${accType}-tooltip`}
              placeholder={`Enter ${accType} field tooltip`}
              value={accValue?.tooltip ? accValue.tooltip : ''}
              onChange={(e) => {
                setAccValue((prevConfig) => {
                  const newConfig = { ...(prevConfig as UtmObj) };
                  newConfig.tooltip = e.target.value;
                  callback(accType, newConfig);
                  return newConfig;
                });
              }}
            />
            <Form.Label>
              <strong>ARIA (Accessibility) Text</strong>
            </Form.Label>
            <Form.Control
              type="text"
              id={`${accType}-aria`}
              placeholder={`Enter ${accType} field ARIA (Accessibility) label`}
              required
              value={accValue?.ariaLabel ? accValue.ariaLabel : ''}
              onChange={(e) => {
                setAccValue((prevConfig) => {
                  const newConfig = { ...(prevConfig as UtmObj) };
                  newConfig.ariaLabel = e.target.value;
                  callback(accType, newConfig);
                  return newConfig;
                });
              }}
            />
            <Form.Label>
              <strong>Error Text</strong>
            </Form.Label>
            <Form.Control
              type="text"
              id={`${accType}-error`}
              placeholder={`Enter ${accType} field error text`}
              value={accValue?.error ? accValue.error : ''}
              onChange={(e) => {
                setAccValue((prevConfig) => {
                  const newConfig = { ...(prevConfig as UtmObj) };
                  newConfig.error = e.target.value;
                  callback(accType, newConfig);
                  return newConfig;
                });
              }}
            />
            {utmObj ? (
              <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
                  <Form.Label>Restrict base URLs for utm_targets?</Form.Label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '20px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
                  <Checker
                    state={utmObj?.restrict_bases ? utmObj.restrict_bases : false}
                    disabled={false}
                    label=''
                    tooltip="Check to restrict URLs to pre-defined values"
                    callback={(value) => {
                        setUtmObj((prevConfig) => {
                          const newConfig = { ...(prevConfig as UtmParams) };
                          const ac = accValue as UtmObj;
                          ac.isChooser = value;
                          newConfig.restrict_bases = value;
                          return newConfig;
                        });
                      }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 'auto' }} />
              </div>
            ) : (
              <></>
            )}
            {!utmObj ? (
              <>
                {accValue?.useValue ? (
                  <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
                      <Form.Label>Use Chooser</Form.Label>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '20px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
                      <Checker
                        state={accValue?.isChooser}
                        disabled={false}
                        label=""
                        tooltip={`Use a chooser to select from a list of ${accType} values`}
                        callback={(value) => {
                            setAccValue((prevConfig) => {
                              const newConfig = { ...(prevConfig as UtmObj) };
                              newConfig.isChooser = value;
                              callback(accType, newConfig);
                              return newConfig;
                            });
                          }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
                      <Form.Label>Use Text Field</Form.Label>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '20px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Checker
                        state={!accValue?.isChooser}
                        disabled={false}
                        label=""
                        tooltip={`Use a Text Field to enter ${accType} values`}
                        callback={(value) => {
                        setAccValue((prevConfig) => {
                          const newConfig = { ...(prevConfig as UtmObj) };
                          newConfig.isChooser = !value;
                          callback(accType, newConfig);
                          return newConfig;
                        });
                      }}
                      />
                  </div>
                </div>
                ) : (
                  <></>
                )}
              </>
            ) : null}
            {accValue?.isChooser || utmObj?.restrict_bases ? (
              <>
              <div style={{display: 'flex', flexDirection: 'row'}} />
                <Form.Label>
                  <strong>{`UTM_${valKind} Values`}</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter comma-separated list of key=value pairs to use"
                  value={kvValue ? kvValue : ''}
                  required
                  id={`${accType}-values`}
                  isInvalid={!valValid}
                  onChange={(eventKey) => {
                    addPill(eventKey);
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  You must provide a key=value pair.
                </Form.Control.Feedback>
                <PillArea
                  pills={ accValue?.value ? accValue.value as UtmKeyValue[] : [] as UtmKeyValue[]}
                  type={accType}
                  callback={deletePillValue}
                />
              </>
            ) : (
              <></>
            )}
          </Form.Group>
          ) : (
            <></>
          )}
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  );
}
