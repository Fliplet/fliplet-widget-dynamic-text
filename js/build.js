// // Register this widget instance
// Fliplet.Widget.instance({
//   name: 'dynamic-text',
//   displayName: 'Dynamic Text',
//   template: '<div class="dynamic-text-container"></div>',
//   data: {
//     dataSourceId: null
//   },
//   render: {
//     async beforeReady() {
//       if (Fliplet.DynamicContainer) {
//         this.dataSourceId = await Fliplet.DynamicContainer.get().then(function(
//           container
//         ) {
//           return container.connection().then(function(connection) {
//             return connection.id;
//           });
//         });
//       }
//     },
//     ready: async function() {
//       const DYNAMIC_TEXT = this;
//       const ENTRY = DYNAMIC_TEXT?.parent?.entry || {};
//       const DYNAMIC_TEXT_INSTANCE_ID = DYNAMIC_TEXT.id;
//       const $HELPER = $(DYNAMIC_TEXT.$el);
//       const MODE_INTERACT = Fliplet.Env.get('interact');

//       DYNAMIC_TEXT.fields = _.assign(
//         {
//           column: '',
//           dataFormat: 'text',
//           urlALtText: '',
//           phoneALtText: '',
//           mailALtText: '',
//           noDecimalRound: '',
//           symbol: '',
//           symbolPlacement: 'before units',
//           dataVisualization: '',
//           dateFormat: '',
//           timeFormat: '',
//           timeDateFormat: '',
//           customRegex: '',
//           timeTimezone: 'data_source',
//           timeDateTimezone: 'data_source'
//         },
//         DYNAMIC_TEXT.fields
//       );

//       const FIELDS = DYNAMIC_TEXT.fields;
//       const COLUMN = FIELDS.column;
//       const VALUE = ENTRY.data[COLUMN];
//       const DATA_FORMAT = FIELDS.dataFormat;
//       const ARRAY_INTERACT_VALUES = ['array item 1', 'array item 2', 'array item 3'];

//       return Fliplet.Widget.findParents({
//         instanceId: DYNAMIC_TEXT_INSTANCE_ID
//       }).then((widgets) => {
//         let dynamicContainer = null;
//         let recordContainer = null;
//         let listRepeater = null;

//         widgets.forEach((widget) => {
//           if (widget.package === 'com.fliplet.dynamic-container') {
//             dynamicContainer = widget;
//           } else if (widget.package === 'com.fliplet.record-container') {
//             recordContainer = widget;
//           } else if (widget.package === 'com.fliplet.list-repeater') {
//             listRepeater = widget;
//           }
//         });

//         if (!dynamicContainer || !dynamicContainer.dataSourceId) {
//           return Fliplet.UI.Toast(
//             'This component needs to be placed inside a Dynamic Container and select a data source'
//           );
//         } else if (!recordContainer && !listRepeater) {
//           return Fliplet.UI.Toast(
//             'This component needs to be placed inside a Record or List Repeater component'
//           );
//         } else if (!COLUMN) {
//           return Fliplet.UI.Toast(
//             'This component needs to be configured, please select a column'
//           );
//         }

//         renderContent();
//       });

//       function renderContent() {
//         switch (DATA_FORMAT) {
//           case 'text':
//             $HELPER.find('.dynamic-text-container').text(MODE_INTERACT ? 'Dynamic Text' : (VALUE || ''));
//             break;
//           case 'html':
//             $HELPER.find('.dynamic-text-container').html(MODE_INTERACT ? 'Dynamic Text' : (VALUE || ''));
//             break;
//           case 'url':
//             renderURL();
//             break;
//           case 'telephone':
//             renderTelephone();
//             break;
//           case 'email':
//             renderEmail();
//             break;
//           case 'numberCurrency':
//             renderNumber();
//             break;
//           case 'array':
//             renderArray();
//             break;
//           case 'date':
//             renderDate();
//             break;
//           case 'time':
//             renderTime();
//             break;
//           case 'dateTime':
//             renderDateTime();
//             break;
//           case 'custom':
//             renderCustom();
//             break;
//           default:
//             break;
//         }
//       }

//       function renderURL() {
//         const LINK = document.createElement('a');

//         LINK.href = MODE_INTERACT ? '#' : VALUE;
//         LINK.textContent = FIELDS.urlALtText || 'Tap to open';

//         // TODO missing form figma
//         // if (settings.inAppBrowser) {
//         //   LINK.setAttribute('target', '_self');
//         // } else {
//         //   LINK.setAttribute('target', '_blank');
//         // }

//         $HELPER.find('.dynamic-text-container').html(LINK);
//       }

//       function renderTelephone() {
//         const LINK = document.createElement('a');

//         LINK.href = `tel:${MODE_INTERACT ? '123-123-123' : VALUE}`;
//         LINK.textContent = FIELDS.phoneALtText || 'Tap to call';

//         $HELPER.find('.dynamic-text-container').html(LINK);
//       }

//       function createList() {
//         const list = document.createElement(FIELDS.dataVisualization === 'Numbered List' ? 'ol' : 'ul');

//         list.style.paddingLeft = '20px';

//         if (FIELDS.dataVisualization === 'Alphabetic List') {
//           list.style.listStyle = 'lower-alpha';
//         } else if (FIELDS.dataVisualization === 'Bullet Point List') {
//           list.style.listStyle = 'disc';
//         }

//         (MODE_INTERACT ? ARRAY_INTERACT_VALUES : (VALUE || [])).forEach(item => {
//           const li = document.createElement('li');

//           li.textContent = item;
//           list.appendChild(li);
//         });

//         $HELPER.find('.dynamic-text-container').html(list);
//       }

//       function renderEmail() {
//         const LINK = document.createElement('a');

//         LINK.href = `mailto:${MODE_INTERACT ? 'john@doe.com' : VALUE}`;
//         LINK.textContent = FIELDS.mailALtText || 'Tap to email';

//         $HELPER.find('.dynamic-text-container').html(LINK);
//       }

//       function renderArray() {
//         let formattedData;

//         if (!MODE_INTERACT && !Array.isArray(VALUE)) {
//           return; // not an array do not render anything
//         }

//         switch (FIELDS.dataVisualization) {
//           case 'Numbered List':
//           case 'Bullet Point List':
//           case 'Alphabetic List':
//             createList();
//             break;
//           case 'Comma-separated list':
//             formattedData = (MODE_INTERACT ? ARRAY_INTERACT_VALUES : (VALUE || [])).join(', ');
//             break;
//           case 'Semicolon-Separated List':
//             formattedData = (MODE_INTERACT ? ARRAY_INTERACT_VALUES : (VALUE || [])).join('; ');
//             break;
//           default:
//             formattedData = (MODE_INTERACT ? ARRAY_INTERACT_VALUES : (VALUE || [])).join(', ');
//             break;
//         }

//         $HELPER.find('.dynamic-text-container').html(formattedData);
//       }

//       function renderCustom() {
//         const regex = new RegExp(FIELDS.customRegex);

//         $HELPER
//           .find('.dynamic-text-container')
//           .html(VALUE.match(regex) ? (MODE_INTERACT ? 'Dynamic Text' : VALUE).match(regex)[0] : 'No match');
//       }

//       function renderNumber() {
//         let toReturnValue = '';

//         if (isNaN(MODE_INTERACT ? 555 : VALUE)) {
//           toReturnValue = 'N/A';
//         } else if (FIELDS.noDecimalRound === 0) {
//           toReturnValue = parseInt(MODE_INTERACT ? 555 : VALUE, 10);
//         } else {
//           toReturnValue = Number(MODE_INTERACT ? 555 : VALUE).toFixed(FIELDS.noDecimalRound);
//         }

//         if (FIELDS.symbolPlacement === 'before units') {
//           $HELPER
//             .find('.dynamic-text-container')
//             .html(`${FIELDS.symbol}${toReturnValue}`);
//         } else {
//           $HELPER
//             .find('.dynamic-text-container')
//             .html(`${toReturnValue}${FIELDS.symbol}`);
//         }
//       }

//       // Function to convert UTC date to local time
//       function convertUTCToLocal(utcDateStr) {
//         // Parse the UTC date string to create a Date object
//         const utcDate = new Date(utcDateStr);

//         // Get the local time equivalent of the UTC date
//         const localDate = new Date(
//           utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
//         );

//         return localDate;
//       }

//       function isValidDate(dateStr) {
//         // Create a new Date object with the given date string
//         const date = new Date(dateStr);

//         // Check if the date is valid by ensuring it's not "Invalid Date"
//         return !isNaN(date.getTime());
//       }

//       function renderTime() {
//         const INTERACT_VALUE = '2024-07-18T13:42:12.777Z';

//         if (!isValidDate(MODE_INTERACT ? INTERACT_VALUE : VALUE)) {
//           $HELPER.find('.dynamic-text-container').html('invalid date');

//           return;
//         }

//         const time = moment(MODE_INTERACT ? INTERACT_VALUE : VALUE);
//         const format = FIELDS.timeFormat || 'HH:MM A';
//         const timezone = FIELDS.timeTimezone === 'data_source' ? 'UTC' : '';

//         if (timezone) {
//           $HELPER
//             .find('.dynamic-text-container')
//             .html(moment(convertUTCToLocal(MODE_INTERACT ? INTERACT_VALUE : VALUE)).format(format));
//         } else {
//           $HELPER.find('.dynamic-text-container').html(time.format(format));
//         }
//       }

//       function renderDate() {
//         const INTERACT_VALUE = '2024-07-18T13:42:12.777Z';

//         if (!isValidDate(MODE_INTERACT ? INTERACT_VALUE : VALUE)) {
//           $HELPER.find('.dynamic-text-container').html('invalid date');

//           return;
//         }

//         const date = moment(MODE_INTERACT ? INTERACT_VALUE : VALUE);
//         const format = FIELDS.dateFormat || 'MM-DD-YYYY';

//         $HELPER.find('.dynamic-text-container').html(date.format(format));
//       }

//       function renderDateTime() {
//         const INTERACT_VALUE = '2024-07-18T13:42:12.777Z';

//         if (!isValidDate(MODE_INTERACT ? INTERACT_VALUE : VALUE)) {
//           $HELPER.find('.dynamic-text-container').html('invalid date');

//           return;
//         }

//         const date = moment(MODE_INTERACT ? INTERACT_VALUE : VALUE);
//         const format = FIELDS.timeDateFormat || 'HH:MM A';
//         const timezone = FIELDS.timeDateTimezone === 'data_source' ? 'UTC' : '';

//         if (timezone) {
//           $HELPER
//             .find('.dynamic-text-container')
//             .html(moment(convertUTCToLocal(MODE_INTERACT ? INTERACT_VALUE : VALUE)).format(format));
//         } else {
//           $HELPER.find('.dynamic-text-container').html(date.format(format));
//         }
//       }
//     }
//   }
// });
