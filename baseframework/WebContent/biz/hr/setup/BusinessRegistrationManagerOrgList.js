var gridManager = null,selectOrgDialog=null;
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
		{ display: "单位名称", name: "orgName", width: 200, minWidth: 60, type: "string", align: "left" },		   
		{ display: "路径", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedQueryBusinessRegistrationManagerOrg.ajax',
		parms:{businessRegistrationId:$('#businessRegistrationId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		sortName:'fullSequence',
		sortOrder:'asc',
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
	DataUtil.del({action:'hrSetupAction!deleteBusinessRegistrationManagerOrg.ajax',
		gridManager:gridManager,idFieldName:'managerOrgId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

function showChooseOrgDialog(){
    if (!selectOrgDialog) {
        selectOrgDialog = UICtrl.showDialog({
            title: "选择机构...",
            width: 350,
            content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="movetree"></ul></div>',
            init: function () {
                $('#movetree').commonTree({
                	loadTreesAction:'orgAction!queryOrgs.ajax',
            		parentId :'orgRoot',
            		getParam : function(e){
            			if(e){
            				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
            			}
            			return {showDisabledOrg:0};
            		},
            		changeNodeIcon:function(data){
            			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
            		},
            		IsShowMenu:false
                });
            },
            ok: function(){
            	var moveToNode = $('#movetree').commonTree('getSelected');
			    var moveToId = moveToNode.id;
			    var moveToName=moveToNode.name;
			    var moveToFullId=moveToNode.fullId;
			    if (!moveToId) {
			        Public.tip('请选择组织节点！');
			        return false;
			    }
			    var params = {};
			    params.orgId = moveToId;
			    params.orgName = moveToName;
			    params.fullId = moveToFullId;
			    params.businessRegistrationId=$('#businessRegistrationId').val();
			    Public.ajax(web_app.name + "/hrSetupAction!saveBusinessRegistrationManag.ajax", params, function () {
			    	reloadGrid();
					selectOrgDialog.hide();
				});
            },
            close: function () {
                this.hide();
                return false;
            }
        });
    } else {
        selectOrgDialog.show().zindex();
    }
}