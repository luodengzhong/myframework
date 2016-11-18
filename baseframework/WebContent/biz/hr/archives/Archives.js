var gridManager = null, refreshFlag = false,archivesState=null;
var staffingPostsRankData={};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	archivesState=$('#tempArchivesState').combox('getJSONData');
	staffingPostsRankData=$('#tempStaffingPostsRank').combox('getJSONData');
	initializeUI();
	initializeGrid();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrArchivesManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds: "ogn,dpt,pos"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	$('#state').combox({data:archivesState,checkbox:true}).combox('setValue','0,1');
	$('#staffingPostsRank').combox({data:staffingPostsRankData,checkbox:true});
    $('#staffingPostsRankSequence').searchbox({
		type:'hr',name:'postsRankSequenceByFullId',checkboxIndex:'code',
		showToolbar:true,pageSize:100,checkbox:true,
		maxHeight:200,
		getViewWidth:function(){
			return 180;
		},
		getParam:function(){
			var organId=$('#mainOrganId').val();
				return {organId:organId};
		},
		back:{code:$('#staffingPostsRankSequence')}
	});
	$('#responsibilitiyNames').treebox({
		name:'responsibilitiy',
		onChange:function(n,d){
			$('#responsibilitiyId').val(d.fullId);
			$('#responsibilitiyNames').val(d.fullName);
		}
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='',organId='';
	if(!data){
		html.push('人员列表');
	}else{
		fullId=data.fullId,fullName=data.fullName,  organId=data.orgId;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人员列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	$('#mainOrganId').val(organId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		viewHandler: function(){
			viewHandler();
		}, 
		updateHandler: function(){
			updateHandler();
		},
		updateComputeHandler:{id:'updateComputeHandler',text:'数据刷新',img:'page_tree.gif',click:function(){
			var fullId=$('#mainFullId').val();
			if(fullId==''){
				Public.tip('请选择组织机构！');
				return false;
			}
			Public.ajax(web_app.name + "/hrArchivesAction!saveComputeRule.ajax",{fullId:fullId},function(){
				reloadGrid();
			});
		}},
		updateEntryApplyHandler:{id:'updateEntryApplyHandler',text:'入职手续办理',img:'page_next.gif',click:function(){
				entryApply();
			}
		},
		updateCancelEmployHandler:{id:'updateCancelEmployHandler',text:'取消录用',img:'page_delete.gif',click:function(){
				cancelEmploy();
			}
		},
		updateStateHandler:{id:'updateStateHandler',text:'人员状态改变',img:'page_settings.gif',click:function(){
				updateStateHandler();
			}
		},
		/*bakArchivesHandler:{id:'bakArchivesHandler',text:'备份在职人员',img:'page_settings.gif',click:function(){
				bakArchivesHandler();
			}
		},*/
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "姓名", name: "staffName", width:60, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "性别", name: "sexTextView", width: 40, minWidth: 60, type: "string", align: "left"},
		{ display: "年龄", name: "age", width: 40, minWidth: 60, type: "string", align: "left"},
		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "层级", name: "posTierTextView", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "行政级别", name: "posLevelTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "入职时间", name: "employedDate", width: 80, minWidth: 60, type: "date", align: "left" },
		{ display: "集团工龄", name: "CWorkTime", width: 40, minWidth: 60, type: "string", align: "left" },
		{ display: "最高学历", name: "educationTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "体系分类", name: "systemTypeTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "编制状态", name: "staffingLevelTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "职级", name: "staffingPostsRankTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "职级序列", name: "staffingPostsRankSequence", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "职能", name: "responsibilitiyNames", width: 150, minWidth: 60, type: "string", align: "left" },
		{ display: "通讯号码", name: "phoneNumber", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "证件号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left"},
		{ display: "离职办理", name: "isLeaveTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "试用期", name: "isProbationTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "stateTextView", width: 60, minWidth: 60, type: "string", align: "left"}		
		//{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/hrArchivesAction!slicedQuery.ajax',
		parms:{state:'0,1'},
		manageType:'hrArchivesManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			if($('#toolbar_menuUpdate').length>0){//存在编辑按钮
				updateHandler(data.archivesId);
			}else{
				viewHandler(data.archivesId);
			}
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	param['posLevelgt']='';
	param['posLevellt']='';
	param['posLeveleq']='';
	var posLevelSymbol=param['posLevelSymbol'];
	if(posLevelSymbol!=''){
		var posLevel=param['posLevel'];
		if(posLevel!=''){
			param['posLevel'+posLevelSymbol]=posLevel;
		}
	}
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
	$('#state').combox('setValue','0,1');
	onFolderTreeNodeClick();
}

//添加按钮 
function addHandler() {
	var url=web_app.name + '/hrArchivesAction!showInsert.do?functionCode=HRArchivesMaintain';
	parent.addTabItem({ tabid: 'HRArchivesAdd', text: '新增人员 ', url:url});
}

//编辑按钮
function updateHandler(archivesId){
	if(!archivesId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		archivesId=row.archivesId;
	}
	var url=web_app.name + '/hrArchivesAction!showUpdate.do?functionCode=HRArchivesMaintain&archivesId='+archivesId;
	parent.addTabItem({ tabid: 'HRArchivesAdd'+archivesId, text: '编辑人员 ', url:url});
}

//入职手续办理
function entryApply(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var archivesId = row.archivesId;
	var state=row.state;
	if(parseInt(state)!=0){
		Public.tip('无需办理入职手续!');
		return false;
	}
	Public.ajax(web_app.name + '/entryCheckAction!queryEntryCheck.ajax',{archivesId:archivesId},function(data){
		if(null!=data.id){
			Public.tip('该员工已办理入职手续,正审核中...');
			return false;
		}else{
			parent.addTabItem({ 
				tabid: 'HREntryApply'+archivesId,
				text: '新员工入职手续办理',
				url: web_app.name + '/entryCheckAction!forwardBill.job?archivesId=' 
					+ archivesId
				}); 
		}
	});
}

//备份在职人员
function bakArchivesHandler(){
	Public.ajax(web_app.name + '/hrArchivesAction!bakArchives.ajax',{},function(data){
		
			Public.tip('备份成功');
			
		});
}

//取消录用按钮

function cancelEmploy(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var state=row.state;
	var archivesId=row.archivesId;
	var name=row.staffName;
	var organId=row.ognId;
	if(parseInt(state)!=0){
		Public.tip('不能执行取消录用操作!');
		return false;
	}
	UICtrl.showAjaxDialog({
		title : "取消录用["+name+"]",
		width : 400,
		url : web_app.name + '/cancelEmployApplyAction!forwardCancelEmploy.load',
		ok : function(){
			var _self=this;
			$('#submitForm').ajaxSubmit({
				url : web_app.name + '/cancelEmployApplyAction!insertCancelEmployApply.ajax',
				param:{archivesId:archivesId,staffName:name,organId:organId},
				success : function() {
					_self.close();
					reloadGrid();	
				}
			});
		}
	});
	/*DataUtil.updateById({ action: 'entryCheckAction!cancelEmploy.ajax',
		gridManager: gridManager, param:{state:-1},idFieldName:'archivesId',
		message:'确实要作废对该员工的录用吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		*/

}

function viewHandler(archivesId){
	if(!archivesId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		archivesId=row.archivesId;
	}
	var url=web_app.name + '/hrArchivesAction!showUpdate.do?functionCode=HRArchivesMaintain&archivesId='+archivesId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HRArchivesView'+archivesId, text: '查看人员 ', url:url});
}

function updateStateHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var archivesId=row.archivesId;
	var name=row.staffName;
	UICtrl.showAjaxDialog({
		title : "["+name+"]状态改变",
		width : 400,
		url : web_app.name + '/hrArchivesAction!forwardStateChange.load',
		ok : function(){
			var _self=this;
			$('#stateChangeForm').ajaxSubmit({
				url : web_app.name + '/hrArchivesAction!insertStateChangeLog.ajax',
				param:{archivesId:archivesId},
				success : function() {
					_self.close();
					reloadGrid();	
				}
			});
		}
	});
}


