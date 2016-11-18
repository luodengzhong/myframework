var gridManager = null , refreshFlag = false,scorePersonLevel=null,personIdTmp;
$(document).ready(function() {
	 $('#staffName').searchbox({ type:"hr", name: "resignationChoosePerson",
			back:{
				ognId:"#fromOrganId",ognName:"#fromOrganName",centreId:"#fromCenterId",employedDate:"#employedDate",age:"#age",specialty:"#specialty",
				centreName:"#fromCenterName",dptId:"#fromDeptId",dptName:"#fromDeptName",posDesc:"#fromPosDesc",posLevel:"#fromPosLevel",
				posId:"#fromPositionId",posName:"#fromPositionName",staffName:"#staffName",archivesId:"#archivesId",education:"#education",
				staffingPostsRank:"#fromStaffingPostsRank",  postsRankSequence:"#fromPostsRankSequence",
				wageCompany:"#fromPayOrganId",companyName:"#fromPayOrganName",staffKind:"#staffKind",staffingLevel:"#staffingLevel",personId:"#personId"	
			    },
			  onChange:function(){
	        	 $('#fromPosLevel').combox('setValue');
	        	 $('#fromStaffingPostsRank').combox('setValue');
	        	 $('#education').combox('setValue');
	        	 $("#rank").val('');
	        	 $('#rank').combox('setValue');
	        	 var archivesId =  $("#archivesId").val();
	     		 Public.ajax(web_app.name + '/reshuffleAction!queryLatestPerformanceRank.ajax?',{archivesId:archivesId}, function(data){
	     			 if(null!=data.effectiveRank){
	    				 $("#rank").val(data.effectiveRank);
	    				 $('#rank').combox('setValue');
	    			 }
	    		 });
	     		gridManager.options.parms['personId'] =$("#personId").val();
	     		reloadGrid();
	          }
	 });
	 posNameSelect($('#toPositionName'));
	 $('#reshuffleFileList').fileList();
	 //选择是否就职演讲
	  
	 var isInauguralV=$('#isInaugural').combox({onChange:function(o){
		changeJudgesComposeTr(o.value);
	}}).val();
	
	function changeJudgesComposeTr(value){
		var tr=$('#judgesComposeTr');
      if(value==1){
			$('#judgesCompose').attr('required',true);
			$('div,span',tr).add(tr).show();
			
		}else{
			$('#judgesCompose').removeAttr('required');
		    $('div,span',tr).add(tr).hide();
		}
	}
	
	changeJudgesComposeTr(isInauguralV);

	  	//职级选择
	 $('#toStaffingPostsRank').combox({onChange:function(){
		$('#toPostsRankSequence').val('');
	 }});
	  //职级序列的选择
	  $('#toPostsRankSequence').searchbox({
		type:'hr',name:'postsRankSequenceByFullId',checkboxIndex:'code',
		showToolbar:true,pageSize:100,checkbox:true,
		maxHeight:200,
		getViewWidth:function(){
			return 180;
		},
		getParam:function(){
			var organId=$('#toOrganId').val();
			var staffingPostsRank=$('#toStaffingPostsRank').val();
			if(staffingPostsRank!=''){
				return {organId:organId,searchQueryCondition:"staffing_posts_rank='"+staffingPostsRank+"'"};
			}else{
				return {organId:organId,searchQueryCondition:""};
			}
		},
		back:{code:$('#toPostsRankSequence')}
	});	
	//职能选择
	$('#toResponsibilitiyName').treebox({
		name:'responsibilitiy',
		checkbox:true,
		back:{text:$('#toResponsibilitiyName'),value:$('#toResponsibilitiyId')}
	});
	 
	 setEditable();
     UICtrl.autoSetWrapperDivHeight();
     scorePersonLevel = $('#scorePersonLevel').combox('getJSONData');
	 initializeGrid();
	
});

function setEditable(){
	if(isApproveProcUnit()){//是审核中
		setTimeout(function(){
			UICtrl.enable('#type');
			if(!Public.isReadOnly){
		    $('#reshuffleFileList').fileList('enable');
	     }
		},0);
		
	
		permissionAuthority['maingrid.addHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.deleteHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.scorePersonName']={authority:'readwrite',type:'1'};
		permissionAuthority['maingrid.scorePersonLevel']={authority:'readwrite',type:'1'};
		permissionAuthority['maingrid.sequence']={authority:'readwrite',type:'1'};
	
	}else{
//		setTimeout(function(){
//			UICtrl.disable('#type');
//		},0);
	}
}



function isApproveProcUnit(){
	return procUnitId == "Approve";
}


//选择机构
function ognNameSelect($el){
	$el.orgTree({filter:'ogn',param:{searchQueryCondition:"org_kind_id in('ogn')"},
		manageType:'noControlAuthority',
		back:{
			text:$el,
			value:'#toOrganId',
			id:'#toOrganId',
			name:$el
		}
	});
}
//选择中心
function centreNameSelect($el){
	$el.orgTree({filter:'dpt',manageType:'noControlAuthority',
		getParam:function(){
			var ognId=$('#toOrganId').val();
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
				if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '/"+ognId+"%'");
				}
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		back:{
			text:$el,
			value:'#toCenterId',
			id:'#toCenterId',
			name:$el
		}
	});
}
//选择部门
function dptNameSelect($el){
	$el.orgTree({filter:'dpt',manageType:'noControlAuthority',
		getParam:function(){
			var ognId=$('#toOrganId').val();
			var centreId=$('#toCenterId').val();
			root='orgRoot';
			if(ognId!=''){
			   root=ognId;
			}
			if(centreId!=''){
			   root=centreId;
			}
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				return {a:1,b:1,orgRoot:root,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
				if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '/"+ognId+"%'");
				}
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		back:{
			text:$el,
			value:'#toDeptId',
			id:'#toDeptId',
			name:$el
		}
	});
}
//选择岗位
function posNameSelect($el){
	$el.orgTree({filter:'pos',manageType:'noControlAuthority',
		searchName :'hrPosSelect',
		searchType :'hr',
		onChange:function(values,nodeData){
			if($('#toPositionId').val()==''){
				$('#toPosLevel').combox('setValue','');
				return;
			}
			if(this.mode=='tree'){
				Public.ajax(web_app.name + "/hrSetupAction!loadPosTier.ajax", {posId: $('#toPositionId').val()}, function(data) {
					$.each(data,function(i,id){
						if(i=='posLevel'){
							$('#toPosLevel').combox('setValue',id);
						}
					});
				});
				$('#toOrganName').val(nodeData.orgName);
	        	$('#toOrganId').val(nodeData.orgId);
	        	$('#toCenterName').val(nodeData.centerName);
	        	$('#toCenterId').val(nodeData.centerId);
	        	$('#toDeptName').val(nodeData.deptName);
	        	$('#toDeptId').val(nodeData.deptId);
			}else{
				$('#toPosLevel').combox('setValue');
			}
		},
		back:{
			text:$el,
			value:'#toPositionId',
			id:'#toPositionId',
			name:$el,
			posLevel:'#toPosLevel',
			orgName:'#toOrganName',
			orgId:'#toOrganId',
			centerName:'#toCenterName',
			centerId:'#toCenterId',
			deptName:'#toDeptName',
			deptId:'#toDeptId'
		}
	});
}

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
	gridManager.options.parms['auditId'] =value;
	$('#reshuffleFileList').fileList({bizId:value});
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addPersonHandler, 
		updateHandler: updateAssessPersonHandler,
		deleteHandler: deleteHandler	
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "测评人", name: "scorePersonName", width: 200, minWidth: 200, type: "string", align: "left",
		editor: { type: 'select',   required: true, data: { type:"sys", name: "orgSelect",
				getParam: function(){
				 return { a: 1, b: 1, searchQueryCondition: " org_kind_id ='psm'  and instr(full_id, '.prj') = 0" };
				}, back:{personMemberId: "scorePersonId", personMemberName: "scorePersonName" }
		}}	
		},
			
	  { display: "级别", name: "scorePersonLevel", width: 150, minWidth: 150, type: "String", align: "center",
			editor: { type:'combobox',data : scorePersonLevel, required: true},	
			render : function(item) {
				return scorePersonLevel[item.scorePersonLevel];
			}
		},		   
		
		 {display : "序号",name : "sequence",width : 100,minWidth : 60,type : "string",align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'nnn'
			}},
			 {display : "权重",name : "proportion",width : 100,minWidth : 60,type : "string",align : "left"
			
			}
		],
		dataAction : 'server',
		url: web_app.name+'/reshuffleAction!slicedQueryPerformAssessPerson.ajax',
		parms:{personId:$('#personId').val(),underAssessmentId:$('#underAssessmentId').val(),periodCode:'jscp'},
		pageSize : 20,
		width : '99%',
		height : 300,
		heightDiff : -5,
		usePager:false,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{scorePersonId:'',assessPersonId:'',underAssessmentId:''},
		onLoadData :function(){
			return true;
		}
	});
}

function addPersonHandler(){
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
	gridManager.addRows(addRows);
}

//修改评分人级别和权重
function updateAssessPersonHandler(){
	var data =gridManager.getSelectedRows();
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
    html.push("<dl></div>","</form>");
	UICtrl.showDialog( {
		width:280,
		top:150,
		title : '修改评分人级别',
		content:html.join(''),
		ok : function(){
			var scorePersonLevel=$('#choose_scorePersonLevel').val();
			if(scorePersonLevel==''){
				Public.tip('请选择评分人级别！');
			    return false;
			}
			$.each(data,function(i,o){
				gridManager.updateRow(o,{
	                scorePersonLevel: scorePersonLevel
	            });
			});
			return true;
		},
		init:function(){
			$('#choose_scorePersonLevel').combox({data:scorePersonLevel});
		}
	});
}
//删除评分人
function deleteHandler(){
	DataUtil.delSelectedRows({ action:'reshuffleAction!deletePerformAssessPerson.ajax',
		gridManager: gridManager,idFieldName:'assessPersonId',
		onSuccess:function(){
			reloadGrid();
		}
	});	
}


function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager,idFieldName:'assessPersonId'});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}

function getOrganId(){
	return $("#organId").val();
}

function afterSave(){
	reloadGrid();
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
