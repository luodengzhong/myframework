var  gridManager = null,refreshFlag = false; var fullId=null;
$(document).ready(function() {
	initializeGrid();
});



function initializeGrid(){
		var hunterId=$('#hunterId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		viewPosDetailHandler: {id:'viewPosDetail',text:'推荐候选人',img:'page_new.gif',click:function(){
			viewPosDetail();
		}},
		personRegListHandler: {id:'personList',text:'已推荐人员列表',img:'page_user.gif',click:function(){
			personRegList();
		}}
		
		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "招聘单位", name: "organName", width: 200, minWidth: 60, type: "string", align: "center" },
		{ display: "招聘岗位", name: "name", width: 160, minWidth: 60, type: "string", align: "center"},	
		{ display: "已推荐人数", name: "recommendNum", width: 120, minWidth: 60, type: "string", align: "center" },
        { display: "查看", name: "", width: 180, minWidth: 60, type: "string", align: "center",
	       render: function (item){
		    return '<a href="javascript:viewPosDeslare(\''+item.recPosId+'\');" class="GridStyle">' + '查看岗位职责要求' + '</a>';
	     }}
		],
		dataAction : 'server',
		url: web_app.name+'/personregisterAction!sliceHeadHunterPosList.ajax',
		parms:{hunterId:hunterId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewPosDeslare(data.recPosId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);

}
function viewPosDetail(recPosId){
	var hunterId=$('#hunterId').val();
	if(!recPosId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择岗位！'); return; }
		recPosId=row.recPosId;
		var jobPosId=row.jobPosId;
	}
    window.open (web_app.name + '/personregisterAction!showInsertPersonRegister.do?jobPosId='+jobPosId+'&sourceType='+4+'&hunterId='+hunterId);
}

//查看崗位描述
function viewPosDeslare(recPosId){
	var hunterId=$('#hunterId').val();
	if(!recPosId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		recPosId=row.recPosId;
	   var jobPosId=row.jobPosId;
	}
	  window.open(web_app.name + '/personregisterAction!forwardPosDetailHunter.do?posId='+recPosId+'&sourceType='+4+'&hunterId='+hunterId);

}
function  personRegList(){
	 var hunterId=$('#hunterId').val();
	 window.open( web_app.name +'/personregisterAction!forwardListPersonRegisterByHeader.do?hunterId='+hunterId+
             			'&sourceType='+4);
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

