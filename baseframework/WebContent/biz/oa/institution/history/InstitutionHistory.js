var treeManager,refreshFlag=false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
});

var InstImagePath = web_app.name + "/themes/default/images/standardToolbar/standard/";

var loadUrl = web_app.name+'/oaInstitutionAction!queryInstitutionHistoryTree.ajax';//查询修制度

function initializeUI(){
    UICtrl.layout("#layout", {
        leftWidth: 240,
        heightDiff: -10
    });
	//修订制度树初始化
    initTreeManager();
}

function initTreeManager(){
	treeManager=UICtrl.tree("#maintree",{
		url:loadUrl,
		param:{parentId:1,isTree:'t',kind:'system'},
		idFieldName : 'id',
		textFieldName : "name",
		checkbox : false,
        nodeWidth : 180,
        isLeaf : function(data)
        {
            if (!data) return false;
            if(data.status=="0"||data.parentId=="0"){
            	data.icon = InstImagePath+'stop.gif';
            }
            return data.hasChild == false;
        },
        delay: function(e){
        	//展开节点
            return { url:loadUrl,parms:{parentId: e.data.id,isTree:e.data.isTree,kind:e.data.kind} };
        },
        onClick: onEditNodeClick
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
}

var showDetailUrl = web_app.name+'/oaInstitutionAction!queryHistoryDetail.load';
function onEditNodeClick(node,obj){
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
			if(isTree=="f"){//制度细项
				Public.autoInitializeUI($('#institutionInfo'));//自动初始化控件
				if('institution'==kind){
					$('#inst').show();
					$('#proc').hide();
					$('#instFileList').fileList({downloadEnable:false,readOnly:true,bizId:id});
				}
				else if('process'==kind){
					$('#proc').show();
					$('#inst').hide();
					$('#instProcFileList').fileList({downloadEnable:false,readOnly:true,bizId:id});
				}
			}
	});
}