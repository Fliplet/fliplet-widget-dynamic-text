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

      const COLUMN = DYNAMIC_TEXT.fields.column;
      const VALUE = ENTRY.data[COLUMN];
      const DATA_FORMAT = DYNAMIC_TEXT.fields.dataFormat;

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

      function renderURL() {
        const a = document.createElement('a');

        a.href = VALUE;
        a.textContent = DYNAMIC_TEXT.fields.urlALtText || VALUE;

        // if (settings.inAppBrowser) {
        //   a.setAttribute('target', '_self');
        // } else {
        //   a.setAttribute('target', '_blank');
        // }

        $HELPER.find('.dynamic-text-container').html(a);
      }


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
    }
  }
});
