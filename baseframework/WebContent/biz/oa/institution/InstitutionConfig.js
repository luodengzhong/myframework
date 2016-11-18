var treeManager,refreshFlag=false,gridManager=null,selectFunctionDialog=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initGrid();
});

var loadUrl = web_app.name+'/oaInstitutionAction!queryInstitutionTree.ajax';//查询修制度

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
		param:{parentId:1},
		idFieldName : 'id',
		textFieldName : "name",
		checkbox : false,
        nodeWidth : 180,
        isLeaf : function(data)
        {
            if (!data) return false;
            return data.hasChild == false;
        },
        delay: function(e){
        	//展开节点
            return { url:loadUrl,parms:{parentId: e.data.id} };
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

function doAddRow(){
    var funNode = $('#funtree').commonTree('getSelected');
    if(funNode){
        var funNodeCode = funNode.code;
        var funNodeName=funNode.name;
        var funNodeUrl=funNode.url;
        if (!funNodeCode||!funNodeUrl) {
        	Public.tip('请选择菜单叶子节点！');
        }
        else{
        	var count =  gridManager.getData().length;
            UICtrl.addGridRow(gridManager,{institutionName:$('#institutionName').val(),
    		fullName:$('#fullName').val(),code:funNodeCode,url:funNodeUrl,
    		name:funNodeName,
            	institutionId:getInstitutionId(),sequence:count+1});
            selectFunctionDialog.hide();
        }
    }
    else{
    	 Public.tip('请选择菜单叶子节点！');
    }

}

function initGrid(){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler:function(){
			if(getInstitutionId()==""){
				Public.tip('请选择制度细项！');
				return;
			}
			if (!selectFunctionDialog) {
		        selectFunctionDialog = UICtrl.showDialog({
		            title: "功能菜单选择",
		            width: 350,
		            content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="funtree"></ul></div>',
		            init: function () {
		                $('#funtree').commonTree({
		                	loadTreesAction : web_app.name+"/permissionAction!queryFunctions.ajax",
		        			beforeChange:function(data){
		        				var url = data.url;
		        				if(url&&url!=""){
		        					return true;
		        				}
		        				return false;
		        			},
		                	isLeaf : function(data) {
		        				if (!data.parentId){
		        					data.nodeIcon = web_app.name + "/themes/default/images/icons/function.gif";
		        				}else {
		        					data.nodeIcon=DataUtil.changeFunctionIcon(data.icon);
		        				}
		        				return data.hasChildren == 0;
		        			},
		        			IsShowMenu : false
		                });
		            },
		            ok: doAddRow,
		            close: function () {
		                this.hide();
		                return false;
		            }
		        });
		    } else {
		        selectFunctionDialog.show().zindex();
		    }
		},
		saveHandler:saveHandler,
		deleteHandler:function(){
			DataUtil.delSelectedRows({action:'oaInstitutionAction!deleteInstitutionConfig.ajax',
				gridManager:gridManager,idFieldName:'institutionConfigId',
				onSuccess:function(){
					gridManager.loadData();
				}
			});
		}
	});
	gridManager = UICtrl.grid('#institutionConfigGrid', {
		columns: [
		        { display: "制度名称", name: "institutionName", width: 120, minWidth: 60, type: "string", align: "left" },
		  		{ display: "制度路径", name: "fullName", width: 240, minWidth: 60, type: "string", align: "left" },
		  		{ display: "菜单名称", name: "name", width: 120, minWidth: 60, type: "string", align: "left" },
		  		{ display: "编码", name: "code", width: 120, minWidth: 60, type: "string", align: "left" },		 
		  		{ display: "Url", name: "url", width: 140, minWidth: 60, type: "string", align: "left" },		 
		  		{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
		  			editor: { type: 'spinner',mask:"nnn",required:true}}
		  		],
		  		dataAction : 'server',
		  		url: web_app.name+'/oaInstitutionAction!slicedQueryInstitutionConfig.ajax',
		  		parms:{institutionId:getInstitutionId(),pagesize:1000},
		  		width : '100%',
		  		height : '99%',
		  		heightDiff : -5,
		  		headerRowHeight : 25,
		  		rowHeight : 25,
		  		sortName:'sequence',
		  		sortOrder:'asc',
		  		toolbar: toolbarOptions,
		  		fixedCellHeight : true,
		  		selectRowButtonOnly : true,
		  		checkbox: true,
		  		enabledEdit: true,
		  		usePager: false
		  	});
		  	UICtrl.setSearchAreaToggle(gridManager);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

function saveHandler(){
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0){
		Public.tip('没有数据被修改！');
		return false;
	}
	Public.ajax(web_app.name + '/oaInstitutionAction!saveInstitutionConfig.ajax', {detailData:encodeURI($.toJSON(detailData))}, function(data) {
		reloadGrid();
	});
	return false;
}

function getInstitutionId() {
	return $('#institutionId').val();
}

function onEditNodeClick(node,obj){
	var data = node.data;
	var isTree = data.isTree;
	var id = data.id;
	if(isTree=="f"){//制度细项
		$('#institutionId').val(id);
		$('#institutionName').val(data.name);
		$('#fullName').val(data.fullName);
		gridManager.options.parms['institutionId'] =id;
	}
	else{
		$('#institutionId').val("");
		$('#institutionName').val("");
		$('#fullName').val("");
		gridManager.options.parms['institutionId'] = 0;
	}
	reloadGrid();
}
