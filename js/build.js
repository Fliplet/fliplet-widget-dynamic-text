// Register this widget instance
Fliplet.Widget.instance({
  name: 'dynamic-text',
  displayName: 'Dynamic Text',
  template:
    '<div data-view="dynamicText" class="dynamic-text-container"></div>',
  data: {
    dataSourceId: null
  },
  render: {
    async beforeReady() {
      if (Fliplet.DynamicContainer) {
        this.dataSourceId = await Fliplet.DynamicContainer.get().then(function(
          container
        ) {
          return container.connection().then(function(connection) {
            return connection.id;
          });
        });
      }
    },
    ready: async function() {
      const DYNAMIC_TEXT = this;
      const ENTRY = DYNAMIC_TEXT?.parent?.entry || {};
      const DYNAMIC_TEXT_INSTANCE_ID = DYNAMIC_TEXT.id;
      const $HELPER = $(DYNAMIC_TEXT.$el);
      const MODE_INTERACT = Fliplet.Env.get('interact');

      DYNAMIC_TEXT.fields = _.assign(
        {
          column: '',
          dataFormat: 'text',
          urlALtText: '',
          phoneALtText: '',
          mailALtText: '',
          noDecimalRound: '',
          symbolBefore: '',
          symbolAfter: '',
          dataVisualization: '',
          dateFormat: '',
          timeFormat: '',
          timeDateFormat: '',
          customRegex: '',
          timeDateTimezone: 'Europe/London',
          timeDateTimezoneCheckbox: []
        },
        DYNAMIC_TEXT.fields
      );

      const FIELDS = DYNAMIC_TEXT.fields;
      const COLUMN = FIELDS.column;
      let VALUE = MODE_INTERACT ? COLUMN : ENTRY.data[COLUMN];
      const DATA_FORMAT = FIELDS.dataFormat;

      return Fliplet.Widget.findParents({
        instanceId: DYNAMIC_TEXT_INSTANCE_ID
      }).then((widgets) => {
        let dynamicContainer = null;
        let recordContainer = null;
        let listRepeater = null;

        widgets.forEach((widget) => {
          if (widget.package === 'com.fliplet.dynamic-container') {
            dynamicContainer = widget;
          } else if (widget.package === 'com.fliplet.record-container') {
            recordContainer = widget;
          } else if (widget.package === 'com.fliplet.list-repeater') {
            listRepeater = widget;
          }
        });

        if (!dynamicContainer || !dynamicContainer.dataSourceId) {
          return Fliplet.UI.Toast(
            'This component needs to be placed inside a Dynamic Container and select a data source'
          );
        } else if (!recordContainer && !listRepeater) {
          return Fliplet.UI.Toast(
            'This component needs to be placed inside a Record or List Repeater component'
          );
        } else if (!COLUMN) {
          $HELPER.find('.dynamic-text-container').html(`
            <div class="not-configured">
              <p>Configure Dynamic Text</p>
            </div>`);

          return Fliplet.UI.Toast(
            'This component needs to be configured, please select a column'
          );
        }

        if (MODE_INTERACT) {
          $HELPER.find('.dynamic-text-container').html(COLUMN);

          return;
        }

        renderContent();
      });

      function renderContent() {
        switch (DATA_FORMAT) {
          case 'text':
            $HELPER.find('.dynamic-text-container').text(VALUE);
            break;
          case 'html':
            $HELPER.find('.dynamic-text-container').html(VALUE);
            break;
          case 'url':
            renderURL();
            break;
          case 'telephone':
            renderTelephone();
            break;
          case 'email':
            renderEmail();
            break;
          case 'numberCurrency':
            renderNumber();
            break;
          case 'array':
            renderArray();
            break;
          case 'date':
            renderDate();
            break;
          case 'time':
            renderTime();
            break;
          case 'dateTime':
            renderDateTime();
            break;
          case 'custom':
            renderCustom();
            break;
          default:
            break;
        }
      }

      function renderURL() {
        if (VALUE) {
          const LINK = document.createElement('a');

          LINK.href = VALUE;
          LINK.textContent = FIELDS.urlALtText || VALUE; // 'Tap to open';

          // TODO missing form figma
          // if (settings.inAppBrowser) {
          //   LINK.setAttribute('target', '_self');
          // } else {
          //   LINK.setAttribute('target', '_blank');
          // }

          $HELPER.find('.dynamic-text-container').html(LINK);
        }
      }

      function renderTelephone() {
        if (VALUE) {
          const LINK = document.createElement('a');

          LINK.href = `tel:${VALUE}`;
          LINK.textContent = FIELDS.phoneALtText || VALUE;

          $HELPER.find('.dynamic-text-container').html(LINK);
        }
      }

      function createList() {
        const list = document.createElement(
          FIELDS.dataVisualization === 'Numbered List' ? 'ol' : 'ul'
        );

        list.style.paddingLeft = '20px';

        if (FIELDS.dataVisualization === 'Alphabetic List') {
          list.style.listStyle = 'lower-alpha';
        } else if (FIELDS.dataVisualization === 'Bullet Point List') {
          list.style.listStyle = 'disc';
        }

        VALUE.forEach((item) => {
          const li = document.createElement('li');

          li.textContent = item;
          list.appendChild(li);
        });

        $HELPER.find('.dynamic-text-container').html(list);
      }

      function renderEmail() {
        if (VALUE) {
          const LINK = document.createElement('a');

          LINK.href = `mailto:${VALUE}`;
          LINK.textContent = FIELDS.mailALtText || VALUE;

          $HELPER.find('.dynamic-text-container').html(LINK);
        }
      }

      function renderArray() {
        let formattedData;

        if (!VALUE) {
          VALUE = [];
        }

        if (!Array.isArray(VALUE)) {
          VALUE = VALUE.split(',').map((item) => item.trim());
        }

        switch (FIELDS.dataVisualization) {
          case 'Numbered List':
          case 'Bullet Point List':
          case 'Alphabetic List':
            createList();
            break;
          case 'Comma-separated list':
            formattedData = VALUE.join(', ');
            break;
          case 'Semicolon-Separated List':
            formattedData = VALUE.join('; ');
            break;
          default:
            formattedData = VALUE.join(', ');
            break;
        }

        $HELPER.find('.dynamic-text-container').html(formattedData);
      }

      function renderCustom() {
        let parts = FIELDS.customRegex.split('/');
        let pattern = parts[1];
        let flags = parts[2];
        let regex = new RegExp(pattern, flags);
        let result = regex.test(VALUE);

        if (result && Array.isArray(VALUE)) {
          VALUE = VALUE.join(', ');
        }

        $HELPER.find('.dynamic-text-container').html(result ? VALUE : '');
      }

      function renderNumber() {
        let toReturnValue = '';
        let fractionDigits = 0;

        if (isNaN(VALUE)) {
          // toReturnValue = 'N/A';
          return;
        } else if (FIELDS.noDecimalRound === 0) {
          fractionDigits = 0;
          toReturnValue = Math.round(Number(VALUE, 10));
        } else if (FIELDS.noDecimalRound === '') {
          fractionDigits = 20;
          toReturnValue = Number(VALUE);
        } else {
          fractionDigits = FIELDS.noDecimalRound;
          toReturnValue = Number(VALUE).toFixed(FIELDS.noDecimalRound);
        }

        toReturnValue = new Intl.NumberFormat(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: fractionDigits
        }).format(toReturnValue);

        $HELPER
          .find('.dynamic-text-container')
          .html(`${FIELDS.symbolBefore}${toReturnValue}${FIELDS.symbolAfter}`);
      }

      function isValidDate(dateStr) {
        // Create a new Date object with the given date string
        const date = new Date(dateStr);

        // Check if the date is valid by ensuring it's not "Invalid Date"
        return !isNaN(date.getTime());
      }

      function isValidTime(timeString) {
        // Regular expressions for HH:MM and HH:MM:SS formats
        const regexHHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;
        const regexHHMMSS = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

        return regexHHMM.test(timeString) || regexHHMMSS.test(timeString);
      }

      function renderTime() {
        const format = FIELDS.timeFormat || 'LTS';

        if (isValidTime(VALUE)) {
          let now = moment();

          now.set({
            hour: VALUE.split(':')[0],
            minute: VALUE.split(':')[1],
            second: VALUE.split(':')[2] || '00'
          });
          VALUE = now.format('YYYY-MM-DD HH:mm:ss');
        } else {
          VALUE = moment(VALUE); // .format('HH:mm:ss');
        }


        $HELPER.find('.dynamic-text-container').html(
          Fliplet.Locale.date(VALUE, {
            format: format,
            locale: navigator.language
          })
        );
      }

      function renderDate() {
        if (!isValidDate(VALUE)) {
          return;
        }

        const date = moment(VALUE).format('YYYY-MM-DD');
        const format = FIELDS.dateFormat || 'L';

        $HELPER.find('.dynamic-text-container').html(
          Fliplet.Locale.date(date, {
            format: format,
            locale: navigator.language
          })
        );
      }

      function renderDateTime() {
        if (!isValidDate(VALUE)) {
          return;
        }

        const date = moment(VALUE).format('YYYY-MM-DD HH:mm:ss');
        const format = FIELDS.timeDateFormat || 'L LTS';
        const timezone = FIELDS.timeDateTimezone;
        const isCustomTimezone = FIELDS.timeDateTimezoneCheckbox.includes(true);

        if (isCustomTimezone) {
          const utcMoment = moment(date); // moment.utc(date);
          const localMoment = utcMoment.tz(timezone);

          $HELPER
            .find('.dynamic-text-container')
            .html(Fliplet.Locale.date(localMoment, { format: format }));
        } else {
          $HELPER.find('.dynamic-text-container').html(
            Fliplet.Locale.date(date, {
              format: format,
              locale: navigator.language
            })
          );
        }
      }
    }
  }
});
