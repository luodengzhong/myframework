$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	UICtrl.autoGroupAreaToggle();
	initializeUI();
	bindEvent();
});

function initializeUI(){
	$('html').addClass("html-body-overflow");
	var layout=$("#layout"),bodyHeight;
	UICtrl.layout(layout, { leftWidth : 250,  heightDiff :-3 , onHeightChanged: function(options){
		bodyHeight = layout.height() - 2;
        $('#evaluateGradeList').height(bodyHeight-38);
        $('#evaluateGradeCenter').height(bodyHeight-38);
    }});
	bodyHeight = layout.height() - 2;
	$('#evaluateGradeList').height(bodyHeight-38);
	$('#evaluateGradeCenter').height(bodyHeight-38).css({ overflowX:'hidden',overflowY:'auto'});
	//处理toolbar
	var div=$('div.l-layout-center').find('div.l-layout-header').attr('id','evaluateGradeToolbar');
	div.html('').css({border:'0px',borderBottom:'1px',fontWeight:'normal'});
	div.toolBar([
	    {id:'save',name:'保存',icon:'save',event:save},
		{line:true,id:'saveLine'},
		{id:'savesubmit',name:'提交',icon:'turn',event:submit},
		{line:true,id:'savesubmitLine'}
	]);
	div.toolBar('disable');
}

function bindEvent(){
	$('#evaluateGradeList').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.GridStyle')){
			$('div.divChoose',this).removeClass('divChoose');
			var id=$clicked.attr('id'),title=$clicked.attr('title');
			var html=['填写说明[当前您正在给<font color="red">',title,'</font>评价]'];
			//按要求 2015-03-30 屏蔽
			/*html.push('<span style="line-height:22px;display:none;" id="setDefaultScoreSpan">');
			html.push('&nbsp;<font color="Tomato">默认标准分&nbsp;:</font>&nbsp;');
			html.push('<label><input type="radio" name="defaultScore" value="100" />100分</label>');
			html.push('<label><input type="radio" name="defaultScore" value="90" />90分</label>');
			html.push('<label><input type="radio" name="defaultScore" value="80" />80分</label>');
			html.push('<label><input type="radio" name="defaultScore" value="70" />70分</label>');
			html.push('<label><input type="radio" name="defaultScore" value="60" />60分</label>');
			html.push('</span>');*/
			$('#group').find('span.titleSpan').html(html.join(''));
			loadEvaluateGradePape(id);
			$clicked.parent().addClass('divChoose');
		}
	});
	 $('#group').on('click',function(e){
    	var $clicked = $(e.target || e.srcElement);
    	if($clicked.is('input')){
    		setTimeout(function(){
    			var defaultScore=$clicked.getValue();
    			var scoreEvaluateOrgRelevanceId=$('#scoreEvaluateOrgRelevanceId').val();
    			var table=$('#tbody'+scoreEvaluateOrgRelevanceId);
    			if(!table.length) return;
    			table.find('input').each(function(){
    				if($(this).val()==defaultScore){
    					$(this).attr('checked',true);
    				}
    			});
    		},0);
    	} 
    });
}
//加载评分表
function loadEvaluateGradePape(id){
	var togglebtn=$('#group').find('a.togglebtn');
	if(!togglebtn.hasClass('togglebtn-down')){
		togglebtn.trigger('click');
	}
	$('#evaluateGradeToolbar').toolBar('disable');
	var url= web_app.name +'/evaluateTaskAction!loadEvaluateGradePape.ajax';
	Public.load(url,{evaluateOrgRelevanceId:id},function(html){
		$('#evaluateGradeDiv').html(html);
		initEvaluateGradePape();
	});
}
//初始化评分表
function initEvaluateGradePape(){
	var scoreEvaluateOrgRelevanceId=$('#scoreEvaluateOrgRelevanceId').val();
	var status=$('#scoreStatus').val();
	var table=$('#tbody'+scoreEvaluateOrgRelevanceId);
	mergeCellIndexTable(table,"mainContent");
	mergeCellIndexTable(table,"partContent");
	if(parseInt(status,10)==3){//已评分
		UICtrl.setReadOnly($('#evaluateGradeDiv'));
		$('#setDefaultScoreSpan').hide();
	}else{
		$('#evaluateGradeToolbar').toolBar('enable');
		$('#setDefaultScoreSpan').show();
	}
}
//合并单元格
function mergeCellIndexTable(table,className){
	var oldval,firstTD,counter = 0;
	var $tds=$('td.'+className,table);
	$tds.each(function(index) {
		if (index == 0) {
			oldval = $(this).text();
	        firstTD = $(this).get(0);
	        counter = 1;
	    } else {
	    	if ($(this).text() == oldval) {
	    		$(this).remove();
	            counter++;
	        } else {
	            $(firstTD).attr("rowSpan", counter);
	            oldval = $(this).text();
	            firstTD = $(this).get(0);
	            counter = 1;
	       }
	    }
	    if (index >= $tds.length - 1) {
	   		$(firstTD).attr("rowSpan", counter);
	    }
	});
}

//执行保存方法
function doSave(isSubmit){
	var scoreEvaluateOrgRelevanceId=$('#scoreEvaluateOrgRelevanceId').val();
	//控制滚动条位置高亮显示未评分栏目
	var setScrollTop=function(tr){
		var offsetTop=tr.offset().top;
		var centerDiv=$('#evaluateGradeCenter');
		var centerHeight=centerDiv.height(),scrollTop=centerDiv.scrollTop();
		if(offsetTop<0){
			centerDiv.scrollTop(scrollTop+offsetTop-50);
		}else if(offsetTop>(centerHeight+scrollTop)){
			centerDiv.scrollTop(offsetTop-centerHeight+50);
		}
		tr.find('td.desption').addClass('bright');
	};
	var table=$('#tbody'+scoreEvaluateOrgRelevanceId);
	$('td.bright',table).removeClass('bright');
	var indexScores=new Array(),flag=true;
	var indexId,radioCheckedscore,remark;
	$('tr',table).each(function(){
		indexId=$(this).attr('id');
		remark=$(this).find('textarea').val();
		radioCheckedscore=$(this).find('input:checked');
		if(radioCheckedscore.length>0){
			score=radioCheckedscore.val();
			//低于80分需要填写事项描述
			if(score<80&&remark==''){
				setScrollTop($(this));
				Public.tip('请结合具体事项进行描述！');
				$(this).find('textarea').focus();
				flag=false;
				return false;
			}
		}else{
			setScrollTop($(this));
			Public.tip('请选择评分标准！');
			flag=false;
			return false;
		}
		indexScores.push({evaluateOrgIndexId:indexId,scoreNum:score,remark:remark});
	});
	if(!flag) return false;
	var toDo=function(){
		var param={evaluateOrgRelevanceId:scoreEvaluateOrgRelevanceId};
		var overallEvaluation=$('#overallEvaluation'+scoreEvaluateOrgRelevanceId).val();
		param['overallEvaluation']=encodeURI(overallEvaluation);
		param['indexScores']=encodeURI($.toJSON(indexScores));
		param['isSubmit']=isSubmit;
		var url=web_app.name + '/evaluateTaskAction!saveEvaluateScores.ajax'
		Public.ajax(url,param,function(){
			if(isSubmit){//提交操作
				var a=$('#'+scoreEvaluateOrgRelevanceId),title=a.attr('title');
				a.html(title+'(<font color="green">已评价</font>)').attr('status',3);
				$('#evaluateGradeDiv').html('');
				//屏蔽一下代码 不自动选择下一评分表
				//寻找下一个未评分的机构
				/*UICtrl.setReadOnly($('#evaluateGradeDiv'));
				chooseFirstEvaluatePape();*/
				var togglebtn=$('#group').find('a.togglebtn');
				if(togglebtn.hasClass('togglebtn-down')){
					togglebtn.trigger('click');
				}
				$('#evaluateGradeToolbar').toolBar('disable');
				$('#group').find('span.titleSpan').html('填写说明');
			}
		});
	};
	if(isSubmit){
		UICtrl.confirm('确定提交吗？提交后不能再次修改。',function(){
			toDo();
		});
	}else{
		toDo();
	}
}
//寻找下一个打分表
function chooseFirstEvaluatePape(){
	var aList=$('#evaluateGradeList').find('a.GridStyle');
	aList.each(function(){
		var status=$(this).attr('status');
		if(parseInt(status,10)!=3){//不是已评分状态
			$(this).trigger('click');
			return false;
		}
	});
}
//保存
function save(){
	doSave(false);//不是提交传false
}
//提交
function submit(){
	doSave(true);//提交传入true
}