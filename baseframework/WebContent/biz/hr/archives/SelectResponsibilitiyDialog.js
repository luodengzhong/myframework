var treeManager, gridManager;
$(function () {
	initializeUI();
	initializeGrid();
});
function initializeUI(){
	Public.ajax(web_app.name + '/treeViewAction!root.ajax', {treeViewMappingName:'responsibilitiy'}, function(data){
		treeManager=UICtrl.tree('#responsibilitiyTree',{
			data:data['Rows'],
			textFieldName: 'name',
			parentIDFieldName: 'parentId',
			isExpand:true,
			nodeWidth:'200',
			delay:2,
			onclick: function(node){
				var data=node.data;
				var type=data['nodeType'];
				if(type==1){//==1 选择的是分类
					addData(data);
				}
			}
		});
	});
}
function initializeGrid(){
	  gridManager = UICtrl.grid("#responsibilitiyGrid", {
            columns: [
                { display: "职能分类", name: "fullName", width: 180, minWidth: 60, type: "string", align: "left"}
            ],
            url: web_app.name + '/hrArchivesAction!queryArchivesResponsibilitiy.ajax',
            parms: { archivesId: $('#archivesId').val() },
            height: "100%",
            heightDiff: -30,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: true,
            usePager: false,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onDblClickRow: function (data, rowindex, rowobj) {
               gridManager.deleteRow(data);
            }
        });
}
function addData(data) {
	if(!data){
		 var node = treeManager.getSelected();
         if (!node) return;
         data=node.data; 
	}
	var id=data.id,flag=true;
	var rows=gridManager.getData();
	//判断选择的分类是否已存在
	$.each(rows,function(i,o){
		if(o['responsibilitiyId']==id){
			flag=false;
			return false;
		}
	});
	if(!flag) return;
	UICtrl.addGridRow(gridManager,{responsibilitiyId:id,fullName:data.fullName});
}

function deleteData(data){
	var rows = gridManager.getSelectedRows();
	$.each(rows,function(i,o){
		gridManager.deleteRow(o);
	});
}

function saveData(fn){
	var _self=this;
	var archivesId=$('#archivesId').val();
	var rows=gridManager.getData(),ids=[];
	$.each(rows,function(i,o){
		ids.push(o['responsibilitiyId']);
	});
	Public.ajax(web_app.name + '/hrArchivesAction!saveArchivesResponsibilitiy.ajax', {archivesId:archivesId,ids:$.toJSON(ids)}, function(data){
		if($.isFunction(fn)){
			fn.call(window,rows);
		}
		_self.close();
	});
}