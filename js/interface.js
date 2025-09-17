function hideAllFields() {
  Fliplet.Helper.field('urlALtText').toggle(false);
  Fliplet.Helper.field('phoneALtText').toggle(false);
  Fliplet.Helper.field('mailALtText').toggle(false);
  Fliplet.Helper.field('noDecimalRound').toggle(false);
  Fliplet.Helper.field('symbolBefore').toggle(false);
  Fliplet.Helper.field('symbolAfter').toggle(false);
  Fliplet.Helper.field('dataVisualization').toggle(false);
  Fliplet.Helper.field('dateFormat').toggle(false);
  Fliplet.Helper.field('timeFormat').toggle(false);
  Fliplet.Helper.field('timeDateFormat').toggle(false);
  Fliplet.Helper.field('timeDateTimezone').toggle(false);
  Fliplet.Helper.field('timeDateTimezoneCheckbox').toggle(false);
  Fliplet.Helper.field('customRegex').toggle(false);
}

function handleFieldVisibility(value) {
  hideAllFields();

  switch (value) {
    case 'text':
    case 'html':
      break;
    case 'url':
      Fliplet.Helper.field('urlALtText').toggle(true);
      break;
    case 'telephone':
      Fliplet.Helper.field('phoneALtText').toggle(true);
      break;
    case 'email':
      Fliplet.Helper.field('mailALtText').toggle(true);
      break;
    case 'numberCurrency':
      Fliplet.Helper.field('noDecimalRound').toggle(true);
      Fliplet.Helper.field('symbolBefore').toggle(true);
      Fliplet.Helper.field('symbolAfter').toggle(true);
      break;
    case 'array':
      Fliplet.Helper.field('dataVisualization').toggle(true);
      break;
    case 'date':
      Fliplet.Helper.field('dateFormat').toggle(true);
      break;
    case 'time':
      Fliplet.Helper.field('timeFormat').toggle(true);
      break;
    case 'dateTime':
      Fliplet.Helper.field('timeDateFormat').toggle(true);
      Fliplet.Helper.field('timeDateTimezone').toggle(true);
      Fliplet.Helper.field('timeDateTimezoneCheckbox').toggle(true);

      let showTimezone = Fliplet.Helper.field('timeDateTimezoneCheckbox').get().includes(true);

      Fliplet.Helper.field('timeDateTimezone').toggle(showTimezone);
      break;
    case 'custom':
      Fliplet.Helper.field('customRegex').toggle(true);
      break;

    default:
      break;
  }
}

const findParentDataWidget = async(packageName, parents) => {
  const parent = parents.find((parent) => parent.package === packageName);

  if (!parent) {
    return [null];
  }

  return [parent];
};

Fliplet.Widget.findParents().then(async(widgets) => {
  const [[ dynamicContainer ], [ recordContainer ], [ listRepeater ]] = await Promise.all([
    findParentDataWidget('com.fliplet.dynamic-container', widgets),
    findParentDataWidget('com.fliplet.record-container', widgets),
    findParentDataWidget('com.fliplet.list-repeater', widgets)
  ]);

  if (!dynamicContainer || !dynamicContainer.dataSourceId) {
    return Fliplet.Widget.generateInterface({
      title: 'Configure data text',
      fields: [
        {
          type: 'html',
          html: '<p style="color: #A5A5A5; font-size: 12px; font-weight: 400;">This component needs to be placed inside a Data container with selected Data source</p>'
        }
      ]
    });
  } else if (!recordContainer && !listRepeater) {
    return Fliplet.Widget.generateInterface({
      title: 'Configure data text',
      fields: [
        {
          type: 'html',
          html: '<p style="color: #A5A5A5; font-size: 12px; font-weight: 400;">This component needs to be placed inside a Data record or Data list component</p>'
        }
      ]
    });
  }

  return Fliplet.DataSources.getById(
    dynamicContainer && dynamicContainer.dataSourceId,
    {
      attributes: ['name', 'columns']
    }
  ).then((dataSource) => {
    const DATA_SOURCE_COLUMNS_OPTIONS = (dataSource.columns || []).map((el) => {
      return {
        value: el,
        label: el
      };
    });

    const DATA_FORMATS_OPTIONS = [
      {
        value: 'text',
        label: 'Plain text'
      },
      {
        value: 'html',
        label: 'HTML'
      },
      {
        value: 'url',
        label: 'URL'
      },
      {
        value: 'telephone',
        label: 'Telephone'
      },
      {
        value: 'email',
        label: 'Email'
      },
      {
        value: 'numberCurrency',
        label: 'Number / Currency'
      },
      {
        value: 'array',
        label: 'Multiple values'
      },
      {
        value: 'date',
        label: 'Date'
      },
      {
        value: 'time',
        label: 'Time'
      },
      {
        value: 'dateTime',
        label: 'Date & Time'
      },
      {
        value: 'custom',
        label: 'Custom (format with regex)'
      }
    ];

    const NO_DECIMAL_ROUND_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
      function(i) {
        return {
          value: i,
          label: i
        };
      }
    );

    const DATA_VISUALIZATION_OPTIONS = [
      'Comma-separated list',
      'Semicolon-Separated List',
      'Bullet Point List',
      'Numbered List',
      'Alphabetic List'
    ].map(function(i) {
      return {
        label: i,
        value: i
      };
    });

    const DATE_FORMAT_OPTIONS = [
      { label: '09/22/1986', value: 'L' },
      { label: 'Sep 22,1986', value: 'll' },
      { label: 'September 22,1986', value: 'LL' },
      { label: 'Monday, September 22,1986', value: 'dddd, MMMM D, YYYY' }
    ];

    const TIME_FORMAT_OPTIONS = [
      { label: '08:30 PM / 20:30', value: 'LT' },
      { label: '08:30:45 PM / 20:30:45', value: 'LTS' }
    ];

    const TIME_DATE_FORMAT_OPTIONS = [
      { label: 'September 4, 1986 8:30 PM', value: 'LL LT' },
      { label: 'Sep 4, 1986 8:30 PM', value: 'll LT' },
      { label: 'Thursday, September 4, 1986 8:30 PM', value: 'LLLL' },
      { label: 'Thu, Sep 4, 1986 8:30 PM', value: 'llll' }
    ];

    const TIMEZONES_OPTIONS = [
      'Europe/Andorra',
      'Asia/Dubai',
      'Asia/Kabul',
      'Europe/Tirane',
      'Asia/Yerevan',
      'Antarctica/Casey',
      'Antarctica/Davis',
      'Antarctica/DumontDUrville', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
      'Antarctica/Mawson',
      'Antarctica/Palmer',
      'Antarctica/Rothera',
      'Antarctica/Syowa',
      'Antarctica/Troll',
      'Antarctica/Vostok',
      'America/Argentina/Buenos_Aires',
      'America/Argentina/Cordoba',
      'America/Argentina/Salta',
      'America/Argentina/Jujuy',
      'America/Argentina/Tucuman',
      'America/Argentina/Catamarca',
      'America/Argentina/La_Rioja',
      'America/Argentina/San_Juan',
      'America/Argentina/Mendoza',
      'America/Argentina/San_Luis',
      'America/Argentina/Rio_Gallegos',
      'America/Argentina/Ushuaia',
      'Pacific/Pago_Pago',
      'Europe/Vienna',
      'Australia/Lord_Howe',
      'Antarctica/Macquarie',
      'Australia/Hobart',
      'Australia/Currie',
      'Australia/Melbourne',
      'Australia/Sydney',
      'Australia/Broken_Hill',
      'Australia/Brisbane',
      'Australia/Lindeman',
      'Australia/Adelaide',
      'Australia/Darwin',
      'Australia/Perth',
      'Australia/Eucla',
      'Asia/Baku',
      'America/Barbados',
      'Asia/Dhaka',
      'Europe/Brussels',
      'Europe/Sofia',
      'Atlantic/Bermuda',
      'Asia/Brunei',
      'America/La_Paz',
      'America/Noronha',
      'America/Belem',
      'America/Fortaleza',
      'America/Recife',
      'America/Araguaina',
      'America/Maceio',
      'America/Bahia',
      'America/Sao_Paulo',
      'America/Campo_Grande',
      'America/Cuiaba',
      'America/Santarem',
      'America/Porto_Velho',
      'America/Boa_Vista',
      'America/Manaus',
      'America/Eirunepe',
      'America/Rio_Branco',
      'America/Nassau',
      'Asia/Thimphu',
      'Europe/Minsk',
      'America/Belize',
      'America/St_Johns',
      'America/Halifax',
      'America/Glace_Bay',
      'America/Moncton',
      'America/Goose_Bay',
      'America/Blanc-Sablon',
      'America/Toronto',
      'America/Nipigon',
      'America/Thunder_Bay',
      'America/Iqaluit',
      'America/Pangnirtung',
      'America/Atikokan',
      'America/Winnipeg',
      'America/Rainy_River',
      'America/Resolute',
      'America/Rankin_Inlet',
      'America/Regina',
      'America/Swift_Current',
      'America/Edmonton',
      'America/Cambridge_Bay',
      'America/Yellowknife',
      'America/Inuvik',
      'America/Creston',
      'America/Dawson_Creek',
      'America/Fort_Nelson',
      'America/Vancouver',
      'America/Whitehorse',
      'America/Dawson',
      'Indian/Cocos',
      'Europe/Zurich',
      'Africa/Abidjan',
      'Pacific/Rarotonga',
      'America/Santiago',
      'America/Punta_Arenas',
      'Pacific/Easter',
      'Asia/Shanghai',
      'Asia/Urumqi',
      'America/Bogota',
      'America/Costa_Rica',
      'America/Havana',
      'Atlantic/Cape_Verde',
      'America/Curacao',
      'Indian/Christmas',
      'Asia/Nicosia',
      'Asia/Famagusta',
      'Europe/Prague',
      'Europe/Berlin',
      'Europe/Copenhagen',
      'America/Santo_Domingo',
      'Africa/Algiers',
      'America/Guayaquil',
      'Pacific/Galapagos',
      'Europe/Tallinn',
      'Africa/Cairo',
      'Africa/El_Aaiun',
      'Europe/Madrid',
      'Africa/Ceuta',
      'Atlantic/Canary',
      'Europe/Helsinki',
      'Pacific/Fiji',
      'Atlantic/Stanley',
      'Pacific/Chuuk',
      'Pacific/Pohnpei',
      'Pacific/Kosrae',
      'Atlantic/Faroe',
      'Europe/Paris',
      'Europe/London',
      'Asia/Tbilisi',
      'America/Cayenne',
      'Africa/Accra',
      'Europe/Gibraltar',
      'America/Godthab',
      'America/Danmarkshavn',
      'America/Scoresbysund',
      'America/Thule',
      'Europe/Athens',
      'Atlantic/South_Georgia',
      'America/Guatemala',
      'Pacific/Guam',
      'Africa/Bissau',
      'America/Guyana',
      'Asia/Hong_Kong',
      'America/Tegucigalpa',
      'America/Port-au-Prince',
      'Europe/Budapest',
      'Asia/Jakarta',
      'Asia/Pontianak',
      'Asia/Makassar',
      'Asia/Jayapura',
      'Europe/Dublin',
      'Asia/Jerusalem',
      'Asia/Kolkata',
      'Indian/Chagos',
      'Asia/Baghdad',
      'Asia/Tehran',
      'Atlantic/Reykjavik',
      'Europe/Rome',
      'America/Jamaica',
      'Asia/Amman',
      'Asia/Tokyo',
      'Africa/Nairobi',
      'Asia/Bishkek',
      'Pacific/Tarawa',
      'Pacific/Enderbury',
      'Pacific/Kiritimati',
      'Asia/Pyongyang',
      'Asia/Seoul',
      'Asia/Almaty',
      'Asia/Qyzylorda',
      'Asia/Qostanay', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
      'Asia/Aqtobe',
      'Asia/Aqtau',
      'Asia/Atyrau',
      'Asia/Oral',
      'Asia/Beirut',
      'Asia/Colombo',
      'Africa/Monrovia',
      'Europe/Vilnius',
      'Europe/Luxembourg',
      'Europe/Riga',
      'Africa/Tripoli',
      'Africa/Casablanca',
      'Europe/Monaco',
      'Europe/Chisinau',
      'Pacific/Majuro',
      'Pacific/Kwajalein',
      'Asia/Yangon',
      'Asia/Ulaanbaatar',
      'Asia/Hovd',
      'Asia/Choibalsan',
      'Asia/Macau',
      'America/Martinique',
      'Europe/Malta',
      'Indian/Mauritius',
      'Indian/Maldives',
      'America/Mexico_City',
      'America/Cancun',
      'America/Merida',
      'America/Monterrey',
      'America/Matamoros',
      'America/Mazatlan',
      'America/Chihuahua',
      'America/Ojinaga',
      'America/Hermosillo',
      'America/Tijuana',
      'America/Bahia_Banderas',
      'Asia/Kuala_Lumpur',
      'Asia/Kuching',
      'Africa/Maputo',
      'Africa/Windhoek',
      'Pacific/Noumea',
      'Pacific/Norfolk',
      'Africa/Lagos',
      'America/Managua',
      'Europe/Amsterdam',
      'Europe/Oslo',
      'Asia/Kathmandu',
      'Pacific/Nauru',
      'Pacific/Niue',
      'Pacific/Auckland',
      'Pacific/Chatham',
      'America/Panama',
      'America/Lima',
      'Pacific/Tahiti',
      'Pacific/Marquesas',
      'Pacific/Gambier',
      'Pacific/Port_Moresby',
      'Pacific/Bougainville',
      'Asia/Manila',
      'Asia/Karachi',
      'Europe/Warsaw',
      'America/Miquelon',
      'Pacific/Pitcairn',
      'America/Puerto_Rico',
      'Asia/Gaza',
      'Asia/Hebron',
      'Europe/Lisbon',
      'Atlantic/Madeira',
      'Atlantic/Azores',
      'Pacific/Palau',
      'America/Asuncion',
      'Asia/Qatar',
      'Indian/Reunion',
      'Europe/Bucharest',
      'Europe/Belgrade',
      'Europe/Kaliningrad',
      'Europe/Moscow',
      'Europe/Simferopol',
      'Europe/Kirov',
      'Europe/Astrakhan',
      'Europe/Volgograd',
      'Europe/Saratov',
      'Europe/Ulyanovsk',
      'Europe/Samara',
      'Asia/Yekaterinburg',
      'Asia/Omsk',
      'Asia/Novosibirsk',
      'Asia/Barnaul',
      'Asia/Tomsk',
      'Asia/Novokuznetsk',
      'Asia/Krasnoyarsk',
      'Asia/Irkutsk',
      'Asia/Chita',
      'Asia/Yakutsk',
      'Asia/Khandyga',
      'Asia/Vladivostok',
      'Asia/Ust-Nera',
      'Asia/Magadan',
      'Asia/Sakhalin',
      'Asia/Srednekolymsk',
      'Asia/Kamchatka',
      'Asia/Anadyr',
      'Asia/Riyadh',
      'Pacific/Guadalcanal',
      'Indian/Mahe',
      'Africa/Khartoum',
      'Europe/Stockholm',
      'Asia/Singapore',
      'America/Paramaribo',
      'Africa/Juba',
      'Africa/Sao_Tome',
      'America/El_Salvador',
      'Asia/Damascus',
      'America/Grand_Turk',
      'Africa/Ndjamena',
      'Indian/Kerguelen',
      'Asia/Bangkok',
      'Asia/Dushanbe',
      'Pacific/Fakaofo',
      'Asia/Dili',
      'Asia/Ashgabat',
      'Africa/Tunis',
      'Pacific/Tongatapu',
      'Europe/Istanbul',
      'America/Port_of_Spain',
      'Pacific/Funafuti',
      'Asia/Taipei',
      'Europe/Kiev',
      'Europe/Uzhgorod',
      'Europe/Zaporozhye',
      'Pacific/Wake',
      'America/New_York',
      'America/Detroit',
      'America/Kentucky/Louisville',
      'America/Kentucky/Monticello',
      'America/Indiana/Indianapolis',
      'America/Indiana/Vincennes',
      'America/Indiana/Winamac',
      'America/Indiana/Marengo',
      'America/Indiana/Petersburg',
      'America/Indiana/Vevay',
      'America/Chicago',
      'America/Indiana/Tell_City',
      'America/Indiana/Knox',
      'America/Menominee',
      'America/North_Dakota/Center',
      'America/North_Dakota/New_Salem',
      'America/North_Dakota/Beulah',
      'America/Denver',
      'America/Boise',
      'America/Phoenix',
      'America/Los_Angeles',
      'America/Anchorage',
      'America/Juneau',
      'America/Sitka',
      'America/Metlakatla',
      'America/Yakutat',
      'America/Nome',
      'America/Adak',
      'Pacific/Honolulu',
      'America/Montevideo',
      'Asia/Samarkand',
      'Asia/Tashkent',
      'America/Caracas',
      'Asia/Ho_Chi_Minh',
      'Pacific/Efate',
      'Pacific/Wallis',
      'Pacific/Apia',
      'Africa/Johannesburg'
    ].sort();

    return Fliplet.Widget.generateInterface({
      title: 'Configure data text',
      fields: [
        {
          type: 'html',
          html: `<p style="color: #A5A5A5; font-size: 12px; font-weight: 400;"><strong>Get data from: </strong>
          </br>
          <span class="data-source-id">${dynamicContainer.dataSourceId}</span>
          ${dataSource.name}</p>
                <p style="font-size: 10px; font-weight: 400; color: #8E8E8E;">To change this Data Source, go to parent data container</p>
                <hr/>`
        },
        {
          type: 'dropdown',
          name: 'column',
          label: 'Select column',
          options: DATA_SOURCE_COLUMNS_OPTIONS,
          ready: function() {
            hideAllFields();
          }
        },
        {
          type: 'dropdown',
          name: 'dataFormat',
          label: 'Select data format:',
          options: DATA_FORMATS_OPTIONS,
          default: 'text',
          description:
          'Choose "Custom (format with regex)" if you need to define a specific data format that is not already available, such as a custom date, alphanumeric code, or other pattern.',
          change: function(value) {
            handleFieldVisibility(value);
          },
          ready: function() {
            let value = this.val();

            handleFieldVisibility(value);
          }
        },
        {
          name: 'urlALtText',
          type: 'text',
          label: 'Link label',
          description:
            'When configured, clicking on this link will open the URL',
          placeholder: 'Specify text here e.g. “Tap to open”'
        },
        {
          name: 'phoneALtText',
          type: 'text',
          label: 'Label for phone number',
          description:
            'When configured, clicking on this link will initiate a call to the specified number.',
          placeholder: 'Specify text here e.g. “Tap to call”'
        },
        {
          name: 'mailALtText',
          type: 'text',
          label: 'Label for email',
          description:
            'When configured,  clicking on this link will compose a new email to the specified address',
          placeholder: 'Specify text here e.g. “Tap to send an email”'
        },
        {
          type: 'dropdown',
          name: 'noDecimalRound',
          label: 'Select number of decimals to round this value',
          options: NO_DECIMAL_ROUND_OPTIONS,
          default: 0
        },
        {
          name: 'symbolBefore',
          type: 'text',
          label: 'Specify a symbol before number',
          placeholder: '%, $, km',
          description: 'Leave empty if no symbol required'
        },
        {
          name: 'symbolAfter',
          type: 'text',
          label: 'Specify a symbol after number',
          placeholder: '%, $, km',
          description: 'Leave empty if no symbol required'
        },
        {
          type: 'dropdown',
          name: 'dataVisualization',
          label: 'Select data visualization',
          description:
            'Data should be formatted as an array: [“value”, “value”] or a comma-separated list:  value,value',
          options: DATA_VISUALIZATION_OPTIONS
        },
        {
          type: 'dropdown',
          name: 'dateFormat',
          label: 'Select format',
          description:
            "Note, date will be displayed in user's local device format",
          options: DATE_FORMAT_OPTIONS
        },
        {
          type: 'dropdown',
          name: 'timeFormat',
          label: 'Select format',
          description: 'Note, time will be displayed in user\'s local device format',
          options: TIME_FORMAT_OPTIONS
        },
        {
          type: 'dropdown',
          name: 'timeDateFormat',
          label: 'Select format',
          description:
            "Note, date & time will be displayed in user's local device format",
          options: TIME_DATE_FORMAT_OPTIONS
        },
        {
          type: 'checkbox',
          name: 'timeDateTimezoneCheckbox',
          label: 'Convert to another timezone',
          options: [{ value: true, label: 'Yes' }],
          default: [],
          change: function(value) {
            Fliplet.Helper.field('timeDateTimezone').toggle(
              value.includes(true)
            );
          },
          ready: function() {
            let showTimezone = Fliplet.Helper.field('timeDateTimezoneCheckbox').get().includes(true);

            Fliplet.Helper.field('timeDateTimezone').toggle(showTimezone);
          }
        },
        {
          type: 'dropdown',
          name: 'timeDateTimezone',
          label: 'Select timezone',
          options: TIMEZONES_OPTIONS
        },
        {
          name: 'customRegex',
          type: 'text',
          required: true,
          label: 'Provide regex',
          placeholder: '/[A-Z]/g',
          description:
            'Enter a regular expression (regex) to define your custom format. Regex allows you to specify patterns for data validation. For example:<br><br>' +
            '<ul style="margin-left: -20px;">' +
            '<li>Date in DD-MM-YYYY format: <code>/\\d{2}-\\d{2}-\\d{4}/</code></li>' +
            '<li>Uppercase letters only: <code>/^[A-Z]+$/</code></li>' +
            '<li>Alphanumeric code (6 characters): <code>/^[A-Za-z0-9]{6}$/</code></li>' +
            '</ul><br>' +
            'Click <a href="https://builtin.com/software-engineering-perspectives/javascript-regex" target="_blank">here</a> for examples and a guide to common regex patterns.'
        }
      ]
    });
  });
});
