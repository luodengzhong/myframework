
$(document).ready(function() {
	
	var curDate = new Date();
	setCurYearToPage(curDate.getFullYear());

	createYearView();//初始化年视图
	bindClickEventToYearView();

	//上一年
	$("#preYear").on('click',preYear);
	//下一年
	$("#nextYear").on('click',nextYear);
	
});

function bindClickEventToYearView(){
	var tds = $("#yearCalendarMain #yearTable").find("td");
	var curYear = getCurYear();

	$.each(tds,function(i,t){
		$t = $(t);
		var month = $t.attr("month");
		var starttime = getStarttimeByMonth(curYear,parseInt(month));
		$t.on('click',function(e){
			var yc = new YearCalendar({"month":month,"year":curYear,"starttime":starttime});
			yc.clickYearCalendar(t);
		});
	});
}

function getStarttimeByMonth(year,month){
	var date = "";
	switch(month){
		case 1 : 
			date = year+"-01-01";
			break;
		case 2 :
			date = year+"-02-01";
			break;
		case 3 :
			date = year+"-03-01";
			break;
		case 4 :
			date = year+"-04-01";
			break;
		case 5 :
			date = year+"-05-01";
			break;
		case 6 :
			date = year+"-06-01";
			break;
		case 7 :
			date = year+"-07-01";
			break;
		case 8 :
			date = year+"-08-01";
			break;
		case 9 :
			date = year+"-09-01";
			break;
		case 10 :
			date = year+"-10-01";
			break;
		case 11 :
			date = year+"-11-01";
			break;
		case 12 :
			date = year+"-12-01";
			break;
	}
	return date;
}

function setCurYearToPage(year){
	$("#curYear").html(year);
}

function getCurYear(){
	return $("#curYear").html();
}

function preYear(){
	var cy = getCurYear();
	setCurYearToPage(parseInt(cy)-1);
	createYearView();
	bindClickEventToYearView();
}

function nextYear(){
	var cy = getCurYear();
	setCurYearToPage(parseInt(cy)+1);
	createYearView();
	bindClickEventToYearView();
}

//当点击上一年或下一年时，需要重新生成年视图html
//在审批查看时，该方法会在workcalendar.js中组装好ycDatas后再调用
function createYearView(){
	var curYear = getCurYear();
	var html= ['<table style="width:90%; height:80%;" cellspacing="0">'];
	var tdId;
	var month;
	html.push('<tr>');
	for(var i=1;i<=4;i++){
		html.push('<th class="fc- ui-widget-header">&nbsp;</th>');
	}
	html.push('</tr>');
	
	for(var i=1;i<=3;i++){
		html.push('<tr>');
		month = (i-1)*4+1;
		tdId = curYear+"_"+month+"_td";
		html.push('<td width="25%" height="100" align="left" class="fc- ui-widget-content fc-day0" valign="top" id="'+tdId+'" month="'+month+'">');
		html.push('<div style="position:relative;left:90%;">',month,'月</div>');
		html.push('</td>');
		month = (i-1)*4+2;
		tdId = curYear+"_"+month+"_td";
		html.push('<td width="25%" height="100" align="left" class="fc- ui-widget-content fc-day0" valign="top" id="'+tdId+'" month="'+month+'">');
		html.push('<div style="position:relative;left:90%;">',month,'月</div>');
		html.push('</td>');
		month = (i-1)*4+3;
		tdId = curYear+"_"+month+"_td";
		html.push('<td width="25%" height="100" align="left" class="fc- ui-widget-content fc-day0" valign="top" id="'+tdId+'" month="'+month+'">');
		html.push('<div style="position:relative;left:90%;">',month,'月</div>');
		html.push('</td>');
		month = (i-1)*4+4;
		tdId = curYear+"_"+month+"_td";
		html.push('<td width="25%" height="100" align="left" class="fc- ui-widget-content fc-day0" valign="top" id="'+tdId+'" month="'+month+'">');
		html.push('<div style="position:relative;left:90%;">',month,'月</div>');
		html.push('</td>');
		html.push('</tr>');
	}
	html.push('</table>');
	$("#yearTable").html(html.join(''));
	addCalTextToYearView();
}

function addCalTextToYearView(){
	var curYear = getCurYear();
	for(var i=0;i<ycDatas.length;i++){
		var ycd = ycDatas[i];
		//只显示1年的
		if(curYear == ycd.year){
			var tdId = ycd.year+"_"+ycd.month+"_td";
			var yc = new YearCalendar({calId:ycd.calId,"text":ycd.text,"month":ycd.month,"year":ycd.year}); 
			yc.addCalToYearView($("#"+tdId)[0],ycd.text);
		}
	}
}


function findCalById(id){
	var cal;
	for(var i=0;i<ycDatas.length;i++){
		if(ycDatas[i].calId == id){
			cal = ycDatas[i];
			break;
		}
	}
	return cal;
}


function openCal(id,e){
	e = e?e:window.event;
	//在点击已有日程时，阻止在其单元格中再增加数据
	try{
		e.preventDefault();
		e.stopPropagation();
	}catch(ex){
		e.cancelBubble = true;
	}
	
	var bubble=getYearBubbleTip();

	var curCal = findCalById(id);
	var calText = curCal.text;
	var timeView = curCal.starttime;
	var endtimeView = curCal.endtime;;

	//鼠标点击的坐标
	var x = e.clientX;
	var y = e.clientY;
	//调整坐标
	pos=getbuddlepos(x,y);
	var html=['<table class="bubble-input-table" cellSpacing="0" cellPadding="0"><colgroup><col width="50%"><col width="50%"></colgroup>'];
	html.push('<input type="hidden" id="bubble-year-id" value="',id,'">');
	html.push('<input type="hidden" id="bubble-isalldayevent" value="',1,'">');
	html.push('<tr><td colspan=2>');
	html.push('<tr><td colspan=2><div class="econtent">'+calText+'</div></td></tr>');
	html.push('<tr><td colspan=2 style="border-bottom:1px solid #cccccc;">开始时间:',timeView,'&nbsp;&nbsp;&nbsp;结束时间:');
	if(status == 0){
		html.push('<input type="text" class="text textDate" style="width:90px" id="endtime'+id+'" />');
	}else{
		html.push(endtimeView);
	}
	html.push('</td>','</tr>');
	if(status == 0){
		html.push('<tr><td><a href="#" class="doDel">删除</a>&nbsp;&nbsp;</td>');
	}
	html.push('</tr>');
	html.push('</table>');
	$('#bubbleContentYear1').html(html.join(''));
	
	if(status == 0){
		$("#endtime"+id).datepicker().mask('9999-99-99');//设置为日历控件
		$("#endtime"+id).val(endtimeView);//设置结束时间默认显示日期
	}
	
	bubble.css({ "visibility": "visible", left: pos.left, top: pos.top }).show();
}


var maxLength = 20;


function getMonthPartName(part){
	var monthPartName = "";
	if(part == "top"){
		monthPartName = "上旬";
	}else if(part == "middle"){
		monthPartName = "中旬";
	}else{
		monthPartName = "下旬";
	}
	return monthPartName;
}

//年视图中每个月的日程显示对象封装
var YearCalendar = function(param){
	var par = $.extend({"starttime":"2014-01-01","endtime":"2014-01-31","text":""},param);
	if(param.calId){
		this.calId = param.calId;
	}else{
		this.calId = calId++; //calId 是定义在workcalendar.js里面的（年视图和月视图共用calId,没有重复值)
	}
	
	this.text = par.text;
	this.starttime = par.starttime;
	this.endtime = par.endtime;
	this.month = par.month;//日程在哪个月
	this.year = par.year;//日程在哪年
}

//获得某个月的某个旬的结束日期
function getYearViewTime(year,month,monthPart){
	
	var starttime = "";
	var endtime = "";
	var monthStr = month;
	if(parseInt(month) < 10){
		monthStr = "0"+monthStr;
	}
	
	if(monthPart == "top"){
		starttime = year+"-"+monthStr+"-01";
		endtime = year+"-"+monthStr+"-10"
	}else if(monthPart == "middle"){
		starttime = year+"-"+monthStr+"-11";
		endtime = year+"-"+monthStr+"-20"
	}else{
		starttime = year+"-"+monthStr+"-21";

		var dateStr= year+"/"+(parseInt(month)+1)+"/0";
		var monthMaxDate=new Date(dateStr);
		endtime = dateToStr(monthMaxDate);
	}
	var viewTime = {"starttime":starttime,"endtime":endtime};
	return viewTime;
}

YearCalendar.prototype.addCalToYearView = function(td,text){
	
	this.text = text;
	var displayText = text;
	if(displayText.length > maxLength){
		displayText = displayText.substr(0,maxLength);
	}

	var divId = this.year+"_"+this.month+"_"+this.calId;
	$(td).append("<div id='"+divId+"'><a class='yearcal'  href='#' onclick='openCal("+this.calId+",event);'>"+displayText+"</a></div>");
}

//点击日历月单元格中
YearCalendar.prototype.clickYearCalendar = function(td){
	//审批中，审批通过，审批未通过 都不能点击
	if(status != 0){
		return;
	}

	var finalOrgs = [];
	var receiverNames = [];
	var chs = $("input[type='checkbox']","#receiverShowDiv");
	for(var i=0;i<chs.length;i++){
		if(chs[i].checked){
			var org = new spOrg(chs[i].getAttribute("orgId"),chs[i].getAttribute("orgName"),
					chs[i].getAttribute("orgType"),chs[i].getAttribute("fullId"));
			finalOrgs.push(org);
			receiverNames.push(chs[i].getAttribute("orgName"));
		}
	}

	var funcId = $("#functionId").val();
	var funcName = $("#functionName").val();
	var authorityCode = $("#authorityCode").val();
	var authorityName = $("#authorityName").val();

	//如果选择了执行人，那么点击日历后，日历单位元格中显示   功能(执行人1，执行人2)
	//如果没有选择执行人，则显示 功能(管理权限)
	var subject = "";
	if(receiverNames.length > 0){
		subject = funcName+"("+receiverNames.join(",")+")";
	}else{
		subject = funcName+"("+authorityName+")";
	}
	var text = subject;

	//加进日程数组
	ycDatas.push(this);

	var monthParts = $("input[type='radio']","#yearMonthPart");
	var mpart = "";//表示上旬，中旬，还是下旬
	for(var i=0;i<monthParts.length;i++){
		if(monthParts[i].checked){
			mpart = monthParts[i].value;
			break;
		}
	}
	var timeView = getYearViewTime(this.year,this.month,mpart);
	this.starttime = timeView.starttime;
	this.endtime = timeView.endtime;

	var func = new spFunction(funcId,funcName,authorityCode,authorityName);
	//将功能，执行人，时间进行绑定，存入planYearDatas对象中
	var pd = new planData(this.calId,this.starttime,this.endtime,func,finalOrgs,this.year+"_"+this.month+"_"+mpart);
	planYearDatas.push(pd);

	text = "("+getMonthPartName(mpart)+")"+text;
	//将日程显示在 视图上
	this.addCalToYearView(td,text);
}

//明细对话框删除操作
YearCalendar.prototype.deleteCal = function(){
	var id = this.calId;
	//var curYear = $("#curYear").html();
	var calDivId = this.year+"_"+this.month+"_"+id;
	//从年视图的html中删除 
	$("#"+calDivId).remove();
	
	closeYearAddCalendarBubbleTip();
	for(var i=0;i<ycDatas.length;i++){
		if(ycDatas[i].calId == id){
			ycDatas.splice(i,1);
			break;
		}
	}
	
	for(var i=0;i<planYearDatas.length;i++){
		if(planYearDatas[i].calId == id){
			planYearDatas.splice(i,1);
			break;
		}
	}
}

//测试方法
function printYcData(){
	var ss = " 视图上显示的文本信息\n ";
	for(var i=0;i<ycDatas.length;i++){
		var yd = ycDatas[i];
		ss += " i="+i+"  calId "+yd.calId+" month "+yd.month+"  year "+yd.year+" \n ";
	}

	for(var i=0;i<calDatas.length;i++){
		var yd = calDatas[i];
		ss += "  calId "+yd.id+" starttime "+yd.starttime+" \n ";
	}
	ss+= " \n  数据信息:  \n "
	ss+= " \n planDatas.length "+planDatas.length+" planYearDatas.length "+planYearDatas.length

	for(var i=0;i<planYearDatas.length;i++){
		var yd = planYearDatas[i];
		ss+= " dateStr "+yd.dateStr +"  \n";
	}

	alert(ss);
}



//关闭对话框
function closeYearAddCalendarBubbleTip(){
	var bubble=$('#cw_buddle-tip_year');
	if(bubble.length>0&&bubble.is(':visible')){
		bubble.removeData('chooseTime');
		bubble.css("visibility", "hidden").hide();
	}
}

//创建对话框层
function getYearBubbleTip(){
	var bubble=$('#cw_buddle-tip_year');
	if(bubble.length==0){
		bubble=$('<div id="cw_buddle-tip_year" class="bubble"><table class="bubble-table" cellspacing="0" cellpadding="0"><tbody><tr><td class="bubble-cell-side"><div id="tl1" class="bubble-corner"><div class="bubble-sprite bubble-tl"></div></div></td><td class="bubble-cell-main"><div class="bubble-top"></div></td><td class="bubble-cell-side"><div id="tr1" class="bubble-corner"><div class="bubble-sprite bubble-tr"></div></div></td></tr><tr><td class="bubble-mid" colspan="3"><div id="bubbleContentYear1" style="overflow: hidden;"></div></td></tr><tr><td><div id="bl1" class="bubble-corner"><div class="bubble-sprite bubble-bl"></div></div></td><td><div class="bubble-bottom"></div></td><td><div id="br1" class="bubble-corner"><div class="bubble-sprite bubble-br"></div></div></td></tr></tbody></table><div class="bubble-closebutton"></div><div id="bubble_prong" class="bubble-prong"><div class="bubble-sprite"></div></div></div>').appendTo(document.body);
		bubble.bind('click',function(e){
			var el=$(e.target || e.srcElement);
			e.preventDefault();
			e.stopPropagation();
			if(el.hasClass('bubble-closebutton')){//关闭提示框

				if(status == 0){
					var id=$('#bubble-year-id').val();
					var curSelCal = findCalById(id);	
					//结束时间不能小于开始时间
					var st = curSelCal.starttime.replace(/-/g,"/");
					if(st.length > 10){
						st = st.substr(0,10);
					}
					var stdate = new Date(st);

					var selendtime = $("#endtime"+curSelCal.calId).val();
					var et = selendtime.replace(/-/g,"/");
					var etdate = new Date(et);

					if(etdate < stdate){
						Public.tip("结束时间不能小于开始时间!");
						return;
					}else{
						for(var i=0;i<ycDatas.length;i++){
							if(ycDatas[i].calId == curSelCal.calId){
								ycDatas[i].endtime = selendtime;
								break;
							}
						}
						for(var i=0;i<planYearDatas.length;i++){
							if(planYearDatas[i].calId == curSelCal.calId){
								planYearDatas[i].endtime = selendtime;
								break;
							}
						}
					}
				}

				closeYearAddCalendarBubbleTip();
				return false;
			}
			if(el.is('li.color')){//颜色选择
				var color=el.attr('id');
				bubble.find('li.cur').removeClass('cur');
				el.addClass('cur');
				$('#bubble-className').val(color=='system'?'':color);
				return false;
			}
			if(el.is('li.change')){//颜色改变
				
				return false;
			}
			if(el.is('a.doDel')){//删除日程
				var id=$('#bubble-year-id').val();
				var cal = findCalById(id);	
				cal.deleteCal();//调用日程对象内部的删除方法
				

				return false;
			}
			if(el.is('a.editC')){//打开日程详细对话框
				return false;
			}
			if(el.hasClass('button')){//快捷保存
				
			return false;
			}
		}).bind('mousedown',function(e){
			var el=$(e.target || e.srcElement);
			if(!el.hasClass('bubble-closebutton')){
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		});
	}
	return bubble;
}





