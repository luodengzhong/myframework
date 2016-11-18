var gridManager = null;
Public.tip.topDiff=10;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: showChooseOrgDialog, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单位名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left" },		   
		{ display: "路径", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/dispatchManagerAction!slicedQueryDispatchKindOrg.ajax',
		parms:{dispatchKindId:$('#dispatchKindId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true
	});
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'dispatchManagerAction!deleteDispatchKindOrg.ajax',
		gridManager:gridManager,idFieldName:'dispatchKindOrgId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

function showChooseOrgDialog(){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='ogn,dpt,pos,psm';
	var options = { params: selectOrgParams,title : "请选择组织",lock:false,
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			var ids=[];
			$.each(data,function(i,o){
				ids.push(o['id']);
			});
			var _self=this,params = {};
			params.ids=encodeURI($.toJSON(ids));
			params.dispatchKindId=$('#dispatchKindId').val();
			Public.ajax(web_app.name + "/dispatchManagerAction!saveDispatchKindOrg.ajax", params, function () {
			    reloadGrid();
				_self.close();
			});
			return false;
		}
	};
	parent.OpmUtil.showSelectOrgDialog(options);
}