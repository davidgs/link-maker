import JSONInput from "react-json-editor-ajrm/index";
import locale from "react-json-editor-ajrm/locale/en";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { MainSettings, UtmParams } from "renderer/types";
import { GearFill } from "react-bootstrap-icons";

export default function JsonEditor({type, json, show, callback}: {type: string, json: MainSettings | UtmParams | null, show: boolean, callback: (value: boolean) => void}) {
  const [myJson, setJson] = useState(json);
  const [showModal, setShowModal] = useState(show);
  const [myType, setType] = useState(type);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  useEffect(() => {
    setType(type);
  }, [type]);

  const handleCancel = () => {
    setShowModal(false);
    callback(false);
  };

  /* handle the save button
      @param: event: the event that triggered the save
  */
  const handleSave = () => {
    if(errorText === '' || errorText === undefined || errorText === null){
      const c = JSON.stringify(myJson);
      switch(myType){
        case 'Main':
          window.electronAPI
            .saveMainConfig(c)
            .then((response: string) => {
            return;
          })
          .catch((error: unknown) => {
            console.log(`Error: ${error}`);
          });
          break;
        case 'UTM':
          window.electronAPI
            .saveConfig(c)
            .then((response: string) => {
            return;
          })
          .catch((error: unknown) => {
            console.log(`Error: ${error}`);
          });
          break;
        default:
          break;
      }
      setShowModal(false);
      callback(false);
    } else {
      alert('JSON is invalid. Please correct before saving.');
    }
  };

  useEffect(() => {
    if(json === undefined || json === null ){
      setShowModal(false);
      return;
    }
    setJson(json);
  }, [json]);

  return (
    <Modal
        show={showModal}
        onHide={handleCancel}
        size="xl"
        dialogClassName="my-modal"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>{myType} JSON Configuration Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div><h2>Warning: Do not edit unless you know what you're doing.</h2>
          <h3>Use the <GearFill size={20} /> Configuration Editor to make changes.</h3>
          </div>
    <JSONInput
      id="a_unique_id"
      placeholder={myJson}
      locale={locale}
      height="550px"
      width="100%"
      onChange={(e) => {
        setJson(e.jsObject);
        console.log(e.error.reason)
        setErrorText(e.error.reason)
      }}
    />
    <div className="d-grid gap-2">

    </div>
    </Modal.Body>
    <Modal.Footer>
 <button
        className="btn btn-primary"
        type="button"
        onClick={() => {
          handleCancel();
          // setShowModal(false);
          // callback(false);
        }}
      >
        Cancel
      </button>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => {
          setShowModal(false);
          handleSave();
        }}
      >
        Save
      </button>
    </Modal.Footer>
    </Modal>
  );
}
