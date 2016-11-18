var gridManager = null, refreshFlag = false,rewardApplyKind=null;
var yesOrNo={1:'是',0:'否'};	
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	rewardApplyKind=$('#mainRewardApplyKind').combox('getJSONData');
	initializeGrid();
	initializeUI();
});
//关联任务时使用的业务ID
function getTaskinstRelationsBizId(){
	return $("#firstAuditId").val();
}
function initializeUI(){
	var parentId=$('#allotParentId').val();
	if(parentId!=''){//分配父ID不为空
		$('#mainRewardApplyKind').combox('disable');
		UICtrl.disable('#title');
		UICtrl.disable('#allAmount');
		$('#deleteProcessInstance,#deleteProcessInstance_line').hide();
		if(isApplyProcUnit()){//申请环节可改团队比例和团队捐赠信息
			$('#modifGroupRatio').show().click(doModifGroupRatio);
			$('#showTeamDonate').show().click(showTeamDonate);
			$('#teamDonateFlag1').click(showTeamDonate);
		}
	}
	if(!isApplyProcUnit()){
		var v=$('#teamDonateFlag0').getValue();
		if(v==''){//空代表不捐赠
			$('#teamDonateFlag0').setValue('0');
		}
	}
	//不控制是否添加组织
	/*var allotKind=$('#allotKind').val();
	if(allotKind=='2'){
		$('#toolbar_menuaddOrgan').hide();
	}*/
	$('#toolbar_menuaddPersion').comboDialog({type:'hr',name:'personArchiveSelect',width:635,
		dataIndex:'archivesId',
		checkbox:true,onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["organId"] = o["dptId"];
	    		addRow["organName"] = o["dptName"];
	    		addRow["orgFullName"] = o["dptName"];
	    		addRow["archivesName"] = o["staffName"];
	    		addRow["allotKind"] =3;
	    		addRow["isGroupAmount"] =0;
	    		addRow["parentId"] =$('#allotParentId').val();
	    		addRows.push(addRow);
    	});
	    gridManager.addRows(addRows);
    	return true;
    }});
	$('#specialRewardFileList').fileList();
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addOrgan:{id:'addOrgan',text:'添加单位',img:'page_component.gif',click:addOrganPage},
		addPersion:{id:'addPersion',text:'添加人员',img:'page_boy.gif'},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [	   
				{ display: "组织名称", name: "orgFullName",id:"organName", width: 350, minWidth: 60, type: "string", align: "left" },			      
				{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "姓名", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left" },
				{ display: "金额", name: "amount", width: 120, minWidth: 60, type: "money", align: "left",
					editor: { type:'text',required: true,mask:'positiveMoney'},
					render: function (item) { 
						return  Public.currency(item.amount);
					}
				},		      
				{ display: "分配责任人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
				{ display: "团队比例", name: "groupRatio", width: 100, minWidth: 60, type: "string", align: "left",
					editor: { type:'text',mask:'nnn'}
				},		   
				{ display: "是否为团队基金", name: "isGroupAmount", width: 100, minWidth: 60, type: "string", align: "left",
					editor: { type:'combobox',data:yesOrNo},
					render: function (item) { 
						return yesOrNo[item.isGroupAmount];
					} 
				},
				{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
					editor: { type:'text',mask:'nnn'}
				},
				{ display: "备注", name: "remark", width: 200, minWidth: 60, type: "string", align: "left",editor: { type:'text'}}
		],
		dataAction : 'server',
		url: web_app.name+'/hRSpecialRewardAction!slicedQuerySpecialRewardDetail.ajax',
		parms:{auditId:$('#auditId').val(),parentId:$('#allotParentId').val(),pagesize:'1000'},
		width : '99%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		sortName: 'speciaId',
        sortOrder: 'asc',
		usePager:false,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRowByKeydown:false,
		sortName:'sequence',
		sortOrder:'asc',
		autoAddRow:{allotKind:'',fullId:''},
		tree: {
            columnId: 'organName',
            idField: 'speciaId',
            parentIDField: 'parentId'
        },
        onBeforeEdit:function(editParm){
			var c=editParm.column;
			var auditId=editParm.record['auditId'];
			if(getId()&&auditId){//不是本单据的数据
				if(auditId!=getId()){
					return false;
				}
			}
			
			var allotKind= parseInt(editParm.record['allotKind'],10);
			if(c.name=='isGroupAmount'){
			   return allotKind==3;
			}
			if(c.name=='isByStages'){
			   return allotKind==3;
			}
			var parentId=$('#allotParentId').val();
			if(parentId!=''&&parentId==editParm.record['speciaId']){
				if(c.name=='amount'||c.name=='groupRatio'){
					return false;
				}
			}
			if(c.name=='groupRatio'){
				return allotKind!=3;
			}
			return true;
		},
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

function setId(value){
	$("#auditId").val(value);
	if($("#firstAuditId").val()==''){
		$("#firstAuditId").val(value);
	}
	gridManager.options.parms['auditId'] =value;
	$('#specialRewardFileList').fileList({bizId:value});
}
function afterSave(){
	reloadGrid();
}

/*//保存
function save(fn) {
	var detailData =getExtendedData();
	if(detailData===false){
		return;
	}
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/hRSpecialRewardAction!saveSpecialRewardAudit.ajax',
		param : $.extend({}, detailData),
		success : function(data) {
			if (!getId())
				setId(data);
			afterSave();
			if($.isFunction(fn)){
				fn.call(window);
			}
		}
	});
}*/

function checkConstraints(){
	if (gridManager.getData().length == 0){
		Public.tip("没有数据信息，不能提交！");
		return false;
	}
	return true;
}
function deleteHandler(){
	DataUtil.delSelectedRows({action:'hRSpecialRewardAction!deleteSpecialRewardDetail.ajax',
		gridManager: gridManager,idFieldName:'speciaId',
		onCheck:function(data){
			var parentId=$('#allotParentId').val();
			if(data.speciaId!=''&&data.speciaId==parentId){
				Public.tip(data.organName+'不能删除!');
				return false;
			}
		},
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}
function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {firstAuditId:'',detailData:encodeURI($.toJSON(detailData))};
}
function dialogClose(){
	reloadGrid();
}
function addOrganPage(){
	var doAdd=function(){
		UICtrl.showAjaxDialog({url: web_app.name + '/hRSpecialRewardAction!showAddOrganPage.load',
			width:300,top:100,ok: saveOrgan,title:"添加单位",init:initChooseOrgan, close: dialogClose
		});
	};
	var auditId=$('#auditId').val();
	if(auditId==''){
		save(doAdd);
	}else{
		doAdd();
	}
}
function initChooseOrgan(){
	var organName=$('#detailOrganName');
	var ognId=$('#allotOrganId').val();
	//var filter=ognId!=''?'dpt':'ogn,dpt';
	var filter='ogn,dpt';
	organName.orgTree({filter:filter,param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		getParam:function(){
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				//return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
				return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id in ('ogn','dpt')"];
				/*if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '%"+ognId+"%'");
				}*/
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		back:{
			text:organName,
			value:'#detailOrganId',
			id:'#detailOrganId',
			name:organName
		},
		beforeChange:function(data){
			var type=null;
			if($.isPlainObject(data)){
				type=data['orgKindId'];
			}else{
				type=$('input[name="orgKindId"]',data).val();
			}
			if(type=='ogn'){
				$('#detailAllotKind').val(1);
			}else{
				$('#detailAllotKind').val(2);
			}
		}
	});
	var personMember=$('#detailPersonMemberName');
	personMember.orgTree({filter:'psm',
		getParam:function(){
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				//return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId};
				return {a:1,b:1,orgRoot:'orgRoot'};
			}else{
				var param={a:1,b:1},condition=[];
				/*if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '%"+ognId+"%'");
				}*/
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		back:{
			text:personMember,
			value:'#detailPersonMemberId',
			id:'#detailPersonMemberId',
			name:personMember
		}
	});
}

function saveOrgan(){
	var speciaId=$('#speciaId').val();
	var url=web_app.name + '/hRSpecialRewardAction!insertSpecialRewardDetail.ajax';
	if(speciaId!=''){
		url=web_app.name + '/hRSpecialRewardAction!updateSpecialRewardDetail.ajax';
	}
	var kind=parseInt($('#mainRewardApplyKind').val(),10);
	if(!isNaN(kind)&&kind>0&&kind<4){//奖励团队经费不能小于20%
		var groupRatio=parseInt($('#groupRatio').val(),10);
		if(!isNaN(groupRatio)&&groupRatio<20){
			Public.tips({type:2,content:'团队经费不能小于20%!'});
			return;
		}
	}
	$('#submitForm').ajaxSubmit({url: url,
		param:{auditId:$("#auditId").val(),parentId:$('#allotParentId').val()},
		success : function(data) {
			if(speciaId==''){
				$('#speciaId').val(data);
			}
			refreshFlag = true;
		}
	});
}
//修改团队比例
function doModifGroupRatio(){
	var modifGroupRatioValue=$('#modifGroupRatioValue').val();
	var html=['<div class="ui-form">'];
	html.push("<div class='row'><dl>");
    html.push("<dt style='width:85px'>团队比例(%)<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:80px'>");
    html.push("<input type='text' class='text' id='modifGroupRatioText' required='true' maxlength='20' value='",modifGroupRatioValue,"'/>");
    html.push("</dd>");
    html.push("</dl></div>");
	html.push("</div>");
	UICtrl.showDialog( {
		width:240,
		top:150,
		title : '修改团队比例',
		content:html.join(''),
		ok : function(){
			var value=$('#modifGroupRatioText').val();
			var allotParentId=$('#allotParentId').val();
			var kind=parseInt($('#mainRewardApplyKind').val(),10);
			if(!isNaN(kind)&&kind>0&&kind<4){//奖励团队经费不能小于20%
				var groupRatio=parseInt(value,10);
				if(!isNaN(groupRatio)&&groupRatio<20){
					Public.tips({type:2,content:'团队经费不能小于20%!'});
					return;
				}
			}
			var _self=this;
			var url=web_app.name+'/hRSpecialRewardAction!updateSpecialRewardGroupRatio.ajax';
			Public.ajax(url,{groupRatio:value,allotParentId:allotParentId},function(data){
				$('#modifGroupRatioValue').val(value);
				$('#showGroupRatio').html(value);
				_self.close();
			});
		},
		init:function(){
			$('#modifGroupRatioText').mask('nnn',{number:true});
		}
	});
}

function showTeamDonate(){
	UICtrl.showAjaxDialog({
		url: web_app.name + '/hRSpecialRewardAction!showTeamDonate.load',
		title:'团队捐赠设置',
		width:300,
		param:{speciaId:$('#allotParentId').val()}, 
		ok: function(){
			var _self=this;
			var proportion=$('#detailTeamDonateProportion').val();
			proportion=parseInt(proportion,10);
			if(isNaN(proportion)){
				Public.tips({type:2,content:'请输入捐赠比例!'});
				return false;
			}
			if(proportion<0||proportion>100){
				Public.tips({type:2,content:'捐赠比例应在[0-100]范围内!'});
				return false;
			}
			$('#teamDonateForm').ajaxSubmit({url: web_app.name + '/hRSpecialRewardAction!saveTeamDonate.ajax',
				param:{auditId:$('#auditId').val(),speciaId:$('#allotParentId').val()},
				success : function(data) {
					$('#TeamDonateInfo').html(data);
					if(data.length>0){
						$('#teamDonateFlag0').setValue('1');
					}else{
						$('#teamDonateFlag0').setValue('0');
					}
					_self.close();
				}
			});
		},
		init:function(){
			var name=$('#teamDonatePagePersonName');
			name.searchbox({ type:"hr", name: "personArchiveSelect",
				back:{staffName:name,personId:"#teamDonatePagePersonId"}
			});	
		}
	});
}