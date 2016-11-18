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
	var html=[],fullId='',name='', organId='';
	if(!data){
		html.push('职级序列督导师关系');
	}else{
		fullId=data.fullId,name=data.name, organId=data.orgId;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>职级序列督导师关系');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#fullId').val(fullId); 
	$('#deptName').val(name); 
	$('#organId').val(organId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler: saveHandler,
		addHandler: function(){
			var fullId=$('#fullId').val();
			var deptName=$('#deptName').val();
			if(fullId == ''){
				Public.tip('请选择机构!');
				return ;
			}
            var addRows = [], addRow;
            addRow = {fullId:fullId,deptName:deptName};
            gridManager.addRows(addRow);
		}, 
		deleteHandler: deleteHandler,
		addSyn: {id:'addSyn',text:'同步',img:'page_dynamic.gif',click:addSyn}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "机构fullID", name: "fullId", hide: true },
		{ display: "岗位ID", name: "positionId", hide: true },
		{ display: "职级序列ID", name: "postsRankSequenceId", hide: true },
		{ display: "职级ID", name: "staffingPostsRank", hide: true },
		{ display: "机构", name: "deptName", width: 150, minWidth: 60, type: "string", align: "left" },
		{ display: "岗位", name: "positionName", width: 250, minWidth: 60, type: "string", align: "left", 
			editor: { type: 'select', required: true,data:{name :'hrPosSelect',type :'hr',
				getParam:function(rowData){
					var fullId=rowData.fullId||'';
					var root='';
			 	   if(fullId!=''){
					   root=fullId;
			 	   }
			  	  return {searchQueryCondition:"full_id like '%"+root+"%'"};
			},back:{
				id:'positionId',
				fullName:'positionName'
			}}}
		},	   
		{ display: "职级序列", name: "name", width: 80, minWidth: 60, type: "string", align: "left" , 
			editor: { type: 'select', required: true,data:{name :'postsRankSequenceByFullId',type :'hr',
				getParam:function(){
					return {organId:$('#organId').val()||''};
			},
			back:{
					postsRankSequenceId:'postsRankSequenceId',
					staffingPostsRankTextView:'staffingPostsRankTextView',
					staffingPostsRank:'staffingPostsRank',
					name:'name'
			}}} 
		},
		{ display: "职级", name: "staffingPostsRankTextView", width: 60, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedPostsRankTeacherRelationQuery.ajax',
		parms:{fullId:"/"},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		autoAddRowByKeydown:false,
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
	Public.ajax(web_app.name + '/hrSetupAction!savePostsRankTeacherRelation.ajax', {datas:encodeURI($.toJSON(detailData))}, function(data) {
		reloadGrid();
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'hrSetupAction!deletePostsRankTeacherRelation.ajax',
		gridManager:gridManager,idFieldName:'postsRankTeacherRelationId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}
function addSyn(){
	var fullId = $('#fullId').val();
	if(!fullId){
		Public.tip('请选择机构')	;	
		return;
	}
	Public.ajax(web_app.name + '/hrSetupAction!synPostsRankTeacherRelation.ajax', {fullId:fullId}, function(data) {
		reloadGrid();
	});
}

