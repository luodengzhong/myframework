var gridManager = null;
$(document).ready(function () {
	initChildGrid();
});

function initChildGrid(){
	gridManager = UICtrl.grid('#childGrid', {
		columns: [
		  		{ display: "名称", name: "name", width: 140, minWidth: 80, type: "string", align: "left" },	
		  		{ display: "编码", name: "code", width: 140, minWidth: 80, type: "string", align: "left" },	
		  		{ display: "生效日期", name: "effectiveDate", width: 100, minWidth: 80, type: "string", align: "left" },		   		   
		  		{ display: "制度版本", name: "institutionVersion", width: 120, minWidth: 80, type: "string", align: "left" },		   		   
		  		{ display: "修订状态", name: "currentNode", width: 140, minWidth: 80, type: "string", align: "left"},
		  		{ display: "处理人", name: "personName", width: 140, minWidth: 80, type: "string", align: "left"}
		  		],
		  		dataAction : 'server',
		  		url: web_app.name+'/oaInstitutionAction!slicedQueryInstitutionChildDetail.ajax',
		  		usePager : false,
		  		title:'制度概况',
		  		parms:{parentId:$('#id').val(),pagesize:1000},
		  		width : '100%',
		  		height : '100%',
		  		heightDiff : -5,
		  		headerRowHeight : 25,
		  		rowHeight : 25,
		  		sortName:'sequence',
		  		sortOrder:'asc',
		  		fixedCellHeight : true,
		  		selectRowButtonOnly : true,
		  		checkbox: false
		  	});
}