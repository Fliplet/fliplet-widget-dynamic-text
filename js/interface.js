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
  );
});
