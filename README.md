
# UTM Link Builder & QR Code Generator

A simple Electron/React JS application to help you generate useful UTM links and QR codes.

## Features

- Generate UTM links
- Generate QR codes
- Integrated with Bit.ly API to also shorten links for you
- Highly configurable interface with a configuration-page that allows you to change everything from menu contents to tool tip messages, etc.
- Password-protected settings page
- Restrict referral links to pre-defined domain(s)

## Screen shots

The basic UI:
![Basic UI][basic]

Entering a link to encode:
![Link UI][link]

Choosing a `utm_campaign` value:
![Campaign UI][campaign]

Choosing a Country:
![Country UI][country]

Basic Configuration UI:
![Configuration UI][config]

Configuring a Drop-down element:
![Drop-down Configuration][drop]

Configure the `utm_source` Field:
![Source Configuration][source]

Restricting referral domains:
![Restricting referral domains][restrict]

Restricted referral domains:
![Restricted referral domains][restricted]

Restricted referral domains result:
![Restricted referral domains result][restricted-result]


## Based on Electron React Boilerplate (ERB)

Learn more about [ERB](https://github.com/electron-react-boilerplate/) if you want to build your own electron-based apps. This project is a fork of ERB with a ton of modifications to suit my needs.
### ERB Maintainers

- [Amila Welihinda](https://github.com/amilajack)
- [John Tran](https://github.com/jooohhn)
- [C. T. Lin](https://github.com/chentsulin)
- [Jhen-Jie Hong](https://github.com/jhen0409)

## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)
MIT © [UTM Link Builder & QR Code Generator](https://github.com/davidgs/utm-redux)


[basic]: ./images/utm-redux-basic-ui.png
[campaign]: ./images/utm-redux-campaign-chooser.png
[link]: ./images/utm-redux-link.png
[country]: ./images/utm-redux-country-chooser.png
[config]: ./images/utm-redux-basic-config.png
[drop]: ./images/utm-redux-config-drop.png
[source]: ./images/utm-redux-config-source.png
[restrict]: ./images/utm-redux-restrict.png
[restricted]: ./images/utm-redux-restricted.png
[restricted-result]: ./images/utm-redux-restricted-res.png
