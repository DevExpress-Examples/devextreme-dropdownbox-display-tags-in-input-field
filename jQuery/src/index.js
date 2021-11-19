$(function(){
    var treeView;
    
    const syncTreeViewSelection = function(treeView, value){
        if (!treeView) return;
      
        treeView.unselectAll();
      
        if (value.length > 0) {
            value.forEach(item => {
                treeView.selectItem(item);
            })
        }
    };
    
    const makeAsyncDataSource = function(jsonFile){
        return new DevExpress.data.CustomStore({
            loadMode: "raw",
            key: "ID",
            load: function() {
                return $.getJSON("https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/data/" + jsonFile);
            }
        });
    };

    const dataSource = makeAsyncDataSource("treeProducts.json");
  
    const dropDownBox = $("#treeBox").dxDropDownBox({
        value: ["1_1"],
        valueExpr: "ID",
        displayExpr: "name",
        dataSource: dataSource,
        fieldTemplate: function(value, fieldElement) {
            $("<div>").dxTagBox({
                dataSource: dataSource,
                valueExpr: "ID",
                displayExpr: "name",
                value: value,
                onValueChanged: function (e) {
                    dropDownBox.option("value", e.value);
                    syncTreeViewSelection(treeView, e.value)
                },
                showClearButton: true,
                placeholder: value.length ? "" : "Select a value...",
                openOnFieldClick: false,
                width: "100%"
            }).appendTo(fieldElement);
        },
        contentTemplate: function(e){
            const $treeView = $("<div>").dxTreeView({
                dataSource: dataSource,
                dataStructure: "plain",
                keyExpr: "ID",
                parentIdExpr: "categoryId",
                selectionMode: "multiple",
                displayExpr: "name",
                selectByClick: true,
                onContentReady: function(args){
                    const value = e.component.option("value")
                    syncTreeViewSelection(args.component, value);
                },
                selectNodesRecursive: false,
                showCheckBoxesMode: "normal",
                onItemSelectionChanged: function(args){
                    const selectedKeys = args.component.getSelectedNodeKeys();
                    e.component.option("value", selectedKeys);
                }
            });
            
            treeView = $treeView.dxTreeView("instance");
           
            return $treeView;
        },
    }).dxDropDownBox("instance");
});
