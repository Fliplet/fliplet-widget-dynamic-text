// Register this widget instance
Fliplet.Widget.instance({
  name: 'dynamic-text',
  displayName: 'Data Text',
  template:
    '<div class="dynamic-text-container"></div>',
  render: {
    ready: async function () {
      const DYNAMIC_TEXT = this;


      const parents = await Fliplet.Widget.findParents({
        instanceId: this.data.id,
      });

      /**
       * Finds and returns the parent widget and its entry data for a specified widget type
       * @param {('RecordContainer'|'ListRepeater'|'DynamicContainer')} type - The type of parent widget to search for
       * @returns {Promise<[Object|null, Object|null]>} A tuple containing:
       *   - The parent widget configuration if found, null otherwise
       *   - The parent widget instance if found, null otherwise
       * @async
       * @private
       */
      const findParentDataWidget = async (type, packageName) => {
        const parent = parents.find((parent) => parent.package === packageName);

        if (!parent) {
          return [null, null];
        }

        const instance = await Fliplet[type].get({ id: parent.id });
        return [parent, instance];
      }

      const [[ dynamicContainer ], [ recordContainer, recordContainerInstance ], [ listRepeater, listRepeaterInstance ]] = await Promise.all([
        findParentDataWidget('DynamicContainer', 'com.fliplet.dynamic-container'),
        findParentDataWidget('RecordContainer', 'com.fliplet.record-container'),
        findParentDataWidget('ListRepeater', 'com.fliplet.list-repeater')
      ]);

      const ENTRY = recordContainerInstance?.entry || listRepeaterInstance?.entry;

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
    
      if (!dynamicContainer || !dynamicContainer.dataSourceId) {
        $HELPER.find('.dynamic-text-container').html(`
          <div class="not-configured">
            <p>Configure Data Text</p>
          </div>`);

        return errorMessageStructureNotValid($(DYNAMIC_TEXT.$el), 'This component needs to be placed inside a Data container and select a data source');
      } else if (!recordContainer && !listRepeater) {
        $HELPER.find('.dynamic-text-container').html(`
          <div class="not-configured">
            <p>Configure Data Text</p>
          </div>`);

        return errorMessageStructureNotValid($(DYNAMIC_TEXT.$el), 'This component needs to be placed inside a Record or Data list component');
      } else if (!COLUMN) {
        $HELPER.find('.dynamic-text-container').html(`
          <div class="not-configured">
            <p>Configure Data Text</p>
          </div>`);

        return Fliplet.UI.Toast(
          'This component needs to be configured, please select a column'
        );
      }

      if (MODE_INTERACT) {
        $HELPER.find('.dynamic-text-container').html(`${COLUMN}`);

        return;
      }

      renderContent();

      function errorMessageStructureNotValid($element, message) {
        // todo remove this function after product solution
        $element.addClass('component-error-before-todo');
        Fliplet.UI.Toast(message);
      }

      function isValidRegex(pattern) {
        try {
          new RegExp(pattern);

          return true;
        } catch (e) {
          return false;
        }
      }

      function renderContent() {
        return {
          text: () => $HELPER.find('.dynamic-text-container').text(VALUE),
          html: () => $HELPER.find('.dynamic-text-container').html(VALUE),
          url: renderURL,
          telephone: renderTelephone,
          email: renderEmail,
          numberCurrency: renderNumber,
          array: renderArray,
          date: renderDate,
          time: renderTime,
          dateTime: renderDateTime,
          custom: renderCustom
        }[DATA_FORMAT]?.();
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

        list.style.paddingLeft = '0';
        list.style.marginLeft = '20px';
        list.style.display = 'block';

        if (FIELDS.dataVisualization === 'Alphabetic List') {
          list.style.listStyle = 'lower-alpha';
        } else if (FIELDS.dataVisualization === 'Bullet Point List') {
          list.style.listStyle = 'disc';
        }

        VALUE.forEach((item) => {
          const li = document.createElement('li');
          li.style.display = 'list-item';

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
        if (!VALUE || !FIELDS.customRegex || !isValidRegex(VALUE)) {
          return;
        }

        let parts = FIELDS.customRegex.split('/');
        let pattern = parts[1];
        let flags = parts[2];
        let regex = new RegExp(pattern, flags);
        let result = regex.test(VALUE);

        if (!flags && !pattern) {
          return;
        }

        if (result && Array.isArray(VALUE)) {
          VALUE = VALUE.join(', ');
        }

        if (result) {
          $HELPER
            .find('.dynamic-text-container')
            .html(`${VALUE}`);
        }
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
          .html(`${FIELDS.symbolBefore}${toReturnValue}${FIELDS.symbolAfter}`
          );
      }

      function isValidDate(dateStr) {
        // Create a new Date object with the given date string
        const date = new Date(dateStr);

        // Check if the date is valid by ensuring it's not "Invalid Date"
        return !isNaN(date.getTime());
      }

      function isTimeWithoutDate(timeString) {
        // Regular expressions for HH:MM and HH:MM:SS formats
        const regexHHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;
        const regexHHMMSS = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

        return regexHHMM.test(timeString) || regexHHMMSS.test(timeString);
      }

      function renderTime() {
        const format = FIELDS.timeFormat || 'LTS';

        if (!VALUE) {
          return;
        } else if (isTimeWithoutDate(VALUE)) {
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

        $HELPER.find('.dynamic-text-container').html(`${Fliplet.Locale.date(VALUE, {
          format: format,
          locale: navigator.language
        })}`
        );
      }

      function renderDate() {
        if (!isValidDate(VALUE)) {
          return;
        }

        const date = moment(VALUE).format('YYYY-MM-DD');
        const format = FIELDS.dateFormat || 'L';

        $HELPER.find('.dynamic-text-container').html(`${Fliplet.Locale.date(date, {
          format: format,
          locale: navigator.language
        })}`);
      }

      function renderDateTime() {
        if (!VALUE || !isValidDate(VALUE)) {
          return;
        }

        let date = moment(VALUE).format('YYYY-MM-DD HH:mm:ss');

        const format = FIELDS.timeDateFormat || 'L LTS';
        const timezone = FIELDS.timeDateTimezone;
        const isCustomTimezone = FIELDS.timeDateTimezoneCheckbox.includes(true);

        if (isCustomTimezone) {
          const utcMoment = moment(date); // moment.utc(date);
          const localMoment = utcMoment.tz(timezone);

          $HELPER
            .find('.dynamic-text-container')
            .html(`${Fliplet.Locale.date(localMoment, {
              format: format,
              locale: navigator.language
            })}`
            );
        } else {
          let date = moment.utc(VALUE).format('YYYY-MM-DD HH:mm:ss');

          $HELPER.find('.dynamic-text-container').html(`${Fliplet.Locale.date(date, {
            format: format,
            locale: navigator.language
          })}`
          );
        }
      }
    }
  }
});
