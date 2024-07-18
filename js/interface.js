Fliplet.Widget.findParents({ filter: { package: 'com.fliplet.dynamic-container' } }).then(async widgets => {
  if (widgets.length === 0) {
    return Fliplet.UI.Toast('This component needs to be placed inside a Dynamic Data Container');
  }

  const dynamicContainer = widgets[0];

  return Fliplet.DataSources.getById(dynamicContainer && dynamicContainer.dataSourceId, {
    attributes: ['name', 'columns']
  }).then(dataSource => {
    // const dataSourceColumns = dataSource.columns.map(el => {
    //   return {
    //     id: el,
    //     label: el
    //   };
    // });

    return Fliplet.Widget.generateInterface({
      title: 'Dynamic Text',
      fields: [
        {
          type: 'html',
          html: `<p style="color: #A5A5A5; font-size: 12px; font-weight: 400;">List from ${dataSource.name}(ID: <span class="data-source-id">${dynamicContainer.dataSourceId}</span>)</p>
                <p style="font-size: 10px; font-weight: 400; color: #E7961E;">To change Data source go to Data Container Settings</p>
                <hr/>`
        }
      ]
    });
  });
});
