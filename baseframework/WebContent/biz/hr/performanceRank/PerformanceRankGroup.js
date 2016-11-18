var  performanceLevelData=null;
$(document).ready(function() {
	performanceLevelData=$('#mainPerformanceLevel').combox('getJSONData');
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrPerFormAssessManage',
		getParam : function(e){
			if(e){
				return {showVirtualOrg: 1, showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	 $('#staffName').searchbox({ type:"hr",name: "resignationChoosePerson",
			back:{
				ognId:"#organizationId",ognName:"#organizationName",centreId:"#centerId",
				centreName:"#centerName",dptId:"#deptId",dptName:"#deptName",
				posId:"#posId",posName:"#posName",staffName:"#staffName",archivesId:"#archivesId"}
	 });
	$('#periodIndex').combox({checkbox:true,data:{}});
	var value =$('#periodCode').combox().val(); 
	setPriodIndex(value);	 
	$('#periodCode').combox({
			onChange:function(obj){
				var value = obj.value;
				$('#periodIndex').combox().html('');
				setPriodIndex(value);
			}
		});
	
}

function onFolderTreeNodeClick(data) {
	//点击是判断是否是考核主题
    var fullId = '',underAssessmentId='',underAssessmentName='';
    $('.l-layout-center .l-layout-header').html('发起排名');
    if (data) {
    	fullId = data.fullId;
    	underAssessmentId=data.id;
    	underAssessmentName=data.name;
    	//鉴权通过后才能执行
		Public.authenticationAssessSubject('hrPerFormAssessManage',fullId,true,function(flag){
			if(flag){
				$('#mainFullId').val(fullId);
				$('#underAssessmentId').val(underAssessmentId);
				$('#underAssessmentName').val(underAssessmentName);
				$("#periodIndex").combox('setValue','');

				//根据考核排名单位id查询下面的人员评分是否已经完成
				/*Public.ajax(web_app.name + '/performanceRankAction!queryPersonNumByunderAssessmentId.ajax',
			       {underAssessmentId:underAssessmentId},function(data){
			       	var bb="朱群"
			             var tipdiv=$('#tipdiv').show();
				          tipdiv.html(bb).show();
   
		               });*/
				$('.l-layout-center .l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + data.name + "]</font>" + '被考核人列表');
				
			}else{
				//清除数据
				Public.tip('选择的单位没有权限！');
				$("#underAssessmentId").val('');
				$("#underAssessmentName").val('');
				$("#periodIndex").combox('setValue','');


			}
		});
    }
    
}


function setPriodIndex(value){
	if("month"==value){
		$('#periodIndex').combox('setData',{
			1:'1月',
			2:'2月',
			3:'3月',
			4:'4月',
			5:'5月',
			6:'6月',
			7:'7月',
			8:'8月',
			9:'9月',
			10:'10月',
			11:'11月',
			12:'12月'
		});
	}else if("quarter"==value){
		$('#periodIndex').combox('setData',{
			1:'1季度',
			2:'2季度',
			3:'3季度',
			4:'4季度'
		});
	}else {
		$('#periodIndex').combox('setData',{});					
	}				
}




function getId() {
	return $("#performanceRankGroupId").val() || 0;
}

function setId(value){
	$("#performanceRankGroupId").val(value);
	gridManager.options.parms['performanceRankGroupId'] =value;
}


function    viewRankPerson(){
	 var underAssessmentId=$('#underAssessmentId').val();
	 var periodCode=$('#periodCode').val();
	 var periodIndex=$('#periodIndex').val();
	 if(!underAssessmentId){
			Public.tip("请选择考核实体");
			return;
		}
	 Public.ajax(web_app.name + '/performanceRankAction!queryRankDetailByCondtion.ajax', 
						{underAssessmentId:underAssessmentId,periodCode:periodCode,periodIndex:periodIndex},function(data) {
	                     if(data!=null){
	                   parent.addTabItem({
	                     tabid: 'HRPerformanceRankResultList'+underAssessmentId,
	                     text: '绩效排名查询',
		                  url: web_app.name + '/performanceRankAction!forwardPerformanceRankGroup.job?bizId=' 
		                  	+ data+'&nendConstraint=false'
	                       }
	                      );	
	                     }else{
	                    	 Public.tip("当前所选择单位的【"+periodIndex+periodCode+"】绩效考核还未发起!");
	                     }
						});
	
		
}

function save() {
	UICtrl.confirm('确定要发起此排名吗?',function(){
		var underAssessmentId = $("#underAssessmentId").val();
		if(!underAssessmentId){
			Public.tip("请选择考核实体");
			return;
		}
		$('#submitForm').ajaxSubmit({
			url : web_app.name + '/performanceRankAction!createRankProcTask.ajax',
			success : function() {
				$("#underAssessmentId").val('');
				$("#periodIndex").val('');
			}
		});
		
	})
}


function  createRankPerson(){
	UICtrl.confirm('确定生成排名数据吗?',function(){
		var underAssessmentId = $("#underAssessmentId").val();
	//	alert(underAssessmentId);
		if(!underAssessmentId){
			Public.tip("请选择考核实体");
			return;
		}
		$('#submitForm').ajaxSubmit({
			url : web_app.name + '/performanceRankAction!saveOrUpdateRankGroup.ajax',
			success : function(data) {
			//	afterSave();
				$("#underAssessmentId").val('');
				$("#periodIndex").val('');
	             parent.addTabItem({
	                     tabid: 'HRPerformanceRankResultList'+underAssessmentId,
	                     text: '绩效排名查看',
		                  url: web_app.name + '/performanceRankAction!forwardPerformanceRankGroup.job?bizId=' 
		                  	+ data+'&nendConstraint=false'
	                       }
	                   );	
			}
		});
	})
}







