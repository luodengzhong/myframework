var gridManager = null,institutionProcessId='';
$(document).ready(function() {
	institutionProcessId = Public.getQueryStringByName("institutionProcessId");
	initializeGrid();
});
//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "文件名称", name: "fileName", width: 560, minWidth: 560, type: "string", align: "left",
				render: function (item) {
					var str = '<a href="#" onClick="AttachmentUtil.onOpenViewFile('+item.id+',\'\',\'\',true)">'+
					item.fileName+'</a>';
	  				return str;
	  			}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/oaInstitutionAction!slicedQueryProcFileList.ajax',
		parms:{institutionProcessId:institutionProcessId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'fileName',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}