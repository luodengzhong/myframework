var gridManager = null;
$(document).ready(function() {
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		deleteHandler: deleteHandler,
		receiver:{id:'receiver',text:'增加接收人',img:'page_boy.gif',click:function(){
			parent.openChooseOrgDialog('增加接收人',function(data){
				$.each(data,function(i,o){
					o['orgUnitId']=o['id'];
					o['orgUnitName']=o['name'];
					o['kindId']='receiver';
					o['kindIdTextView']='接收人';
				});
				gridManager.addRows(data);
			});
		}},
		handler:{id:'handler',text:'增加处理人',img:'page_user_dark.gif',click:function(){
			parent.openChooseOrgDialog('增加处理人',function(data){
				$.each(data,function(i,o){
					o['orgUnitId']=o['id'];
					o['orgUnitName']=o['name'];
					o['kindId']='handler';
					o['kindIdTextView']='事务处理人';
				});
				gridManager.addRows(data);
			});
		}},
		feedbacker:{id:'feedbacker',text:'增加反馈接收人',img:'page_user_light.gif',click:function(){
			parent.openChooseOrgDialog('增加反馈接收人',function(data){
				$.each(data,function(i,o){
					o['orgUnitId']=o['id'];
					o['orgUnitName']=o['name'];
					o['kindId']='feedbacker';
					o['kindIdTextView']='反馈接收人';
				});
				gridManager.addRows(data);
			});
		}},
		feedbackViewer:{id:'feedbackViewer',text:'增加管理者',img:'page_user.gif',click:function(){
			parent.openChooseOrgDialog('增加管理者',function(data){
				$.each(data,function(i,o){
					o['orgUnitId']=o['id'];
					o['orgUnitName']=o['name'];
					o['kindId']='feedbackViewer';
					o['kindIdTextView']='管理者';
				});
				gridManager.addRows(data);
			});
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "名称", name: "orgUnitName", width: 200, minWidth: 60, type: "string", align: "left" },	
			{ display: "人员类别", name: "kindIdTextView", width: 80, minWidth: 60, type: "string", align: "left"},		
			{ display: "机构类别", name: "orgKindId", width: 80, minWidth: 60, type: "string", align: "left",  
				render: function (item) {
                        return OpmUtil.getOrgKindDisplay(item.orgKindId);
                }
            },		
			{ display: "路径", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/oaInfoAction!slicedQueryCommonHandler.ajax',
		parms:{bizId:$('#infoPromulgateId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'kindId,fullSequence',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}
//删除
function deleteHandler(){
	var data = gridManager.getSelectedRow();
	if (!data) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('删除的数据执行"确定"后生效,确定删除?',function(){
		gridManager.deleteRow(data);
	});
}
//保存数据改变
function saveHandler(){
	var delData=new Array();
	var deleteData=gridManager.getDeleted();
	if(deleteData){
		$.each(deleteData,function(i,o){
			if(o['bizId']&&o['commonHandlerId']){//存在关联单据信息
				delData.push(o);
			}
		});
	}
	var addData=gridManager.getAdded();
	addData=addData?addData:new Array();
	if(delData.length==0&&addData.length==0){
		Public.tip('数据没有发生改变，请确认!');
		return false;
	}
	var param={
		infoPromulgateId:$('#infoPromulgateId').val(),
		addData:encodeURI($.toJSON(addData)),
		delData:encodeURI($.toJSON(delData))
	};
	var _self=this;
	Public.ajax(web_app.name + '/oaInfoAction!saveChangeHandler.ajax',param, function(){
		//setTimeout(function(){_self.close();},2000);
	});
}
