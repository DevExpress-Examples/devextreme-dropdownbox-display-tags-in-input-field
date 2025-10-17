$(() => {
  let treeView;
  let popup;

  const syncTreeViewSelection = (treeViewInstance, value) => {
    if (!treeViewInstance) return;

    treeViewInstance.unselectAll();

    if (value.length > 0) {
      value.forEach((item) => {
        treeViewInstance.selectItem(item);
      });
    }
  };

  const makeAsyncDataSource = (jsonFile) => new DevExpress.data.CustomStore({
    loadMode: 'raw',
    key: 'ID',
    load() {
      return $.getJSON(
        `https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/data/${jsonFile}`,
      );
    },
  });

  const dataSource = makeAsyncDataSource('treeProducts.json');

  const dropDownBox = $('#treeBox')
    .dxDropDownBox({
      value: ['1_1'],
      valueExpr: 'ID',
      displayExpr: 'name',
      dataSource,
      dropDownOptions: {
        onInitialized(e) {
          popup = e.component;
        },
      },
      fieldTemplate(value, fieldElement) {
        $('<div>')
          .dxTextBox({
            visible: false,
          })
          .appendTo(fieldElement);
        $('<div>')
          .dxTagBox({
            dataSource,
            value,
            valueExpr: 'ID',
            displayExpr: 'name',
            showClearButton: true,
            placeholder: value.length ? '' : 'Select a value...',
            openOnFieldClick: false,
            width: '100%',
            onValueChanged(e) {
              dropDownBox.option('value', e.value);
              syncTreeViewSelection(treeView, e.value);
              popup.repaint();
            },
          })
          .appendTo(fieldElement);
      },
      contentTemplate(e) {
        const $treeView = $('<div>').dxTreeView({
          dataSource: e.component.getDataSource(),
          dataStructure: 'plain',
          keyExpr: 'ID',
          parentIdExpr: 'categoryId',
          selectionMode: 'multiple',
          displayExpr: 'name',
          selectByClick: true,
          onContentReady(args) {
            const value = e.component.option('value');
            syncTreeViewSelection(args.component, value);
          },
          selectNodesRecursive: false,
          showCheckBoxesMode: 'normal',
          onItemSelectionChanged(args) {
            const selectedKeys = args.component.getSelectedNodeKeys();
            e.component.option('value', selectedKeys);
            popup.repaint();
          },
        });

        treeView = $treeView.dxTreeView('instance');

        return $treeView;
      },
    })
    .dxDropDownBox('instance');
});
