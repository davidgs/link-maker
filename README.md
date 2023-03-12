
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
![Basic UI light-mode](images/link-maker-ui-light.png)

![Basic UI dark-mode](./images/link-maker-ui-dark.png)

Restricted referral domains:
![Restricted referral domains](./images/link-maker-restricted-light.png)

![Restricted referral domains dark-mode](./images/link-maker-restricted-dark.png)

Password-protected settings page:
![Password-protected settings page](./images/link-maker-passwd-light.png)

![Password-protected settings page dark-mode](./images/link-maker-passwd-dark.png)

Change Password:
![Change Password](./images/link-maker-change-passwd-light.png)

![Change Password dark-mode](./images/link-maker-change-passwd-dark.png)

Configuration Page:
![Configuration Page](./images/link-maker-config-light.png)

![Configuration Page dark-mode](./images/link-maker-config-dark.png)

Configuring Bit.ly API:
![Configuring Bit.ly API](./images/link-maker-config-bitly-light.png)

![Configuring Bit.ly API dark-mode](./images/link-maker-bitly-config-dark.png)

Configuring Restricted Referral Domains:
![Configuring Restricted Referral Domains](./images/link-maker-config-restricted-light.png)

![Configuring Restricted Referral Domains dark-mode](./images/link-maker-config-restricted-dark.png)

Configuring Unrestricted Referral Domains:
![Configuring Unrestricted Referral Domains](./images/link-maker-config-unrestricted-light.png)

![Configuring Unrestricted Referral Domains dark-mode](./images/link-maker-config-unrestricted-dark.png)

Configuring a value to be a Text Field:
![Configuring a value to be a Text Field](./images/link-maker-config-textfield-light.png)

![Configuring a value to be a Text Field dark-mode](./images/link-maker-config-textfield-dark.png)

Configuring a value to be a Chooser-menu:
![Configuring a value to be a Chooser-menu](./images/link-maker-config-chooser-light.png)

![Configuring a value to be a Chooser-menu dark-mode](./images/link-maker-config-chooser-dark.png)

Adding Key-Value pairs to the Chooser-menu:
![Adding Key-Value pairs to the Chooser-menu](./images/link-maker-config-key-value-light.png)

![Adding Key-Value pairs to the Chooser-menu dark-mode](./images/link-maker-config-key-value-dark.png)

Key-Value entries displayed in the Configuration Page:
![Key-Value entries displayed in the Configuration Page](./images/link-maker-config-pill-light.png)

![Key-Value entries displayed in the Configuration Page dark-mode](./images/link-maker-config-pill-dark.png)

## The Configuration File:

The configuration file is a JSON file that is stored on the user's computer. The location of the configuration file is platform-dependent but on macOS, it is stored in `~/Library/Application Support/Electron/config.json`

**Note:** The complete configuration file will *only* appear once changes to the configuration settings have been saved. Until then, the application will use a set of default values.

### Configuration File Format

This is the complete set of default settings:

```json
{
	"dark-mode": false,
	"admin-passwd": "",
	"utm-config": {
		"restrict_bases": true,
		"show_country": true,
		"utm_bases": {
			"useValue": true,
			"isChooser": true,
			"showName": true,
			"label": "Web Property",
			"ariaLabel": "Web Property",
			"tooltip": "Which web property will this link point to?",
			"error": "These need to be full URLs",
			"value": [
				{
					"key": "https://foo.com/",
					"value": "https://foo.com"
				},
				{
					"key": "https://bar.com/",
					"value": "https://bar.com"
				},
				{
					"key": "https://foobar.com/",
					"value": "https://foobar.com"
				}
			]
		},
		"utm_campaign": {
			"useValue": true,
			"isChooser": false,
			"showName": true,
			"label": "Campaign",
			"tooltip": "Enter a campaign name",
			"error": "Please enter a valid campaign name",
			"ariaLabel": "Campaign Name",
			"value": [
				{
					"key": "",
					"value": ""
				}
			]
		},
		"utm_target": {
			"useValue": true,
			"isChooser": false,
			"showName": true,
			"label": "URL Parameters",
			"tooltip": "Additional URL parameters to append to the link",
			"error": "Please enter a valid URL Parameter",
			"ariaLabel": "Add any additional URL parameters",
			"value": [
				{
					"key": "",
					"value": ""
				}
			]
		},
		"utm_term": {
			"useValue": true,
			"isChooser": true,
			"showName": true,
			"label": "Term",
			"tooltip": "What's the Campaign Term?",
			"error": "Please choose a valid Term",
			"ariaLabel": "What's the Campaign Term?",
			"value": [
				{
					"key": "adwords",
					"value": "Adwords"
				},
				{
					"key": "angel",
					"value": "Angel"
				},
				{
					"key": "baidu",
					"value": "Baidu"
				},
				{
					"key": "bing",
					"value": "Bing"
				},
				{
					"key": "conf-talk",
					"value": "Conference Talk"
				},
				{
					"key": "discord",
					"value": "Discord"
				},
				{
					"key": "duckduckgo",
					"value": "Duck Duck Go"
				},
				{
					"key": "dev-to",
					"value": "Dev.To"
				},
				{
					"key": "dzone",
					"value": "DZone"
				},
				{
					"key": "facebook",
					"value": "Facebook"
				},
				{
					"key": "github",
					"value": "GitHub"
				},
				{
					"key": "gitlab",
					"value": "GitLab"
				},
				{
					"key": "google",
					"value": "Google"
				},
				{
					"key": "linkedin",
					"value": "LinkedIn"
				},
				{
					"key": "medium",
					"value": "Medium"
				},
				{
					"key": "meetup",
					"value": "Meetup"
				},
				{
					"key": "otta",
					"value": "Otta"
				},
				{
					"key": "reddit",
					"value": "Reddit"
				},
				{
					"key": "simplify",
					"value": "Simplify"
				},
				{
					"key": "slack",
					"value": "Slack"
				},
				{
					"key": "stack-overflow",
					"value": "Stack Overflow"
				},
				{
					"key": "techmeme",
					"value": "Techmeme"
				},
				{
					"key": "twitter",
					"value": "Twitter"
				},
				{
					"key": "youtube",
					"value": "YouTube"
				}
			]
		},
		"utm_medium": {
			"useValue": true,
			"isChooser": false,
			"showName": true,
			"label": "Referral Medium",
			"tooltip": "What kind of referral link is this? This is usually how you're distributing the link.",
			"error": "Please choose a valid referral medium",
			"ariaLabel": "Referral medium",
			"value": [
				{
					"key": "cpc",
					"value": "Cost Per Click"
				},
				{
					"key": "direct",
					"value": "Direct"
				},
				{
					"key": "display",
					"value": "Display"
				},
				{
					"key": "email",
					"value": "Email"
				},
				{
					"key": "event",
					"value": "Event"
				},
				{
					"key": "organic",
					"value": "Organic"
				},
				{
					"key": "paid-search",
					"value": "Paid Search"
				},
				{
					"key": "paid-social",
					"value": "Paid Social"
				},
				{
					"key": "qr",
					"value": "QR Code"
				},
				{
					"key": "referral",
					"value": "Referral"
				},
				{
					"key": "retargeting",
					"value": "Retargeting"
				},
				{
					"key": "social",
					"value": "Social"
				},
				{
					"key": "ppc",
					"value": "Pay Per Click"
				},
				{
					"key": "linq",
					"value": "Linq"
				}
			]
		},
		"utm_source": {
			"useValue": true,
			"isChooser": false,
			"showName": true,
			"label": "Referral Source",
			"tooltip": "Where will you be posting this link?",
			"error": "Please enter a valid referral source",
			"ariaLabel": "Referral Source",
			"value": [
				{
					"key": "",
					"value": ""
				}
			]
		},
		"utm_content": {
			"useValue": true,
			"isChooser": true,
			"showName": true,
			"label": "Content",
			"tooltip": "Additional content to append to the link",
			"error": "Please enter a valid content value",
			"ariaLabel": "Add any additional content",
			"value": [
				{
					"key": "",
					"value": ""
				}
			]
		},
		"utm_keyword": {
			"useValue": true,
			"isChooser": true,
			"showName": true,
			"label": "Keywords",
			"tooltip": "Additional keywords to append to the link",
			"error": "Please enter a valid Keyword",
			"ariaLabel": "Add any additional keywords",
			"value": [
				{
					"key": "",
					"value": ""
				}
			]
		},
		"bitly_config": {
			"useValue": true,
			"label": "Use Bitly",
			"ariaLabel": "Shorten Link with Bitly",
			"tooltip": "Shorten Link with Bitly",
			"error": "No Bitly Token Found",
			"bitlyToken": "",
			"bitlyDomain": "",
			"bitlyAddr": "https://api-ssl.bitly.com/v4/shorten",
			"bitlyEnabled": false
		},
		"team_name": {
			"useValue": true,
			"isChooser": true,
			"showName": false,
			"label": "Team",
			"tooltip": "What team are you on?",
			"error": "Please enter a valid team name",
			"ariaLabel": "Team Name",
			"value": [
				{
					"key": "dr",
					"value": "Developer Relations"
				},
				{
					"key": "el",
					"value": "Executive Leaders"
				},
				{
					"key": "en",
					"value": "Engineering"
				},
				{
					"key": "mk",
					"value": "Marketing"
				},
				{
					"key": "pr",
					"value": "Product"
				},
				{
					"key": "sa",
					"value": "Sales"
				},
				{
					"key": "so",
					"value": "Social"
				}
			]
		},
		"region_name": {
			"useValue": true,
			"isChooser": true,
			"showName": true,
			"label": "Region",
			"tooltip": "What region will this target?",
			"error": "Please enter a valid region name",
			"ariaLabel": "Region Name",
			"value": [
				{
					"key": "na",
					"value": "North America"
				},
				{
					"key": "apac",
					"value": "APAC"
				},
				{
					"key": "emea",
					"value": "EMEA"
				},
				{
					"key": "gl",
					"value": "Global"
				}
			]
		}
	}
}
```

The Admin password is *not* stored in plain-text but is instead stored only as a SHA512 hash of the original password. The hash is stored in the `config.json` file.

If you would like to change the default settings, and set an initial, default password you will have to change the settings in the source files and build the application yourself.

The default settings are all stored in the `src/types.tsx` file. No Default password is set but you can create one by running the following command in a terminal:

```bash
echo -n "password" | openssl dgst -sha512
```

The output of the command will be the hash of the password. Copy the hash and paste it into the `src/main/main.tsx` file in the `check-passwd` function at line 183.


## Based on Electron React Boilerplate (ERB)

Learn more about [ERB](https://github.com/electron-react-boilerplate/) if you want to build your own electron-based apps. This project is a fork of ERB with a ton of modifications to suit my needs.
### ERB Maintainers

- [Amila Welihinda](https://github.com/amilajack)
- [John Tran](https://github.com/jooohhn)
- [C. T. Lin](https://github.com/chentsulin)
- [Jhen-Jie Hong](https://github.com/jhen0409)

## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)
MIT © [UTM Link Builder & QR Code Generator](https://github.com/davidgs/link-maker)



