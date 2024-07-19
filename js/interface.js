function hideAllFields() {
  Fliplet.Helper.field('urlALtText').toggle(false);
  Fliplet.Helper.field('phoneALtText').toggle(false);
  Fliplet.Helper.field('mailALtText').toggle(false);
  Fliplet.Helper.field('noDecimalRound').toggle(false);
  Fliplet.Helper.field('symbol').toggle(false);
  Fliplet.Helper.field('symbolPlacement').toggle(false);
  Fliplet.Helper.field('dataVisualization').toggle(false);
  Fliplet.Helper.field('dateFormat').toggle(false);
  Fliplet.Helper.field('timeFormat').toggle(false);
  Fliplet.Helper.field('timeDateFormat').toggle(false);
  Fliplet.Helper.field('customRegex').toggle(false);
  Fliplet.Helper.field('timeTimezone').toggle(false);
  Fliplet.Helper.field('timeDateTimezone').toggle(false);
}

function handleFieldVisibility(value) {
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
      Fliplet.Helper.field('symbol').toggle(true);
      Fliplet.Helper.field('symbolPlacement').toggle(true);
      break;
    case 'array':
      Fliplet.Helper.field('dataVisualization').toggle(true);
      break;
    case 'date':
      Fliplet.Helper.field('dateFormat').toggle(true);
      break;
    case 'time':
      Fliplet.Helper.field('timeFormat').toggle(true);
      Fliplet.Helper.field('timeTimezone').toggle(true);
      break;
    case 'dateTime':
      Fliplet.Helper.field('timeDateFormat').toggle(true);
      Fliplet.Helper.field('timeDateTimezone').toggle(true);
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
    const DATA_SOURCE_COLUMNS_OPTIONS = dataSource.columns.map((el) => {
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
      // TODO objects missing
      {
        value: 'array',
        label: 'Array'
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
    const SYMBOL_PLACEMENT_OPTIONS = ['before units', 'after units'].map(
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
      { label: 'MM-DD-YYYY', value: 'MM-DD-YYYY' },
      { label: 'DD-MM-YYYY', value: 'DD-MM-YYYY' },
      { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
      { label: 'Month Day, Year', value: 'MMM DD, Year' }, // July 12, 2024
      { label: 'Day Month Year', value: 'DD MMM Year' }, // 12 July 2024
      { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
      { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
      { label: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
      { label: 'MMM DD, YYYY', value: 'MMM DD, YYYY' }, // Jul 12, 2024
      { label: 'DD MMM YYYY', value: 'DD MMM YYYY' }, // 12 Jul 2024
      { label: 'Week Month Day', value: 'dddd MMM DD' }// Monday July 12
    ];
    const TIME_FORMAT_OPTIONS = [
      { label: 'HH AM/PM', value: 'HH:MM A' }, // 08:30 AM
      { label: 'HH:MM:SS AM/PM', value: 'HH:MM:SS A' }, // 08:30:45 AM
      { label: 'HH (24-hour)', value: 'HH:MM' }, // 14:30
      { label: 'HH:MM:SS (24-hour)', value: 'HH:MM:SS' }, // 14:30:45
      { label: 'HHMM (military)', value: 'HHMM' }, // 1430
      { label: 'HHMMSS (military', value: 'HHMMSS' } // 143045
    ];
    const TIME_DATE_FORMAT_OPTIONS = [
      { label: 'MM-DD-YYYY HH:MM AM/PM', value: 'MM-DD-YYYY HH:MM A' }, // 07-12-2024 08:30
      { label: 'DD-MM-YYYY HH:MM AM/PM', value: 'DD-MM-YYYY HH:MM A' }, // 12-07-2024 08:30
      { label: 'YYYY-MM-DD HH:MM', value: 'YYYY-MM-DD HH:MM' }, // 2024-07-12 14:30:45
      { label: 'YYYY/MM/DD HH', value: 'YYYY/MM/DD HH' }, // 2024/07/12 14:30
      { label: 'MMM DD, YYYY HH:MM AM/PM', value: 'MMM DD, YYYY HH:MM A' }, // Jul 12, 2024 08:30 AM
      { label: 'Week, Month, Day, HH AM/PM', value: 'dddd, MMM, DD, HH A' }, // Monday, June, 12 08:30 AM
      { label: 'Week, Month, Day, HH:MM', value: 'dddd, MMM, DD, HH:MM' } // Monday, June, 12 08:30
    ].map(function(i) {
      return {
        label: i,
        value: i
      };
    });
    const TIMEZONE_OPTIONS = [
      {
        label: 'display in device timezone',
        value: 'device'
      },
      {
        label: 'display data source value',
        value: 'data_source'
      }
    ];

    return Fliplet.Widget.generateInterface({
      title: 'Dynamic Text',
      fields: [
        {
          type: 'html',
          html: `<p style="color: #A5A5A5; font-size: 12px; font-weight: 400;">List from ${dataSource.name}(ID: <span class="data-source-id">${dynamicContainer.dataSourceId}</span>)</p>
                <p style="font-size: 10px; font-weight: 400; color: #E7961E;">To change Data source go to Data Container Settings</p>
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
            hideAllFields();

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
          label: 'Alternative text for link',
          placeholder: 'Specify text here e.g. “Tap to open”'
        },
        {
          name: 'phoneALtText',
          type: 'text',
          label: 'Alternative text for phone number',
          placeholder: 'Specify text here e.g. “Tap to call”'
        },
        {
          name: 'mailALtText',
          type: 'text',
          label: 'Alternative text for email',
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
          name: 'symbol',
          type: 'text',
          label: 'Specify a symbol for units',
          placeholder: '%, $, km',
          description: 'Leave empty if no symbol required'
        },
        {
          type: 'radio',
          name: 'symbolPlacement',
          label: 'Show symbol',
          options: SYMBOL_PLACEMENT_OPTIONS,
          default: 'before units'
        },
        {
          type: 'dropdown',
          name: 'dataVisualization',
          label: 'Select data visualization',
          options: DATA_VISUALIZATION_OPTIONS
        },
        {
          type: 'dropdown',
          name: 'dateFormat',
          label: 'Select dataview type',
          options: DATE_FORMAT_OPTIONS
        },
        {
          type: 'dropdown',
          name: 'timeFormat',
          label: 'Select dataview type',
          options: TIME_FORMAT_OPTIONS
        },
        {
          type: 'radio',
          name: 'timeTimezone',
          label: 'Timezone',
          options: TIMEZONE_OPTIONS,
          default: 'data_source'
        },
        {
          type: 'dropdown',
          name: 'timeDateFormat',
          label: 'Select dataview type',
          options: TIME_DATE_FORMAT_OPTIONS
        },
        {
          type: 'radio',
          name: 'timeDateTimezone',
          label: 'Timezone',
          options: TIMEZONE_OPTIONS,
          default: 'data_source'
        },
        {
          name: 'customRegex',
          type: 'text',
          label: 'Provide regex'
        }
      ]
    });
  });
});
