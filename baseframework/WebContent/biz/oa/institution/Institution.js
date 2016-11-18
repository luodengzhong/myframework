var treeManager,refreshFlag=false,actionNode;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
});

function revise(id){
	if(id!=""){
		//页面跳转
		parent.addTabItem({
			tabid : 'InstitutionApply',
			text : '制度修订申请',
			url : web_app.name+'/oaInstitutionAction!forwardInstitutionApply.job?institutionRootId=' + id
		});
	}		
}
var InstImagePath = web_app.name + "/themes/default/images/standardToolbar/standard/";

function initAttachment(kind){
	if('institution'==kind){
		$('#inst').show();
		$('#proc').hide();
		$('#instFileList').fileList({readOnly:false,isCheck:false});
	}
	else{
		$('#proc').show();
		$('#inst').hide();
		$('#instProcFileList').fileList({readOnly:false,isCheck:false});
	}
}

var loadUrl = web_app.name+'/oaInstitutionAction!queryInstitutionTree.ajax';//查询修制度
var loadByRootUrl = web_app.name+'/oaInstitutionAction!queryInstitutionTreeByRoot.ajax';//查询制度

function initializeUI(){
    UICtrl.layout("#layout", {
        leftWidth: 240,
        heightDiff: -10
    });
	//修订制度树初始化
    var institutionTreeId = $('#institutionTreeId').val();
	if(institutionTreeId==""||institutionTreeId=="1"){
		initTreeManager();
	}
	else{
		initTreeManagerByRoot();
	}
}

function initTreeManagerByRoot(){
	treeManager=UICtrl.tree("#maintree",{
		url:loadByRootUrl,
		param:{rootId:$('#institutionTreeId').val()},
		idFieldName : 'id',
		textFieldName : "name",
		checkbox : false,
        nodeWidth : 180,
        isLeaf : function(data)
        {
            if (!data) return false;
            if(data.status=="0"){
            	data.icon = InstImagePath+'stop.gif';
            }
            return data.hasChild == false;
        },
        delay: function(e){
        	//展开节点
            return { url:loadByRootUrl,parms:{parentId: e.data.id,rootId:''} };
        },
        onClick: onEditNodeClick
    });
}

function initTreeManager(){
	treeManager=UICtrl.tree("#maintree",{
		url:loadUrl,
		param:{parentId:1},
		idFieldName : 'id',
		textFieldName : "name",
		checkbox : false,
        nodeWidth : 180,
        isLeaf : function(data)
        {
            if (!data) return false;
            if(data.status=="0"){
            	data.icon = InstImagePath+'stop.gif';
            }
            return data.hasChild == false;
        },
        delay: function(e){
        	//展开节点
            return { url:loadUrl,parms:{parentId: e.data.id} };
        },
        onContextmenu:function (node, e){
        	actionNode = node;
        },
        onClick: onEditNodeClick
    });
}

function addChild(data){
	var kind = data.kind;
	var addKind = '';
	var title = '';
	if('system'==kind){//系统结构
		//新增职能文件夹
		addKind = 'function';
		title = "新增职能文件夹";
    	var systemChildrenCount = data.systemChildrenCount;
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
	         parentId: data.id,
	         status: data.status,
	         kind: addKind
	     },
	     init: function(){UICtrl.disable($('#opfunctionCode'));},
	     ok: doInsertInstitutionTree,
	     close: dialogClose
	  });
}

function editNode(actionNode){
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
        	reloadParentNode(actionNode);
            _self.close();
        }
    });
}

function dialogClose(){
	if(refreshFlag){
		reloadEditTree();
		refreshFlag=false;
	}
}

function doInsertInstitutionTree(){
    _self = this;
    $('#submitForm').ajaxSubmit({url: web_app.name + '/institutionTreeAction!insertInstitutionTree.ajax',
        success: function (id) {
        	//reloadEditTree();
        	reloadParentNode(actionNode);
            _self.close();
        }
    });
}

function reloadEditTree()
{
	if(treeManager!=null){
		treeManager.clear();
		treeManager.loadData(null,loadUrl,{parentId:1});
	}
	else{
		initTreeManager();
	}
	$('#institutionInfo').html("");
}

function addInstNode(data){
	var ctitle = "二级流程";
	if('institution'==data.kind){
		ctitle = "一级制度";
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/oaInstitutionAction!showInsertInstitution.load', 
		param:{reviseStatus:"3",fullName:data.fullName,
			parentId:data.id,kind:data.kind},
		ok: insert, close: true,
		title:'新增'+ctitle,width:650});
}

function insert(){
	_self = this;
	 $('#submitForm').ajaxSubmit({url: web_app.name + '/oaInstitutionAction!insertInstitution.ajax',
	        success: function (id) {
	        	refreshFlag=true;
	        	reloadParentNode(actionNode);
	            _self.close();
	        }
	    });
}

function saveInst(id,code,name,sequence,institutionVersion,description){
	//update
	 Public.ajax(web_app.name + '/oaInstitutionAction!updateInstitution.ajax', 
     		{institutionId:id,code:code,name:name,sequence:sequence,
		 institutionVersion:institutionVersion,description:description}
     	, function (data) {
     		refreshFlag=true;
     		reloadParentNode(actionNode);
     });
}

var showDetailUrl = web_app.name+'/oaInstitutionAction!queryDetail.load';
function onEditNodeClick(node,obj){
	actionNode = node;
	var data = node.data;
	var isTree = data.isTree;
	var institutionTreeId = '';
	var id = data.id;
	var kind = data.kind;
	if(isTree=="f"){//制度细项
		institutionTreeId = data.parentId;
	}
	else{
		institutionTreeId = data.id;
	}
	Public.load(showDetailUrl,
		{id:id,institutionTreeId:institutionTreeId,isTree:isTree,personId:$('#personId').val()},
		function(data){
			$('#institutionInfo').html(data);
			var reviseFlg = $('#reviseFlg').val();
			if(reviseFlg=="false"){
				$("#btn").hide();
			}
			$("#revise").click(function() {
				revise(id);  
			});
			$("#saveInst").click(function() {
				var code = $('#code').val();
				var name = $('#name').val();
				var sequence = $('#sequence').val();
				var institutionVersion = $('#institutionVersion').val();
				var description = $('#description').val();
				saveInst(id,code,name,sequence,institutionVersion,description);
			});
			if(isTree!="f"){
				if(kind!="process"){
					$("#addChild").click(function() {
						addChild(node.data);
					});
					$("#addChild").show();
				}
				else{
					$("#addChild").hide();
				}
				if(kind!="system"){
					$("#editNode").click(function() {
						editNode(node.data);
					});
					$("#editNode").show();
					if(kind=="institution"){
						$("#addProc").hide();
						$("#addInst").show();
						$("#addInst").click(function() {
							addInstNode(node.data);
						});
					}
					else if(kind=="process"){
						$("#addProc").show();
						$("#addInst").hide();
						$("#addProc").click(function() {
							addInstNode(node.data);
						});
					}
					else{
						$("#addInst").hide();
						$("#addProc").hide();
					}
				}
				else{
					$("#addInst").hide();
					$("#addProc").hide();
					$("#editNode").hide();
				}
			}
			else{
				$("#addChild").hide();
				$("#editNode").hide();
			}
			$("#manage").click(function() {
				//attachmentManage(id,kind);
				//
				UICtrl.showAjaxDialog({url: web_app.name+'/oaInstitutionAction!forwardAttachmentManage.load',
					param:{id:id,kind:kind},
					title:'附件管理',ok: false,init:function(){
						initAttachment(kind);
					},
					width:610
				});
			});
			$("#disable").click(function() {
			    var id = $('#id').val();
			    UICtrl.confirm('确实要禁用选中制度吗?', function () {
			        Public.ajax(web_app.name + '/oaInstitutionAction!updateInstitutionStatus.ajax', 
			        		{status:0,institutionId:id
			        }, function (data) {
			        	reloadEditTree();
			        	$('#institutionInfo').html("");
			        });
			    });	
			});
			if(isTree=="f"){//制度细项
				Public.autoInitializeUI($('#institutionInfo'));//自动初始化控件
				if('institution'==kind){
					$('#inst').show();
					$('#proc').hide();
					$('#instFileList').fileList({readOnly:true,bizId:id});
				}
				else if('process'==kind){
					$('#proc').show();
					$('#inst').hide();
					$('#instProcFileList').fileList({readOnly:true,bizId:id});
				}
			}
	});
}

function reloadParentNode(node){
	treeManager.selectNode(node.data.id);
	var chooseNode = treeManager.getSelected();
	var parentDom = treeManager.getParentTreeItem(chooseNode.data);
	if(parentDom){
		var parentData = treeManager.getParent(chooseNode.data);
		for(var i=0;i<parentData.children.length;i++){
			treeManager.remove(parentData.children[i]);
		}
		treeManager.loadData(parentDom,loadUrl,{parentId:node.data.parentId});			
	}else{
		treeManager.clear();
		treeManager.loadData(null,loadUrl,{parentId:0});
	}
}