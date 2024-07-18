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
      // Initialize children components when this widget is ready
      let dynamicTextContainer = this;

      await Fliplet.Widget.initializeChildren(
        dynamicTextContainer.$el,
        dynamicTextContainer
      );

      if (!Fliplet.DynamicContainer) {
        Fliplet.UI.Toast('Please add Dynamic Container component');

        return Promise.reject('');
      }

      // todo update fields from interface
      dynamicTextContainer.fields = _.assign(
        {
          isFilterOnDifferentScreen: [],
          action: { action: 'screen' },
          allowSearching: [],
          allowSorting: [],
          bookmarksEnabled: [],
          searchingOptionsSelected: [],
          sortingOptionsSelected: []
        },
        dynamicTextContainer.fields
      );
    }
  }
});
