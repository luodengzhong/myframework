var gridManager, permissionGridManager, parentId, refreshFlag;

$(function() {
	loadOrgTreeView();
	initializeGrid();
	initializePermissionGrid();
	bindEvents();	
	initializateUI();
	
	function initializateUI() {
		UICtrl.layout("#layout", { leftWidth : 250,  heightDiff : -5 });
		UICtrl.autoSetWrapperDivHeight();
		$('#tabPage').tab();
	}

	function bindEvents() {
		$("#queryRoleFormBtn").click(function() {
			var params = $(this.form).formToJSON();
			UICtrl.gridSearch(gridManager, params);
		});
		$("#queryPermissionMainBtn").click(function() {
			var params = $(this.form).formToJSON();
			UICtrl.gridSearch(permissionGridManager, params);
		});
		$("#resetRoleFormBtn").click(function() {
			$(this.form).formClean();
		});
		$("#resetPermissionMainBtn").click(function() {
			$(this.form).formClean();
		});
		//切换tab 刷新grid
		$('#menuRoleAuthorize').add('#menuPermissionQuery').on('click',function(){
			if(!$(this).hasClass('current')){
				setTimeout(function(){reloadGrid();},0);
			}
		});
	}

	function initializeGrid() {
		var imageFilePath = web_app.name + '/themes/default/images/icons/';
		var toolbarOptions = {
			items : [ { id : "addAuthorization", text : "分配", click : showInsertAuthorizationDialog, img : imageFilePath + "page_new.gif" },
			          { line : true },
			          { id : "deleteAuthorization", text : "删除", click : deleteAuthorization, img : imageFilePath + "page_delete.gif" }, 
			          { line : true }
			]
		};

		gridManager = UICtrl.grid("#maingrid", {
			columns : [
			        { display : "类型", name : "roleKindId", width : "60", minWidth : 60, type : "string", align : "left",
			        	render:function(item){
			        		if (item.roleKindId == "fun")
			        			return "<div style='text-align:center;height:25px;'> <img style='margin-top:4px;' src=\"" + OpmUtil.OrgImagePath + "funRole.gif\" /></div>";
			        		else
			        			return "<div style='text-align:center;height:25px;'><img style='margin-top:4px;' src=\"" + OpmUtil.OrgImagePath + "dataRole.gif\"/></div>";
			        	}
			        },
			        { display : "编码", name : "roleCode", width : 140, minWidth : 60, type : "string", align : "left" },
			        { display : "角色", name : "roleName", width : 120, minWidth : 60, type : "string", align : "left" },
					//{ display : "授权组织", name : "orgFullName", width : "300", minWidth : 60, type : "string", align : "left" },
					{ display: "创建人", name: "creatorName", width: 60, minWidth: 60, type: "string", align: "left" },
					{ display: "创建日期", name: "createDate", width: 80, minWidth: 60, type: "date", align: "left" }
					],
			dataAction : "server",
			url : web_app.name + "/authorizationAction!loadAuthorizes.ajax",
			usePager: false,
			toolbar : toolbarOptions,
			width : "99%",
			height : "100%",
			heightDiff : -14,
			headerRowHeight : 25,
			rowHeight : 25,
			checkbox : true,
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			onLoadData :function(){
				return !(Public.isBlank(parentId));
			}
		});
		UICtrl.setSearchAreaToggle(gridManager, $("#navTitle01"));
	}

	function initializePermissionGrid() {
	    permissionGridManager = UICtrl.grid("#permissiongrid", {
				columns : [
						{ display : "编码", name : "code", width : "120", minWidth : 60, type : "string", align : "left" },
						{ display : '图标', name : 'icon', width : 60, minWidth : 60, type : "string", align : "center", isAutoWidth : 0,
							render : function(item) {
								return DataUtil.getFunctionIcon(item.icon);
							}
			            },
     				    { display : "名称", name : "name", width : "150", minWidth : 60, type : "string", align : "left",
							render: function (item) { 
								if(item.type=='field'){//字段权限显示连接
									var html=['<a href="javascript:void(null);" class="GridStyle" '];
									 html.push('funId="',item.id,'" ');
									 html.push('funName="',item.name,'" ');
									 html.push('onclick="showPermissionField(this)" ');
									 html.push('>');
									 html.push(item.name);
									 html.push('</a>');
									 return html.join('');
								}
								return item.name;
							}
						},
 					    { display : "路径", name : "fullName", width : "400", minWidth : 60, type : "string", align : "left" }
						],
				dataAction : "server",
				url : web_app.name  + "/authorizationAction!slicedQueryAuthorizePermissionsByOrgFullId.ajax",
				pageSize : 20,
				width : '99%',
				height : "100%",
				sortName: 'sequence',
	            sortOrder: 'asc',
				heightDiff : -7,
				headerRowHeight : 25,
				rowHeight : 25,
				checkbox : true,
				fixedCellHeight : true,
				selectRowButtonOnly : true,
				onLoadData :function(){
					return !(Public.isBlank(parentId));
				}
			});
	 	   UICtrl.setSearchAreaToggle(permissionGridManager, $("#navTitle02"));
	}
	
	function showInsertAuthorizationDialog() {
		if (Public.isBlank(parentId)){
			Public.tip("请选择组织节点。");
			return false;
		}
		
		UICtrl.showFrameDialog({
			title : "选择角色",
			width: 700,
			height: 400,
			url : web_app.name + '/permissionAction!showSelectRoleDialog.do',
			ok : doSaveAuthorization,
			close : onDialogCloseHandler
		});
	}

	function doSaveAuthorization(){		
		var data = this.iframe.contentWindow.getRoleData();
		if (!data) {
			return;	
		}
		
		var _self = this;
		
		var roleIds = [];
	    for (var i = 0; i < data.length; i++) {
	    	roleIds[roleIds.length] = data[i].id;
	    }
	    
		var params = {};
		params.orgId = parentId;
		params.roleIds = $.toJSON(roleIds);
		
		Public.ajax(web_app.name + "/authorizationAction!insertAuthorize.ajax",
				params, function() {
			        refreshFlag = true;
					_self.close();
				});
	}
	
	function onDialogCloseHandler() {
		if (refreshFlag) {
			reloadGrid();
			refreshFlag = false;
		}
	}
	
	function deleteAuthorization() {
		var action = "authorizationAction!deleteAuthorize.ajax";
		DataUtil.del({ action: action, gridManager: gridManager, onSuccess: reloadGrid });
	}
});

function loadOrgTreeView(){
	var url = web_app.name + "/orgAction!queryOrgs.ajax";
	 $('#maintree').commonTree({
        loadTreesAction: url,
        parentId: 'orgRoot',
        getParam: function (e) {
            if (e) {
                return { showDisabledOrg: 0, displayableOrgKinds: "ogn,dpt,pos,psm,fld,prj,grp" };
            }
            return { showDisabledOrg: 0 };
        },
        manageType: 'functionDelegation',
        isLeaf: function (data) {
            data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId, data.status, false);
             return data.hasChildren == 0;
        },
        onClick: treeNodeOnclick,
        IsShowMenu: false
    });
}

function treeNodeOnclick(data){
	if (!data) {
		return;
	}
	if(data.id=='orgRoot') {
		parentId=null;
		return;
	}
	if (parentId != data.id){
		parentId = data.id;
		gridManager.options.parms.orgFullId = data.fullId;
		permissionGridManager.options.parms.orgFullId = data.fullId;
		reloadGrid();
	}
}

function reloadGrid() {
	if ($("#menuRoleAuthorize").hasClass("current"))
		gridManager.loadData();
	else
		permissionGridManager.loadData();
}

function showPermissionField(obj){
	var id,name;
	id=$(obj).attr('funId');
	name=$(obj).attr('funName');
	UICtrl.showFrameDialog({
		url : web_app.name + "/system/opm/permissionField/showPermissionField.jsp",
		param : {functionFieldGroupId : id},
		title : name,
		width : 650,
		height : 400,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});
}