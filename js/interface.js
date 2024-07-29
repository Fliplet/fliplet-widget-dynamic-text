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
      break;
    case 'custom':
      Fliplet.Helper.field('customRegex').toggle(true);
      break;

    default:
      break;
  }
}

Fliplet.Widget.findParents({
  filter: { package: 'com.fliplet.dynamic-container' }
}).then(async(widgets) => {
  if (widgets.length === 0) {
    Fliplet.Widget.generateInterface({
      title: 'Configure dynamic text',
      fields: [
        {
          type: 'html',
          html: '<p style="color: #A5A5A5; font-size: 12px; font-weight: 400;">This component needs to be placed inside a Dynamic Container</p>'
        }
      ]
    });

    return Fliplet.UI.Toast(
      'This component needs to be placed inside a Dynamic Container'
    );
  }

  const dynamicContainer = widgets[0];

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
      { label: '08:30 PM', value: 'LT' },
      { label: '08:30:45 PM', value: 'LTS' }
    ];

    const TIME_DATE_FORMAT_OPTIONS = [
      { label: 'September 4, 1986 8:30 PM', value: 'LL LT' },
      { label: 'Sep 4, 1986 8:30 PM', value: 'll LT' },
      { label: 'Thursday, September 4, 1986 8:30 PM', value: 'LLLL' },
      { label: 'Thu, Sep 4, 1986 8:30 PM', value: 'llll' }
    ];

    const TIMEZONES_OPTIONS = [
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'America/Denver',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Europe/Moscow',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Singapore',
      'Australia/Sydney',
      'Australia/Melbourne',
      'Asia/Hong_Kong',
      'Asia/Seoul',
      'America/Sao_Paulo',
      'America/Bogota',
      'Africa/Johannesburg',
      'America/Argentina/Buenos_Aires',
      'Asia/Dubai',
      'Pacific/Auckland'
    ];

    return Fliplet.Widget.generateInterface({
      title: 'Configure dynamic text',
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
          label: 'Select data format',
          options: DATA_FORMATS_OPTIONS,
          default: 'text',
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
            'Data should be formatted as an array: [“value”, “value”] or a coma-separated list:  value,value',
          options: DATA_VISUALIZATION_OPTIONS
        },
        {
          type: 'dropdown',
          name: 'dateFormat',
          label: 'Select dataview type',
          description:
            "Note, date will be displayed in user's local device format",
          options: DATE_FORMAT_OPTIONS
        },
        {
          type: 'dropdown',
          name: 'timeFormat',
          label: 'Select dataview type',
          options: TIME_FORMAT_OPTIONS
        },
        {
          type: 'dropdown',
          name: 'timeDateFormat',
          label: 'Select dataview type',
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
          label: 'Provide regex',
          placeholder: '/[A-Z]/g',
          description:
            'We use the RegExp in javaScript. An example to find an uppercase string is /[A-Z]/g. See guide <a href="https://builtin.com/software-engineering-perspectives/javascript-regex" target="_blank">here<a/>'
        }
      ]
    });
  });
});
