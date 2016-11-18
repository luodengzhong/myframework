var gridManager = null, refreshFlag = false;
var courseStatusMap = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
    courseStatusMap = $("#status").combox("getJSONData");
});

function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.TrainingCourseType,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.TrainingCourseType){
		parentId="";
		html.push('课程列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>课程列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	$('#flagCode').val(data.shortCode);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		moveHandler:moveHandler,
		deleteHandler:deleteHandler,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
        submitApplication:{
            id:'submitApplication',
            text:'提交申请',
            icon:'action_go.gif',
            click:function(){
                var row = gridManager.getSelectedRow();
                if(row.status!='CREATED'){
                    Public.tips({type:2,content:"课程已锁定，不能提交！"});
                }
	    	Public.ajax(web_app.name + '/trainingCourseAction!submitApplyProc.ajax', 
	    		{trainingCourseId:row.trainingCourseId}, function(data){
	    		  $("#courseApplyId").val(data);
			      reloadGrid();
		       });
            }
        }
	  });
	gridManager = UICtrl.grid('#maingrid', {
        columns: [
            { display: "编号", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "体系", name: "systemTypeTextView", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "单位", name: "courseOrganName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "中心/部门", name: "courseCenterName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "课程名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "课程大纲", name: "outline",  minWidth: 60, type: "string", align: "left" },
            { display: "适用学员", name: "adjustArchives", width: 100, minWidth: 60, type: "string", align: "center" },
            { display: "课程开发者", name: "trainingTeacherName", width: 100, minWidth: 60, type: "string", align: "center" },
            { display: "创建时间", name: "applicationDate", width: 100, minWidth: 60, type: "string", align: "center" },
            { display: "最后更新时间", name: "updateNewDate", width: 100, minWidth: 60, type: "string", align: "center" },
            { display: "状态", name: "status",  minWidth: 60, type: "string", align: "center",render:function(item){
                return courseStatusMap[item.status];
            }},
            { display: "使用次数", name: "num", width: 60, minWidth: 60, type: "string", align: "center" },
            { display: "评价得分", name: "avgScore", width: 60, minWidth: 60, type: "string", align: "center" }
        ],
		dataAction : 'server',
		url: web_app.name+'/trainingCourseAction!slicedQuery.ajax',
		//manageType:'hrReshuffleManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		checkbox:true,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'trainingCourseId',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
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
function moveHandler(){
	 ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "trainingCourseId"
    });
    if (!ids) {
        return;
    }
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动到',kindId:CommonTreeKind.TrainingCourseType,
		save:function(parentId){
			DataUtil.updateById({action:'trainingCourseAction!moveTree.ajax',
				gridManager:gridManager,idFieldName:'trainingCourseId',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();
				}
			});
		}
	});

}
//添加按钮 
function addHandler() {
	var parentId=$('#treeParentId').val();
	var flagCode=$('#flagCode').val();
	if(parentId==''){
		Public.tip('请选择课程类别！'); 
		return;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingCourseAction!showInsert.load',
	param:{flagCode:flagCode}, 
	ok: insert,init:initDialog, close: dialogClose,title:'新增课程',width:600});
}
function initDialog(){
			//选择机构
  var  $el=$('#courseOrganName');
	$el.orgTree({filter:'ogn',param:{searchQueryCondition:"org_kind_id in('ogn')"},
		manageType:'hrArchivesManage',
		onChange:function(){
			$('#courseCenterName').val('');
		    $('#courseCenterId').val('');
		},
		needAuth:false,
		back:{
			text:$el,
			value:'#courseOrganId',
			id:'#courseOrganId',
			name:$el
		}
	});
	var $al=$('#courseCenterName');
		$al.orgTree({filter:'dpt',
			manageType:'hrArchivesManage',
			getParam:function(){
				var ognId=$('#courseOrganId').val();
				var mode=this.mode;
				if(mode=='tree'){//更改树的根节点
					return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
				}else{
					var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
					if(ognId!=''){//增加根查询参数
						condition.push(" and full_id like '%/"+ognId+"%'");
					}
					param['searchQueryCondition']=condition.join('');
					return param;
				}
			},
			back:{
				text:$al,
				value:'#courseCenterId',
				id:'#courseCenterId',
				name:$al
			}
		});
	$('#trainingCourseFileList').fileList();
}
//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
   /* if(row.status!='CREATED'){

        UICtrl.alert("课程已锁定，不能修改!");
        return;
    }*/
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingCourseAction!showUpdate.load',
	param:{trainingCourseId:row.trainingCourseId}, ok: update, close: dialogClose,init:initDialog,
	title:'修改课程信息',width:600});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }

	 if(row.status!='CREATED'){
        UICtrl.alert("课程已提交审核，不能删除");
        return;
        }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/trainingCourseAction!delete.ajax', {trainingCourseId:row.trainingCourseId}, function(){
			reloadGrid();
		});
	});
}

//新增保存
function insert() {
	var id=$('#trainingCourseId').val();
	if(id!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingCourseAction!insert.ajax',
	   param:{parentId:$('#treeParentId').val()},
		success : function(data) {
			$('#trainingCourseId').val(data);
		   $('#trainingCourseFileList').fileList({bizId:data});
			refreshFlag = true;
		}
	});
}


//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingCourseAction!update.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

function getId() {
	return $("#courseApplyId").val() || 0;
}

function setId(value){
	$("#courseApplyId").val(value);
}
//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

