var treeManager, gridManager, refreshFlag = false, selectFunctionDialog, lastSelectedId = 0;

$(function() {
	bindEvents();

	loadFunctionTree();
	initializeUI();
	initializeGrid();

	function initializeUI() {
		UICtrl.initDefaulLayout();
	}

	function bindEvents() {
		$("#btnQuery").click(function() {
					var params = $(this.form).formToJSON();
					UICtrl.gridSearch(gridManager, params);
				});
		$("#btnReset").click(function() {
					$(this.form).formClean();
				});
		// todo 优化
		$("#name").live("blur", function() {
					if (!$("#fullName").val()) {
						$("#fullName").val($("#name").val());
					}
				});
		bindAddPermissionFieldBtnEvent();
	}

	function initializeGrid() {
		UICtrl.autoSetWrapperDivHeight();
		var toolbarparam = {
			addHandler : showInsertDialog,
			moveHandler : moveFunction,
			updateHandler : showUpdateDialog,
			deleteHandler : deleteFunction,
			saveSortIDHandler : updateFunctionSequence,
			addPermissionField:{id:'PermissionField',text:'字段及按钮权限',img:'page_extension.gif',click:addPermissionField},
			addOftenUse:{id:'addOftenUse',text:'添加到常用功能',img:'file_font_truetype.gif',click:addOftenUse},
			queryOftenUse:{id:'queryOftenUse',text:'常用功能维护',img:'file_font.gif',click:queryOftenUse}
			/*
			 * , buttonManagerHandler: buttonManager, allocationRoleHandler:
			 * allocationRole
			 */
		};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

		gridManager = UICtrl.grid("#maingrid", {
					columns : [{ display : '编码', name : 'code', width : 200, minWidth : 60, type : "string", align : "left" }, 
					           { display : '名称', name : 'name', width : 150, minWidth : 60, type : "string", align : "left" }, 
					           { display : '描述', name : 'description', width : 150, minWidth : 60, type : "string", align : "left" },
					           { display : '全名称', name : 'fullName', width : 150, minWidth : 60, type : "string", align : "left" },
					           { display : 'Url', name : 'url', width : 280, minWidth : 60, type : "string", align : "left", hide : 0 }, 
					           { display : '业务导图', name : 'operationMapName', width : 140, minWidth : 60, type : "string", align : "left"}, 
					           { display : '图标', name : 'icon', width : 60, minWidth : 60, type : "string", align : "center", isAutoWidth : 0,
									render : function(item) {
										return DataUtil.getFunctionIcon(item.icon);
									}
					           }, { display : "排序号", name : "sequence", width : 60, minWidth : 60, type : "int", align : "left",
									render : function(item) {
										return "<input type='text' id='txtSequence_"
												+ item.id
												+ "' class='textbox' value='"
												+ item.sequence + "' />";
									}
								},
								{ display : '状态', name : 'status', width : 60, minWidth : 60, type : "int", align : "left",
									render : function(item) {
										return "<div class='"
												+ (item.status ? "Yes" : "No")
												+ "'/>";
								}
							}],
					dataAction : 'server',
					url : web_app.name
							+ "/permissionAction!queryFunctions.ajax",
					parms : {
						parentId : 0
					},
					usePager : false,
					sortName: "sequence",
					SortOrder: "asc",
					toolbar : toolbarOptions,
					width : '100%',
					height : '100%',
					heightDiff : -13,
					headerRowHeight : 25,
					rowHeight : 25,
					checkbox : true,
					fixedCellHeight : true,
					selectRowButtonOnly : true,
					onDblClickRow : function(data, rowindex, rowobj) {
						doShowUpdateDialog(data.id);
					}
				});

		UICtrl.setSearchAreaToggle(gridManager);
	}

	function loadFunctionTree() {
		$('#maintree').commonTree({
			loadTreesAction : "/permissionAction!queryFunctions.ajax",
			isLeaf : function(data) {
				if (!data.parentId){
					
					data.nodeIcon = web_app.name + "/themes/default/images/icons/function.gif";
				}else {
					data.nodeIcon=DataUtil.changeFunctionIcon(data.icon);
				}
				return data.hasChildren == 0;
			},
			onClick : function(data) {
				if (data && lastSelectedId != data.id) {
					reloadGrid3(data.id, data.name);
				}
			},
			IsShowMenu : false
		});
	}
});

function getId() {
	return parseInt($("#id").val() || 0);
}
//功能分类
var functionImgsDirList=[
	{name:'3D',code:'3d'},
	{name:'A',code:'a'},
	{name:'B',code:'b'},
	{name:'blue',code:'blue'},
	{name:'C',code:'c'},
	{name:'D',code:'d'},
	{name:'ginux',code:'ginux'},
	{name:'green',code:'green'},
	{name:'H',code:'h'},
	{name:'index',code:'index'},
	{name:'O',code:'o'},
	{name:'OA',code:'oa'},
	{name:'PM',code:'pm'},
	{name:'stat',code:'stat'},
	{name:'T',code:'t'}
];
// 选择功能点图标
function chooseImg() {
	var imgUrl = '/desktop/images/functions/';
	var nowChooseImg = $('#input_icopath').val(),display = nowChooseImg == ''? "none": "";
	var html = ['<div id="showImgMain">'];
	html.push('<div id="showFunctionImgDirs">');
	$.each(functionImgsDirList,function(i,o){
		html.push('<a href="#" class="aLink',(i==0?' right_selected':''),'" id="',o['code'],'">',o['name'],'</a>');
	});
	html.push('</div>');
	html.push('<div id="showFunctionImgs"></div>');
	html.push('<div id="showChooseOk">');
	html.push('<input type="hidden" value="',nowChooseImg,'" id="nowChooseValue">');
	html.push('<p><img src="' , web_app.name , nowChooseImg, '" style="display:' , display, '" width="68" height="68" id="nowChooseImg"/></p>');
	html.push('<p><input type="button" value="确 定" class="buttonGray" style="display:',display , '" id="nowChooseBut"/></p>');
	html.push('</div>');
	html.push('</div>');
	Public.dialog({
		title:'选择功能图片',
		content:html.join(''),
		width: 620,
		opacity:0.1,
		onClick:function($clicked){
			if ($clicked.is('img')) {
				var dirName=$('a.right_selected',$('#showFunctionImgDirs')).attr('id');
				var icon = $clicked.parent().attr('icon');
				$('#nowChooseImg').attr('src',web_app.name + imgUrl +dirName + '/'+ icon).show();
				$('#nowChooseBut').show();
				$('#nowChooseValue').val(imgUrl +dirName + '/'+ icon);
			} else if ($clicked.is('input')) {// 点击按钮
				$('#input_icopath').val($('#nowChooseValue').val());
				this.close();
			}else if ($clicked.is('a.aLink')) {// 类别选择
				var id=$clicked.attr('id');
				$('a.right_selected',$('#showFunctionImgDirs')).removeClass('right_selected');
				$clicked.addClass('right_selected');
				$('#showFunctionImgs').scrollReLoad({params:{dirName:id}});
			}
		}
	});
	setTimeout(function() {
		$('#showFunctionImgs').scrollLoad({
			url : web_app.name+ '/permissionAction!getFunctionImgList.ajax',
			itemClass : 'functionImg',
			params:{dirName:functionImgsDirList[0]['code']},
			size : 20,
			scrolloffset : 70,
			onLoadItem : function(obj) {
				var dirName=$('a.right_selected',$('#showFunctionImgDirs')).attr('id');
				var imgHtml = ['<div class="functionImg" icon="', obj,'">'];
				imgHtml.push('<img src="' , web_app.name, imgUrl,dirName,'/' , obj,'"  width="64" height="64"/>');
				imgHtml.push('</div>');
				return imgHtml.join('');
			}
		});
	},0);
}

function reloadGrid() {
   $("#maintree").commonTree('refresh', lastSelectedId);
	var params = $("#queryMainForm").formToJSON();
	UICtrl.gridSearch(gridManager, params);
}

function reloadGrid2() {
	var params = $("#queryMainForm").formToJSON();
	UICtrl.gridSearch(gridManager, params);
}

function reloadGrid3(id, name) {
	$('.l-layout-center .l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + name+ "]</font>子功能列表");
	lastSelectedId = id;
	var params = $("#queryMainForm").formToJSON();
	params.parentId = id;
	UICtrl.gridSearch(gridManager, params);
}

function showInsertDialog() {
	if (!$('#maintree').commonTree('getSelectedId')) {
		Public.tip('请选择左侧父功能!');
		return;
	}
	UICtrl.showAjaxDialog({
				title : "添加功能",
				param : {
					parentId : $('#maintree').commonTree('getSelectedId')
				},
				width : 400,
				url : web_app.name
						+ '/permissionAction!showFunctionDetail.load',
				ok : doSaveFunction,
				close : onDialogCloseHandler,
				init:initDetail
			});
}

function doShowUpdateDialog(id) {
	UICtrl.showAjaxDialog({
				url : web_app.name + '/permissionAction!loadFunction.load',
				param : {
					id : id
				},
				title: "修改功能",
				width : 400,
				ok : doSaveFunction,
				close : onDialogCloseHandler,
				init:initDetail
			});
}

function initDetail(){
	$('#operationMapName').treebox({
		name:'sysOperationMap',
		treeLeafOnly:true,
		back:{text:'#operationMapName',value:'#operationMapId'},
		beforeChange:function(node){
			var type=node.nodeType;
			if(type=='f') return false;
			return true;
		}
	});
}
function showUpdateDialog() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	doShowUpdateDialog(row.id);
}

function doSaveFunction() {
	var _self = this;
	var id = getId();
	$('#submitForm').ajaxSubmit({
		url : web_app.name
				+ (id
						? '/permissionAction!updateFunction.ajax'
						: '/permissionAction!insertFunction.ajax'),
		success : function() {
			refreshFlag = true;
			_self.close();
		}
	});
}

function deleteFunction() {
	var action = "permissionAction!deleteFunction.ajax";
	DataUtil.del({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid
			});
}

function updateFunctionSequence() {
	var action = "permissionAction!updateFunctionSequence.ajax";
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid
			});
}

/**
 * 移动
 */
var ids = null;

function moveFunction() {
	ids = DataUtil.getSelectedIds({
				gridManager : gridManager
			});
	if (!ids)
		return;
	if (!selectFunctionDialog) {
		selectFunctionDialog = UICtrl.showDialog({
			title : "移动到...",
			width : 350,
			content : '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="movetree"></ul></div>',
			init : function() {
				$('#movetree').commonTree({
							loadTreesAction : "permissionAction!queryFunctions.ajax",
							IsShowMenu : false
						});
			},
			ok : doMoveFunction,
			close : function() {
				this.hide();
				return false;
			}
		});
	} else {
		$('#movetree').commonTree('refresh');
		selectFunctionDialog.show().zindex();
	}
}

function doMoveFunction() {
	var moveToId = $('#movetree').commonTree('getSelectedId');
	if (!moveToId) {
		Public.tip('请选择移动到的节点！');
		return false;
	}
	var params = {};
	params.parentId = moveToId;
	params.ids = $.toJSON(ids);
	Public.ajax(web_app.name + "/permissionAction!moveFunction.ajax", params, function(data) {
		ids = null;
		reloadGrid();
		selectFunctionDialog.hide(); });
}

function onDialogCloseHandler() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}

function addPermissionField(){
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	UICtrl.showFrameDialog({
		url :web_app.name + "/permissionFieldAction!showAddPermissionFieldDialog.do",
		param : {
			functionId : row.id
		},
		title : "编辑字段权限",
		width : 730,
		height : 350,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});
}
function bindAddPermissionFieldBtnEvent(){
	$('#addPermissionFieldBtn').comboDialog({type:'sys',name:'permissionField',width:400,lock:false,checkbox:true,dataIndex:'fieldId'});
}
function showAddPermissionField(gm){
	$('#addPermissionFieldBtn').comboDialog({
		onChoose:function(){
		    var rows=this.getSelectedRows();
		    var addRows = [];
		    $.each(rows, function(i, o){
		    	addRows.push(o);
		    });
		    gm.addRows(addRows);
		    return true;
	    }
	}).trigger('click');
}

function addOftenUse(){
	DataUtil.updateById({
		action : '/permissionAction!addOftenUse.ajax',
		gridManager : gridManager,
		onSuccess : reloadGrid
	});
}
var oftenUseGridManager= null;
function queryOftenUse(){
	UICtrl.showDialog({
		title : "常用功能维护",
		width : 650,
		content : '<div id="oftenUseGrid"></div>',
		init : function() {
			var toolbarparam = {
				deleteHandler : function(){
					var action = "permissionAction!deleteOftenUse.ajax";
					DataUtil.del({
								action : action,
								idFieldName:'oftenUseFunctionId',
								gridManager : oftenUseGridManager,
								onSuccess : function(){
									oftenUseGridManager.loadData();
								}
							});
				},
				saveSortIDHandler : function(){
					var action = "permissionAction!updateOftenUseSequence.ajax";
					DataUtil.updateSequence({
								action : action,
								idFieldName:'oftenUseFunctionId',
								sequenceFieldName:'oftenUseSequence',
								gridManager : oftenUseGridManager,
								onSuccess : function(){
									oftenUseGridManager.loadData();
								}
							});
				}
			};
			var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);
			oftenUseGridManager = UICtrl.grid("#oftenUseGrid", {
							columns : [
							           { display : '名称', name : 'name', width : 100, minWidth : 60, type : "string", align : "left" }, 
							           { display : '描述', name : 'description', width : 100, minWidth : 60, type : "string", align : "left" },
							           { display : '全名称', name : 'fullName', width : 250, minWidth : 60, type : "string", align : "left" },
							           { display : "排序号", name : "oftenUseSequence", width : 60, minWidth : 60, type : "int", align : "left",
											render : function(item) {
												return "<input type='text' id='txtSequence_"
														+ item.oftenUseFunctionId
														+ "' class='textbox' value='"
														+ item.oftenUseSequence + "' />";
											}
										},
										{ display : '状态', name : 'status', width : 60, minWidth : 60, type : "int", align : "left",
											render : function(item) {
												return "<div class='"
														+ (item.status ? "Yes" : "No")
														+ "'/>";
										}
							}],
							dataAction : 'server',
							url : web_app.name+ "/permissionAction!slicedQueryOftenUse.ajax",
							sortName: "oftenUseSequence",
							SortOrder: "asc",
							toolbar : toolbarOptions,
							width : '630px',
							height : '400px',
							heightDiff : -13,
							headerRowHeight : 25,
							rowHeight : 25,
							checkbox : true,
							fixedCellHeight : true,
							selectRowButtonOnly : true
						});
		},
		ok :false
	});
}