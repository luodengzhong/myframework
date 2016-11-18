var gridManager = null, detailGridManager =null, refreshFlag = false;
var orgNode=null;
var copyData={};//复制粘贴评分人
var periodMap=null,scorePersonLevel={},perStatus={};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	periodMap=$('#periodMapQuery').combox('getFormattedData');
	scorePersonLevel = $('#scorePersonLevel').combox('getJSONData');
	perStatus=$('#perStatusQuery').combox('getJSONData');
	initializeUI();
	initializeGrid();
	initDetailGrid();
});
function initializeUI(){
	$('#mainfullId').val("-1");
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5,onSizeChanged:function(){
		try{detailGridManager.reRender();}catch(e){}
	}});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrPerFormAssessManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos,psm"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	$('div.l-layout-center').css({borderWidth:0});
}
function onFolderTreeNodeClick(data) {
	var fullId='',orgKindId='';
	orgNode=null;
	if(data){
		fullId=data.fullId;
		$('#mainFullId').val(fullId);
		orgKindId=data.orgKindId;
		if(orgKindId=='psm'){//选择的是人员，新增时默认为选中人员
			orgNode=data;
		}
	}
	if (!fullId) {
		$('#maingrid').find(".l-panel-header-text").html('被考核人列表');
	} else {
		$('#maingrid').find(".l-panel-header-text").html(
				"<font style=\"color:Tomato;font-size:13px;\">["
						+ data.name + "]</font>" + '被考核人列表');
	}
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var underAssessmentId=$('#mainUnderAssessmentId').val();
	var paType=$('#paType').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		noAduitHandler:{id:'noaduit',text:'修改状态',img:'',click:onAduit},
		disableHandler: disableHandler,
		moreOperate:{id:'moreOperate',text:'更多操作',img:'page_settings.gif',click:function(){}}
		/*copyPerson:{id:'copyPerson',text:'复制',img:'copy.gif',click:function(){
			var row = gridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			copyData['underAssessmentId']=row.underAssessmentId;
			copyData['data']=detailGridManager.currentData['Rows'];
			Public.successTip('复制成功！');
		}},
		pastePerson:{id:'pastePerson',text:'粘贴',img:'paste.png',click:function(){
			var row = gridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			var underAssessmentId=row.underAssessmentId;
			if(copyData['underAssessmentId']==underAssessmentId){
				return;
			}
			addPersons(copyData['data'],'scorePersonId','scorePersonName');
			Public.successTip('粘贴成功！');
		}},
		aduitHandler:{ id:'sendAduit',text:'发起审核',img:'page_next.gif',click:sendAduit}*/
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [  
			{ display: "姓名", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "排名单位", name: "orgnName", width: 180, minWidth: 60, type: "string", align: "left" },
			{ display: "考核表", name: "templetName", width: 160, minWidth: 60, type: "string", align: "left",
				render : function(item) {
					return '<a href="javascript:showForm('+item.evaluationId+',\''+item.templetName+'\');" class="GridStyle">'+item.templetName+'</a>';
				}
			},
			{ display: "类别", name: "periodName", width: 60, minWidth: 60, type: "string", align: "left"},
			{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
				render : function(item) {
					return perStatus[item.status];
				}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/performassessAction!slicedQueryUnderAssessment.ajax',
		parms:{fullId:$('#mainFullId').val(),underAssessmentId:underAssessmentId,paType:paType},
		manageType:'hrPerFormAssessManage',
		pageSize : 20,
		title: "被考核人列表",
		width : '59%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox:true,
		sortName:'personName',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.underAssessmentId);
		},
		onLoadData :function(){
			return !($('#mainFullId').val()=='')||!($('#mainUnderAssessmentId').val()=='');
		},
		onSelectRow:function(data, rowindex, rowobj){
			refreshDeatilGrid(data.underAssessmentId);
		},
		onSuccess:function(){
			var v=$('#mainUnderAssessmentId').val();
			if(v!=''&&v!=-1){
				refreshDeatilGrid(-1);
			}
		}
	});
	UICtrl.createGridQueryBtn('#maingrid',function(param){
		UICtrl.gridSearch(gridManager, {personName:encodeURI(param)});
	});
	initMoreOperate();
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
//更多操作按钮
function initMoreOperate(){
	var more=$('#toolbar_menumoreOperate');
	more.contextMenu({
		width:"100px",
		eventType:'mouseover',
		autoHide:true,
		overflow:function(){
			var of=more.offset(),height=more.height()+2;
			return {left:of.left,top:of.top+height};
		},
		items:[
			 {name:"删除",icon:'copyGif',handler:function(){deleteHandler()}},
			{name:"复制评分人",icon:'copyGif',handler:function(){
				var row = gridManager.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return; }
				copyData['underAssessmentId']=row.underAssessmentId;
				copyData['data']=detailGridManager.currentData['Rows'];
				Public.successTip('复制成功！');
			}},
			{name:"粘贴评分人",icon:'paste',handler:function(){
				var row = gridManager.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return; }
				var underAssessmentId=row.underAssessmentId;
				if(copyData['underAssessmentId']==underAssessmentId){
					return;
				}
				addPersons(copyData['data'],'scorePersonId','scorePersonName');
				Public.successTip('粘贴成功！');
			}},
			{classes:'separator'},
			{name:"发起审核",icon:'next',handler:sendAduit}
			
		],
		onSelect:function(){
			this._hideMenu();
		}
	});
}

//直接修改表的状态
function  onAduit(){
	 var underAssessmentIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'underAssessmentId' });
     if (!underAssessmentIds) return;
     var sts=DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'status' });
	 for(var i=0;i<sts.length;i++){
    		if(parseInt(sts[i])==3 ){
    			Public.tip('审核中的状态不能修改!');
    			return false;
    		}
     }
	UICtrl.confirm('确定修改评分名单的状态为【已审核】吗?',function(){
	     $('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!noAduit.ajax',
		param:{underAssessmentIds:$.toJSON(underAssessmentIds)},
		success : function() {
			reloadGrid();
			}
	});
	});
}
//添加按钮 
function addHandler() {
	var fullId=$('#mainFullId').val();

	if(fullId==''||fullId=='-1'){
		Public.tip("请选择组织节点!");
		return;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!showInsertUnderAssessment.load',
		ok: insert,
		init:initDialog,
		title:"新增考核人",
		width:350
	});
}
//编辑按钮
function updateHandler(underAssessmentId){
	if(!underAssessmentId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		underAssessmentId=row.underAssessmentId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!showUpdateUnderAssessment.load', 
		param:{underAssessmentId:underAssessmentId}, 
		ok: update,
		init:initDialog,
		title:"编辑考核人",
		width:350
	});
}
function initDialog(){
	var underAssessmentId=$('#underAssessmentId').val();
		var paType=$('#paType').val();
	if(underAssessmentId==''){//新增
		//选择的是人员，新增时默认为选中人员
		if(orgNode){
			$('#detailPersonId').val(orgNode.id);
			$('#detailPersonName').val(orgNode.name);
		}
	}
	$('#detailPersonName').searchbox({
		type : 'sys',
		name : 'orgSelect',
		back : {
			personMemberId : '#detailPersonId',
			name : '#detailPersonName'
		},
		getParam : function(){
			var param={a : 1,b : 1};
			param['searchQueryCondition']= " org_kind_id ='psm'  and instr(full_id, '.prj') = 0 and full_id like '"+$('#mainFullId').val()+"%'";
			return param;
		}
	}).blur(function(){
		$('#detailFormName').val('('+$('#detailPersonName').val()+')'+$('#templetName').val());
	});
	
	$('#detailPeriodCode').combox({data:periodMap});
	
	$('#templetName').searchbox({type : 'hr',name : 'performAssessTempletSelect',
		getParam:function(){
			return {fullId:$('#mainFullId').val(),paType:paType};
		},
		back : {
			templetId : '#evaluationId',
			templetName : '#templetName'
		}
	}).blur(function(){
		$('#detailFormName').val('('+$('#detailPersonName').val()+')'+$('#templetName').val());
	});
	$('#detailOrgnName').orgTree({filter:'ogn,dpt',
			getParam:function(){
			  return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			},
			manageType:'noControlAuthority',//不进行权限过滤
			back:{
				text:'#detailOrgnName',
				value:'#detailOrgnId',
				id:'#detailOrgnId',
				name:'#detailOrgnName'
			},
			beforeChange:function(data){
				//考核主体验证
				var flag=false,fullId=data.fullId;
				if(!fullId){
					fullId=$('input[name="fullId"]',data).val();
				}
				if(!fullId){
					return false;
				}
				Public.authenticationAssessSubject('',fullId,false,function(f){
					flag=f;
					if(f===false){
						Public.tip('选择的单位不是考核主体！');
					}
				});
				return flag;
			}
	});
}
//删除模板
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/performassessAction!deleteUnderAssessment.ajax',{underAssessmentId:row.underAssessmentId}, 
		function(){
			reloadGrid();
			refreshDeatilGrid(-1);
		});
	});
}
//停用
function disableHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定停用选中数据吗?',function(){
		Public.ajax(web_app.name + '/performassessAction!disableUnderAssessment.ajax',{underAssessmentId:row.underAssessmentId}, 
		function(){
			reloadGrid();
			refreshDeatilGrid(-1);
		});
	});
}
//新增保存
function insert() {
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!insertUnderAssessment.ajax',
		success : function(data) {
			_self.close();
			reloadGrid();
		}
	});
}

//编辑保存
function update(){
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!updateUnderAssessment.ajax',
		success : function() {
			_self.close();
			reloadGrid();
		}
	});
}
//更改显示状态,不重刷表格
function updateMainStatus(){
	var row = gridManager.getSelectedRow();
	gridManager.updateRow(row,{status:0});
}
function refreshDeatilGrid(underAssessmentId){
	$('#mainUnderAssessmentId').val(underAssessmentId);
	detailGridManager.options.parms.underAssessmentId = underAssessmentId;
	detailGridManager.loadData();
}

function initDetailGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler:savePersonHandler,
		addHandler: addPersonHandler,
		updateHandler: updateAssessPersonHandler,
		deleteHandler:deletePersonHandler
	});
	detailGridManager = UICtrl.grid('#assessPersongrid', {
		columns : [ 
		  {display : "评分人姓名",name : "scorePersonName",width : 100,minWidth : 60,type : "string",align : "left"},
		  {display : "评分人级别",name : "scorePersonLevel",width : 80,minWidth : 60,type : "string",align : "left",
			editor : {
				type : 'combobox',
				data : scorePersonLevel
			},
			render : function(item) {
				return scorePersonLevel[item.scorePersonLevel];
			}
		  }, 
		  {display : "所占权重(%)",name : "proportion",width : 60,minWidth : 60,type : "string",align : "left"
		  },
		  {display : "序号",name : "sequence",width : 60,minWidth : 60,type : "string",align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'nnn'
			}
		}],
		dataAction : 'server',
		url: web_app.name+'/performassessAction!slicedQueryPerformAssessPerson.ajax',
		pageSize : 20,
		width : '39%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight :25,
		enabledEdit: true,
		sortName:'sequence',
		sortOrder:'asc',
		checkbox:true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#mainUnderAssessmentId').val()=='');
		}
	});
}

function addPersonHandler(){
	var underAssessmentId=$('#mainUnderAssessmentId').val();
	if(underAssessmentId==''||underAssessmentId<=0||underAssessmentId=='-1'){
		Public.tip("请选择考核表!");
		return;
	}
	
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();

	UICtrl.showFrameDialog({
		title : "选择评分名单",
		url : web_app.name + "/orgAction!showSelectOrgDialog.do",
		param : selectOrgParams,
		width : 700,
		height : 400,
		ok : function() {
			var _self=this,data = _self.iframe.contentWindow.selectedData;
			if (!data)
				return;
			addPersons(data,'id','name');
			_self.close();
		}
	});
}
function addPersons(data,idName,name){
	var addRows = [], addRow;
	$.each(data, function(i, o) {
		// 绩效考核全部默认为上级
		addRow = $.extend({}, o);
		addRow["assessPersonId"]='';
		addRow["underAssessmentId"]='';
		addRow["scorePersonId"] = o[idName];
		addRow["scorePersonName"] = o[name];
		addRow["proportion"] = 0;
		addRow["scorePersonLevel"] = 'superior';
		addRow["sequence"] =i+1;
		addRows.push(addRow);
	});
	detailGridManager.addRows(addRows);
}
function reLoaddetailGrid(){
	detailGridManager.loadData();
}

//删除评分名单
function deletePersonHandler(){
	DataUtil.delSelectedRows({action:'performassessAction!deletePerformAssessPerson.ajax',
		gridManager:detailGridManager,idFieldName:'assessPersonId',
		param:{underAssessmentId:$('#mainUnderAssessmentId').val()},
		onSuccess:function(){
			reLoaddetailGrid();
			updateMainStatus();
		}
		
	});
}

//发送审核按钮
function sendAduit(){
	var fullId=$('#mainFullId').val();
	if(fullId==''||fullId=='-1'){
		Public.tip("请选择组织节点!");
		return;
	}
    var underAssessmentIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'underAssessmentId' });
     if (!underAssessmentIds) return;
     var sts=DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'status' });
	 for(var i=0;i<sts.length;i++){
    		if(parseInt(sts[i])==3 ){
    			Public.tip('审核中的状态不能修改!');
    			return false;
    		}
     }
	UICtrl.confirm('确定发起审核吗?',function(){
		$('#submitForm').ajaxSubmit({url: web_app.name + '/assessmentauditAction!sendAduit.ajax',
			param:{fullId:fullId,kind:"personAduit",underAssessmentIds:$.toJSON(underAssessmentIds)}, 
			success : function() {
				reloadGrid();
			}
		});
	});
}
//批量保存评分人
function savePersonHandler(){
	var underAssessmentId=$('#mainUnderAssessmentId').val();
	if(underAssessmentId==''||underAssessmentId<=0||underAssessmentId=='-1'){
		return;
	}
	var detailData=DataUtil.getGridData({gridManager:detailGridManager,idFieldName:'assessPersonId'});
	if(!detailData) return false;
	if(detailData.length==0) return;
	Public.ajax(web_app.name + "/performassessAction!savePerformAssessPerson.ajax",
			{detailData:encodeURI($.toJSON(detailData)),underAssessmentId:$('#mainUnderAssessmentId').val()},
			function(){
				reLoaddetailGrid();	
				updateMainStatus();
				UICtrl.confirm('是否修改状态为已审核吗?',function(){
			    		 $('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!noAduitOneTempletOrPerson.ajax',
		                   param:{underAssessmentId:underAssessmentId},
	                   	   success : function() {
			                  reloadGrid();
			                 }
	                        }); 	
				})
			}
	);
}
function showForm(evaluationId,name){
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!queryIndexForView.load', 
		param:{evaluationId:evaluationId}, 
		ok: false,
		init:function(doc){
			var div=$('#viewTempletIndexDiv').width(840);
			var height=div.height(),wh=getDefaultDialogHeight()-50;
			if(height>wh){
				div.height(wh);
			}
		},
		title:"考核表["+name+"]指标",
		width:850
	});
}
//修改评分人级别和权重
function updateAssessPersonHandler(){
	var data =detailGridManager.getSelectedRows();
	if (!data || data.length < 1) {
		Public.tip('请选择需要编辑的评分人！');
		return false;
	}
	var html=['<div class="ui-form">','<form method="post" action="">'];
	html.push("<div class='row'><dl>");
    html.push("<dt style='width:80px'>评分人级别<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' id='choose_scorePersonLevel' required='true' maxlength='20' value=''/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<div class='row'><dl>");
    html.push("<dt style='width:80px'>所占权重(%)<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' id='choose_proportion' required='true' maxlength='20' value='' mask='nnn'/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<dl></div>","</form>");
	UICtrl.showDialog( {
		width:280,
		top:150,
		title : '修改评分人级别',
		content:html.join(''),
		ok : function(){
			var scorePersonLevel=$('#choose_scorePersonLevel').val();
			var proportion=$('#choose_proportion').val();
			if(scorePersonLevel==''){
				Public.tip('请选择评分人级别！');
			    return false;
			}
			if(proportion==''){
				Public.tip('请填写所占权重！');
			    return false;
			}
			$.each(data,function(i,o){
				detailGridManager.updateRow(o,{
	                scorePersonLevel: scorePersonLevel,
	                proportion: proportion
	            });
			});
			return true;
		},
		init:function(){
			$('#choose_scorePersonLevel').combox({data:scorePersonLevel});
		}
	});
}