var gridManager = null, refreshFlag = false;

$(document).ready(function() {
	initializeGrid();

});




//初始化表格
function initializeGrid() {
	var jobPosId=$('#jobPosId').val();
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "招聘岗位", name: "name", width: 150, minWidth: 60, type: "string", align: "left"},	
		{ display: "猎头", name: "headHunterName", width: 150, minWidth: 60, type: "string", align: "left" },
		{display: "操作",width: 150,render: function (item){
    		return '<a href="javascript:deleteRelation('+item.id+');" class="GridStyle">' + "删除"+ '</a>';
		} }

		],
		dataAction : 'server',
		url: web_app.name+'/recruitPositionAction!sliceHeadHunterPoslList.ajax',
		parms:{jobPosId:jobPosId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox:false,
		fixedCellHeight : true,
		selectRowButtonOnly : true
		
	});
	UICtrl.setSearchAreaToggle(gridManager);
}



function deleteRelation(id){
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/recruitPositionAction!deleteRelation.ajax', 
				{id:id}, function(){
			reloadGrid();
		});
	});
}


//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 