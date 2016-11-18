var lastSelectedId=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 250,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'oaDocumentAction!loadTrees.ajax',
		parentId :'0',
		idFieldName: 'documentLibraryId',
        textFieldName: "documentName",
		IsShowMenu:false,
		changeNodeIcon:function(data){
			var url=web_app.name + "/themes/default/images/org/";
			var kind=data.documentType;
			var hasChildren=data.hasChildren;
			var status=data.status;
			url += kind=='DIR'?(hasChildren>0?'org':'dept'):'dataRole';
			url += status>0?'.gif':'-disable.gif';
			data['nodeIcon']=url;
		},
		onClick : onFolderTreeNodeClick
	});
	//初始化页签
	initTab();
	//文件上传按钮
	initUploadButton();
}

function initUploadButton(){
	//上传按钮
	$('#updateFileButton').uploadButton({
		afterUpload:function(data){
			reLoadChildrenListGrid();
		},
		backurl:'oaDocumentAction!saveDocumentFile.ajax',
		param:function(){
			var documentLibraryId=getDocumentLibraryId();
			if(documentLibraryId==''){
				Public.tip('请选择要操作的节点!');
				return false;
			}
			var documentType=$('#documentType').val();
			if(documentType!='DIR'){
				Public.tip('请选择目录节点!');
				return false;
			}
			return {bizCode:'document',bizId:documentLibraryId};
		}
	});
	//替换文件按钮
	$('#replaceFileButton').uploadButton({
		afterUpload:function(data){
			$('#fileId').val(data['id']);
			$.each(data,function(p,v){$('#'+p,$('#fileInfoDiv')).val(v);});
		},
		backurl:'oaDocumentAction!saveReplaceDocumentFile.ajax',
		param:function(){
			var documentLibraryId=getDocumentLibraryId();
			if(documentLibraryId==''){
				Public.tip('请选择要操作的节点!');
				return false;
			}
			var documentType=$('#documentType').val();
			if(documentType!='FILE'){
				return false;
			}
			return {bizCode:'document',bizId:documentLibraryId};
		}
	});
	//文件历史版本
	$('#documentFileHistory').comboDialog({type:'sys',name:'sysAttachment',
		title:'文件历史版本',width:600,
		onShow:function(){
			var documentLibraryId=getDocumentLibraryId();
			if(documentLibraryId==''){return false; }
		},
		getParam:function(){
			var documentLibraryId=getDocumentLibraryId();
			return {bizId:documentLibraryId,bizCode:'DOCUMENTREPLACE'};
		},
		onChoose:function(){
			var row=this.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return false; }
			AttachmentUtil.onOpenViewFile(row.id);
			return false;
	    },
	    dialogOptions:{
	    	okVal:'预览',
	    	button:[
				{
					 name: '删除',
					 callback: function(){
						 var row=this['gridManager'].getSelectedRow();
						 if (!row) {Public.tip('请选择数据！'); return false; }
						 var id=row.id;
						 var confirmFlag = window.confirm("此操作不能回退，确定要删除该文件吗？");
						if(confirmFlag){
							var _self=this;
							Public.ajax(web_app.name + '/attachmentAction!doDelete.ajax', {id:id,isCheck:false}, function(){
								_self['gridManager'].loadData();
							});
						}
					    return false;
					  },
					  focus: true
				 },
				 {
					 name: '下载',
				     callback: function(){
				    	 var row=this['gridManager'].getSelectedRow();
						 if (!row) {Public.tip('请选择数据！'); return false; }
						 AttachmentUtil.downFileByAttachmentId(row.id);
						 return false;
				      },
				     focus: true
				 }
	    	]
	   }
   });
}

function onFolderTreeNodeClick(data,folderId) {
	if(data){
		var documentLibraryId=data.documentLibraryId;
		if (lastSelectedId != documentLibraryId) {
			loadDocumentLibrary(documentLibraryId,true);
			changeTitle(data.fullPathName);
			$('#baseInfo').trigger('click');
			$('#extendInfoForm').formClean();
			$('#fileInfoForm').formClean();
		}
	}else{
		clearData('');
	}
}

//清除页面数据
function clearData(parentId){
	$('#submitForm').formClean();
	$('#extendInfoForm').formClean();
	$('#fileInfoForm').formClean();
	$('#parentId').val(parentId);
	//清除表格数据
	if(childrenListGridManager){
		childrenListGridManager._clearGrid();
	}
	if(documentPostilGridManager){
		documentPostilGridManager._clearGrid();
	}
	$.each(authGridManager,function(p,o){
		if(o){
			o._clearGrid();
		}
	});
}

function changeTitle(title){
	var html=[];
	if(title){
		html.push('<font style="color:Tomato;font-size:13px;">[',title,']</font>');
	}
	html.push('详细信息');
	$('.l-layout-center .l-layout-header').html(html.join(''));
}
//加载明细
function loadDocumentLibrary(documentLibraryId,flag){
	Public.ajax(web_app.name + '/oaDocumentAction!loadDocumentLibrary.ajax', {documentLibraryId:documentLibraryId}, function(data){
		$.each(data,function(p,v){$('#'+p,$('#baseInfoDiv')).val(v);});
		$('#submitForm').find(':checkbox').each(function(){
			var name=$(this).attr('name');
			if(data[name]==1){
				$(this).attr('checked',true);
			}else{
				$(this).removeAttr('checked');
			}
		});
		$('#statusTextView').val(data['status']==1?'启用':'停用');
		if(flag){
			reloadGrid(documentLibraryId);
		}
		lastSelectedId=documentLibraryId;
	});
}

var childrenListGridManager = null;
var documentPostilGridManager = null;
var documentLogGridManager = null;
var authGridManager={};
function initTab(){
	initializeChildrenListGrid();
	childrenListGridManager._onResize.ligerDefer(childrenListGridManager, 50);
	$('#documentLibraryTab').tab().on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		var _gridManager=null;
		if($clicked.is('li')){
			var id=$clicked.attr('id');
			if(id=='childrenList'){
				_gridManager=childrenListGridManager;
			}else if(id=='documentPostil'){//评注
				if(!documentPostilGridManager){
					initializeDocumentPostilGrid();
				}
				_gridManager=documentPostilGridManager;
			}else if(id=='documentLog'){//日志
				if(!documentLogGridManager){
					initializeDocumentLogGrid();
				}
				_gridManager=documentLogGridManager;
			}else if($clicked.hasClass('auth')){
				var documentLibraryId=getDocumentLibraryId();
				_gridManager=authTabClickInit(id,documentLibraryId);
			}
			if(_gridManager){
				_gridManager._onResize.ligerDefer(_gridManager, 50);
			}
		}
	});
	
	$('#documentInfoTab').tab().on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('li')){
			var id=$clicked.attr('id');
			if(id=='extendInfo'){
				loadUpdateDocumentExtend();
			}else if(id=='fileInfo'){
				loadDocumentFileInfo();
			}
		}
	});
}

function loadUpdateDocumentExtend(){
	var documentLibraryId=getDocumentLibraryId();
	var extendInfoLibraryId=$('#extendInfoLibraryId').val();
	if(documentLibraryId==extendInfoLibraryId) return;
	Public.ajax(web_app.name + '/oaDocumentAction!loadUpdateDocumentExtend.ajax', {documentLibraryId:documentLibraryId}, function(data){
		$('#extendInfoLibraryId').val(documentLibraryId);
		$.each(data,function(p,v){$('#'+p,$('#extendInfoDiv')).val(v);});
	});
}

function getDocumentExtend(){
	var param={};
	var documentLibraryId=getDocumentLibraryId();
	var extendInfoLibraryId=$('#extendInfoLibraryId').val();
	if(documentLibraryId!=extendInfoLibraryId) return {};
	param=$('#extendInfoForm').formToJSON();
	param['isDocumentExtend']='true';
	param['documentLibraryId']=documentLibraryId;
	return param;
}

function loadDocumentFileInfo(){
	$('#replaceFileButton').hide();
	$('#replaceBigFileButton').hide();
	var fileId=$('#fileId').val();
	if(fileId=='') return;
	var documentLibraryId=getDocumentLibraryId();
	Public.ajax(web_app.name + '/oaDocumentAction!loadFileInfo.ajax', {fileId:fileId,documentLibraryId:documentLibraryId}, function(data){
		$('#fileId').val(data['id']);
		$.each(data,function(p,v){$('#'+p,$('#fileInfoDiv')).val(v);});
		var replaceFlag=data['replaceFlag'];
		if(replaceFlag=='ok'){//允许替换操作
			$('#replaceFileButton').show();
			$('#replaceBigFileButton').show();
		}else{
			$('#replaceFileButton').hide();
			$('#replaceBigFileButton').hide();
		}
	});
	
}

//初始化表格
function initializeChildrenListGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		deleteHandler: function(){
			DataUtil.del({action:'oaDocumentAction!deleteDocumentLibraryByList.ajax',
				param:{isCheck:false},
				gridManager:childrenListGridManager,idFieldName:'documentLibraryId',
				onSuccess:function(){
					reLoadChildrenListGrid();
				}
			});
		},
		enableHandler: function(){
			disableHandler(1);
		},
		disableHandler: function(){
			disableHandler(-1);
		},
		saveSortIDHandler: function(){
			var action = "oaDocumentAction!updateDocumentLibrarySequence.ajax";
			DataUtil.updateSequence({action: action,gridManager: childrenListGridManager,idFieldName:'documentLibraryId', onSuccess: function(){
				reLoadChildrenListGrid();
			}});
		},
		moveHandler:function(){
			moveOrCopyHandler('move');
		},
		saveCopyHandler:{id:'saveCopy',text:'复制粘贴',img:'page_bookmark.gif',click:function(){moveOrCopyHandler('copy');}}
	});
	childrenListGridManager = UICtrl.grid('#childrenListGrid', {
		columns: [	   
		{ display: "序号", name: "sequence", width: 80, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'documentLibraryId');
			}
		},
		{ display: "名称", name: "documentName", width: '140', minWidth: 60, type: "string", align: "left"},
		{ display: "类型", name: "documentTypeTextView", width: '60', minWidth: 40, type: "string", align: "left"},
		{ display: "路径", name: "fullPathName", width: '400', minWidth: 60, type: "string", align: "left"},
		{ display: "继承管理权限", name: "isManagePermissionsTextView", width: '60', minWidth: 60, type: "string", align: "left"},
		{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/oaDocumentAction!slicedQueryDocumentLibrary.ajax',
		parms :{parentId:getDocumentLibraryId()},
		width : '99.5%',
		height : '100%',
		heightDiff : -55,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		checkbox: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return canEidt();
		}
	});
	UICtrl.createGridQueryBtn('#childrenListGrid','div.l-panel-topbar', function (value) {
        UICtrl.gridSearch(childrenListGridManager, { documentName: encodeURI(value) });
    });
}

function reLoadChildrenListGrid(isReloadParent){
	childrenListGridManager.loadData();
	if(isReloadParent){
		reloadTree($('#parentId').val(),2);
	}else{
		reloadTree(getDocumentLibraryId(),2);
	}
}

//禁用
function disableHandler(status){
	var message=status==1?'确实要启用选中数据吗?':'确实要禁用选中数据吗?';
	DataUtil.updateById({ action: 'oaDocumentAction!updateDocumentLibraryStatus.ajax',
		gridManager: childrenListGridManager,idFieldName:'documentLibraryId',param:{status:status},
		message: message,
		onSuccess:function(){
			reLoadChildrenListGrid();
		}
	});		
}

function moveOrCopyHandler(kind){
	var rows =childrenListGridManager.getSelectedRows();
	if (!rows || rows.length < 1) {
		Public.tip('请选择数据！');
		return;
	}
	var title=kind=='move'?'移动到......':'复制到......';
	UICtrl.showDialog({title:title,width:300,
		content:'<div style="overflow-x: hidden; overflow-y: auto; width:280px;height:250px;"><ul id="dialogMoveTree"></ul></div>',
		init:function(){
			$('#dialogMoveTree').commonTree({
				loadTreesAction:'oaDocumentAction!loadTrees.ajax',
				parentId :'0',
				idFieldName: 'documentLibraryId',
		        textFieldName: "documentName",
				IsShowMenu:false,
				getParam:function(){
					//return {documenType:'DIR',documentLibraryId:getDocumentLibraryId()};
					return {documentType:'DIR'};
				}
			});
		},
		ok:function(){
			var parentId=$('#dialogMoveTree').commonTree('getSelectedId');
			if(!parentId){
				Public.tip('请选择树节点！');
				return false;
			}
			var action='';
			if(kind=='move'){
				action='oaDocumentAction!updateDocumentLibraryFolder.ajax';
			}else if(kind=='copy'){
				action='oaDocumentAction!updateDocumentLibraryCopy.ajax';
			}else{
				return false;
			}
			var ids = DataUtil.getSelectedIds({gridManager:childrenListGridManager,idFieldName:'documentLibraryId'});
			if(!ids) return;
			Public.ajax(web_app.name + '/' + action, {parentId:parentId,ids:ids.join(',')}, function(data) {
				childrenListGridManager.loadData();
				reloadTree(0,2);
			});
			return true;
		}
	});
}


function initializeDocumentPostilGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			if(!canEidt()){
				Public.tip('请选择要操作的节点!');
				return false;
			}
			UICtrl.showAjaxDialog({
				url: web_app.name + '/oaDocumentAction!showInsertDocumentPostil.load',
				width:550,
				title:'添加评注',
				ok: function(){
					var documentLibraryId=getDocumentLibraryId(),_self=this;
					$('#casePostilForm').ajaxSubmit({url: web_app.name + '/oaDocumentAction!saveDocumentPostil.ajax',
						param:{documentLibraryId:documentLibraryId},
						success : function(data) {
							_self.close();
							documentPostilGridManager.loadData();
						}
					});
				}
			});
		},
		updateHandler: function(){
			updatePostil();
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'oaDocumentAction!deleteDocumentPostil.ajax',
				gridManager:documentPostilGridManager,idFieldName:'documentPostilId',
				onSuccess:function(){
					documentPostilGridManager.loadData();
				}
			});
		}
	});
	documentPostilGridManager = UICtrl.grid('#documentPostilGrid', {
		columns: [	   
		{ display: "创建人", name: "createByName", width: '100', minWidth: 60, type: "string", align: "left"},
		{ display: "创建时间", name: "createDate", width: '130', minWidth: 40, type: "dateTime", align: "left"},
		{ display: "内容", name: "content", width: '600', minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/oaDocumentAction!slicedQueryDocumentPostil.ajax',
		parms :{documentLibraryId:getDocumentLibraryId()},
		width : '99.5%',
		height : '100%',
		heightDiff : -55,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'createDate',
		sortOrder:'desc',
		checkbox: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return canEidt();
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			updatePostil(data.documentPostilId);
		}
	});
	UICtrl.createGridQueryBtn('#documentPostilGrid','div.l-panel-topbar', function (value) {
        UICtrl.gridSearch(documentPostilGridManager, { keyValue: encodeURI(value) });
    });
}

function updatePostil(documentPostilId){
	if(!documentPostilId){
		var row = documentPostilGridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		documentPostilId=row.documentPostilId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/oaDocumentAction!showUpdateDocumentPostil.load',
		param:{documentPostilId:documentPostilId},
		width:550,title:'编辑评注',
		ok:function(){
			var _self=this;
			$('#casePostilForm').ajaxSubmit({url: web_app.name + '/oaDocumentAction!saveDocumentPostil.ajax',
				success : function(data) {
					_self.close();
					documentPostilGridManager.loadData();
				}
			});
		}
	});
}

function canEidt(){
	var documentLibraryId=getDocumentLibraryId();
	return !(documentLibraryId=='');
}

function getDocumentLibraryId(){
	var documentLibraryId=$('#documentLibraryId').val();
	return documentLibraryId;
}
//刷新树
function reloadTree(id,type) {
	if(id=='0'){
		$("#maintree").commonTree('refresh');
	}else{
		$("#maintree").commonTree('refresh',id,type);
	}
}
//刷新表格
function reloadGrid(documentLibraryId) {
	if(documentLibraryId){
		if(childrenListGridManager){
			UICtrl.gridSearch(childrenListGridManager,{parentId:documentLibraryId});
		}
		if(documentPostilGridManager){
			UICtrl.gridSearch(documentPostilGridManager,{documentLibraryId:documentLibraryId});
		}
		if(documentLogGridManager){
			UICtrl.gridSearch(documentLogGridManager,{documentLibraryId:documentLibraryId});
		}
		$.each(authGridManager,function(p,o){
			if(o){
				UICtrl.gridSearch(o,{documentLibraryId:documentLibraryId});
			}
		});
	}else{
		if(childrenListGridManager){
			childrenListGridManager.loadData();
		}
		if(documentPostilGridManager){
			documentPostilGridManager.loadData();
		}
		if(documentLogGridManager){
			documentLogGridManager.loadData();
		}
		$.each(authGridManager,function(p,o){
			if(o){
				o.loadData();
			}
		});
	}
}

//启用or停用
function enableOrDisable(status){
	if(!canEidt()){
		Public.tip('请选择要操作的节点!');
		return false;
	}
	var documentLibraryId=getDocumentLibraryId();
	var message=status==1?'确实要启用选中数据吗?':'确实要禁用选中数据吗?';
	UICtrl.confirm(message,function(){
		Public.ajax(web_app.name + '/oaDocumentAction!updateDocumentLibraryStatus.ajax', {ids:$.toJSON([documentLibraryId]),status:status}, function(){
			reloadTree($('#parentId').val(),1);
			$('#statusTextView').val(status==1?'启用':'停用');
		});
	});
}

function initializeDocumentLogGrid(){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		query:{id:'query',text:'查询',img:'page_find.gif',click:function(){
			if(!canEidt()){
				Public.tip('请选择要操作的节点!');
				return false;
			}
			UICtrl.showAjaxDialog({
				url: web_app.name + '/oaDocumentAction!showQueryLogPage.load',
				title:"日志查询",width:600,
				okVal:'查询',
				ok:function(){
					var param=$('#queryDocumentLogForm').formToJSON();
					UICtrl.gridSearch(documentLogGridManager, param);
					return true;
				}
			});
		}},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'oaDocumentAction!deleteDocumentLog.ajax',
				gridManager:documentLogGridManager,idFieldName:'documentLogId',
				onSuccess:function(){
					documentLogGridManager.loadData();
				}
			});
		}
	});
	documentLogGridManager = UICtrl.grid('#documentLogGrid', {
		columns: [	   
		{ display: "操作人", name: "createByName", width: '100', minWidth: 60, type: "string", align: "left"},
		{ display: "创建时间", name: "createDate", width: '130', minWidth: 40, type: "dateTime", align: "left"},
		{ display: "操作类型", name: "operationTypeTextView", width: '100', minWidth: 60, type: "string", align: "left"},
		{ display: "位置", name: "fullPathName", width: '400', minWidth: 60, type: "string", align: "left"},
		{ display: "内容", name: "operationRemark", width: '400', minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/oaDocumentAction!slicedQueryDocumentLog.ajax',
		parms :{documentLibraryId:getDocumentLibraryId()},
		width : '99.5%',
		height : '100%',
		heightDiff : -55,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'createDate',
		sortOrder:'desc',
		checkbox: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return canEidt();
		}
	});
}

//编辑保存
function saveDocumentLibrary(){
	var parentId=$('#parentId').val();
	if(parentId==''||parentId==0){
		Public.tip('请选择父级节点!');
		return false;
	}
	var param=getDocumentExtend();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/oaDocumentAction!saveDocumentLibrary.ajax',
		param:param,
		success : function(id) {
			var documentLibraryId=$('#documentLibraryId'),parent=$('#parentId');
			var type=documentLibraryId.val()==''?2:1;
			if(parent.val()==''){
				parent.val('0');
			}
			documentLibraryId.val(id);
			loadDocumentLibrary(id);
			reloadTree(parent.val(),type);
		}
	});
}

//删除按钮
function deleteDocument(documentLibraryId){
	if(!canEidt()){
		Public.tip('请选择要删除的节点!');
		return false;
	}
	var documentLibraryId=getDocumentLibraryId();
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/oaDocumentAction!deleteDocumentLibrary.ajax', {documentLibraryId:documentLibraryId}, function(){
			reloadTree($('#parentId').val(),1);
			clearData('0');
		});
	});
}

function add(no){
	var node=$('#maintree').commonTree('getSelected');
	var parentId='0';
	var fullPathName='';
	if(!node){//没有选中节点表示新增根节点
		if(no==1){
			Public.tip('请选择要操作的节点!');
			return false;
		}
	}else{//有选中节点
		fullPathName=node.fullPathName;
	    if(no==0){//新增选中节点的同级节点
		   parentId=node.parentId;
		   fullPathName+='----新增同级';
	    }else{//新增子级
		   parentId=node.documentLibraryId;
		   var kind=node.documentType;
		   if(kind!='DIR'){
			   Public.tip('只能选择目录新增子级!');
			   return false;
		   }
		   fullPathName+='----新增子级';
	    }
	}
	clearData(parentId);
	//默认全部继承权限
	$('#submitForm').find(':checkbox').attr('checked',true);
	changeTitle(fullPathName);
}

function closeWindow(){
	UICtrl.closeCurrentTab();
}

function doViewFile(){
	var fileId=$('#fileId').val();
	if(fileId=='') return;
	AttachmentUtil.onOpenViewFile(fileId);
}

function downloadFile(){
	var fileId=$('#fileId').val();
	if(fileId=='') return;
	AttachmentUtil.downFileByAttachmentId(fileId);
}

function openFTPUpLoadPage(){
	var documentType=$('#documentType').val();
	if(documentType!='DIR'){
		Public.tip('请选择目录节点!');
		return false;
	}
	var documentLibraryId=getDocumentLibraryId();
	var param= {bizCode:'document',bizId:documentLibraryId};
	param['queryFileUrl']='oaDocumentAction!queryFileByLibraryId.ajax';
	param['saveFileFileUrl']='oaDocumentAction!saveFTPFileList.ajax';
	param['deleteFileUrl']='oaDocumentAction!deleteDocumentLibraryByList.ajax';
	AttachmentUtil.openFTPUpLoadPage(param);
	//ftp上传回调
	window['callBackFTPApplet']=function(){
		reLoadChildrenListGrid();
	};
}

//文件替换
function replaceBigFileClick(){
	var documentLibraryId=getDocumentLibraryId();
	var param= {bizCode:'document',bizId:documentLibraryId,isMore:0,canDelete:false};
	param['saveFileFileUrl']='oaDocumentAction!saveFTPReplaceFile.ajax';
	AttachmentUtil.openFTPUpLoadPage(param);
	//ftp上传回调
	window['callBackFTPApplet']=function(){
		loadDocumentFileInfo();
	};
}

function showDocumentPersonPowerByKindAuth(){
	var documentLibraryId=getDocumentLibraryId();
	if(documentLibraryId==''){
		return;
	}
	var width=getDefaultDialogWidth()-100;
	UICtrl.showAjaxDialog({
		url: web_app.name + '/oaDocumentAction!showSetDocumentAuthDialog.load',
		param:{documentLibraryId:documentLibraryId,isViewAuth:false,width:width-20},title:'权限查询',width:width,
		init:function(doc){
			authGridManagerView={};//清空以前数据
			$('#setDocumentAuthTab').tab().on('click',function(e){
				var $clicked = $(e.target || e.srcElement);
				var _gridManager=null;
				if($clicked.is('li')){
					var id=$clicked.attr('id');
					_gridManager=authTabClickDocumentPersonPower(id,documentLibraryId,'400');
					if(_gridManager){
						_gridManager._onResize.ligerDefer(_gridManager, 50);
					}
				}
			});
			var id=$($('#setDocumentAuthTab').find('li').get(0)).attr('id');
			authTabClickDocumentPersonPower(id,documentLibraryId,'400');
		},
		ok:false
	});
}