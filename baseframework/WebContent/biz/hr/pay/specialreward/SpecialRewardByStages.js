var gridManager = null, refreshFlag = false;
var yesOrNo={1:'是',0:'否'};	
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	PayPublic.updateOperationPeriod({
		button:'#toolbar_menusaveDefaultPeriod',
		getParam:function(){
			var organId=$('#organId').val();
			var year = new Date().getFullYear();
			return {organId:organId,paramValue:year};
		},
		onChoose:function(){
			var row=this.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			var periodId=row['periodId'];
			Public.ajax(web_app.name + "/hRSpecialRewardAction!saveDefaultPeriod.ajax",{auditId:$('#auditId').val(),periodId:periodId},function(){
				reloadGrid();
			});	
			return true;
		}
	});
	$('#specialRewardFileList').fileList();
	//该任务不能删除
	$('#deleteProcessInstance,#deleteProcessInstance_line').hide();
}

function businessJudgmentUnit(){
	if($.isFunction(window['isDoModel'])){
		return isDoModel();
	}
	return true;
}
function getId() {
	return $("#auditId").val() || 0;
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveDefaultPeriod:{id:'saveDefaultPeriod',text:'默认分期',img:'page_settings.gif'}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [	   
				{ display: "组织名称", name: "orgFullName",id:"organName", width: 350, minWidth: 60, type: "string", align: "left" },			      
				{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "姓名", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left" },
				{ display: "金额", name: "amount", width: 120, minWidth: 60, type: "money", align: "right"},
				{ display: "已执行金额", name: "effectAmount", width: 80, minWidth: 60, type: "money", align: "right"},
				{ display: "分配责任人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
				{ display: "团队比例", name: "groupRatio", width: 100, minWidth: 60, type: "string", align: "left"},		   
				{ display: "是否为团队基金", name: "isGroupAmount", width: 80, minWidth: 60, type: "string", align: "left",
					render: function (item) { 
						return yesOrNo[item.isGroupAmount];
					} 
				},
				{ display: "是否分期", name: "isByStages", width: 60, minWidth: 60, type: "string", align: "center",
					render: function (item) { 
						return yesOrNo[item.isByStages];
					}
				},
				{ display: "是否执行完成", name: "isOver", width: 60, minWidth: 60, type: "string", align: "center",
					render: function (item) { 
						return yesOrNo[item.isOver];
					}
				}
		],
		dataAction : 'server',
		url: web_app.name+'/hRSpecialRewardAction!slicedQueryStages.ajax',
		parms:{auditId:$('#auditId').val(),isFirstAudit:$('#isFirstAudit').val(),pagesize:'1000'},
		width : '99%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		usePager:false,
		fixedCellHeight : true,
		toolbar: toolbarOptions,
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

//初始化分期表格
function initStagesGrid(row, detailPanel){
	var isOver=row['isOver'],speciaId=row['speciaId'];
	var organId=row['orgId'];
	var isByStages=row['isByStages'];
	var stagesGridManager=null;
	var html=['<table style="margin:5px"><tr>'];
	html.push('<td style="text-align:center;vertical-align:top;">');
	if(isByStages==''||isByStages=='0'){
		html.push('总金额&nbsp;<font color=red>',Public.currency(row['amount']),'</font>&nbsp;平均分配&nbsp;');
		html.push('<input type="text" class="text" style="width:60px;" id="stagesNumber'+speciaId+'" value="1"/>&nbsp;期间','<br/>','<div class="blank_div"></div>');
		html.push('<div>开始期间年度&nbsp;:&nbsp;<input type="text" class="text" style="width:80px;" id="stagesYear'+speciaId+'" value="'+new Date().getFullYear()+'"/></div>','<div class="blank_div"></div>');
		html.push('<div>开始期间&nbsp;:<input type="hidden" id="startPeriodId'+speciaId+'" value="'+$('#defStartPeriodId').val()+'"/>&nbsp;&nbsp;');
		html.push('<input type="text" class="text textSearch combox_button" style="width:220px;" id="startPeriodName'+speciaId+'" value="'+$('#defStartPeriodName').val()+'">');
		html.push('</div>');
		html.push('<input type="button" style="margin-top:5px;" class="buttonGray" value="确定" id="stagesButton'+speciaId+'">');
	}
	html.push('</td>');
	html.push('<td style="padding-left:10px;">','<div id="stagesGrid'+speciaId+'"></div>','</td>');
    $(detailPanel).append(html.join(''));
    if(isByStages==''||isByStages=='0'){
	    $('#stagesNumber'+speciaId).spinner({min:1,max:100,countWidth:60,mask:'nnn'}).mask('nnn',{number:true});
	    $('#stagesYear'+speciaId).spinner({countWidth:80}).mask('nnnn');
	    $('#startPeriodName'+speciaId).searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		   var year = $('#stagesYear'+speciaId).val();
		   return {paramValue:year};
	    },back:{periodId:'#startPeriodId'+speciaId,yearPeriodName:'#startPeriodName'+speciaId}});
	    $('#stagesButton'+speciaId).click(function(){
	    	var button=$(this);
	    	var num=$('#stagesNumber'+speciaId).val();
	    	if(num==''){
	    		Public.tip('请输入分期数!');
				return false;
	    	}
	    	Public.ajax(web_app.name + "/hRSpecialRewardAction!saveSpecialRewardAverageScore.ajax",
	    	    {
	    		 auditId:row['auditId'],
	    		 speciaId:row['speciaId'],
	    		 stagesNumber:num,
	    		 amount:row['amount'],
	    		 organId:organId,
	    		 startPeriodId:$('#startPeriodId'+speciaId).val()
	    		 },
	    	    function(){
	    	    	stagesGridManager.loadData();
	    	    	button.parent().hide();
	    	    }
	    	);
	    });
    }
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({
    	saveHandler:function(){
    		var detailData=DataUtil.getGridData({gridManager:stagesGridManager});
    		if(!detailData) return false;
    		if(detailData.length==0){
    			Public.tip('没有数据被修改!');
    			return false;
    		}
    		Public.ajax(web_app.name + "/hRSpecialRewardAction!saveSpecialRewardByStages.ajax",
    	    	{auditId:row['auditId'],speciaId:row['speciaId'],amount:row['amount'],detailData:encodeURI($.toJSON(detailData))},
    	    	function(){
    	    		stagesGridManager.loadData();
    	    	}
    	    );
    	},
		addHandler: function(){
			UICtrl.addGridRow(stagesGridManager);
		}, 
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'hRSpecialRewardAction!deleteSpecialRewardByStages.ajax',
				gridManager: stagesGridManager,idFieldName:'stagesId',
				onCheck:function(data){
					if(parseInt(data.isEffect)!=0){
						Public.tip(data.stagesAmount+'已执行,不能删除!');
						return false;
					}
				},
				onSuccess:function(){
					stagesGridManager.loadData();
				}
			});
		},
		updateOperationPeriod:{id:'updateOperationPeriod'+speciaId,text:'修改业务期间',img:'page_component.gif'}
	});
    stagesGridManager=UICtrl.grid('#stagesGrid'+speciaId, {
    	 columns:[
             { display: '分期金额', name: 'stagesAmount',type:'money',width: 120, minWidth: 60,
            	editor: { type:'text',required: true,mask:'positiveMoney'},
     			render: function (item) { 
     				return  Public.currency(item.stagesAmount);
     			}
             },
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
 		 parms:{speciaId:row['speciaId'],pagesize:'1000'},
         showToggleColBtn: false, 
         width:540, 
         usePager:false,
         showTitle: false,
         checkbox:true,
 		 fixedCellHeight : true,
 		 selectRowButtonOnly : true,
         toolbar: toolbarOptions,
         autoAddRow:{isEffect:'0'},
         enabledEdit: true,
         onBeforeEdit:function(editParm){
 			return editParm.record['isEffect']==0;
 		 },
         columnWidth: 100
     });
    PayPublic.updateOperationPeriod({
    	button:'#toolbar_menuupdateOperationPeriod'+speciaId,
    	onShow:function(){
			var row = stagesGridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return false; }
			var isEffect=row['isEffect'];
			if(isEffect=='1'){
				Public.tip('已生效的数据不能修改！'); 
				return false; 
			}
		},
		getParam:function(){
			var year = new Date().getFullYear();
			return {organId:organId,paramValue:year};
		},
		onChoose:function(){
			var row=this.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			var periodId=row['periodId'];
			var gridRow = stagesGridManager.getSelectedRow();	
			Public.ajax(web_app.name + "/hRSpecialRewardAction!updateOperationPeriod.ajax",
	    	    	{periodId:periodId,stagesId:gridRow['stagesId']},
	    	    	function(){
	    	    		stagesGridManager.loadData();
	    	    	}
	    	);
			return true;
		}	
    });
}