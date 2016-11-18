var infoGridManager;
$(document).ready(function () {
	UICtrl.autoSetWrapperDivHeight();
	InitInfoGrid();
});

function getId(){
	return $('#bizId').val();
}

function InitInfoGrid(){
	infoGridManager = UICtrl.grid('#InfoPromulgate', {
		columns: [
		  		{ display: "标题", name: "subject", width: 260, minWidth: 80, type: "string", align: "left" },	
		  		{ display: "编号", name: "billCode", width: 140, minWidth: 80, type: "string", align: "left" },	
		  		{ display: "主题词", name: "keywords", width: 260, minWidth: 80, type: "string", align: "left" },	
		  		{ display: "创建日期", name: "createTime", width: 100, minWidth: 80, type: "string", align: "left" },		   		   
		  		{ display: "生效日期", name: "effectiveTime", width: 100, minWidth: 80, type: "string", align: "left" }
		  		],
		  		dataAction : 'server',
		  		url: web_app.name+'/oaInstitutionAction!slicedQueryInfoPromulgate.ajax',
		  		usePager : false,
		  		parms:{bizId:getId(),pagesize:1000},
		  		width : '100%',
		  		height : 135,
		  		heightDiff : -5,
		  		headerRowHeight : 25,
		  		rowHeight : 25,
		  		sortName:'createTime',
		  		sortOrder:'desc',
		  		fixedCellHeight : true,
		  		selectRowButtonOnly : true,
		  		checkbox: false,
		  		onLoadData :function(){
		   			return (getId()!='');
		   		},
		   		onSelectRow : function(data, rowindex, rowobj) {
		   			var url = web_app.name+'/oaInfoAction!forwardFeedBackStatPage.do?infoPromulgateId=';
		   			url = url + data.infoPromulgateId;
		   			var iframe=document.getElementById("infoDetail");
		   			iframe.src=url;
		  		}
		  	});
		  	UICtrl.setSearchAreaToggle(infoGridManager);
}