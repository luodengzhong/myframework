var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.AttKind,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.AttKind){
		parentId="";
		html.push('分组机构列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>分组机构列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{folderKindId:parentId});
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler: addHandler,
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "名称", name: "name", width: 240, minWidth: 60, type: "string", align: "left" },
		{ display: "分组", name: "folderKindName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "路径", name: "fullName", width: 450, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/zkAttAction!slicedQueryAttOrgGroup.ajax',
		manageType:'hrBaseZKAtt',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox: true,
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

function addHandler(){
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	
	/*
		{
		"filter": "",
        "multiSelect": true,
        "parentId": "orgRoot",
        "manageCodes": "hrBaseZKAtt",
        "orgKindIds": "ogn dpt pos psm",
        "includeDisabledOrg": false,
        "listMode": false,
        "showCommonGroup": false,
        "cascade": true,
        "selected": []
    };
    */
    var selectOrgparams = OpmUtil.getSelectOrgDefaultParams();
    selectOrgparams =  jQuery.extend(selectOrgparams, {multiSelect: true, manageCodes: "hrBaseZKAtt",selectableOrgKinds: "ogn,dpt,pos,psm" });
    var options = { 
    	params: selectOrgparams, 
    	confirmHandler: function(){
    		var data = this.iframe.contentWindow.selectedData;
        	if (data.length == 0) {
        		Public.errorTip("请选择组织");
        		return;
        	}
        	var ids=new Array();
        	$.each(data,function(i,o){
        	    ids.push(o.id);
        	});
        	var _self=this;
		    Public.ajax(web_app.name + "/zkAttAction!saveAttOrgGroup.ajax",
		    	{folderKindId:parentId,ids:$.toJSON(ids)},
		    	function(){
		    		_self.close();
		    		reloadGrid();
		    	}
		    );
        }, 
        closeHandler: function(){},
        title : "选择组织"
   };
   OpmUtil.showSelectOrgDialog(options);
}
//删除按钮
function deleteHandler(){
	DataUtil.del({action:'zkAttAction!deleteAttOrgGroup.ajax',
		gridManager:gridManager,idFieldName:'attGroup',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}