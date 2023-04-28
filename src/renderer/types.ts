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

// import logo from '../../assets/images/logo-mark_fill.png';
// import MainLogo from '../../assets/images/NewLinkerLogo.svg';
// import logo from '../../assets/images/logo-mark_fill.png';
export interface IProps {
  value: string;
  ecLevel: 'L' | 'M' | 'Q' | 'H';
  enableCORS: boolean;
  size: number;
  quietZone: number;
  bgColor: string;
  fgColor: string;
  logoImage: string;
  logoWidth: number;
  logoHeight: number;
  logoOpacity: number;
  logoOnLoad?: () => void;
  removeQrCodeBehindLogo: boolean;
  logoPadding: number;
  logoPaddingStyle: 'square' | 'circle' | undefined;
  eyeRadius: [CornerRadii, CornerRadii, CornerRadii];
  eyeColor: EyeColor ;
  qrStyle: 'squares' | 'dots';
  style: object;
  id: string;
}
declare type EyeColor = string | InnerOuterEyeColor;
declare type InnerOuterEyeColor = {
  inner: string;
  outer: string;
};
declare type CornerRadii = [number, number, number, number]


export type UtmKeyValue = {
  key: string;
  value: string;
};

export type UtmObj = {
  useValue: boolean;
  isChooser: boolean;
  showName: boolean;
  label: string;
  ariaLabel: string;
  tooltip: string;
  error: string;
  value: UtmKeyValue[];
};

export type BitlyConfig = {
  useValue: boolean;
  label: string;
  ariaLabel: string;
  tooltip: string;
  error: string;
  bitlyToken: string;
  bitlyDomain: string;
  bitlyAddr: string;
  bitlyEnabled: boolean;
};

export type UtmParams = {
  restrict_bases: boolean;
  show_country: boolean;
  utm_bases: UtmObj;
  utm_campaign: UtmObj;
  utm_target: UtmObj;
  utm_term: UtmObj;
  utm_medium: UtmObj;
  utm_source: UtmObj;
  utm_keyword: UtmObj;
  utm_content: UtmObj;
  team_name: UtmObj;
  region_name: UtmObj;
  bitly_config: BitlyConfig;
};

export const defaultBitlyConfig: BitlyConfig = {
  useValue: false,
  label: 'Use Bitly',
  ariaLabel: 'Shorten Link with Bitly',
  tooltip: 'Shorten Link with Bitly',
  error: 'No Bitly Token Found',
  bitlyToken: '',
  bitlyDomain: '',
  bitlyAddr: 'https://api-ssl.bitly.com/v4/shorten',
  bitlyEnabled: false,
};

export const defaultUTMBases = {
  useValue: true,
  isChooser: true,
  showName: true,
  label: 'Web Property',
  ariaLabel: 'Web Property',
  tooltip: 'Which web property will this link point to?',
  error: 'These need to be full URLs',
  value: [
    { key: 'https://foo.com/', value: 'https://foo.com' },
    { key: 'https://bar.com/', value: 'https://bar.com' },
    { key: 'https://foobar.com/', value: 'https://foobar.com' },
  ],
};

export const defaultUTMTeamName: UtmObj = {
  useValue: true,
  isChooser: true,
  showName: false,
  label: 'Team',
  tooltip: 'What team are you on?',
  error: 'Please enter a valid team name',
  ariaLabel: 'Team Name',
  value: [
    { key: 'dr', value: 'Developer Relations' },
    { key: 'el', value: 'Executive Leaders' },
    { key: 'en', value: 'Engineering' },
    { key: 'mk', value: 'Marketing' },
    { key: 'pr', value: 'Product' },
    { key: 'sa', value: 'Sales' },
    { key: 'so', value: 'Social' },
  ],
};

export const defaultUTMRegionName: UtmObj = {
  useValue: true,
  isChooser: true,
  showName: true,
  label: 'Region',
  tooltip: 'What region will this target?',
  error: 'Please enter a valid region name',
  ariaLabel: 'Region Name',
  value: [
    { key: 'na', value: 'North America' },
    { key: 'apac', value: 'APAC' },
    { key: 'emea', value: 'EMEA' },
    { key: 'gl', value: 'Global' },
  ],
};

export const defaultUTMTarget: UtmObj = {
  useValue: true,
  isChooser: false,
  showName: true,
  label: 'URL Parameters',
  tooltip: 'Additional URL parameters to append to the link',
  error: 'Please enter a valid URL Parameter',
  ariaLabel: 'Add any additional URL parameters',
  value: [{ key: '', value: '' }],
};

export const defaultUTMKeyword: UtmObj = {
  useValue: true,
  isChooser: true,
  showName: true,
  label: 'Keywords',
  tooltip: 'Additional keywords to append to the link',
  error: 'Please enter a valid Keyword',
  ariaLabel: 'Add any additional keywords',
  value: [{ key: '', value: '' }],
};

export const defaultUTMContent: UtmObj = {
  useValue: true,
  isChooser: true,
  showName: true,
  label: 'Content',
  tooltip: 'Additional content to append to the link',
  error: 'Please enter a valid content value',
  ariaLabel: 'Add any additional content',
  value: [{ key: '', value: '' }],
};

export const defaultUTMTerm: UtmObj = {
  useValue: true,
  isChooser: true,
  showName: true,
  label: 'Term',
  tooltip: `What's the Campaign Term?`,
  error: 'Please choose a valid Term',
  ariaLabel: `What's the Campaign Term?`,
  value: [
    { key: 'adwords', value: 'Adwords' },
    { key: 'angel', value: 'Angel' },
    { key: 'baidu', value: 'Baidu' },
    { key: 'bing', value: 'Bing' },
    { key: 'conf-talk', value: 'Conference Talk' },
    { key: 'discord', value: 'Discord' },
    { key: 'duckduckgo', value: 'Duck Duck Go' },
    { key: 'dev-to', value: 'Dev.To' },
    { key: 'dzone', value: 'DZone' },
    { key: 'facebook', value: 'Facebook' },
    { key: 'github', value: 'GitHub' },
    { key: 'gitlab', value: 'GitLab' },
    { key: 'google', value: 'Google' },
    { key: 'linkedin', value: 'LinkedIn' },
    { key: 'medium', value: 'Medium' },
    { key: 'meetup', value: 'Meetup' },
    { key: 'otta', value: 'Otta' },
    { key: 'reddit', value: 'Reddit' },
    { key: 'simplify', value: 'Simplify' },
    { key: 'slack', value: 'Slack' },
    { key: 'stack-overflow', value: 'Stack Overflow' },
    { key: 'techmeme', value: 'Techmeme' },
    { key: 'twitter', value: 'Twitter' },
    { key: 'youtube', value: 'YouTube' },
  ],
};

export const defaultUTMMedium: UtmObj = {
  useValue: true,
  isChooser: false,
  showName: true,
  label: 'Referral Medium',
  tooltip:
    "What kind of referral link is this? This is usually how you're distributing the link.",
  error: 'Please choose a valid referral medium',
  ariaLabel: 'Referral medium',
  value: [
    { key: 'cpc', value: 'Cost Per Click' },
    { key: 'direct', value: 'Direct' },
    { key: 'display', value: 'Display' },
    { key: 'email', value: 'Email' },
    { key: 'event', value: 'Event' },
    { key: 'organic', value: 'Organic' },
    { key: 'paid-search', value: 'Paid Search' },
    { key: 'paid-social', value: 'Paid Social' },
    { key: 'qr', value: 'QR Code' },
    { key: 'referral', value: 'Referral' },
    { key: 'retargeting', value: 'Retargeting' },
    { key: 'social', value: 'Social' },
    { key: 'ppc', value: 'Pay Per Click' },
    { key: 'linq', value: 'Linq' },
  ],
};

export const defaultUTMSource: UtmObj = {
  useValue: true,
  isChooser: false,
  showName: true,
  label: 'Referral Source',
  tooltip: 'Where will you be posting this link?',
  error: 'Please enter a valid referral source',
  ariaLabel: 'Referral Source',
  value: [{ key: '', value: '' }],
};

export const defaultUTMCampaign: UtmObj = {
  useValue: true,
  isChooser: false,
  showName: true,
  label: 'Campaign',
  tooltip: 'Enter a campaign name',
  error: 'Please enter a valid campaign name',
  ariaLabel: 'Campaign Name',
  value: [{ key: '', value: '' }],
};

export const defaultUTMParams: UtmParams = {
  restrict_bases: true,
  show_country: true,
  utm_bases: defaultUTMBases,
  utm_campaign: defaultUTMCampaign,
  utm_target: defaultUTMTarget,
  utm_term: defaultUTMTerm,
  utm_medium: defaultUTMMedium,
  utm_source: defaultUTMSource,
  utm_content: defaultUTMContent,
  utm_keyword: defaultUTMKeyword,
  bitly_config: defaultBitlyConfig,
  team_name: defaultUTMTeamName,
  region_name: defaultUTMRegionName,
};

export type LinkData = {
  longLink: string | null;
  shortLink: string | null;
  uuid: string;
  teamName: string | null;
  regionName: string | null;
  campaign: string | null;
  source: string | null;
  medium: string | null;
  term: string | null;
  content: string | null;
  keyword: string | null;
  target: string | null;
  base: string | null;
  countryName: string | null;
  date: string | null;
};

export type QRSettings = {
  QRProps: IProps;
  QRType: string;
  XParent: boolean;
  QRImageFile: string;
};

export type MainSettings = {
  brandImageFile: string;
  brandHeight: number;
  brandWidth: number;
  brandOpacity: number;
  QRSettings: QRSettings;
};

export const DefaultQRStyle: IProps = {
  value: 'https://www.example.com/',
  ecLevel: 'H',
  size: 220,
  quietZone: 0,
  enableCORS: true,
  bgColor: 'rgba(255, 255, 255, 1)',
  fgColor: 'rgba(11, 38, 62, 1)',
  logoImage: '',
  logoWidth: 60,
  logoHeight: 60,
  logoOpacity: 1,
  removeQrCodeBehindLogo: false,
  qrStyle: 'dots',
  eyeColor: 'rgba(11, 38, 62, 1)',
  eyeRadius: [
    [16, 16, 0, 16],
    [16, 16, 16, 0],
    [16, 0, 16, 16],
  ],
  logoPadding: 0,
  logoPaddingStyle: 'circle',
  style: {height: '100%', width: '100%'},
  id: ""
};

export const defaultQRSettings: QRSettings = {
  QRProps: DefaultQRStyle,
  QRType: 'png',
  XParent: false,
  QRImageFile: '',
};

export const defaultMainSettings: MainSettings = {
  brandImageFile: '',
  brandHeight: 0,
  brandWidth: 0,
  brandOpacity: 1,
  QRSettings: defaultQRSettings,
};
