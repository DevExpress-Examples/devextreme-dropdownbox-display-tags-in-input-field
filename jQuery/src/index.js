$(function(){
    var treeView;
    
    var syncTreeViewSelection = function(treeView, value){
        if (!treeView) return;
      
        treeView.unselectAll();
      
        if (value.length > 0) {
            value.forEach(item => {
                treeView.selectItem(item);
            })
        }
    };
    
    var makeAsyncDataSource = function(jsonFile){
        return new DevExpress.data.CustomStore({
            loadMode: "raw",
            key: "ID",
            load: function() {
                return $.getJSON("https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/data/" + jsonFile);
            }
        });
    };

    var dataSource = makeAsyncDataSource("treeProducts.json");
  
    var dropDownBox = $("#treeBox").dxDropDownBox({
        value: ["1_1"],
        valueExpr: "ID",
        displayExpr: "name",
        dataSource: dataSource,
        fieldTemplate: function(value, fieldElement) {
            $("<div>").dxTagBox({
                dataSource: dataSource,
                value: value,
                valueExpr: "ID",
                displayExpr: "name",
                showClearButton: true,
                placeholder: value.length ? "" : "Select a value...",
                openOnFieldClick: false,
                width: "100%",
                onValueChanged: function (e) {
                    dropDownBox.option("value", e.value);
                    syncTreeViewSelection(treeView, e.value)
                },
            }).appendTo(fieldElement);
        },
        contentTemplate: function(e){
            var value = e.component.option("value"),
                $treeView = $("<div>").dxTreeView({
                    dataSource: e.component.getDataSource(),
                    dataStructure: "plain",
                    keyExpr: "ID",
                    parentIdExpr: "categoryId",
                    selectionMode: "multiple",
                    displayExpr: "name",
                    selectByClick: true,
                    onContentReady: function(args){
                        syncTreeViewSelection(args.component, value);
                    },
                    selectNodesRecursive: false,
                    showCheckBoxesMode: "normal",
                    onItemSelectionChanged: function(args){
                        var selectedKeys = args.component.getSelectedNodeKeys();
                        e.component.option("value", selectedKeys);
                    }
                });
            
            treeView = $treeView.dxTreeView("instance");
           
            return $treeView;
        },
    }).dxDropDownBox("instance");
});
