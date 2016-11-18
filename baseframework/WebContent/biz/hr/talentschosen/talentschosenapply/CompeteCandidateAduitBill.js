var gridManager = null,  personGridManager = null,refreshFlag = false,juryTypeMap=null;
var yesOrNo={1:'是',0:'否'};

$(document).ready(function() {
   juryTypeMap=$('#juryTypeMap').combox('getJSONData');
   $('#competeCandidateAduitFileList').fileList();
	initializeGrid();
	initializePersonGrid();
	
	//设置审批页面中字段为可读写
	setEditable();
});

function setEditable(){
	 setTimeout(function(){
				//$('#talentsChosenDemandFileList').fileList('enable');

		},0);
		permissionAuthority['maingrid.yesorno']={authority:'readwrite',type:'1'};
	}

//初始化表格
function initializeGrid() {
	var aduitId=$('#aduitId').val();
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "序号", name: "rownum", width: 40, minWidth: 40, type: "string", align: "center" },		   
		{ display: "单位", name: "ognName", width: 130, minWidth: 60, type: "string", align: "left" },		   
		{ display: "中心", name: "centreName", width: 120, minWidth: 60, type: "string", align: "left" },	
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "员工姓名", name: "staffName", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "行政级别", name: "posLevelTextView", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "毕业学校", name: "campus", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "入职时间", name: "employedDate", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "演讲岗位", name: "chosenPosName", width: 100, minWidth: 60, type: "string", align: "center" },
		{ display: "是否同意", name: "yesorno", width: 100, minWidth: 60, type: "string", align: "left",
	     editor: { type:'combobox',data:yesOrNo,required: true},
			render: function (item) { 
				return yesOrNo[item.yesorno];
			}
	      },
			
		{ display: "查看",  width: 200, minWidth: 60, type: "string", align: "left",
		 render: function (item){
	    		return '<a href="javascript:viewApply('+item.chosenApplyId+',\''+item.staffName+'\');" class="GridStyle">'+'人才选拨申请详情'+'</a>' +
	    				'  ||   '+'<a href="javascript:viewLZCPResultDetail('+'\''+item.personId+'\''+',\''+item.staffName+'\');" class="GridStyle">'+'履职测评分数'+'</a>';
			}}

		],
		dataAction : 'server',
		url: web_app.name+'/talentschosenapplyAction!slicedQueryCompeteCandidateAduitDet.ajax',
		parms:{aduitId:aduitId},
		usePager:false,
		enabledEdit: true,
		pageSize : 20,
		width : '100%',
		height : 220,
		heightDiff : -5,
		headerRowHeight : 25,
		autoAddRowByKeydown:false,
		rowHeight : 25,
		sortName:'rownum',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.talentsChosenDemandId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

function initializePersonGrid(){
		var chosenPosId=$('#chosenPosId').val();
	columns=[ {
			display : "评分姓名",
			name : "juryName",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "center"
		}, {
			display : "评委类别",
			name : "juryTypeId",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "center",
			editor : {
				type : 'combobox',
				data : juryTypeMap
			},
			render : function(item) {
				return juryTypeMap[item.juryTypeId];
			}
		},
		{
		display : "序号",
			name : "sequence",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "center",
			editor : {
				type : 'text',
				required : true,
				mask : 'nn'
			}
		}
		
		];
	
	personGridManager = UICtrl.grid('#personid', {
		columns : columns,
		dataAction : 'server',
		url : web_app.name + '/talentschosendemandAction!slicedQueryJuryCompose.ajax',
		pageSize : 20,
		parms : {
			posId : chosenPosId
		},
		width : '100%',
		height : 300,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'sequence',
		sortOrder : 'asc',
		checkbox : true,
		enabledEdit : true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData : function() {
			return !($('#chosenPosId').val() == '');
		}

	});
	UICtrl.setSearchAreaToggle(personGridManager);
}
function getExtendedData(){
	var extendedData = DataUtil.getGridData({gridManager: gridManager});
	if(!extendedData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(extendedData))};
}


function viewLZCPResultDetail(personId,staffName){
	parent.addTabItem({ 
		tabid: 'HRScoreReault',
		text: staffName+'履职测评结果查看',
		url: web_app.name + '/performAssessResultAction!showDetail.do?PSMId=' 
			+ personId +'&periodCode='+'lzcp'
		}); 
}

function updateHandler(talentsChosenDemandId){
	if(!talentsChosenDemandId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		talentsChosenDemandId=row.talentsChosenDemandId;
	}
	parent.addTabItem({
		tabid: 'HRtalentsDemand'+talentsChosenDemandId,
		text: '人才选拨需求详情',
		url: web_app.name + '/talentschosendemandAction!showUpdate.job?bizId=' 
			+ talentsChosenDemandId+'&isReadOnly=true'
	}
	);
}


function viewApply(chosenApplyId,staffName){
	parent.addTabItem({ 
		tabid: 'HRTalentsChosenApply'+chosenApplyId,
		text: '员工 '+staffName+'人才选拨申请详情',
		url: web_app.name + '/talentschosenapplyAction!showUpdateTalentsChosenApply.do?chosenApplyId=' 
			+ chosenApplyId+'&isReadOnly=true'
		}); 
}
function getId() {
	return $("#aduitId").val() || 0;
}

function setId(value){
	$("#aduitId").val(value);
	gridManager.options.parms['aduitId'] =value;
    $('#competeCandidateAduitFileList').fileList({bizId:value});
}


//打印功能
function print(){
	var  aduitId=$('#aduitId').val();
	var  staffName=$('#staffName').val();
	window.open(web_app.name + '/talentschosenapplyAction!createPdf.load?aduitId='+aduitId+'&staffName='+encodeURI(encodeURI(staffName)));	
}
