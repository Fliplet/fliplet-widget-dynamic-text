// Register this widget instance
Fliplet.Widget.instance({
  name: 'dynamic-text',
  displayName: 'Dynamic Text',
  template: '<div class="dynamic-text-container"></div>',
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

      if (MODE_INTERACT) {
        $HELPER.find('.dynamic-text-container').html('Dynamic Text');

        return;
      }

      DYNAMIC_TEXT.fields = _.assign(
        {
          column: '',
          dataFormat: 'text',
          urlALtText: '',
          phoneALtText: '',
          mailALtText: '',
          noDecimalRound: '',
          symbol: '',
          symbolPlacement: 'before units',
          dataVisualization: '',
          dateFormat: '',
          timeFormat: '',
          timeDateFormat: '',
          customRegex: '',
          timeTimezone: 'data_source',
          timeDateTimezone: 'data_source'
        },
        DYNAMIC_TEXT.fields
      );

      const FIELDS = DYNAMIC_TEXT.fields;
      const COLUMN = FIELDS.column;
      const VALUE = ENTRY.data[COLUMN];
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

        if (
          !dynamicContainer
          || !dynamicContainer.dataSourceId
        ) {
          return Fliplet.UI.Toast('This component needs to be placed inside a Dynamic Container and select a data source');
        } else if (!recordContainer && !listRepeater) {
          return Fliplet.UI.Toast('This component needs to be placed inside a Record or List Repeater component');
        } else if (!COLUMN) {
          return Fliplet.UI.Toast('This component needs to be configured, please select a column');
        }

        renderContent();
      });

      function renderContent() {
        switch (DATA_FORMAT) {
          case 'text':
            $HELPER.find('.dynamic-text-container').text(VALUE || '');
            break;
          case 'html':
            $HELPER.find('.dynamic-text-container').html(VALUE || '');
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
            Fliplet.Helper.field('timeDateFormat').toggle(true);
            Fliplet.Helper.field('timeDateTimezone').toggle(true);
            break;
          case 'custom':
            renderCustom();
            break;
          default:
            break;
        }
      }

      function renderURL() {
        const LINK = document.createElement('a');

        LINK.href = VALUE;
        LINK.textContent = FIELDS.urlALtText || 'Tap to open';

        // TODO missing form figma
        // if (settings.inAppBrowser) {
        //   LINK.setAttribute('target', '_self');
        // } else {
        //   LINK.setAttribute('target', '_blank');
        // }

        $HELPER.find('.dynamic-text-container').html(LINK);
      }

      function renderTelephone() {
        const LINK = document.createElement('a');

        LINK.href = `tel:${VALUE}`;
        LINK.textContent =  FIELDS.phoneALtText || 'Tap to call';

        $HELPER.find('.dynamic-text-container').html(LINK);
      }

      function renderEmail() {
        const LINK = document.createElement('a');

        LINK.href = `mailto:${VALUE}`;
        LINK.textContent =  FIELDS.mailALtText || 'Tap to email';

        $HELPER.find('.dynamic-text-container').html(LINK);
      }

      function getAlphabeticLabel(index) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let label = '';

        while (index >= 0) {
          label = letters[index % 26] + label;
          index = Math.floor(index / 26) - 1;
        }

        return label;
      }

      function renderArray() {
        let formattedData;

        switch (FIELDS.dataVisualization) {
          case 'Numbered List':
            formattedData = (VALUE || []).map((item, index) => `${index + 1}. ${item}`).join(' \n');
            break;
          case 'Bullet Point List':
            formattedData = (VALUE || []).map(item => `• ${item}`).join(' \n');
            break;
          case 'Comma-separated list':
            formattedData = (VALUE || []).join(', ');
            break;
          case 'Semicolon-Separated List':
            formattedData = (VALUE || []).join('; ');
            break;
          case 'Alphabetic List':
            formattedData = (VALUE || []).map((item, index) => {
              const letter = getAlphabeticLabel(index);

              return `${letter}. ${item}`;
            }).join('\n');
            break;
          default:
            formattedData = (VALUE || []).join(', ');
            break;
        }

        $HELPER.find('.dynamic-text-container').html(formattedData);
      }

      function renderCustom() {
        const regex = new RegExp(FIELDS.customRegex);

        $HELPER.find('.dynamic-text-container').html(VALUE.match(regex) ? VALUE.match(regex)[0] : 'No match');
      }

      function renderNumber() {
        let toReturnValue = '';

        if (isNaN(VALUE)) {
          toReturnValue = 'N/A';
        } else if (FIELDS.noDecimalRound === 0) {
          toReturnValue = parseInt(VALUE, 10);
        } else {
          toReturnValue = Number(VALUE).toFixed(FIELDS.noDecimalRound);
        }

        if (FIELDS.symbolPlacement === 'before units') {
          $HELPER.find('.dynamic-text-container').html(`${FIELDS.symbol}${toReturnValue}`);
        } else {
          $HELPER.find('.dynamic-text-container').html(`${toReturnValue}${FIELDS.symbol}`);
        }
      }

      // Function to convert UTC date to local time
      function convertUTCToLocal(utcDateStr) {
        // Parse the UTC date string to create a Date object
        const utcDate = new Date(utcDateStr);

        // Get the local time equivalent of the UTC date
        const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);

        return localDate;
      }

      function isValidDate(dateStr) {
        // Create a new Date object with the given date string
        const date = new Date(dateStr);

        // Check if the date is valid by ensuring it's not "Invalid Date"
        return !isNaN(date.getTime());
      }

      function renderTime() {
        if (!isValidDate(VALUE)) {
          $HELPER.find('.dynamic-text-container').html('invalid date');

          return;
        }

        const time = moment(VALUE);
        const format = FIELDS.timeFormat || 'HH:MM A';
        const timezone = FIELDS.timeTimezone === 'data_source' ? 'UTC' : '';

        if (timezone) {
          $HELPER.find('.dynamic-text-container').html(moment(convertUTCToLocal(VALUE)).format(format));
        } else {
          $HELPER.find('.dynamic-text-container').html(time.format(format));
        }
      }

      function renderDate() {
        if (!isValidDate(VALUE)) {
          $HELPER.find('.dynamic-text-container').html('invalid date');

          return;
        }

        const date = moment(VALUE);
        const format = FIELDS.dateFormat || 'MM-DD-YYYY';

        $HELPER.find('.dynamic-text-container').html(date.format(format));
      }
    }
  }
});
