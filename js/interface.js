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

Fliplet.Widget.findParents({
  filter: { package: 'com.fliplet.dynamic-container' }
}).then(async(widgets) => {
  if (widgets.length === 0) {
    return Fliplet.UI.Toast(
      'This component needs to be placed inside a Dynamic Data Container'
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
    const NO_DECIMAL_ROUND_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
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
      'MM-DD-YYYY',
      'DD-MM-YYYY',
      'YYYY-MM-DD',
      'Month Day, Year', // July 12, 2024
      'Day Month Year', // 12 July 2024
      'MM/DD/YYYY',
      'DD/MM/YYYY',
      'YYYY/MM/DD',
      'MMM DD, YYYY', // Jul 12, 2024
      'DD MMM YYYY', // 12 Jul 2024
      'Week Month Day' // Monday July 12
    ].map(function(i) {
      return {
        label: i,
        value: i
      };
    });
    const TIME_FORMAT_OPTIONS = [
      'HH AM/PM', // 08:30 AM
      'HH:MM:SS AM/PM', // 08:30:45 AM
      'HH (24-hour)', // 14:30
      'HH:MM:SS (24-hour)', // 14:30:45
      'HHMM (military)', // 1430
      'HHMMSS (military' // 143045
    ].map(function(i) {
      return {
        label: i,
        value: i
      };
    });
    const TIME_DATE_FORMAT_OPTIONS = [
      'MM-DD-YYYY HH AM/PM', // 07-12-2024 08:30 AM
      'DD-MM-YYYY HH AM/PM', // 12-07-2024 08:30 AM
      'YYYY-MM-DD HH:MM', // 2024-07-12 14:30:45
      'YYYY/MM/DD HH', // 2024/07/12 14:30
      'MMM DD, YYYY HH AM/PM', // Jul 12, 2024 08:30 AM
      'Week, Month, Day, HH AM/PM', // Monday, June, 12 08:30 AM
      'Week, Month, Day, HH:MM' // Monday, June, 12 08:30
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
          options: DATA_SOURCE_COLUMNS_OPTIONS
        },
        {
          type: 'dropdown',
          name: 'dataFormat',
          label: 'Select data format',
          options: DATA_FORMATS_OPTIONS,
          change: function(value) {
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
          options: NO_DECIMAL_ROUND_OPTIONS
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
        // todo MISSING timezone
        {
          name: 'customRegex',
          type: 'text',
          label: 'Provide regex'
        }
      ]
    });
  });
});
