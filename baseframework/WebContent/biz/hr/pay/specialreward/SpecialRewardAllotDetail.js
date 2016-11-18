var gridManager = null, refreshFlag = false;
var yesOrNo={1:'是',0:'否'};	
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	$('#specialRewardFileList').fileList();
}
//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [	   
				{ display: "组织名称", name: "orgFullName",id:"organName", width: 350, minWidth: 60, type: "string", align: "left" },			      
				{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "姓名", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left" },
				{ display: "金额", name: "amount", width: 120, minWidth: 60, type: "money", align: "right"},		      
				{ display: "分配责任人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
				{ display: "团队比例", name: "groupRatio", width: 100, minWidth: 60, type: "string", align: "left"},		   
				{ display: "是否为团队基金", name: "isGroupAmount", width: 100, minWidth: 60, type: "string", align: "left",
					render: function (item) { 
						return yesOrNo[item.isGroupAmount];
					} 
				},
				{ display: "备注", name: "remark", width: 200, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/hRSpecialRewardAction!slicedQueryDetailByAllot.ajax',
		parms:{auditId:$('#auditId').val(),allotParentId:$('#allotParentId').val(),pagesize:'1000'},
		width : '99%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		usePager:false,
		fixedCellHeight : true,
		sortName:'sequence',
		sortOrder:'asc',
		selectRowButtonOnly : true,
		tree: {
            columnId: 'organName',
            idField: 'speciaId',
            parentIDField: 'parentId'
        },
        isShowDetailToggle:function(item){//只能是个人分配才能使用明细分页
			return parseInt(item.allotKind,10)==3;
        },
        detail: {height:'auto', onShowDetail: function(row, detailPanel,callback){
        	setTimeout(function(){initStagesGrid(row,detailPanel);},0);
        }},
		onLoadData :function(){
			return !($('#auditId').val()=='');
		}
	});
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
function getId() {
	return $("#auditId").val() || 0;
}
//关联任务时使用的业务ID
function getTaskinstRelationsBizId(){
	return $("#firstAuditId").val();
}
function setId(value){
	
}
function afterSave(){
	reloadGrid();
}

//初始化分期表格
function initStagesGrid(row, detailPanel){
	var speciaId=row['speciaId'];
    $(detailPanel).append('<div style="margin:5px;" id="stagesGrid'+speciaId+'"></div>');
    UICtrl.grid('#stagesGrid'+speciaId, {
    	 columns:[
             { display: '分期金额', name: 'stagesAmount',type:'money',width: 120, minWidth: 60},
             { display: '执行期间', name: 'periodName',width: 220,type:'string' },
             { display: '执行时间', name: 'executionTime',type:'date' },
             { display: "是否生效", name: "isEffect", width: 60, minWidth: 60, type: "string", align: "left",
 				render: function (item) { 
 					return PayPublic.getIsEffectfo(item.isEffect);
 				} 
 			 }
         ],
         dataAction : 'server',
 		 url: web_app.name+'/hRSpecialRewardAction!slicedQuerySpecialRewardByStages.ajax',
 		 parms:{speciaId:speciaId,pagesize:'1000'},
         showToggleColBtn: false, 
         width:540, 
         usePager:false,
         showTitle: false,
 		 fixedCellHeight : true,
 		 selectRowButtonOnly : true,
         columnWidth: 100
     });
}