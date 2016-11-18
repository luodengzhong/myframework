var gridManager = null, refreshFlag = false,detalGridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.initDefaulLayout();

	$('#maintree').commonTree({
		kindId : CommonTreeKind.AttachmentConfig,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.AttachmentConfig){
		parentId="";
		html.push('附件配置列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>附件配置列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{folderId:parentId});
	}
}

function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler: addHandler,
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "编码", name: "bizCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "名称", name: "bizName", width: 150, minWidth: 60, type: "string", align: "left" },				   
		{ display: "控制删除权限", name: "isDelAuthority", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return item.isDelAuthority==1?'是':'否'; 
			} 
		},
		{ display: "备注", name: "remark", width: 300, minWidth: 60, type: "string", align: "left" }	
		],
		dataAction : 'server',
		url: web_app.name+'/attachmentAction!slicedQueryAttachmentConfig.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'bizCode',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		checkbox: true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data);
		}
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

//添加按钮 
function addHandler() {
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/attachmentAction!showInsertAttachmentConfig.load',
		title: "添加附件配置",
		ok: saveAttachmentConfig, 
		close: dialogClose,
		width:750, 
		init:initDialog
	});
}

//编辑按钮
function updateHandler(data){
	if(!data){
		data = gridManager.getSelectedRow();
		if (!data) {Public.tip('请选择数据！'); return; }
	}
	var attachmentConfigId=data.attachmentConfigId;
	UICtrl.showAjaxDialog({
		url: web_app.name + '/attachmentAction!showUpdateAttachmentConfig.load', 
		title: "修改附件配置",
		param:{attachmentConfigId:attachmentConfigId},width:750,
		ok: saveAttachmentConfig, close: dialogClose,init:initDialog
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'attachmentAction!deleteAttachmentConfig.ajax',
		gridManager:gridManager,idFieldName:'attachmentConfigId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//保存
function saveAttachmentConfig() {
	var detailData=DataUtil.getGridData({gridManager:detalGridManager});
	if(!detailData) return false;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/attachmentAction!saveAttachmentConfig.ajax',
		param:{folderId:$('#treeParentId').val(),detailData:encodeURI($.toJSON(detailData))},
		success : function(id) {
			$('#attachmentConfigId').val(id);
			detalGridManager.options.parms['attachmentConfigId']=id;
			detalGridManager.loadData();
			refreshFlag = true;
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动附件配置',kindId:CommonTreeKind.AttachmentConfig,
		save:function(parentId){
			DataUtil.updateById({action:'attachmentAction!moveAttachmentConfig.ajax',
				gridManager:gridManager,idFieldName:'attachmentConfigId',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}

function initDialog(doc){
	var attachmentConfigId=$('#attachmentConfigId').length>0?$('#attachmentConfigId').val():'';
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler: function(){
			//新增时传入detailId -(new Date().getTime())临时主键
			UICtrl.addGridRow(detalGridManager);
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'attachmentAction!deleteAttachmentConfigDetail.ajax',
				gridManager:detalGridManager,idFieldName:'configDetailId',
				onSuccess:function(){
					detalGridManager.loadData();
				}
			});
		}
	});
	var param={attachmentConfigId:attachmentConfigId};
	param[gridManager.options['pagesizeParmName']]=1000;
	detalGridManager=UICtrl.grid('#attachmentConfigDetailGrid', {
		 columns: [
		        { display: "附件名称", name: "attachmentName", width: 150, minWidth: 60, type: "string", align: "left",
		        	editor: { type: 'text',required:true,maxLength:16}
		        },	
		        { display: "附件编码", name: "attachmentCode", width: 100, minWidth: 60, type: "string", align: "left",
		        	editor: { type: 'text',required:true,maxLength:16}
		        },
		        { display: "允许多个", name: "isMore", width:60, minWidth: 60, type: "string", align: "left",
		        	editor: { type:'combobox',data:{'1':'是','0':'否'}},
		        	render: function (item) { 
						return item.isMore==1?'是':'否'; 
					}
				},
				{ display: "列数", name: "colspan", width: 50, minWidth: 60, type: "string", align: "left",
		        	editor: { type:'spinner',min:1,max:9}
				},
		        { display: "允许文件类型", name: "fileKind", width: 200, minWidth: 60, type: "string", align: "left",
		        	editor: { type:'text',maxLength:128}
				},
		        { display: "排序号", name: "sequence", width: 64, minWidth: 60, type: "string", align: "left",
		        	editor: { type:'spinner',min:1,max:100,mask:'nnn'}
				}
		],
		dataAction : 'server',
		url: web_app.name+'/attachmentAction!slicedQueryAttachmentConfigDetail.ajax',
		parms:param,
		width : 715,
		sortName:'sequence',
		sortOrder:'asc',
		height : '100%',
		heightDiff : -60,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		usePager: false,
		checkbox: true,
		fixedCellHeight: true,
		selectRowButtonOnly: true,
		autoAddRow:{isMore:0,colspan:1},
		onLoadData :function(){
			return !($('#attachmentConfigId').val()=='');
		}
	});
}