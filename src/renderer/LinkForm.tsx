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
import { useEffect, useState } from 'react';
import {
  Button,
  FloatingLabel,
  Form,
  FormControl,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import CountrySelect, { ICountry } from 'react-bootstrap-country-select';
import uuid from 'react-uuid';
import UTMTextField from './UTMTextField';
import UTMChoice from './UTMChoice';
import HistoryChooser from './HistoryChooser';
import {
  BitlyConfig,
  defaultBitlyConfig,
  defaultUTMParams,
  UtmParams,
  LinkData,
} from './types';
import BitlyCheck from './BitlyCheck';
import QCode from './QRCode';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import DireWarning from './configuration/DireWarning';
import {
  XCircle,
  XCircleFill,
  Save,
  SaveFill,
} from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

export default function LinkForm({ dark }: { dark: boolean }): JSX.Element {
  const [campaign, setCampaign] = useState<string>('');
  const [finalCampaign, setFinalCampaign] = useState<string>('');
  const [medium, setMedium] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [restrictBases, setRestrictBases] = useState(true);
  const [showCountry, setShowCountry] = useState(false);
  const [base, setBase] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [country, setCountry] = useState<string | ICountry>();
  const [countryID, setCountryID] = useState<string>('');
  const [team, setTeam] = useState<string>('');
  const [target, setTarget] = useState('https://www.example.com/');
  const [longLink, setLongLink] = useState<string | null>('');
  const [shortLink, setShortLink] = useState<string | null>('');
  const [useBitly, setUseBitly] = useState(false);
  const [bitlyConfig, setBitlyConfig] =
    useState<BitlyConfig>(defaultBitlyConfig);
  const [enableBitly, setEnableBitly] = useState(false);
  const [mainConfig, setMainConfig] = useState(defaultUTMParams);
  const [qrOnly, setQrOnly] = useState(false);
  const [linkHistory, setLinkHistory] = useState<LinkData[]>([]);
  const [showDireWarning, setShowDireWarning] = useState(false);
  const [darkMode, setDarkMode] = useState(dark);
  const [darkClass, setDarkClass] = useState<string>('header-stuff');

  useEffect(() => {
    setDarkMode(dark);
    dark ? setDarkClass('header-stuff-dark') : setDarkClass('header-stuff');
  }, [dark]);

  const getHistory = (): void => {
    window.electronAPI
      .getLinks()
      .then((response: string) => {
        const linkData: LinkData[] = JSON.parse(response);
        setLinkHistory(linkData);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  const saveLink = (): void => {
    const ld: LinkData = {
      longLink: (longLink !== '' ? longLink : null),
      shortLink: (shortLink !== '' ? shortLink : null),
      uuid: uuid(),
      teamName: (team !== '' ? team : null),
      regionName: (region !== '' ? region : null),
      campaign: (campaign !== '' ? campaign : null),
      source: (source !== '' ? source : null),
      medium: (medium !== '' ? medium : null),
      term: (term !== '' ? term : null),
      target: (target !== '' ? target : null),
      content: (content !== '' ? content : null),
      keyword: (keyword !== '' ? keyword : null),
      base: (base !== '' ? base : null),
      countryName: (countryID !== '' ? countryID : null),
      date: new Date().toLocaleString(),
    };
    const linkDataString = JSON.stringify(ld);
    window.electronAPI
      .saveLink(linkDataString)
      .then((response: string) => {
        const linkData: LinkData[] = JSON.parse(response);
        setLinkHistory(linkData);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  const clearHistory = (): void => {
    window.electronAPI
      .clearHistory()
      .then((response) => {
        setLinkHistory(JSON.parse(response));
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  const dire = (): void => {
    setShowDireWarning(false);
    clearHistory();
  };

  const clearForm = (): void => {
    window.electronAPI
      .clearForm()
      .then(() => {
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  useEffect(() => {
    window.electronAPI
      .getConfig()
      .then((response: string) => {
        const c: UtmParams = JSON.parse(response);
        setMainConfig(c);
        setRestrictBases(c.restrict_bases);
        setShowCountry(c.show_country);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, [restrictBases]);

  useEffect(() => {
    if (qrOnly) {
      setLongLink(target);
    } else {
      let ll = '';
      const regex = /(^http[s]*:\/\/)|(^ftp[s]*:\/\/)/;
      if (base !== '' && target === 'https://www.example.com/') {
        setTarget('');
      }
      setBase((prevBase) =>
        prevBase?.endsWith('/') ? prevBase : `${prevBase}/`
      );
      setBase(base);
      if (!restrictBases) {
        setTarget((prevTarget) =>
          !regex.test(prevTarget) ? `https://${prevTarget}` : prevTarget
        );
      }
      if (target !== 'https://www.example.com/' && target !== '') {
        setTarget(target);
        // (prevTarget) =>
        //  prevTarget.endsWith('/') ? prevTarget : `${prevTarget}/`
        // );
      }
      ll = `${base}${target}`;
      setSource((prevSource) =>
        regex.test(prevSource) ? prevSource?.replace(regex, '') : prevSource
      );
      source !== '' ? ll = `${ll}?utm_source=${source}` : ll;
      medium !== '' ? ll = `${ll}&utm_medium=${medium}` : ll;
      term !== '' ? ll = `${ll}&utm_term=${term}` : ll;
      content !== '' ? ll = `${ll}&utm_content=${content}` : ll;
      keyword !== '' ? ll = `${ll}&keyword=${keyword}` : ll;
      finalCampaign !== '' ? ll = `${ll}&utm_campaign=${finalCampaign}` : ll;
      setLongLink(ll);
      if (base === 'choose_one_...') {
        setBase('');
        setTarget('https://example.com/');
      }
    }
  }, [
    base,
    target,
    source,
    finalCampaign,
    medium,
    term,
    content,
    keyword,
    longLink,
    restrictBases,
    qrOnly,
  ]);

  useEffect(() => {
    getHistory();
  }, []);

  const fillHistory = (histID: string) => {
    if (histID === 'clear-history') {
      setShowDireWarning(true);
      return;
    }
    linkHistory.forEach((item) => {
      if (item.uuid === histID) {
        setBase(
          (item?.base && item?.base !== '') ? item?.base : '');
        setTarget(
          (item?.target !== null && item?.target !== '') ? item?.target : '');
        setSource(item?.source ? item?.source : '');
        setMedium(item?.medium ? item?.medium : '');
        setTerm(item?.term ? item?.term : '');
        setCampaign(item?.campaign ? item?.campaign : '');
        setTeam(item?.teamName ? item?.teamName : '');
        setRegion(item?.regionName ? item?.regionName : '');
        setCountry(item?.countryName ? item?.countryName : '');
        setUseBitly(false);
        if (item?.shortLink !== '') {
          setShortLink(item?.shortLink);
          setUseBitly(true);
        }
        setLongLink(item?.longLink ? item?.longLink : '');
      }
    });
  };

  useEffect(() => {}, [restrictBases]);

  useEffect(() => {
    if (qrOnly) {
      setShowCountry(false);
      setRestrictBases(false);
    }
  }, [qrOnly]);

  // If Bitly switch is turned on, get the Bitly configuration
  useEffect(() => {
    if (mainConfig.bitly_config?.useValue && useBitly) {
      window.electronAPI
        .getParams('bitly_config')
        .then((response: string) => {
          const c: BitlyConfig = JSON.parse(response);
          c.bitlyEnabled = true;
          setBitlyConfig(c);
          return '';
        })
        .catch((error: unknown) => {
          console.log(`Error: ${error}`);
        });
    } else {
      setShortLink('');
    }
  }, [useBitly, setBitlyConfig]);

  const updateTeam = (value: string) => {
    setTeam(value);
  };

  const updateRegion = (value: string) => {
    setRegion(value);
  };

  useEffect(() => {
    let tempCampaign = '';
    if (team !== '' && team !== 'choose_one_...' && team !== null) {
      tempCampaign = `${team}_`;
    }
    if (campaign !== '' && campaign !== 'choose_one_...' && campaign !== null) {
      tempCampaign = `${tempCampaign}${campaign}_`;
    }
    if (region !== '' && region !== 'choose_one_...' && region !== null) {
      tempCampaign = `${tempCampaign}${region}_`;
    }
    if (countryID !== '' && countryID !== 'choose_one_...' && countryID !== null) {
      tempCampaign = `${tempCampaign}${countryID}_`;
    }
    const t = tempCampaign.endsWith('_')
      ? tempCampaign.slice(0, -`_`.length)
      : tempCampaign;
    setFinalCampaign(t);
  }, [team, region, countryID, campaign]);

  useEffect(() => {
    if (
      target !== 'https://www.example.com/' &&
      (mainConfig?.utm_source?.useValue && (source !== '' && source !== null)) &&
      (mainConfig?.utm_medium?.useValue && (medium !== '' && medium !== null)) &&
      (mainConfig?.utm_term?.useValue && (term !== '' && term !== null)) &&
      (mainConfig?.utm_campaign?.useValue && (campaign !== '' && campaign !== null)) &&
      (mainConfig?.utm_content?.useValue && (content !== '' && content !== null)) &&
      (mainConfig?.utm_keyword?.useValue && (keyword !== '' && keyword !== null))
    ) {
      setEnableBitly(true);
    } else {
      setEnableBitly(false);
    }
  }, [target, source, medium, campaign, term, content, keyword]);

  useEffect(() => {
    if (mainConfig.bitly_config?.useValue && bitlyConfig.bitlyEnabled) {
      // only call bitly if the link is complete.
      if (
        target !== 'https://www.example.com/' &&
        (mainConfig?.utm_source?.useValue && (source !== '' && source !== null)) &&
        (mainConfig?.utm_medium?.useValue && (medium !== '' && medium !== null)) &&
        (mainConfig?.utm_campaign?.useValue && (campaign !== '' && campaign !== null)) &&
        (mainConfig?.utm_term?.useValue && (term !== '' && term !== null)) &&
        (mainConfig?.utm_content?.useValue && (content !== '' && content !== null)) &&
        (mainConfig?.utm_keyword?.useValue && (keyword !== '' && keyword !== null))
      ) {
        const headers = {
          Authorization: `Bearer ${bitlyConfig.bitlyToken}`,
          Accept: 'application/json',
          ContentType: 'application/json; charset=utf-8',
        };
        const bDom = (bitlyConfig && bitlyConfig.bitlyDomain && bitlyConfig.bitlyDomain !== '') ? ( `"domain": ${bitlyConfig.bitlyDomain}`) : ( null );
        const data = JSON.parse(
          `{"long_url": "${longLink}", ${bDom}}`
        );
        axios
          .post(`${bitlyConfig.bitlyAddr}`, data, {
            headers,
          })
          .then((response) => {
            if (response.data.link === undefined) {
              console.log(`Error: ${response.data}`);
              return;
            }
            setShortLink(response.data.link);
            return;
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          }
          );
      }
    }
  }, [bitlyConfig, longLink, target, source, medium, campaign, term, content, keyword]);

  const updateCountry = (countryIdOrCountry: string | ICountry) => {
    if (countryIdOrCountry === null) {
      setCountryID('');
      const c: ICountry = {
        id: '',
        name: '',
        flag: '',
        alpha2: '',
        alpha3: '',
        ioc: '',
      };
      setCountry(c);
      return;
    }
    const c = countryIdOrCountry as ICountry;
    setCountry(countryIdOrCountry);
    const i = c.id;
    setCountryID(i);
  };

  return (
    <div className="link-form">
      <div>
        <QCode
          link={!useBitly ? longLink as string : shortLink as string}
          ext="png"
          qrOnly={qrOnly}
          dark={darkMode}
        />
      </div>
      {/* bitly button */}
      <div style={{ width: '100%' }}>
        <div style={{ width: '18%', display: 'inline-block' }}>
        {/* <OverlayTrigger
          placement="auto"
          overlay={
            <Tooltip id="bitly-tooltip">
              {bitlyConfig.tooltip}
            </Tooltip>
          }
        > */}
          {/* bitly enable */}

          { mainConfig?.bitly_config.useValue ? (<BitlyCheck
            targetType="bitly_config"
            useMe={useBitly}
            bitlyEnabled={enableBitly}
            valueChanged={setUseBitly}
          />) : null }
        {/* </OverlayTrigger> */}
        </div>
        {/* qr only button */}
        <div style={{ width: '22%', display: 'inline-block' }}>
        <OverlayTrigger
          placement="auto"
          overlay={
            <Tooltip id="qr-only-tooltip">
              Just generate a QR Code with no UTM parameters.
            </Tooltip>
          }
        >
          <Form.Check
            type="switch"
            id="qr-only-show"
            label="QR Code Only"
            checked={qrOnly}
            style={{ float: 'left' }}
            onChange={(e) => {
              setQrOnly(e.target.checked);
            }}
          />
        </OverlayTrigger>
        </div>
        {/* history, save & clear buttons */}
        <div style={{ width: '60%', display: 'inline-block', alignItems: 'center' }}>
          <div style={{ width: '50%', display: 'inline-block' }}></div>
        {/* history button */}
        <div style={{ width: '34%', display: 'inline-block', verticalAlign: 'top' }}>
          <HistoryChooser
            history={linkHistory}
            dark={darkMode}
            callback={fillHistory}
          />
        </div>
        {/* save button */}
        <div style={{ width: '8%', display: 'inline-block' }}>
        <OverlayTrigger
          placement="auto"
          overlay={
            <Tooltip id="save-btn-tooltip">
              Save the current link to your history.
            </Tooltip>
          }
        >
          <Button
            size="sm"
            id="save-btn"
            variant={darkMode ? 'icon-only-dark' : 'icon-only'}
            onClick={saveLink}
            className={darkClass}
            style={{ float: 'right' }}
          >
            {darkMode ? <Save /> : <SaveFill />}
          </Button>
        </OverlayTrigger>
        </div>
        {/* clear button */}
        <div style={{ width: '1.5%', display: 'inline-block' }}>
        <OverlayTrigger
          placement="auto"
          overlay={
            <Tooltip id="clear-btn-tooltip">
              Clear the form and start over.
            </Tooltip>
          }
        >
          <Button
            size="sm"
            variant={darkMode ? 'icon-only-dark' : 'icon-only'}
            color={darkMode ? '#adb5bd' : '#0B3665'}
            className={darkClass}
            onClick={clearForm}
            style={{ float: 'right', marginRight: '-30px' }}
          >
            {darkMode ? <XCircle /> : <XCircleFill />}
          </Button>
        </OverlayTrigger>
        </div>
        </div>
      </div>
      {/* utm_target */}
      <Row style={{ marginBottom: '-.5rem' }}>
        <InputGroup className="mb-3" size="lg">
          <Col sm={4}>
            {restrictBases && !qrOnly && (
              <UTMChoice
                valueChanged={setBase}
                targetType="utm_bases"
                id="restricted-bases"
                enabled
                settings={mainConfig?.utm_bases}
                selected={base}
              />
            )}
          </Col>
          <Col sm={restrictBases && !qrOnly ? 8 : 12}>
            <UTMTextField
              valueChanged={setTarget}
              targetType="utm_target"
              enableMe={
                !restrictBases ||
                qrOnly ||
                (base !== '' && base !== 'choose_one_...')
              }
              qrOnly={qrOnly}
              value={target === 'https://www.example.com/' ? '' : target}
            />
          </Col>
        </InputGroup>
      </Row>
      {/* utm_source & utm_medium */}
      <Row style={{ marginBottom: '-.5rem' }}>
        {/* utm_source */}
        {mainConfig?.utm_source?.useValue ? (
          <Col>
            {mainConfig?.utm_source?.isChooser ? (
            <InputGroup className="mb-3" size="lg">
              <UTMChoice
                valueChanged={setSource}
                targetType="utm_source"
                enabled={!qrOnly}
                id="utm-source"
                settings={mainConfig?.utm_source}
                selected={source}
              />
            </InputGroup>
            ) : (
            <InputGroup className="mb-3" size="lg">
              <UTMTextField
                valueChanged={setSource}
                targetType="utm_source"
                enableMe={!qrOnly}
                qrOnly={qrOnly}
                value={source}
              />
            </InputGroup>
            )}
          </Col>
        ) : ( <></> )}
        {/* utm_medium */}
        {mainConfig?.utm_medium?.useValue ? (
          <Col>
            <InputGroup className="mb-3" size="lg">
              {mainConfig?.utm_medium?.isChooser ? (
              <UTMChoice
                valueChanged={setMedium}
                targetType="utm_medium"
                enabled={!qrOnly}
                id="medium-choice"
                settings={mainConfig?.utm_medium}
                selected={medium}
              /> ) : (
              <UTMTextField
                valueChanged={setMedium}
                targetType="utm_medium"
                enableMe={!qrOnly}
                value={medium}
                qrOnly={qrOnly}
              />
              )}
            </InputGroup>
          </Col>
        ) : ( <></> )}
      </Row>
      {/*  utm_term, utm_campaign */}
      <Row style={{ marginBottom: '.5rem' }}>
        {mainConfig?.utm_campaign.useValue ? (
          <Col>
            {mainConfig?.utm_campaign.isChooser ? (
              <UTMChoice
                valueChanged={setCampaign}
                targetType="utm_campaign"
                enabled={!qrOnly}
                id="campaign-choice"
                settings={mainConfig?.utm_campaign}
                selected={campaign}
              /> ) : (
            <UTMTextField
              valueChanged={setCampaign}
              targetType="utm_campaign"
              enableMe={!qrOnly}
              qrOnly={qrOnly}
              value={campaign}
            /> )}
          </Col>
        ) : ( <></> )}
        {mainConfig?.utm_term.useValue ? (
          <Col>
            {mainConfig?.utm_term.isChooser ? (
              <UTMChoice
                valueChanged={setTerm}
                targetType="utm_Term"
                enabled={!qrOnly}
                id="term-choice"
                settings={mainConfig?.utm_term}
                selected={term}
              /> ) : (
            <UTMTextField
              valueChanged={setTerm}
              targetType="utm_term"
              enableMe={!qrOnly}
              qrOnly={qrOnly}
              value={term}
            /> )}
          </Col>
        ) : ( <></> )}
      </Row>

      {/*  utm_content, utm_keyword */}
      <Row style={{ marginBottom: '.5rem' }}>
        {mainConfig?.utm_content?.useValue ? (
          <Col>
            {mainConfig?.utm_content.isChooser ? (
              <UTMChoice
                valueChanged={setContent}
                targetType="utm_content"
                enabled={!qrOnly}
                id="content-choice"
                settings={mainConfig?.utm_content}
                selected={content}
              /> ) : (
            <UTMTextField
              valueChanged={setContent}
              targetType="utm_content"
              enableMe={!qrOnly}
              qrOnly={qrOnly}
              value={content}
            /> )}
          </Col>
        ) : ( <></> )}
        {mainConfig?.utm_keyword?.useValue ? (
          <Col>
            {mainConfig?.utm_keyword?.isChooser ? (
              <UTMChoice
                valueChanged={setKeyword}
                targetType="utm_keyword"
                enabled={!qrOnly}
                id="keyword-choice"
                settings={mainConfig?.utm_keyword}
                selected={keyword}
              /> ) : (
            <UTMTextField
              valueChanged={setKeyword}
              targetType="utm_keyword"
              enableMe={!qrOnly}
              qrOnly={qrOnly}
              value={keyword}
            /> )}
          </Col>
        ) : ( <></> )}
      </Row>


      {/* team_name, region_name, utm_country */}
      <Row style={{ marginTop: '.5rem', marginBottom: '-.5rem' }}>
        {mainConfig?.team_name.useValue ? (
        <Col>
          {mainConfig?.team_name.isChooser ? (
          <InputGroup className="mb-3" size="lg">
            <UTMChoice
              valueChanged={updateTeam}
              targetType="utm_campaign_team"
              enabled={!qrOnly}
              id="utm-team"
              settings={mainConfig?.team_name}
              selected={team}
            />
          </InputGroup>
            ) : (
          <InputGroup className="mb-3" size="lg">
          <UTMTextField
            valueChanged={updateTeam}
            targetType="utm_campaign_team"
            enableMe={!qrOnly}
            qrOnly={qrOnly}
            value={team}
          />
          </InputGroup>
            )}
        </Col>
        ) : ( <></> )}
        {mainConfig?.region_name.useValue ? (
        <Col>
          {mainConfig?.region_name.isChooser ? (
          <InputGroup className="mb-3" size="lg">
            <UTMChoice
              valueChanged={updateRegion}
              targetType="region_name"
              enabled={!qrOnly}
              id="region_name"
              settings={mainConfig?.region_name}
              selected={region}
            />
          </InputGroup>
           ) : (
          <InputGroup className="mb-3" size="lg">
          <UTMTextField
            valueChanged={updateRegion}
            targetType="region_name"
            enableMe={!qrOnly}
            qrOnly={qrOnly}
            value={region}
          />
          </InputGroup>
           )}
        </Col> ) : ( <></> )}
        {showCountry ? (
          <Col style={{ marginTop: '.3rem' }}>
            <CountrySelect
              value={country as ICountry}
              valueAs="object"
              size="lg"
              disabled={qrOnly}
              onChange={updateCountry}
              onTextChange={updateCountry}
            />
          </Col>
        ) : ( <></> )}
      </Row>
      {/* utm_content */}
      <Row>
        <Col sm={12}>
          <InputGroup className="mb-3" size="lg">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>This value is auto-generated</Tooltip>}
            >
              <FloatingLabel label="Final Campaign String">
                <FormControl
                  required
                  disabled
                  id="final-campaign-target"
                  aria-label="Final Campaign Value (Read Only)"
                  aria-describedby="Final Campaign Value (Read Only)"
                  value={finalCampaign}
                />
              </FloatingLabel>
            </OverlayTrigger>
            <Form.Control.Feedback type="invalid">
              This value is auto-generated
            </Form.Control.Feedback>
          </InputGroup>
        </Col>
      </Row>
      <p />
      {/* Dire Warning modal */}
      <DireWarning
        show={showDireWarning}
        onHide={setShowDireWarning}
        onConfirm={dire}
      />
    </div>
  );
}

LinkForm.propTypes = {
  dark: PropTypes.bool,
};
