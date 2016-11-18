var gridManager = null;var dataYesOrNo={1:'是',0:'否'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		saveHandler:saveHandler,
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "机构名称", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "年度", name: "year", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:true} },		   
		{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',required:true} 	},		   
		{ display: "开始日期", name: "startDate", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'date',required:true} },		   
		{ display: "结束日期", name: "endDate", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'date',required: true} },
		{ display: "是否法定假日", name: "isStatutoryHoliday", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:dataYesOrNo,required: true},
					render: function (item) { 
						return dataYesOrNo[item.isStatutoryHoliday];
					} 
		}
		],
		dataAction : 'server',
		url: web_app.name+'/attBaseInfoAction!slicedQueryHoliday.ajax',
		parms: { year: getYear() },
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'startDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: true,
		checkbox: true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

function initializeUI(){
	$('#year').spinner({countWidth:80}).mask('nnnn');
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseAttManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data) {
	var html=[],organId='',name='';
	if(data){
		organId=data.id,name=data.name;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>节假日列表');
		//鉴权通过后才能执行
		Public.authenticationManageType('hrBaseAttManage',data.fullId,function(flag){
			if(flag){
				$('#mainOrganId').val(organId);
				$('#mainOrganName').val(name);
				$('.l-layout-center .l-layout-header').html(html.join(''));
				UICtrl.gridSearch(gridManager,{organId:organId});
			}
		});
	}
}

function getYear(){
	return $('#year').val();
}

function getOrganName(){
	return $("#mainOrganName").val();
}
function getOrganId(){
	return $("#mainOrganId").val();
}
function query(obj) {
	if(getOrganId()==''){
		Public.tip('请选择机构!');	
		return;
	}
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

function reloadGrid() {
	gridManager.loadData();
} 

function addHandler() {
	if(getOrganId()==''){
		Public.tip('请选择机构!');	
		return;
	}
	UICtrl.addGridRow(gridManager,{year: getYear(),organId:getOrganId(),organName: getOrganName() });
}

function saveHandler(){
	var detailData = DataUtil.getGridData({gridManager:gridManager});
	if(!detailData || detailData.length == 0) return false;
	Public.ajax(web_app.name +'/attBaseInfoAction!saveHoliday.ajax',
		{
			detailData:encodeURI($.toJSON(detailData))
		},
		function(){
			reloadGrid();
		}
	);
}

function deleteHandler(){
	DataUtil.delSelectedRows({ action:'attBaseInfoAction!deleteHoliday.ajax', 
		gridManager: gridManager, idFieldName: 'holidayId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}
