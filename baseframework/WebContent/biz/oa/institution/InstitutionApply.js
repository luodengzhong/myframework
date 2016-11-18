var treeManager,menu,menui,menup,menuc,actionNode,gridManager = null,editFlg=false,refreshFlag=false,reviseOldStatusList = {1: '修改', 2: '删除'},
reviseStatusList = {1: '修改', 2: '删除',3:'新增'},selectFunctionDialog=null,
institutionReviseTmpId = '';
var InstitutionReviseDialog=null;
var fileListGrid = null;
var toolGridManager = null,yesOrNo = {0:'否', 1:'是'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	UICtrl.autoGroupAreaToggle();
	//表格权限配置， 制度树选择权限
	if(Public.isReadOnly){//只读模式下修改输入框为只读
		editFlg = false;
		$("#reviseAdviceCollect").attr("disabled",true);
	}else if(UICtrl.isApplyProcUnit()||isApply()){//申请环节可编辑
		$("#reviseAdviceCollect").attr("disabled",true);
		$('#instReviseBody').show();
		editFlg = true;
	}
	else if(isCheckProcUnit()){//调整修订环节可编辑
		//修订说明文件上传
		$('#instReviseBody').show();
		setTimeout(function() {
			$('#instReviseBody').fileList('enable');
		}, 0);
		editFlg = true;
	}
	else{		
		$("#reviseAdviceCollect").attr("disabled",true);
		editFlg = false;
	}
	if(!editFlg){
		$("#textBody").show();
		$("#fileListGrid").show();
		$('#instReviseBody').hide();
		$('#instReviseBody').filePreview({appendTo:
			$('#editDetail'),isReadOnly:true,canEdit:false});//预览模式
	}
	if(getId()!=""){
		initializeUI();
	}
	var fileTable = $('#instReviseBody').fileList();//正文附件
	fileTable.find('table').css({borderTopWidth:0});
	initFileListGrid();
	setEnableGridEdit();
	menu = $.ligerMenu({ top: 100, left: 100, width: 120,items:
	    [
	    { text: '新增文件夹', click: appendNode, icon: 'add'},
	    { text: '修改文件夹', click: editNode, icon: 'edit'}//,
	    //{ text: '删除文件夹', click: removeNode, icon: 'delete'}
	    ]
	});
	menui = $.ligerMenu({ top: 100, left: 100, width: 120,items:
	    [
	    { text: '新增文件夹', click: appendNode, icon: 'add'},
	    { text: '新增一级制度', click: addInstNode, icon: 'add'},
	    { text: '修改文件夹', click: editNode, icon: 'edit'}
	    //{ text: '删除文件夹', click: removeNode, icon: 'delete'},
	    ]
	});
	menup = $.ligerMenu({ top: 100, left: 100, width: 120,items:
	    [
	    { text: '修改文件夹', click: editNode, icon: 'edit'},
	    //{ text: '删除文件夹', click: removeNode, icon: 'delete'},
	    { text: '新增二级流程', click: addInstNode, icon: 'add'}
	    ]
	});
	menuii = $.ligerMenu({ top: 100, left: 100, width: 120,items:
	    [
	    { text: '修改一级制度', click: addInstNode, icon: 'edit'}
	    ]
	});
	menuip = $.ligerMenu({ top: 100, left: 100, width: 120,items:
	    [
	    { text: '修改二级流程', click: addInstNode, icon: 'edit'}
	    ]
	});
	initGrid();
	//reviseAdviceCollect
	$("#reviseAdviceCollect").click(function() {
		if(!Public.isReadOnly&&isCheckProcUnit()){
			Public.syncAjax(web_app.name+'/oaInstitutionAction!collectAdvice.ajax', 
					{institutionProcessId:getId()},
					function(){
						refreshFlag=true;
			});
		}
		else{
			Public.tip("修订环节才能进行意见征集!");
		}
	});
	$("#readCollectedAdvice").click(function() {
		if(getId()!=""){
			parent.addTabItem({
				tabid : 'InstReviseAdviceCollect',
				text : '制度修订信息反馈情况',
				url : web_app.name+'/oaInstitutionAction!forwardInstReviseAdvice.do?bizId='+getId(),
				close:dialogClose
			});
		}
	});
	bindTipDownFileEvent();
});

function initFileListGrid(){
	fileListGrid = UICtrl.grid('#fileListGrid', {
		columns: [
					{ display: "文件名称", name: "fileName", width: 860, minWidth: 860, type: "string", align: "left",
						render: function (item) {
							var str = '<a href="#" onClick="AttachmentUtil.onOpenViewFile('+item.id+',\'\',\'\',true)">'+
							item.fileName+'</a>';
			  				return str;
			  			}
					}
				],
				dataAction : 'server',
				url: web_app.name+'/oaInstitutionAction!slicedQueryReviseProcFileList.ajax',
				parms:{institutionProcessId:getId(),pagesize:1000},
				//pageSize : 20,
				width : '100%',
				height : 155,
				sortName:'fileName',
				sortOrder:'asc',
				heightDiff : -10,
				headerRowHeight : 25,
				rowHeight : 25,
				usePager: false,
				onLoadData :function(){
					return (getId()!='');
				},
				fixedCellHeight : true,
				selectRowButtonOnly : true
			});
}

function reloadFileListGrid(){
	fileListGrid.loadData();
}

//reviseStatus:1修改，2删除，3新增；1,2可互换状态
function showFileList(){
	if(getId()){
		UICtrl.showFrameDialog({
			url : web_app.name + "/biz/oa/institution/reviseFile/reviseFileList.jsp",
			param : {institutionProcessId : getId()},
			title : "文件查看",
			width : 650,
			height : 400,
			cancelVal: '关闭',
			ok :false,
			cancel:true
		});
	}
	else{
		UICtrl.alert("还未保存表单，没有文件可供查看!");
		return;
	}
}

function initGrid(){//初始化
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		/*addHandler:function(){
			addHandler();
		},*/
		updateHandler:function(){
			updateHandler();
		},
		deleteHandler:deleteHandler,
		saveSortIDHandler: saveSortIDHandler,
		viewHandler: {id:'View',text:'文件查看',img:'page.gif',click:showFileList}
	});
	gridManager = UICtrl.grid('#reviseInstitutionGrid', {
		columns: [
		  		{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },		
		  		{ display: "制度版本", name: "institutionVersion", width: 60, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "生效日期", name: "effectiveDate", width: 75, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "修订状态", name: "reviseStatus", width: 60, minWidth: 60, type: "string", align: "left",
		  			render: function (item) {
		  				return reviseStatusList[item.reviseStatus];
		  			}},
		  		{ display: "制度路径", name: "fullName", width: 420, minWidth: 60, type: "string", align: "left" },
		  		{ display: "原制度", name: "oldInstitutionName", width: 100, minWidth: 60, type: "string", align: "left" },
		  		{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",		   
		  			render: function(item){
		  				return "<input type='text' id='txtSequence_" + item.institutionReviseId + "' class='textbox' value='" + item.sequence + "' />";
		  			}
		  		}
		  		],
		  		dataAction : 'server',
		  		url: web_app.name+'/oaInstitutionAction!slicedQueryInstitutionRevise.ajax',
		  		pageSize : 20,
		  		parms:{institutionProcessId:getId()},
		  		width : '99%',
		  		height : 325,
		  		heightDiff : -5,
		  		headerRowHeight : 25,
		  		rowHeight : 25,
		  		sortName:'sequence,institutionReviseId',//防止序列值重复
		  		sortOrder:'asc',
		  		toolbar: toolbarOptions,
		  		fixedCellHeight : true,
		  		selectRowButtonOnly : true,
		  		checkbox: true,
		  		onDblClickRow : function(data, rowindex, rowobj) {
		  			updateHandler(data.institutionReviseId,data.kind);
		  		},
		  		onSuccess:function(data){
		   			if (!data || !data['Rows'] || !data['Rows'].length){
		   				initAttachment();
			  			//reloadEditDetailGrid();
			  			reloadFileListGrid();
		   			}
		   		},
		  		onAfterShowData :function(data){
		  			initAttachment();
		  			//reloadEditDetailGrid();
		  			reloadFileListGrid();
		  		},
		  		onLoadData :function(){
		   			return (getId()!='');
		   		}
		  	});	
}

var oaInstitutionTreeUrl = web_app.name+"/institutionTreeAction!slicedQueryEnableInstitutionTree.ajax";
function initDialog(doc){
	var oldInstitutionId = $('#oldInstitutionId').val();
	var obj = $('#reviseStatus');
	var kind = $('#kind').val();
	if('institution'==kind){
		$('#inst').show();
		$('#proc').hide();
		$('#instFileList').fileList({
			readOnly:!editFlg,
			downloadEnable:function(){
				if(editFlg){
					return true;
				}
				return false;
			},
			showTipEnable:function(file){
				if(editFlg){
					return true;
				}
				return false;
			}
		});
	}
	else if('process'==kind){
		$('#proc').show();
		$('#inst').hide();
		$('#instProcFileList').fileList({
			readOnly:!editFlg,
			downloadEnable:function(id){
				if(editFlg){
					return true;
				}
				var file=$('#'+id),code=file.attr('attachmentCode');
				if(code=='process'){
					openAttachment(id);
					return false;
				}
				return true;
			},
			showTipEnable:function(file){
				var code=file.attr('attachmentCode');
				if(code=='process'){
					return false;
				}
				return true;
			}
		});
	}
	if(oldInstitutionId==""){//新增制度不允许修改状态
		$('#reviseStatus').combox('setData',reviseStatusList);
		UICtrl.disable(obj);
		$('#oldInstFile').hide();
		$('#oldInstProcFile').hide();
		$('#oldInstFile').fileList({readOnly:true,bizId:0});
		$('#oldInstProcFile').fileList({readOnly:true,bizId:0});
	}
	else{
		//删除新增选项
		$('#reviseStatus').combox('setData',reviseOldStatusList);
		UICtrl.enable(obj);
		if('institution'==kind){
			$('#oldInstFile').show();
			$('#oldInsFileList').fileList({readOnly:true,bizId:oldInstitutionId});
			$('#oldInstProcFile').hide();
			$('#oldInstProcFileList').fileList({readOnly:true,bizId:0});
		}
		else if('process'==kind){
			$('#oldInstProcFile').show();
			$('#oldInstProcFileList').fileList({readOnly:true,bizId:oldInstitutionId});
			$('#oldInstFile').hide();
			$('#oldInsFileList').fileList({readOnly:true,bizId:0});
		}
		if(!editFlg)
			UICtrl.setReadOnly(doc);
	}
	$('#processDefinitionName').treebox({
		tree:{url:  web_app.name + '/processManageAction!loadTreeLeaf.ajax?showProcUnit=0&parentId=0',
			idFieldName: 'code',
	        parentIDFieldName: "parentId",
	        textFieldName: "name",
	        dataRender:function(data){
				if(data['Rows']){
					if(data.isAjax===false){//判断是否是AJAX
						this.options.delay=true;
					}
				}
				return data['Rows']||data;
	        },
	        delay: function(e){
		        return { url:web_app.name + '/processManageAction!loadTreeLeaf.ajax',parms:{showProcUnit:"0",parentId : e.data.reProcdefTreeId}};
		    }
		},
		beforeChange:function(data){
			if(data&&data.nodeKindId!=undefined){
        		if(data.nodeKindId=='proc'){
        			return true;
        		}
        	}
			return false;
		},
		back:{text:'#processDefinitionName',value:'#processDefinitionKey'}
    });
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
	//明细页面附件弹出层删除
	$('div.ui-attachment-pop-div').remove();
}

function addHandler(){
	if(getId()==""){
		Public.tip("请先保存表单");
		return false;
	}
	institutionReviseTmpId = '';
	UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showInsertInstitutionRevise.load', 
		param:{reviseStatus:"3",institutionProcessId:getId(),kind:actionNode.kind},ok: insert, close: dialogClose,
		init:initDialog,title:'新增制度',width:650});
}

var toolbutton = [{
	id : 'toolbtn',
	name : '管理工具配置',
	callback : toolManage}];

function toolManage(data){
	if(institutionReviseTmpId){
		//打开二级流程管理工具配置页面
		if(editFlg){
			UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showInstReviseToolConfig.load', 
				param:{institutionReviseId:institutionReviseTmpId}, ok: saveTool, close: dialogClose,parent:window['InstitutionReviseDialog'],
				init:initToolDialog,title:'配置二级流程管理工具',width:650});
		}
		else{
			UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showInstReviseToolConfig.load', 
				param:{institutionReviseId:institutionReviseTmpId}, ok: false, close: dialogClose,parent:window['InstitutionReviseDialog'],
				init:initToolDialog,title:'配置二级流程管理工具',width:650});
		}
	}
	else{
		Public.tip('请先保存二级流程数据！');
	}
	return false;//不关闭二级流程窗口
}

function saveTool(){
	var detailData = DataUtil.getGridData({gridManager:toolGridManager});
	if(!detailData || detailData.length == 0) return false;
	Public.ajax(web_app.name +'/oaInstitutionAction!saveInstReviseToolConfig.ajax',
		{
			detailData:encodeURI($.toJSON(detailData))
		},
		function(){
			reloadToolGrid();
		}
	);
}

function reloadToolGrid(){
	toolGridManager.loadData();
}

function initToolDialog(){
	if(isCheckProcUnit()){
		permissionAuthority['reviseInstToolConfigGrid.readOnly']={authority:'readwrite',type:'1'};
		permissionAuthority['reviseInstToolConfigGrid.sequence']={authority:'readwrite',type:'1'};
	}
	//初始化二级流程管理工具数据
	toolGridManager = UICtrl.grid('#reviseInstToolConfigGrid', {
		columns: [
		          { display: "禁止下载", name: "readOnly", width: 100, minWidth: 60, type: "string", align: "left",
		        	  editor: { type: 'combobox',data: yesOrNo,required:true},
		        	  render: function (item) {
		        		  return yesOrNo[item.readOnly];
		          }},		
				  { display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",	
		        	  editor: { type: 'text',required:false}
		          },
		          { display: "文件名", name: "fileName", width: 410, minWidth: 60, type: "string", align: "left"}
			  	],
		dataAction : 'server',
		url: web_app.name+'/oaInstitutionAction!slicedQueryInstReviseToolConfig.ajax',
		pageSize : 20,
		parms:{institutionReviseId:getInstitutionReviseId()},
		width : 620,
		height : 325,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		fixedCellHeight : true,
  		selectRowButtonOnly : true,
  		checkbox: true,
  		enabledEdit: true
	});
	UICtrl.autoSetWrapperDivHeight();
}

function getInstitutionReviseId(){
	return $('#institutionReviseId').val();
}

function updateHandler(institutionReviseId,kind){
	if(!institutionReviseId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		institutionReviseId=row.institutionReviseId;
		kind=row.kind;
	}
	institutionReviseTmpId = institutionReviseId;
	if(editFlg&&!isApproveProcUnit()){//编辑状态且为申请修订环节才能保存
		if('process'==kind){
			UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showUpdateInstitutionRevise.load', 
				param:{institutionReviseId:institutionReviseId}, ok: update, close: dialogClose,
				init:initDialog,title:'修改二级流程',width:650,button:toolbutton,id:'InstitutionReviseDialog'});
		}
		else{
			UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showUpdateInstitutionRevise.load', 
				param:{institutionReviseId:institutionReviseId}, ok: update, close: dialogClose,
				init:initDialog,title:'修改一级制度',width:650});
		}
	}
	else{
		if('process'==kind){
			UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showUpdateInstitutionRevise.load', 
				param:{institutionReviseId:institutionReviseId,isReadOnly:true},ok:false,close: dialogClose,
				init:initDialog,title:'修改二级流程',width:650,button:toolbutton,id:'InstitutionReviseDialog'});
		}
		else{
			UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showUpdateInstitutionRevise.load', 
				param:{institutionReviseId:institutionReviseId,isReadOnly:true},ok:false,close: dialogClose,
				init:initDialog,title:'修改一级制度',width:650});
		}
	}
	
}

//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({ action:web_app.name + '/oaInstitutionAction!deleteInstitutionRevise.ajax', 
		gridManager: gridManager, idFieldName: 'institutionReviseId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}

function saveSortIDHandler(){
	var action = "oaInstitutionAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'institutionReviseId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
	//reloadEditDetailGrid();
} 

function insert(){
	if(institutionReviseTmpId == ''){
		$('#submitForm').ajaxSubmit({url: web_app.name + '/oaInstitutionAction!insertInstitutionRevise.ajax',
			success : function(id) {
				institutionReviseTmpId = id;
				$('#institutionReviseId').val(id);
				var kind = $('#kind').val();
				var oldInstitutionId = $('#oldInstitutionId').val(); 
				if(oldInstitutionId){
					if(kind=="process"){
						Public.load(web_app.name + '/common/attachment.jsp',{bizCode:'OAReviseProcAttachment',bizId:id,isClass:true,proportion:'12%,38%,12%,38%'},
								function(data){
									$('#reviseInstProcFile').html(data);
									$('#reviseInstProcFile').find('div[id="attachmentList"]').fileList();
							});
							Public.load(web_app.name + '/common/attachment.jsp',{bizCode:'OACurrentProcAttachment',bizId:oldInstitutionId,isClass:true,proportion:'12%,38%,12%,38%'},
								function(data){
									$('#oldInstProcFile').html(data);
									$('#oldInstProcFile').find('div[id="attachmentList"]').fileList({readOnly:true});
							});
					}
					else{
						Public.load(web_app.name + '/common/attachment.jsp',{bizCode:'OAReviseInstAttachment',bizId:id,isClass:true,proportion:'12%,38%,12%,38%'},
								function(data){
									$('#reviseInstFile').html(data);
									$('#reviseInstFile').find('div[id="attachmentList"]').fileList();
							});
							Public.load(web_app.name + '/common/attachment.jsp',{bizCode:'OACurrentInstAttachment',bizId:oldInstitutionId,isClass:true,proportion:'12%,38%,12%,38%'},
								function(data){
									$('#oldInstFile').html(data);
									$('#oldInstFile').find('div[id="attachmentList"]').fileList({readOnly:true});
							});
					}
				}
				else{
					$('#instFileList').fileList({bizId:id});
					$('#instProcFileList').fileList({bizId:id});
				}
				reloadFileListGrid();
				refreshFlag = true;
			}
		});
	}
	else{
		update();
	}
}

function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/oaInstitutionAction!updateInstitutionRevise.ajax',
		success : function() {
			reloadFileListGrid();
			refreshFlag = true;
		}
	});
}

///////////////////////////////主页面制度展现/////////////////////////////////////////////////////////////////
var loadUrl = web_app.name+'/institutionTreeAction!slicedQueryEnableInstitutionHandBook.ajax';//查询制度
var loadByRootUrl = web_app.name+'/oaInstitutionAction!queryInstitutionTreeByRoot.ajax';//查询制度

function initializeUI(){	
	//修订制度树初始化
    var institutionRootId = $('#institutionRootId').val();
	if(institutionRootId==""||institutionRootId=="1"){
		initTreeManager();
	}
	else{
		initTreeManagerByRoot();
	}
	
}

function reloadEditTree()
{
	var institutionRootId = $('#institutionRootId').val();
	if(institutionRootId==""||institutionRootId=="1"){
		if(treeManager!=null){
			treeManager.clear();
			//treeManager.loadData(null,loadUrl,{parentId:1});
			treeManager.loadData(null,loadUrl,{parentId:1,personMemberId:$('#personMemberId').val()});
		}
		else{
			initTreeManager();
		}
	}
	else{
		if(treeManager!=null){
			treeManager.clear();
			treeManager.loadData(null,loadByRootUrl,{rootId:institutionRootId});
		}
		else{
			initTreeManagerByRoot();
		}
	}
}

function initTreeManager(){
	treeManager=UICtrl.tree("#maintree",{
		url:loadUrl,
		param:{parentId:1,personMemberId:$('#personMemberId').val()},
		idFieldName : 'id',
		textFieldName : "name",
		checkbox : false,
        nodeWidth : 260,
        isLeaf : function(data)
        {
            if (!data) return false;
            return data.hasChild == false;
        },
        delay: function(e){
        	//展开节点
            return { url:loadUrl,parms:{parentId: e.data.id} };
        },
        onContextmenu:function (node, e){
        	actionNode = node.data;
        	var kind = actionNode.kind;
        	var isTree = actionNode.isTree;
        	if(editFlg)
        	{
        		if('t'==isTree){
	        		if('system'==kind){
	                	menu.show({ top: e.pageY, left: e.pageX });
	        		}
	        		else if('function'==kind){
	        			menu.show({ top: e.pageY, left: e.pageX });
	        		}
	        		else if('institution'==kind){
	        			menui.show({ top: e.pageY, left: e.pageX });
	        		}
	        		else if('process'==kind){
	        			menup.show({ top: e.pageY, left: e.pageX });
	        		}
        		}
        		else{
        			if('institution'==kind){
        				menuii.show({ top: e.pageY, left: e.pageX });
        			}
        			else if('process'==kind){
	        			menuip.show({ top: e.pageY, left: e.pageX });
	        		}
        		}
        	}	
            return false;
        }/*,
        onDblClick: onEditNodeClick*/
    });
}

function initTreeManagerByRoot(){
	treeManager=UICtrl.tree("#maintree",{
		url:loadByRootUrl,
		param:{rootId:$('#institutionRootId').val()},
		idFieldName : 'id',
		textFieldName : "name",
		checkbox : false,
        nodeWidth : 260,
        isLeaf : function(data)
        {
            if (!data) return false;
            return data.hasChild == false;
        },
        delay: function(e){
        	//展开节点
            return { url:loadByRootUrl,parms:{parentId: e.data.id,rootId:''} };
        },
        onContextmenu:function (node, e){
        	actionNode = node.data;
        	var kind = actionNode.kind;
        	var isTree = actionNode.isTree;
        	if(editFlg)
        	{
        		if('t'==isTree){
	        		if('system'==kind||'function'==kind){
	        			menu.show({ top: e.pageY, left: e.pageX });
	        		}
	        		else if('institution'==kind){
	        			menui.show({ top: e.pageY, left: e.pageX });
	        		}
	        		else if('process'==kind){
	        			menup.show({ top: e.pageY, left: e.pageX });
	        		}
        		}
        		else{
        			if('institution'==kind){
        				menuii.show({ top: e.pageY, left: e.pageX });
        			}
        			else if('process'==kind){
	        			menuip.show({ top: e.pageY, left: e.pageX });
	        		}
        		}
        	}	
            return false;
        }/*,
        onDblClick: onEditNodeClick*/
    });
}

function onEditNodeClick(node,obj){
	if(getId()==""){
		Public.tip("请先保存表单");
		return false;
	}
	if(!editFlg&&!isApproveProcUnit()){//编辑状态且为申请修订环节才能触发
		return false;
	}
	//申请和修订环节可以新增、修改节点
	if((isApply()||isCheckProcUnit())&&node){
		//校验权限
		var ndata = actionNode||node.data;
		var isTree = ndata.isTree;
		var id = ndata.id;
		var parentId = ndata.parentId;
		var institutionTreeId = parentId;
		var kind = ndata.kind;
		if('system'==kind||'function'==kind){
			UICtrl.alert("选择的节点非制度或流程节点，不能挂接细项!");
			return;
		}
		if(isTree=="t"){//树的校验本身的权限，制度则校验父节点权限
			institutionTreeId = id;
		}
		var flg = "false";
		Public.syncAjax(web_app.name+'/institutionTreeAction!checkReviseAuthority.ajax', 
				{institutionTreeId:institutionTreeId,personId:$('#personMemberId').val()},
				function(data){
					flg = data;
		});
		
		if(flg=="false"){
			Public.tip("你没有权限修订这个制度!");
			return;
		}
		else{
			var ctitle = "二级流程";
			if('institution'==kind){
				ctitle = "一级制度";
			}
			if(isTree=="t"){//树节点，只能新增挂载
				var fullName = ndata.fullName;
				institutionReviseTmpId = '';
				if('process'==kind){
					UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showInsertInstitutionRevise.load', 
						param:{reviseStatus:"3",fullName:fullName,
							parentId:id,institutionProcessId:getId(),kind:kind},
						ok: insert, close: dialogClose,
						init:initDialog,title:'新增'+ctitle,width:650,button:toolbutton,id:'InstitutionReviseDialog'});
				}
				else{
					UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showInsertInstitutionRevise.load', 
						param:{reviseStatus:"3",fullName:fullName,
							parentId:id,institutionProcessId:getId(),kind:kind},
						ok: insert, close: dialogClose,
						init:initDialog,title:'新增'+ctitle,width:650});
				}
			}
			else{//修改现有制度
				//id
				//判断是否其它流程修订中，本流程已新增true，未新增false
				Public.syncAjax(web_app.name+'/oaInstitutionAction!checkReviseStatus.ajax', 
						{oldInstitutionId:id,institutionProcessId:getId()},
						function(data){
							if(data=="true"){//修改
								institutionReviseTmpId = id;
								if('process'==kind){
									UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showUpdateInstitutionRevise.load', 
										param:{oldInstitutionId:id,institutionProcessId:getId()}, 
										ok: update, close: dialogClose,
										init:initDialog,title:'修改'+ctitle,width:650,button:toolbutton,id:'InstitutionReviseDialog'});
								}
								else{
									UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showUpdateInstitutionRevise.load', 
										param:{oldInstitutionId:id,institutionProcessId:getId()}, ok: update, close: dialogClose,
										init:initDialog,title:'修改'+ctitle,width:650});
								}
							}
							else if(data=="false"){//新增修改
								institutionReviseTmpId = '';
								var name = ndata.name;
								//var institutionVersion = 'A'+getNum(ndata.institutionVersion);
								if('process'==kind){
									UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showInsertInstitutionRevise.load', 
										param:{reviseStatus:"1",oldInstitutionId:id,oldInstitutionName:name,institutionProcessId:getId()},
										ok: insert, close: dialogClose,
										init:initDialog,title:'修改'+ctitle,width:650,button:toolbutton,id:'InstitutionReviseDialog'});
								}
								else{
									UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showInsertInstitutionRevise.load', 
										param:{reviseStatus:"1",oldInstitutionId:id,oldInstitutionName:name,institutionProcessId:getId()},
										ok: insert, close: dialogClose,
										init:initDialog,title:'修改'+ctitle,width:650});
								}	
							}
				});
			}
		}
	}
}

function getNum(text){
	var value = text.replace(/[^0-9]/ig,"")+1; 
	return value;
}

function addInstNode(){
	onEditNodeClick(actionNode,null);
}

function getId() {
	return $("#institutionProcessId").val();
}

function setId(value) {
	$("#institutionProcessId").val(value);
	$('#instReviseBody').fileList({bizId:value});
	gridManager.options.parms['institutionProcessId'] =value;
	fileListGrid.options.parms['institutionProcessId'] =value;
}

function getOrganId() {
	return $("#organId").val();
}

function getCenterId() {
	return $("#centerId").val();
}

function setEnableGridEdit(){
	if (isCheckProcUnit()) {
		permissionAuthority['reviseInstitutionGrid.updateHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['reviseInstitutionGrid.deleteHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['reviseInstitutionGrid.saveSortIDHandler']={authority:'readwrite',type:'2'};
	}
}

//////////////////////////////流程相关////////////////////////////////////////////////////////
function isApply(){
	return procUnitId == "Apply";
}

function isApproveProcUnit(){
	return procUnitId == "Approve";
}

function isCheckProcUnit(){
	return procUnitId == "Check";
}

function reLoadJobTaskExecutionList(bizId, procUnitId) {
	procUnitId = procUnitId || 'Approve';
	var handlerListId = "";
	if (procUnitId == "Approve") {
		handlerListId = "approverList";
	} else if (procUnitId == "Check") {
		handlerListId = "checkerList";
	}
	if (!handlerListId) {
		return;
	}

	$("#" + handlerListId).load(web_app.name + "/common/TaskExecutionList.jsp",
		{ bizId : bizId, procUnitId : procUnitId, taskId: taskId }, function() {
			Public.autoInitializeUI($("#" + handlerListId));
	});
}

function afterSave(data){
	//保存需刷新制度修订树
	if (isApply()){
		if(actionNode){
			reloadParentNode();
		}
		else
		{
			reloadEditTree();
		}
	}
}

//提交扩展属性,流程数据
function getExtendedData(){
	var detailData = $("#submitWfForm").formToJSON();
	return {detailData:encodeURI(detailData)};
}

function initAttachment(){
	initTip('OAReviseInstAttachment');
	initTip('OAReviseProcAttachment');
	initTip('OACurrentInstAttachment');
	initTip('OACurrentProcAttachment');
}


//绑定tip文件下载事件
function bindTipDownFileEvent(){
	$(document).on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		var file=$clicked.parent('div.file');
		if(file.length>0&&'attachmentList'==file.parent().parent().parent().attr("id")){
			var id=file.attr('id');
			AttachmentUtil.onOpenViewFile(id,'','',true);
			//var url=web_app.name +"/attachmentPreview.do?isReadOnly=true&id="+id;
			//window.open(web_app.name +url);
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	});
}

function initTip(bizCode){
	$('#reviseInstitutionGrid').find('div.'+bizCode).each(function(){
		var id=$(this).attr('id');
		$(this).tooltip({
			position:'right',
			width:'300',
			url:web_app.name+"/oaInstitutionAction!forwardAttachmentTip.ajax",
			onShow:function(tip){
				var tipId=tip.attr('id');
				$('div.ui-tooltip').each(function(){
					var id=$(this).attr('id');
					if(id!=tipId){
						$(this).hide();
					}
				});
				if(tip.find('div.file').length==0){
					tip.hide();
				}
			},
			param:function(){
			   return {bizId:id,bizCode:bizCode,isClass:false,isWrap:false,readOnly:true};
			}
		});
	});
}

/*点击文件打开*/
function openAttachment(id){
	AttachmentUtil.onOpenViewFile(id,'','',true);
}

function appendNode(item,i){
	var kind = actionNode.kind;
	var addKind = '';
	var title = '';
	if('system'==kind){//系统结构
		//新增职能文件夹
		addKind = 'function';
		title = "新增职能文件夹";
    	var systemChildrenCount = actionNode.systemChildrenCount;
    	if(systemChildrenCount>0){
    		Public.tip("含有系统树子节点，不能新增职能文件夹！");
    		return;
    	}
	}
	else if('function'==kind){//职能
		//新增制度文件夹
		addKind = 'institution';
		title = "新增一级制度文件夹";
	}
	else if('institution'==kind){//制度
		//新增流程文件夹
		addKind = 'process';
		title = "新增二级流程文件夹";
	}
	else if('process'==kind){//流程
		Public.tip("流程类别不能新增子节点！");
		return;
	}
	else{
		Public.tip("没有该制度类别，请联系系统管理员维护！");
		return;
	}
	//新增状态默认取父节点值
	  UICtrl.showAjaxDialog({
	     title: title,
	     width: 300,
	     url: web_app.name + '/institutionTreeAction!showInsertInstitutionTree.load',
	     param: {
	         parentId: actionNode.id,
	         status: actionNode.status,
	         kind: addKind
	     },
	     init: function(){UICtrl.disable($('#opfunctionCode'));},
	     ok: doInsertInstitutionTree,
	     close: dialogClose
	  });
}

function doInsertInstitutionTree(){
    _self = this;
    $('#submitForm').ajaxSubmit({url: web_app.name + '/institutionTreeAction!insertInstitutionTree.ajax',
        success: function (id) {
        	//reloadEditTree();
        	reloadParentNode();
            _self.close();
        }
    });
}

function editNode(item,i){
	var id = actionNode.id;
	var title = '';
	var kind = actionNode.kind;
	if('system'==kind){//系统结构
		title = '修改制度树节点';
	}
	else if('function'==kind){//职能
		title = "修改职能文件夹";
		
	}
	else if('institution'==kind){//制度
		title = "修改制度文件夹";
	}
	else if('process'==kind){//流程
		title = "修改流程文件夹";
	}
	UICtrl.showAjaxDialog({
	    title: title,
	    width: 300,
	    url: web_app.name + '/institutionTreeAction!showUpdateInstitutionTree.load',
	    param: {institutionTreeId: id},
	    init: function(){UICtrl.disable($('#opfunctionCode'));},
	    ok: doUpdateInstitutionTree, close: dialogClose
	});
}

function doUpdateInstitutionTree(){
    _self = this;
    $('#submitForm').ajaxSubmit({url: web_app.name + '/institutionTreeAction!updateInstitutionTree.ajax',
        success: function () {
        	//reloadEditTree();
        	reloadParentNode();
            _self.close();
        }
    });
}

function removeNode(item,i){
	var id = actionNode.id;
    var ids = [id];
    UICtrl.confirm('确定删除吗?', function () {
        Public.ajax(web_app.name + '/institutionTreeAction!deleteInstitutionTree.ajax', 
        		{ids: $.toJSON(ids)
        }, function (data) {
        	//reloadEditTree();
        	reloadParentNode();
        });
    });
}

function reloadParentNode(){
	var parentDom = treeManager.getParentTreeItem(actionNode);
	var treeUrl = "";
	var institutionRootId = $('#institutionRootId').val();
	if(institutionRootId==""||institutionRootId=="1"){
		treeUrl = loadUrl;
	}
	else{
		treeUrl = loadByRootUrl;
	}
	var sucfunc = function(){
		treeManager.selectNode(actionNode.id);
		treeManager.unbind("success",sucfunc);
	};
	treeManager.bind("success",sucfunc);
	if(parentDom){
		var parentData = treeManager.getParent(actionNode);
		for(var i=0;i<parentData.children.length;i++){
			treeManager.remove(parentData.children[i]);
		}
		treeManager.loadData(parentDom,treeUrl,{parentId:actionNode.parentId});			
	}else{
		treeManager.clear();
		treeManager.loadData(null,treeUrl,{parentId:0});
	}
}