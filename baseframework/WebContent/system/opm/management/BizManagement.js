var treeManager, gridManager, bizManagementGridManager, 
   refreshFlag, operateCfg = {}, manageTypeId = 0, 
   subordinationId = "",  //下属组织ID
   managerId = "",  //管理组织ID
   typeId; //授权方式ID

$(function() {
	
	getQueryParameters();
	
	bindEvents();
	initializateUI();
	
	initializeOperateCfg();
	loadOrgTreeView();
	loadBizManagementType();
	loadBizManagement();
	
    function getQueryParameters() {
		typeId = Public.getQueryStringByName("typeId");
	}
	
	function initializeOperateCfg(){
		var  path = web_app.name + '/managementAction!';
		operateCfg.queryOrgAction = web_app.name +'/orgAction!queryOrgs.ajax';		
		operateCfg.queryAction = path +'slicedQueryBizManagements.ajax';		
		operateCfg.allocateManagers = path + 'allocateManagers.ajax';
		operateCfg.allocateSubordinations = path + 'allocateSubordinations.ajax';
		operateCfg.deleteAction = path +'deleteBizManagement.ajax';	
		operateCfg.romoveCache = path +'romovePermissionCache.ajax';	
	}

	function bindEvents() {
		$("#showDisabledOrg,#showMasterPsm, #showVirtualOrg").click(function () {
			loadOrgTreeView();
        });
	}
	
	/**
	 * 加载业务权限类别
	 */
	function loadBizManagementType() {
		bizManagementGridManager = UICtrl.grid("#bizManagementType", {
			columns : [
					{ display : "编码", name : "code", width : "120", minWidth : 60, type : "string", align : "left" },
					{ display : "名称", name : "name", width : "160", minWidth : 60, type : "string", align : "left" }
					],
			dataAction : "server",
			url : web_app.name + "/managementAction!slicedQueryBizManagementTypes.ajax",
			title:'查询',
			pageSize : 20,
			parms: { nodeKindId: 2 },
			width: '100%', 
			height: '100%', 
			sortName:'code',
			sortOrder:'asc',
			heightDiff: -12,
			headerRowHeight : 25,
			rowHeight : 25,
			checkbox : false,
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			rownumbers: true,
			usePager: true,
			onDblClickRow: function (data, rowindex, rowobj) {
				doSearchBizManagement(data.id, data.name);
            },
            onSelectRow: function (data, rowindex, rowobj) {
            	doSearchBizManagement(data.id, data.name);
            }
		});
		UICtrl.createGridQueryBtn('#bizManagementType',function(param){
			UICtrl.gridSearch(bizManagementGridManager, {param:encodeURI(param)});
		});
	}

	
	function loadBizManagement() {
		var imageFilePath = web_app.name + '/themes/default/images/icons/';
        var toolbarOptions = {
            items: [
                { id: "addOrg", text: "授权", click: allocateOrg, img: imageFilePath + "page_new.gif" },
                { id: "deleteLine", line: true },
                { id: "deleteOrg", text: "删除", click: deleteBizManagement, img: imageFilePath + "page_delete.gif" },
                { id: "deleteLine", line: true },
		          { id : "romoveCache", text : "清除权限缓存", click : romoveCache, img : imageFilePath + "page_dynamic.gif" }, 
		          { line : true }
              ]
        };

        gridManager =  UICtrl.grid("#maingrid", {
            columns: [
                     { display: "名称", name: "name", width: 300, minWidth: 60, type: "string", align: "left" },
                     { display : "组织状态", name : "status", width : 80, minWidth : 60, type : "string", align : "left",
					   render: function (item){
					   	   	return OpmUtil.getOrgStatusDisplay(item.status) ; 
					   	} },
					 { display: "创建人", name: "creatorName", width: 60, minWidth: 60, type: "string", align: "left" },
	 				 { display: "创建日期", name: "createDate", width: 80, minWidth: 60, type: "date", align: "left" }							  	
                     ],
                    dataAction : "server",
         			url : operateCfg.queryAction,
         			pageSize : 20,
         			usePager: true,
         			toolbar : toolbarOptions,
         			width : "100%",
         			height : "100%",
         			heightDiff : -10,
         			headerRowHeight : 25,
         			rowHeight : 25,
         			checkbox : true,
         			fixedCellHeight : true,
         			selectRowButtonOnly : true,
         			onLoadData: function(){
         				return  isAllocateManager() ?  subordinationId : managerId && manageTypeId;
         			}
        });
    }
	
	function initializateUI() {
		UICtrl.autoSetWrapperDivHeight(adjustTreeAreaHeight);
		UICtrl.layout("#layout", {leftWidth : 250,heightDiff : -5});
		$("#layout2").ligerLayout({ leftWidth: 2 * ($(window).width() - 200) / 5, heightDiff: -5 });
	}

	function deleteBizManagement() {
		DataUtil.del({ action: operateCfg.deleteAction, gridManager: gridManager, onSuccess: reloadGrid });
	}
});

/**
 * 是否分配管理者
 */
function isAllocateManager(){
	return typeId === "manager";	
}

function doSearchBizManagement(id, name){
	if (manageTypeId != id) {
	    manageTypeId = id;
	    $('#layout2').find('div.l-layout-center').find('div.l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + name + "]</font>权限列表");
	    searchBizManagement();
	}
}
function searchBizManagement() {
	if (!manageTypeId){
		return;	
	}
	if (isAllocateManager() ? !subordinationId : !managerId){
		return;
	}
	
    if (isAllocateManager()){
       gridManager.options.parms.manageOrgId = subordinationId;
    }else{
       gridManager.options.parms.orgId = managerId;
    }
    
    gridManager.options.parms.typeId = typeId;
    
    gridManager.options.parms.manageTypeId = manageTypeId;
    gridManager.options.newPage = 1;
    reloadGrid();
}


/**
 * 检查分配条件
 */
function checkAllocateCondition(){
	 if (isAllocateManager() ? !subordinationId : !managerId) {
	        Public.tip('请选择要授权的机构节点。'); 
	        return false;
	 }

	 if (!manageTypeId) {
	    	Public.tip('请选择业务权限类别。'); 
	    	return false;
	 }
	 
	 return true;
}

function allocateOrg() {
	if (!checkAllocateCondition()){
    	return;
    }
	var selectOrgparams = OpmUtil.getSelectOrgDefaultParams();
	selectOrgparams = jQuery.extend(selectOrgparams, {selectableOrgKinds: "ogn,dpt,pos,psm"});
	var options = { 
			params: selectOrgparams, confirmHandler: doSaveAllocateOrg, 
			closeHandler: onDialogCloseHandler, title : "选择组织"
	};
	OpmUtil.showSelectOrgDialog(options);
}

function doSaveAllocateOrg(){
	var data = this.iframe.contentWindow.selectedData;
	if (data.length == 0) {
		Public.errorTip("请选择组织。");
		return;
	}
	
	var _self = this;
	
	var bizOrgIds = [];

    for (var i = 0; i < data.length; i++) {
    	bizOrgIds[bizOrgIds.length] = data[i].id;
    }
    
	var params = {};
	params.kindId = 2;

	params.manageTypeId  = manageTypeId;

	if (isAllocateManager()){
		params.subordinationId = subordinationId;
		params.managerIds = $.toJSON(bizOrgIds);
	}else{
		params.managerId = managerId;
		params.subordinationIds = $.toJSON(bizOrgIds);
	}
	
	var url = isAllocateManager() ? operateCfg.allocateManagers : operateCfg.allocateSubordinations;
	
	Public.ajax(url, params, function() {
		refreshFlag = true;
		_self.close();
	});
}

function onDialogCloseHandler(){
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}

function loadOrgTreeView() {
	$("#orgTree").remove();
	$("#divTreeArea").append("<ul id='orgTree'></ul>");
	
	$('#orgTree').commonTree({	
		loadTreesAction : operateCfg.queryOrgAction,
		parentId :'orgRoot',
		getParam: function (e) {
			return getOrgFilterCondition();
        },
		isLeaf : function(data) {
			data.nodeIcon = OpmUtil.getOrgImgUrl (data.orgKindId, data.status, false);
		},
		onClick : function(data) {
			var changeOrg = false;
			if (isAllocateManager()){
				if (data && subordinationId != data.id) {
					subordinationId = data.id;
					changeOrg = true;
				}
			}else{
				managerId = data.id;
				changeOrg = true;
			}
			if(changeOrg){
				$('#layout > div.l-layout-center > div.l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + data.name + "]</font>业务权限管理");
				searchBizManagement();
			}
		},
		IsShowMenu : false
	});
}


function reloadGrid() {
	UICtrl.gridSearch(gridManager);
}

function romoveCache(){
	Public.ajax(operateCfg.romoveCache);
}