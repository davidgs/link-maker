import { useState, useEffect, SyntheticEvent } from 'react';
import { Accordion, Form } from 'react-bootstrap';
import { UtmKeyValue, UtmObj, UtmParams } from 'renderer/types';
import PillArea from './pills/PillArea';

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
      const f = type.split('_')[1];
      setValKind(f.charAt(0).toUpperCase() + f.slice(1));
    } else {
      setValKind('URL Base Targets');
    }
  }, [type]);

  useEffect(() => {
    if(value.hasOwnProperty('restrict_bases')){
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
            <Form.Check
              type="checkbox"
              id={`${accType}-showName`}
              label={`Show '${accType}' in Field Label?`}
              checked={accValue?.showName}
              onChange={(e) => {
                setAccValue((prevConfig) => {
                  const newConfig = { ...(prevConfig as UtmObj) };
                  newConfig.showName = e.target.checked;
                  callback(accType, newConfig);
                  return newConfig;
                });
              }}
            />
            <Form.Label>
              <strong>ToolTip Text</strong>
            </Form.Label>
            <Form.Control
              type="text"
              id={`${accType}-tooltip`}
              placeholder={`Enter ${accType} field tooltip`}
              value={accValue?.tooltip}
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
              value={accValue?.ariaLabel}
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
              value={accValue?.error}
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
              <Form.Check
                type="checkbox"
                id="utm_target-restrict_bases"
                // key="restrict-bases"
                label="Restrict base URLs for utm_targets?"
                checked={utmObj?.restrict_bases}
                onChange={(e) => {
                  setUtmObj((prevConfig) => {
                    const newConfig = { ...(prevConfig as UtmParams) };
                    newConfig.restrict_bases = e.target.checked;
                    return newConfig;
                  });
                }}
              />
            ) : (
              <></>
            )}
            {accValue?.isChooser || utmObj?.restrict_bases ? (
              <>
                <Form.Label>
                  <strong>{valKind} Values</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter comma-separated list of key=value pairs to use"
                  value={kvValue}
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
                  pills={ accValue?.value as UtmKeyValue[]}
                  type={accType}
                  callback={deletePillValue}
                />
              </>
            ) : (
              <></>
            )}
            {!utmObj ? (
              <>
                <Form.Check
                  type="checkbox"
                  id={`${accType}-use`}
                  label={`Use '${accType}' value?`}
                  checked={accValue?.useValue}
                  onChange={(e) => {
                    setAccValue((prevConfig) => {
                      const newConfig = { ...(prevConfig as UtmObj) };
                      newConfig.useValue = e.target.checked;
                      callback(accType, newConfig);
                      return newConfig;
                    });
                  }}
                />
                {accValue?.useValue ? (
                  <>
                    <Form.Check
                      type="radio"
                      inline
                      id={`${accType}-chooser`}
                      label="Use Chooser"
                      checked={accValue?.isChooser}
                      onChange={(e) => {
                        setAccValue((prevConfig) => {
                          const newConfig = { ...(prevConfig as UtmObj) };
                          newConfig.isChooser = e.target.checked;
                          callback(accType, newConfig);
                          return newConfig;
                        });
                      }}
                    />
                    <Form.Check
                      type="radio"
                      inline
                      id={`${accType}-text`}
                      label="Use Text Input"
                      checked={!accValue?.isChooser}
                      onChange={(e) => {
                        setAccValue((prevConfig) => {
                          const newConfig = { ...(prevConfig as UtmObj) };
                          newConfig.isChooser = !e.target.checked;
                          callback(accType, newConfig);
                          return newConfig;
                        });
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : null}
          </Form.Group>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  );
}
