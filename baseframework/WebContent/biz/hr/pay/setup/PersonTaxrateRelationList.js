var gridManager = null,refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		//manageType:'hrBusinessRegistrationManage',
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
	 $('#mainKind').searchbox({type:'hr',name:'chooseMainPersontaxrate',
			back:{name:'#mainKind',mainId:'#mainId'}
	 });
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',name='';
	if(!data){
		html.push('人员');
	}else{
		fullId=data.fullId,name=data.name;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>人员');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#fullId').val(fullId); 
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['organId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler: saveHandler,
		addHandler: function(){
			UICtrl.addGridRow(gridManager);
		}, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "人员ID", name: "archivesId", hide: true },
		{ display: "个税类别ID", name: "mainId", hide: true },
		{ display: "人员", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left", 
			editor: { type: 'select', required: true,data:{name :'personArchiveSelect',type :'hr',
				getParam:function(){
					var root='';
			    	return {searchQueryCondition:"full_id like '%"+root+"%'"};
			},back:{
				archivesId:'archivesId',
				staffName:'staffName',
				ognName:'ognName',
				dptName:'dptName'
			}}} 
		},		   
		{ display: "个税类别", name: "name", width: 150, minWidth: 60, type: "string", align: "left" , 
			editor: { type: 'select', required: true,data:{name :'chooseMainPersontaxrate',type :'hr',
				back:{
					mainId:'mainId',
					name:'name'
			}}} 
		},		   
		{ display: "公司", name: "ognName", width: 150, minWidth: 60, type: "string", align: "left" },
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/paySetupAction!slicedPersonTaxrateRelationQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

//保存按钮 
function saveHandler() {
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0){
		Public.tip('没有数据被修改!');
		return false;
	}
	Public.ajax(web_app.name + '/paySetupAction!savePersonTaxrateRelation.ajax', {datas:encodeURI($.toJSON(detailData))}, function(data) {
		reloadGrid();
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'paySetupAction!deletePersonTaxrateRelation.ajax',
		gridManager:gridManager,idFieldName:'personTaxrateRelationId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

