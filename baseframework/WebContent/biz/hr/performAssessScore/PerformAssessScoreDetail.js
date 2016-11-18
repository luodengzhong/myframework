var gridManager = null,levelMap={};
$(document).ready(function() {
	levelMap=$('#levelMapQuery').combox('getJSONData');
	initializeUI();
	bindEvent();
});
function initializeUI(){
	$('html').addClass("html-body-overflow");
	var layout=$("#layout"),bodyHeight;
	UICtrl.layout(layout, { leftWidth : 230,  heightDiff :-3 , onHeightChanged: function(options){
		bodyHeight = layout.height() - 2;
        $('#scoreLeft').height(bodyHeight-38);
        $('#scoreCenter').height(bodyHeight-38);
    }});
	bodyHeight = layout.height() - 2;
	$('#scoreLeft').height(bodyHeight-38);
	$('#scoreCenter').height(bodyHeight-38).css({ overflowX:'hidden',overflowY:'auto'});
	//处理toolbar
	var div=$('div.l-layout-center').find('div.l-layout-header').attr('id','scoreToolbar');
	div.html('').css({border:'0px',borderBottom:'1px',fontWeight:'normal'}).toolBar([
	    {id:'save',name:'保存',icon:'save',disable:true,event:save},
		{line:true,id:'saveLine'},
		{id:'savesubmit',name:'提交',icon:'turn',disable:true,event:submit},
		{line:true,id:'savesubmitLine'},
		{id:'savecopy',name:'复制',icon:'copy',disable:true,event:copyScore},
		{line:true,id:'savecopyLine'}
	]);
	$('#savecopy,#savecopyLine').hide();
}

function bindEvent(){
	$('#scoreLeft').bind('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.GridStyle')){
			$('div.divChoose',this).removeClass('divChoose');
			var id=$clicked.attr('id'),type=$clicked.attr('type'),isOnJobAssess=$clicked.attr('isOnJobAssess');
			var isCountAsscore=$clicked.attr('isCountAsscore');
			queryperformAssessScoreList(id,type,isOnJobAssess,isCountAsscore);
			$clicked.parent().addClass('divChoose');
		}
	});
	var bizId=Public.getQueryStringByName("bizId");
	chooseFirstScore(bizId);
}

function initscoreInput(){
	var personId=$('#performAssessScorePersionId').val();
	var totalTD=$('#total_'+personId);
	var inputs=$('#intancePage').find('input.text');
	inputs.each(function(){
		$(this).mask('nnn.nn',{number:true}).blur(function(){
			var total=0,value=0;
			inputs.each(function(){
				value=parseFloat($(this).val());
				if(!isNaN(value)){
					total=total+value;
				}
			});
			totalTD.html(total);
		});
	});
	if(inputs.length>0){
		$('#scoreToolbar').toolBar('enable');
	}
	$('#savecopy,#savecopyLine').show();
}

function initscorePaInput(){
	var inputs=$('#intancePage').find('input.text');
	inputs.each(function(){
		$(this).combox({data:levelMap,dataSortFunction:function(a,b){
			return parseInt(a.value,10)>parseInt(b.value,10)?-1:1;
		}});
	});
	if(inputs.length>0){
		$('#scoreToolbar').toolBar('enable');
	}
	$('#savecopy,#savecopyLine').hide();
}

function initscorePaOnJobInput(){
	var inputs=$('#intancePage').find('input.text');
    inputs.each(function(){
		$(this).mask('nnn.nn',{number:true}).blur(function(){
		var score=$(this).val();
		if(score>100){
			Public.tip('分数不能超过100分');
			$(this).val('');
		}
		});
	});
	$('#scoreToolbar').toolBar('enable');
	$('#savecopy,#savecopyLine').hide();
}

function chooseFirstScore(bizId){
	var aList=$('#scoreLeft').find('a.GridStyle');
	if(aList.length>0){
		var first=null;
		if(bizId){
			aList.each(function(i,o){
				if($(o).attr('id')==bizId){
					first=$(o);
					return false;
				}
			});
		}
		if(!first){
			first=$(aList.get(0));
		}
		var id=first.attr('id'),type=first.attr('type'),isOnJobAssess=first.attr('isOnJobAssess');
		var isCountAsscore=$clicked.attr('isCountAsscore');
		queryperformAssessScoreList(id,type,isOnJobAssess,isCountAsscore);
		first.parent().addClass('divChoose');
	}else{//没有数据了关闭本页面
		UICtrl.closeAndReloadTabs("TaskCenter", null);
	}
}

function save(){
	var isOnJobAssess=$('#isOnJobAssess').val();
	var formId=$('#performAssessScoreFormId').val();
	if(isOnJobAssess==1){
		var onJobAssessValues=getOnJobAssessValues();//获取胜任力测评综合评价和改进建议
		if(!onJobAssessValues) return;
		var scoreValues=getOnJobAssessScoreValues();
		$('#submitForm').ajaxSubmit({
		url: web_app.name+'/performAssessScoreDetailAction!savePaOnJobScore.ajax',
		param: {values:$.toJSON(onJobAssessValues),scoreValues:$.toJSON(scoreValues)}
	});
	}else{
	var values=getScoreValue();
	if(!values) return;
	var addsubScore=$('#addsubScore').val();
	var realityCompeteContents=getrealityCompeteContent();
	var evaluateValues=getPersonEvaluateValue();
	$('#submitForm').ajaxSubmit({
		url: web_app.name+'/performAssessScoreDetailAction!saveScore.ajax',
		param: {formId:formId,addsubScore:addsubScore,values:$.toJSON(values),realityCompeteContents:$.toJSON(realityCompeteContents),evaluateValues:$.toJSON(evaluateValues)}
	});
	}
}


function getOnJobAssessValues(){
	var values=[], detailId,onJobAssess,onJobSuggest,scoreNum,value,scale,tempValue,flag=true;
	$('#performAssessOnJobTable').find('tr').each(function(){
         detailId=$(this).find('input[name="detailId"]').val();	
         scoreNum=$(this).find('input[name="scoreNum"]').val();
         onJobAssess=$(this).find('textarea[name="overallEvaluation"]').val();
         value=$(this).find('input[name="score"]').val();
         scale=value;
         tempValue=(value*scoreNum*0.01).toFixed(2);
		 value=tempValue;
		if(onJobAssess==''){
			Public.tip('请填写完整改进和提升计划!');
			flag=false;
			return false;
		}else{
		values.push({detailId:detailId,overallEvaluation:onJobAssess});
		}
	});
	return flag?values:false;
}

function getOnJobAssessScoreValues(){
	 var scoreValues=[], detailId,scoreNum,value,scale,tempValue,scorePersonDetailId;
     $('#performAssessOnJobTable').find('tr').each(function(){
         detailId=$(this).find('input[name="detailId"]').val();	
         scorePersonDetailId=$(this).find('input[name="scorePersonDetailId"]').val();	
         scoreNum=$(this).find('input[name="scoreNum"]').val();
         value=$(this).find('input[name="score"]').val();
         scale=value;
		 //判断是否是测评
		if(!isNaN(scoreNum)){
			tempValue=(value*scoreNum*0.01).toFixed(2);
			value=tempValue;
		}
		 scoreValues.push({detailId:detailId,scorePersonDetailId:scorePersonDetailId,score:value,scale:scale});
	});
	return scoreValues;
}

function getOnJobTotalScoreValues(){
	var values=[], scorePersonDetailId,totalScore;
	$('#personScoreTable').find('tr').each(function(){
         scorePersonDetailId=$(this).find('input[name="scorePersonDetailId"]').val();	    
         totalScore=$(this).find('input[name="totalScore"]').val();
		if(totalScore==''){
			Public.tip('请填写总分!');
			return ;
		}else{
		values.push({scorePersonDetailId:scorePersonDetailId,totalScore:totalScore});
		}
	});
	return values;
}

function submit(){
	var isOnJobAssess=$('#isOnJobAssess').val();
	var formId=$('#performAssessScoreFormId').val();
    if(isOnJobAssess==1){
		var onJobAssessValues=getOnJobAssessValues();//获取在岗履职测评综合评价和改进建议
		if(!onJobAssessValues) return;
		var scoreValues=getOnJobAssessScoreValues();
		UICtrl.confirm('您确定要提交评分结果吗?提交后分数无法修改,请核实你的分值!',function(){
		$('#submitForm').ajaxSubmit({
		url: web_app.name+'/performAssessScoreDetailAction!submitPaOnJobScore.ajax',
		param: {values:$.toJSON(onJobAssessValues),scoreValues:$.toJSON(scoreValues),formId:formId},
		success:function (data){
			reLoadQueryperformAssessList();
		}
	  });
	 });
	 }
	else{
	var values=getScoreValue();
	if(!values) return;
	var evaluateValues=getPersonEvaluateValue();
	var realityCompeteContents=getrealityCompeteContent();
	var jxassessType=$('#jxassessType').val();
	var addsubScore=$('#addsubScore').val();
	var type=$('#performAssessScoreType').val();
	var url='/performAssessScoreDetailAction!submitScore.ajax';
	if(type != 1){
		//不等于1 表示不是绩效 现指测评和调查
		url='/performAssessScoreDetailAction!submitScorePa.ajax';
	}
	UICtrl.confirm('您确定要提交评分结果吗?提交后分数无法修改,请核实你的分值!',function(){
		$('#submitForm').ajaxSubmit({url: web_app.name+url,
			param: {formId:formId,addsubScore:addsubScore,jxassessType:jxassessType,values:$.toJSON(values),realityCompeteContents:$.toJSON(realityCompeteContents),evaluateValues:$.toJSON(evaluateValues)},
			success : function(data) {
				reLoadQueryperformAssessList();
			}
		});
	});
  }
}

function getrealityCompeteContent(){
	var values=[], indexDetailId,realityCompeteContent;
	$('#performAssessScoreTable').find('tr').each(function(){
         indexDetailId=$(this).find('input[name="indexDetailId"]').val();	    
         realityCompeteContent=$(this).find('textarea[name="realityCompeteContent"]').val();
		if(realityCompeteContent==''){
			Public.tip('请填写实际完成情况!');
			return ;
		}else{
		values.push({indexDetailId:indexDetailId,realityCompeteContent:realityCompeteContent});
		}
	});
	return values;
	
}

function getScoreValue(){
	var values=[], detailId,value,name,defaultScore,realityCompeteContent,tempValue,evaluate,scale,flag=true;
	$('#intancePage').find('input[name="score"]').each(function(){
		name=$(this).attr('name');
		if(name!='score') return;
		value=parseFloat($(this).val()),detailId=$(this).attr('id');
		defaultScore=parseFloat($(this).attr('defaultScore'));
		scale=value;
		if(isNaN(value)){
			Public.tip('请填写分数!');
			flag=false;
			if($(this).is(':hidden')){
				$('input[name="score_text"]',$(this).parent()).focus();
			}else{
				$(this).focus();
			}
			return false;
		}
		//判断是否是测评
		if(!isNaN(defaultScore)&&$(this).is(':hidden')){
			tempValue=(value*defaultScore*0.01).toFixed(2);
			value=tempValue;
		}
		values.push({detailId:detailId,value:value,scale:scale});
	});
	return flag?values:false;
}


function getPersonEvaluateValue(){
	var values=[], scorePersonId,evaluate;
	$('#personEvaluateTable').find('tr').each(function(){
	    scorePersonId=$(this).find('input[name="scorePersonId"]').val();
		evaluate=$(this).find('textarea[name="evaluate"]').val();
		values.push({scorePersonId:scorePersonId,evaluate:evaluate});
	});
	return values;
}
function copyScore(){
	UICtrl.confirm('您确定要复制分数吗?',function(){
		var inputs=$('#intancePage').find('input.text');
		inputs.each(function(){
			var td=$(this).parent(),prevTd=td.prev();
			var value=prevTd.text();
			$(this).val(value);
		});
		$(inputs.get(0)).triggerHandler('blur');
	});
}
function queryperformAssessScoreList(formId,type,isOnJobAssess,isCountAsscore){
	var tip=Public.tips({autoClose:false});
	type=parseInt(type,10);
	var url='/performAssessScoreDetailAction!queryScoreDetailList.load';//加载绩效页面jsp
	if(type != 1){
		if(isOnJobAssess==1){
		 url='/performAssessScoreDetailAction!queryScoreDetaiPaOnJoblList.load';//加载在岗履职测评页面
		}else{
		url='/performAssessScoreDetailAction!queryScoreDetaiPalList.load';//加载测评页面
		}
	}
	$('#scoreToolbar').toolBar('disable');
	$('#intancePage').load(web_app.name + url,{formId:formId,paType:type,isOnJobAssess:isOnJobAssess,isCountAsscore:isCountAsscore},function(){
		tip.remove();
		if(type == 1){
			initscoreInput();//绩效
		}else{
		 if(isOnJobAssess==1){
			 //initscorePaOnJobInput();	//在岗履职测评
		 	initscorePaInput();
		  }else{
			 initscorePaInput();//测评
		 }
		}
	});
}
//刷新
function reLoadQueryperformAssessList(){
	$('#scoreToolbar').toolBar('disable');
	Public.ajax(web_app.name + "/performAssessScoreDetailAction!reLoadQueryperformAssessList.ajax",{},function(data){
		var html = [];
		$.each(data, function(i, o){
			html.push('<div class="list_view">');
			html.push('<a href="javascript:void(null);" class="GridStyle" ');
			html.push('type="',o.paType,'" ');
			html.push('id="',o.formId,'" ');
			html.push('isOnJobAssess="',o.isOnJobAssess,'">');
			html.push(o.formName,'</a>');
			html.push('</div>');
        });
		$("#scoreLeft").html(html.join(""));
		chooseFirstScore();
	});
}