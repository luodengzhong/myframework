var gridManager = null,functionFieldGroupId='';
$(document).ready(function() {
	functionFieldGroupId = Public.getQueryStringByName("functionFieldGroupId");
	initializeGrid();
});
//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "字段编码", name: "fieldCode", width: 150, minWidth: 60, type: "string", align: "left"},		   	
			{ display: "字段名称", name: "fieldName", width: 150, minWidth: 60, type: "string", align: "left"},		   	   
			{ display: "字段类别", name: "fieldTypeTextView", width: 80, minWidth: 60, type: "string", align: "left"},		   
			{ display: "权限", name: "fieldAuthorityTextView", width:80, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/permissionFieldAction!slicedQueryFunctionPermissionfield.ajax',
		parms:{functionFieldGroupId:functionFieldGroupId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'fieldCode',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}