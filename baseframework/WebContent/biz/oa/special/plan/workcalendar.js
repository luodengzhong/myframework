var colors=['system','yellow','blue','green','red'];//进度条可用颜色
/**jquery fullcalendar 插件参数 **/
var fullcalendarOption={
	theme: true,
	monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
	monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],   
    dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],   
    dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],   
	today: ["今天"],
	buttonText: {
		today: '今天',   
        month: '月',   
        week: '周',   
        day: '日'  
    },   
	allDayText:'全天',
	columnFormat: {
		month: 'ddd',
		week: 'ddd M月d日',
		day: 'dddd M月d日'
	},
	timeFormat: {
		'': 'h(:mm)tt' // default
	},
	header: {
		left: 'prev,next today',
		center: 'title'//,
		//right: 'month,agendaWeek,agendaDay'
	},
	editable: true,
	diableResizing:true,
	disableDragging: true,//设置true表示不能拖动
	selectable: true,
	selectHelper: true,
	viewDisplay:function(){closeAddCalendarBubbleTip();},//每次日历加载以及日历的view改变的时候触发一次.
	
	dayClick: function(date, allDay, jsEvent, view) {//日历点击事件
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
		
		var offset=$(this).offset(),x=offset.left+$(this).width()/2,y=allDay?offset.top+$(this).height()/2:jsEvent.pageY;
		var endTime=addDateStep(date,allDay?0:30*60*1000),pos=getbuddlepos(x,y);//不是全天任务默认加一小时
		//这是打开填入日程名称的div,现在专项计划不需要打开了，但是这里面有创建的input隐藏域需要保留，只让div窗口不显示即可
		showAddCalendarBubbleTip(date,endTime,allDay,pos);

		var para={},fields=['subject','startTime','endTime','isAlldayevent','className'];
		$.each(fields,function(i,o){
			var value=$('#bubble-'+o).val();
			if(o=='subject'){
				//如果选择了执行人，那么点击日历后，日历单位元格中显示   功能(执行人1，执行人2)
				//如果没有选择执行人，则显示 功能(管理权限)
				if(receiverNames.length > 0){
					value = funcName+"("+receiverNames.join(",")+")";
				}else{
					value = funcName+"("+authorityName+")";
				}
				
			}
			para[o]=value;
		});
		
		closeAddCalendarBubbleTip();
		$('#calendar').fullCalendar('unselect');//清除选中
		//添加新日程到日历
		var curcalId = calId++;

		
		var stime = new Date(Date.parse(para['startTime'].replace(/-/g,   "/")));   
		//刚点击时，月视图默认的结束日期
		etime = dateToStr(getEndTime(stime));

		$('#calendar').fullCalendar('renderEvent',{
			id:curcalId,
			title:decodeURI(para['subject']),
			start:para['startTime'],
			end:para['startTime'],
			allDay:para['isAlldayevent']=='1'?true:false,
			className:para['className']
		},false);
		var cld = new calData(para['startTime'],para['startTime'],curcalId,decodeURI(para['subject']),etime);
		//已添加的日程存入全局变量，这样日历翻页后才能保留
		calDatas.push(cld);

		var func = new spFunction(funcId,funcName,authorityCode,authorityName);
		//将功能，执行人，时间进行绑定，存入planData对象中
		var pd = new planData(curcalId,para['startTime'],etime,func,finalOrgs);
		planDatas.push(pd);

    },
	eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {//拖动后执行
		dropUpdateCalendar(event,revertFunc);
    },
	eventResize:function(event, dayDelta, minuteDelta, revertFunc) {//拖动改变大小后执行
		dropUpdateCalendar(event,revertFunc);
	},
	eventClick: function(event, jsEvent, view) {//日程点击事件
		var offset=$(this).offset(),x=offset.left+$(this).width()/2,y=view.name=='month'?offset.top+$(this).height()/2:jsEvent.pageY;
        var bubble=getBubbleTip(),pos=getbuddlepos(x,y);
        if (pos.hide) {$("#bubble_prong").css("visibility", "hidden").hide();}else {$("#bubble_prong").css("visibility", "visible").show();}
		var date=event.start,endTime=event.end||date,timeView;
		bubble.data('chooseTime',{startTime:date,endTime:endTime});
		var ddds=fullcalendarOption.dayNamesShort[date.getDay()],ddde=fullcalendarOption.dayNamesShort[endTime.getDay()];
		if(event.allDay){
			if(date.getDate()==endTime.getDate()){//判断是否是同一天
				timeView=Public.formatDate(date,'%m月%d日')+'('+ddds+')';
			}else{
				timeView=Public.formatDate(date,'%m月%d日')+'('+ddds+')'+'&nbsp;-&nbsp;';
				timeView+=Public.formatDate(endTime,'%m月%d日')+'('+ddde+')';
			}
		}else{
			if(date.getDate()==endTime.getDate()){//判断是否是同一天
				timeView=Public.formatDate(date,'%m月%d日')+'('+ddds+')&nbsp;';
				timeView+=Public.formatDate(date,'%H:%I')+'&nbsp;-&nbsp;'+Public.formatDate(endTime,'%H:%I');
			}else{
				timeView=Public.formatDate(date,'%m月%d日')+'('+ddds+')&nbsp;'+Public.formatDate(date,'%H:%I')+'&nbsp;-&nbsp;';
				timeView+=Public.formatDate(endTime,'%m月%d日')+'('+ddde+')&nbsp;'+Public.formatDate(endTime,'%H:%I');
			}
		}
		timeView = dateToStr(date);
		for(var i=0;i<calDatas.length;i++){
			if(event.id == calDatas[i].id){
				var etime;
				//如果审批查看时，viewEndTime表示结束时间，因为calDatas的endTime和startTime保持一致的(要让一个日程条在一个单元格中显示)
				if(calDatas[i].viewEndTime){
					etime = calDatas[i].viewEndTime.replace(/-/g,"/");
				}else{
					etime = calDatas[i].endtime.replace(/-/g,"/");
				}
				etime = new Date(etime); 
				endtimeView = dateToStr(etime);  

				curSelCal = calDatas[i];
				break;
			}
		}
		
		var html=['<table class="bubble-input-table" cellSpacing="0" cellPadding="0"><colgroup><col width="50%"><col width="50%"></colgroup>'];
		html.push('<input type="hidden" id="bubble-id" value="',event.id,'">');
		html.push('<input type="hidden" id="bubble-isalldayevent" value="',event.allDay?1:0,'">');
		html.push('<tr><td colspan=2>');
        //html.push('<ul class="showColor">');
		//var className=event.className||'system';if(className=='') className='system';
		//$.each(colors,function(i,o){html.push('<li class="change '+o+(o==className?' cur':'')+'" id="'+o+'"></li>');});
		//html.push('</ul></td></tr>');
		html.push('<tr><td colspan=2><div class="econtent">',event.title,'</div></td></tr>');
		html.push('<tr><td colspan=2 style="border-bottom:1px solid #cccccc;">开始时间:',timeView,'&nbsp;&nbsp;&nbsp;结束时间:');
		if(status == 0){
			html.push('<input type="text" class="text textDate" style="width:90px" id="endtime'+event.id+'" />');
		}else{
			html.push(endtimeView);
		}
		html.push('</td>','</tr>');
		if(status == 0){
			html.push('<tr><td><a href="#" class="doDel">删除</a>&nbsp;&nbsp;</td>');
		}
		//html.push('<td style="text-align:right;">&nbsp;&nbsp;<a href="#" class="editC">详细信息<strong>»</strong>&nbsp;&nbsp;</a></td></tr>');
		html.push('</tr>');
		html.push('</table>');
		$('#bubbleContent1').html(html.join(''));
		if(status == 0){
			$("#endtime"+event.id).datepicker().mask('9999-99-99');//设置为日历控件
			$("#endtime"+event.id).val(endtimeView);//设置结束时间默认显示日期
		}
		
		bubble.css({ "visibility": "visible", left: pos.left, top: pos.top }).show();
	},
	select: function(start, end, allDay,ev) {//选择事件
		showAddCalendarBubbleTip(start,end,allDay,{left:ev.pageX-200, top:ev.pageY-100, hide:true});
	}
};

function getEndTime(date){
	//当是月视图时，结束时间取当周的周天
	var curday = date.getDay();
	var addday = 7 - curday;
	var endday = date.getTime() + addday * 24 * 60 * 60 * 1000;    
	endday = new Date(endday);
	return endday;
}

function dateToStr(date,type){
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	if(month < 10){
		month = "0"+month;
	}
	var day = date.getDate();
	if(day < 10){
		day = "0"+day;
	}
	if(type != "time"){
		return year+"-"+month+"-"+day;
	}

	var hour = date.getHours();
	if(hour < 10){
		hour = "0"+hour;
	}
	var minute = date.getMinutes();
	if(minute < 10){
		minute = "0"+minute;
	}
	var second = date.getSeconds();
	if(second < 10){
		second = "0"+second;
	}
	return year+"-"+(month+1)+"-"+day+" "+hour+":"+minute+":"+second;
}

var status;
var calId = 1; //日历单元格的点击次数，也就是日程条id
var curSelCal;  //当前点击选择的日程对象 (就是弹出来的)

var calDatas = [];//全局日程对象
var calData = function(start,end,id,title,viewEndTime){
	this.allDay = true;
	this.calenderType = "1";
	this.className = "blue";
	this.start = start;
	this.starttime = start;
	this.end = end;
	this.endtime = end;
	this.id = id;
	this.isAlldayevent = 1;
	this.isRepeat = 0;
	this.title = title;
	this.viewEndTime = viewEndTime; //审批查看时，点某个日程条打开看到的结束时间
}

//存放年视图数组数据
var planYearDatas = [];
//存放视图数组数据,用于存储 组织 功能与时间的数组对象
var planDatas = [];
var planData = function(calId,starttime,endtime,planFunction,planOrgs,dateStr){
	this.calId = calId;
	this.starttime = starttime;
	this.endtime = endtime;
	this.planFunction = planFunction;
	this.planOrgs = planOrgs;
	if(dateStr){
		this.dateStr = dateStr;//只有年视图有，存年月(2014_2)
	}else{
		this.dateStr = "";
	}
}
//组织对象
var spOrg = function(orgUnitId,orgUnitName,kindId,fullId){
	this.orgUnitId = orgUnitId;
	this.orgUnitName = orgUnitName;
	this.kindId = kindId;
	this.fullId = fullId;
}
//功能对象
var spFunction = function(functionId,functionName,authorityCode,authorityName){
	this.functionId = functionId;
	this.functionName = functionName;
	this.authorityCode = authorityCode;
	this.authorityName = authorityName;
}

var ycDatas = [];

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


/**时间计算 返回data 时间 加上 step(ms)后的时间**/
function addDateStep(date,step){
	var times=date.getTime()+step;
	return new Date(times);
}
//页面初始化创建日历
$(document).ready(function(){
    var h=$(this).height(),w=$(this).width();
	//流程的状态
	status = $("#status").val();
	$('#calendar').fullCalendar($.extend(fullcalendarOption,{
		height:h-80,
		width:w-200,
		events:function(start, end, callback) {
			var specialPlanId = $("#specialPlanId").val();
			/**
			 * 流程为以下状态时，需要回显明细数据
			 * 审批中 status==1
			 * 审批通过 status==3
			 * 审批不通过 status==5
			 * 审批退回发起人 (status==0 && specialPlanId != "")
			 */
			if(status == 1 || status == 3 || status == 5 || (status==0 && specialPlanId != "")){
				
				if(calDatas.length < 1 && ycDatas.length < 1){
					
					if(status==0 && specialPlanId != ""){
						Public.ajax(web_app.name+'/specialPlanAction!selMaxCalIdByPlanId.ajax', {specialPlanId:specialPlanId},
								function(data) {
									calId = parseInt(data) + 1;
								});
					}
					
					Public.ajax(web_app.name+'/specialPlanAction!queryCalendars.ajax', {specialPlanId:specialPlanId}, function(data) {
						
						if(calDatas.length < 1){
							var isYearView = "false";
							var monthView = $("#calendar");
							var yearView = $("#yearCalendarMain");

							if(data.length > 0){
								var groupId = data[0].orgGroupId;
								var title = data[0].functionName+"("+(data[0].orgName != "" ? data[0].orgName : data[0].authorityName);
								if(data[0].datestr != ""){
									isYearView = "true";
									yearView.show();
									monthView.hide();
									$("#monthViewRadio").attr("checked",false);
									$("#yearViewRadio").attr("checked",true);
								}else{
									yearView.hide();
									monthView.show();
									$("#monthViewRadio").attr("checked",true);
									$("#yearViewRadio").attr("checked",false);
								}
								
								//回退发起人后，发起人之前在日历视图中设置的 日程数据需要回显出来
								var _func = new spFunction(data[0].functionId,data[0].functionName,data[0].authorityCode,data[0].authorityName);
								var _orgs = [];
								var _org = new spOrg(data[0].orgId,data[0].orgName,data[0].orgType,data[0].fullId); 
								_orgs.push(_org);
								for(var i=0;i<data.length;i++){
									var curGroupId = data[i].orgGroupId;
									if(groupId != curGroupId){
										groupId = curGroupId;
										title += ")";
										
										//------------------------将上一个组中最后一个数据放入数组----------------------------
										var yearStartTime = data[i-1].startTime;
										if(yearStartTime.length>10){
											yearStartTime = yearStartTime.substr(0,10);
										}
										var yearEndTime = data[i-1].endTime;
										if(yearEndTime.length>10){
											yearEndTime = yearEndTime.substr(0,10);
										}
										//年视图数组组装
										if(isYearView == "true"){
											var datestrs = data[i-1].datestr.split("_");
											var year = datestrs[0];
											var month = datestrs[1];
											var mpart = datestrs[2];
											var yearViewTitle = "("+getMonthPartName(mpart)+")"+title;
											var yc = new YearCalendar({"calId":data[i-1].calId,"month":month,"year":year,"starttime":yearStartTime,"endtime":yearEndTime,"text":yearViewTitle});
											ycDatas.push(yc);
										}else{
											//月视图数组组装
											var cal = new calData(data[i-1].startTime,data[i-1].startTime,data[i-1].calId,title,data[i-1].endTime);
											calDatas.push(cal);
										}
										//-----------------------------------------------------------------------------
										
										//上一个组完成后，当前本次循环的组中 第一个数据
										title = data[i].functionName+"("+(data[i].orgName != "" ? data[i].orgName : data[i].authorityName);
										//退回到发送人，发送再编辑
										if(status==0 && specialPlanId != ""){
											var pd = new planData(data[i-1].calId,data[i-1].startTime,data[i-1].endTime,_func,_orgs,data[i-1].datestr);
											if(isYearView == "true"){
												planYearDatas.push(pd);
											}else{
												planDatas.push(pd);
											}

											_func = new spFunction(data[i].functionId,data[i].functionName,data[i].authorityCode,data[i].authorityName);
											_orgs = [];
											var _org = new spOrg(data[i].orgId,data[i].orgName,data[i].orgType,data[i].fullId); 
											_orgs.push(_org);
										}

									}else{
										if(i!=0){
											title += ","+(data[i].orgName != "" ? data[i].orgName : data[i].authorityName);

											if(status==0 && specialPlanId != ""){
												var _org = new spOrg(data[i].orgId,data[i].orgName,data[i].orgType,data[i].fullId); 
												_orgs.push(_org);		
											}
										}
									}
								}
								title += ")";
								
								
								var yearStartTime = data[i-1].startTime;
								if(yearStartTime.length>10){
									yearStartTime = yearStartTime.substr(0,10);
								}
								var yearEndTime = data[i-1].endTime;
								if(yearEndTime.length>10){
									yearEndTime = yearEndTime.substr(0,10);
								}
								//年视图数组组装
								if(isYearView == "true"){
									var datestrs = data[i-1].datestr.split("_");
									var year = datestrs[0];
									var month = datestrs[1];
									var mpart = datestrs[2];
									var yearViewTitle = "("+getMonthPartName(mpart)+")"+title;
									var yc = new YearCalendar({"calId":data[i-1].calId,"month":month,"year":year,"starttime":yearStartTime,"endtime":yearEndTime,"text":yearViewTitle});
									ycDatas.push(yc);
								}else{
									var cal = new calData(data[i-1].startTime,data[i-1].startTime,data[i-1].calId,title,data[i-1].endTime);
									calDatas.push(cal);
								}

								if(isYearView != "true"){
									callback(calDatas);
								}

								if(status==0 && specialPlanId != ""){
									if(isYearView == "true"){
										var pd = new planData(data[i-1].calId,yearStartTime,yearEndTime,_func,_orgs,data[i-1].datestr);	
										planYearDatas.push(pd);
									}else{
										var pd = new planData(data[i-1].calId,data[i-1].startTime,data[i-1].endTime,_func,_orgs,data[i-1].datestr);	
										planDatas.push(pd);
									}
								}
							}
							if(isYearView == "true"){
								createYearView();//初始化年视图
								//当退回到发起人后，绑定点击事件
								if(status==0 && specialPlanId != ""){
									bindClickEventToYearView();
								}
							}
							//alert(ycDatas.length);
							//printPlanDatas();

						}
					});
				}else{
					callback(calDatas);	
				}
				
			}else if(status == 0){
				callback(calDatas);	
			}
			
		}
	}));
});

/**
 * 测试方法，输出当前的planDatas
 */
function printPlanDatas(){
	var sss = "";
	for(var j=0;j<planDatas.length;j++){
		var pp = planDatas[j];
		sss += pp.calId+"  "+pp.starttime+"  "+pp.endtime+"  "+pp.planFunction.functionId+"  "+pp.planFunction.functionName+"    "
			+ "   "+pp.planFunction.authorityCode+ "   "+pp.planFunction.authorityName;
		sss += "\n orgs: \n";
		var _orgs = pp.planOrgs;
		for(var k=0;k<_orgs.length;k++){
			sss += _orgs[k].orgUnitId + "   "+_orgs[k].orgUnitName + "   "+_orgs[k].kindId + "   "+_orgs[k].fullId;
		}
		sss += " orgs  end \n"
	}
	alert(sss);
}

//计算显示对话框显示位置
function getbuddlepos(x, y) {
	 var tleft = x - 120; //先计算如果是显示箭头
	 var ttop = y - 217; //如果要箭头
	 var maxLeft,maxTop,de = document.documentElement;
	 maxLeft = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	 maxTop = self.innerHeight || (de&&de.clientHeight)|| document.body.clientHeight;
	 var ishide = false;
	 if (tleft <= 0 || ttop <= 0 || tleft + 400 > maxLeft) {
		 tleft = x - 200 <= 0 ? 10 : x - 200;
		 ttop = y - 159 <= 0 ? 10 : y - 159;
		 if (tleft + 400 >= maxLeft) {
			 tleft = maxLeft - 410;
		 }
		 if (ttop + 164 >= maxTop) {
			 ttop = maxTop - 165;
		 }
		 ishide = true;
      }
	 return { left: tleft, top: ttop, hide: ishide };
}
//创建对话框层
function getBubbleTip(){
	var bubble=$('#cw_buddle-tip');
	if(bubble.length==0){
		bubble=$('<div id="cw_buddle-tip" class="bubble"><table class="bubble-table" cellspacing="0" cellpadding="0"><tbody><tr><td class="bubble-cell-side"><div id="tl1" class="bubble-corner"><div class="bubble-sprite bubble-tl"></div></div></td><td class="bubble-cell-main"><div class="bubble-top"></div></td><td class="bubble-cell-side"><div id="tr1" class="bubble-corner"><div class="bubble-sprite bubble-tr"></div></div></td></tr><tr><td class="bubble-mid" colspan="3"><div id="bubbleContent1" style="overflow: hidden;"></div></td></tr><tr><td><div id="bl1" class="bubble-corner"><div class="bubble-sprite bubble-bl"></div></div></td><td><div class="bubble-bottom"></div></td><td><div id="br1" class="bubble-corner"><div class="bubble-sprite bubble-br"></div></div></td></tr></tbody></table><div class="bubble-closebutton"></div><div id="bubble_prong" class="bubble-prong"><div class="bubble-sprite"></div></div></div>').appendTo(document.body);
		bubble.bind('click',function(e){
			var el=$(e.target || e.srcElement);
			e.preventDefault();
			e.stopPropagation();
			if(el.hasClass('bubble-closebutton')){//关闭提示框

				if(status == 0){
					//结束时间不能小于开始时间
					var st = curSelCal.starttime.replace(/-/g,"/");
					if(st.length > 10){
						st = st.substr(0,10);
					}
					var stdate = new Date(st);

					var selendtime = $("#endtime"+curSelCal.id).val();
					var et = selendtime.replace(/-/g,"/");
					var etdate = new Date(et);

					if(etdate < stdate){
						Public.tip("结束时间不能小于开始时间!");
						return;
					}else{
						for(var i=0;i<calDatas.length;i++){
							if(calDatas[i].id == curSelCal.id){
								calDatas[i].viewEndTime = selendtime;
								break;
							}
						}
						for(var i=0;i<planDatas.length;i++){
							if(planDatas[i].calId == curSelCal.id){
								planDatas[i].endtime = selendtime;
								break;
							}
						}
					}
				}

				closeAddCalendarBubbleTip();
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
				var color=el.attr('id'),id=$('#bubble-id').val();
				bubble.find('li.cur').removeClass('cur');
				el.addClass('cur');
				Public.ajax(web_app.name+'/personOwnAction!updateCalendarColor.ajax', {id:id,className:color}, function(data) {
					var event=$('#calendar').fullCalendar( 'clientEvents',id)[0];
					event.className=color=='system'?'':color;
					$('#calendar').fullCalendar('updateEvent',event);
				});
				return false;
			}
			if(el.is('a.doDel')){//删除日程
				var id=$('#bubble-id').val();
				/*
				//执行删除方法
				Public.ajax(web_app.name+'/personOwnAction!deleteCalendar.ajax', {id:id}, function(data) {
					$('#calendar').fullCalendar('removeEvents',id);
					closeAddCalendarBubbleTip();
				});*/
				$('#calendar').fullCalendar('removeEvents',id);
				closeAddCalendarBubbleTip();
				//从日程全局对象calDatas中删除
				for(var i=0;i<calDatas.length;i++){
					if(calDatas[i].id == id){
						calDatas.splice(i,1);
						planDatas.splice(i,1);
						break;
					}
				}
				return false;
			}
			if(el.is('a.editC')){//打开日程详细对话框
				showParticularCalendar();
				closeAddCalendarBubbleTip();
				return false;
			}
			if(el.hasClass('button')){//快捷保存
				var para={},flag=true,fields=['subject','startTime','endTime','isAlldayevent','className'];
				$.each(fields,function(i,o){
					var value=$('#bubble-'+o).val();
					if(o=='subject'){
						if(value==''){Public.tip('请填写内容!');$('#bubble-'+o).focus();flag=false;return false;}
						value=encodeURI(value);
					}
					para[o]=value;
				});
				if(!flag) return false;

				//执行保存方法
				Public.ajax(web_app.name+'/personOwnAction!saveCalendar.ajax', para, function(data) {
					closeAddCalendarBubbleTip();
					$('#calendar').fullCalendar('unselect');//清除选中
					//添加新日程到日历
					$('#calendar').fullCalendar('renderEvent',{
						id:data,
						title:decodeURI(para['subject']),
						start:para['startTime'],
						end:para['endTime'],
						allDay:para['isAlldayevent']=='1'?true:false,
						className:para['className']
					},false);
				});
				
			}
			if(el.is('input')){//打开日程详细对话框
				el.focus();
				return false;
			}
			return false;
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
//关闭对话框
function closeAddCalendarBubbleTip(){
	var bubble=$('#cw_buddle-tip');
	if(bubble.length>0&&bubble.is(':visible')){
		bubble.removeData('chooseTime');
		bubble.css("visibility", "hidden").hide();
	}
}
//打开新增日程对话框
function showAddCalendarBubbleTip(startTime,endTime,allDay,pos){
	var bubble=getBubbleTip(),timeView,chooseTime=bubble.data('chooseTime');
	if(chooseTime&&chooseTime.startTime.getTime()==startTime.getTime()&&chooseTime.endTime.getTime()==endTime.getTime()){
		//起始,结束时间相同的不在重复执行
		return false;
	}
	bubble.data('chooseTime',{startTime:startTime,endTime:endTime});
    if (pos.hide) {$("#bubble_prong").css("visibility", "hidden").hide();}else {$("#bubble_prong").css("visibility", "visible").show();}
	var ddds=fullcalendarOption.dayNamesShort[startTime.getDay()],ddde=fullcalendarOption.dayNamesShort[endTime.getDay()];
	if(allDay){
		if(startTime.getDate()==endTime.getDate()){//判断是否是同一天
			timeView=Public.formatDate(startTime,'%m月%d日')+'('+ddds+')';
		}else{
			timeView=Public.formatDate(startTime,'%m月%d日')+'('+ddds+')'+'&nbsp;-&nbsp;';
			timeView+=Public.formatDate(endTime,'%m月%d日')+'('+ddde+')';
		}
	}else{
		if(startTime.getDate()==endTime.getDate()){//判断是否是同一天
			timeView=Public.formatDate(startTime,'%m月%d日')+'('+ddds+')&nbsp;';
			timeView+=Public.formatDate(startTime,'%H:%I')+'&nbsp;-&nbsp;'+Public.formatDate(endTime,'%H:%I');
		}else{
			timeView=Public.formatDate(startTime,'%m月%d日')+'('+ddds+')&nbsp;'+Public.formatDate(startTime,'%H:%I')+'&nbsp;-&nbsp;';
			timeView+=Public.formatDate(endTime,'%m月%d日')+'('+ddde+')&nbsp;'+Public.formatDate(endTime,'%H:%I');
		}
	}
	var html=['<table class="bubble-input-table" cellSpacing="0" cellPadding="0"><colgroup><col width="20%"><col width="80%"></colgroup>'];
	html.push('<input type="hidden" id="bubble-startTime" value="',Public.formatDate(startTime,'%Y-%M-%D %H:%I:%S'),'">');
	html.push('<input type="hidden" id="bubble-endTime" value="',Public.formatDate(endTime,'%Y-%M-%D %H:%I:%S'),'">');
	html.push('<input type="hidden" id="bubble-isAlldayevent" value="',allDay?1:0,'">');
	html.push('<tr><td style="text-align:center;">时&nbsp;&nbsp;间:</td>','<td>',timeView,'</td>','</tr>');
	html.push('<tr><td style="text-align:center;">内&nbsp;&nbsp;容:</td><td><input type="text" id="bubble-subject" class="text" maxlength="100"></td></tr>');
	html.push('<tr><td style="text-align:center;">颜&nbsp;&nbsp;色:</td><td>');
	html.push('<input type="hidden" id="bubble-className" value="blue">');
    html.push('<ul class="showColor">');
	$.each(colors,function(i,o){html.push('<li class="color '+o+(i==0?' cur':'')+'" id="'+o+'"></li>');});
	html.push('</ul></td></tr>');
	html.push('<tr><td colspan=2><input type="button" class="button" value="创建日程">&nbsp;&nbsp;<a href="#" class="editC">详细信息<strong>»</strong></a></td></tr>');
	html.push('</table>');
	$('#bubbleContent1').html(html.join(''));
	//bubble.css({ "visibility": "visible", left: pos.left, top: pos.top }).show();
}
//拖动完成后更新日程
function dropUpdateCalendar(event,revertFunc){
	var para={
		id:event.id,
		startTime:Public.formatDate(event.start,'%Y-%M-%D %H:%I:%S'),
		endTime:Public.formatDate(event.end||event.start,'%Y-%M-%D %H:%I:%S'),
		isAlldayevent:event.allDay?1:0
	};
	Public.ajax(web_app.name+'/personOwnAction!updateCalendar.ajax',para, function(data) {},revertFunc);
}
/*******************以下代码用于日程详细编辑页面*********************/
//打开日历详细编辑页面
function showParticularCalendar(){
	var id=$('#bubble-id').val(),allDay=$('#bubble-isalldayevent').val();
	var url=web_app.name+'/personOwnAction!getCalendarMap.load';
	var chooseTime=$('#cw_buddle-tip').data('chooseTime');
	UICtrl.showAjaxDialog({url:url,title:'日程维护',param:{id:id},top:50,width:560,
		ok:doSaveCalendar,
		close:function(){
			hideYearDayChoose();
		},init:function(){
			particularCalendar_init(chooseTime,allDay);
		}
	});
}
//日程详明编辑页面事件初始化
function particularCalendar_init(chooseTime,allDay){
	if(chooseTime){//初始化日期显示
		$('#c_startDate').val(Public.formatDate(chooseTime['startTime'],'%Y-%M-%D'));
		$('#c_endDate').val(Public.formatDate(chooseTime['endTime'],'%Y-%M-%D'));
		$('#c_startTime').val(Public.formatDate(chooseTime['startTime'],'%H:%I'));
		$('#c_endTime').val(Public.formatDate(chooseTime['endTime'],'%H:%I'));
		if($('#temp_startDate').val()=='')
			$('#temp_startDate').val(Public.formatDate(chooseTime['startTime'],'%Y-%M-%D'));
	}
	//颜色选择初始化
	var html=[],className=$('#c_className').val();className=className==''?'system':className;
	$.each(colors,function(i,o){html.push('<li class="'+o+(className==o?' cur':'')+'" id="'+o+'"></li>');});
	$('#showColorUl').html(html.join('')).click('click',function(e){
		var el=$(e.target || e.srcElement);
		if(el.is('li')){
			var color=el.attr('id');
			$(this).find('li.cur').removeClass('cur');
			el.addClass('cur');
			$('#c_className').val(color=='system'?'':color);
			return false;
		}
	});
	//是否是全天日程复选框初始化
	$('#c_isalldayevent').bind('click',function(){
		if($(this).is(':checked')){
			$('#showStartTime').hide();
			$('#showEndTime').hide();
		}else{
			$('#showStartTime').show();
			$('#showEndTime').show();
		}
	});
	if(allDay==1){$('#c_isalldayevent').attr('checked',true).triggerHandler('click');}
	//重复日程复选框
	$('#c_isrepeat').bind('click',function(){
		var tr=$('#showRepeatTr');
		if($(this).is(':checked')){
			tr.show();
		}else{
			tr.hide();
		}
	}).triggerHandler('click');
	//时间选择器
	var d,hs=[];
	for(var i=0;i<24;i++){
		d=i<10?'0'+i:i;
		hs.push({value:d+':00',text:d+':00'});
		hs.push({value:d+':30',text:d+':30'});
	}
	$.each(['c_startTime','c_endTime'],function(i,o){
		var objTime=$('#'+o);
		objTime.combox({height:120,width:60,data:hs,back:{text:objTime,value:objTime}});
	});
	//初始化重复日程中事件
	repeatInfoinit();
}
//重复日程中事件初始化
function repeatInfoinit(){
	var frequencys=[],frequency=$('#c_frequency');
	for(var i = 1; i <= 30; i++){
		frequencys.push({value:i,text:i});
	}
	if(frequency.val()=='') frequency.val(1);
	frequency.combox({height:120,data:frequencys,back:{text:frequency,value:frequency}});
	//获取重复类型及重复数据
	var repeattype=$('#c_repeattype').val(),schedules=$('#c_schedules').val();
	//按周重复数据初始化
	var weeks=[],checked='';
	$.each(["日", "一", "二", "三", "四", "五", "六"],function(i,o){
		checked='';
		if(repeattype=='2'&&schedules.indexOf(i+',')!=-1) checked='checked';
		weeks.push('<input value="'+i+'" type="checkbox" '+checked+'>&nbsp;<label>',o,'</label>');
	});
	$('#showWeek_repeat').html(weeks.join(''));
	//按月循环初始化
	var monthDay=[],month_repeat=$('#showMonth_repeat');
	for(var i=1;i<=31;i++){
		monthDay.push({value:i<10?'0'+i:i,text:(i<10?'0'+i:i)+'日'});
	}
	$('#addDay_month').combox({height:120,width:50,data:monthDay,getOffset:function(){
			var of=$('#addDay_month').offset(),_height=$('#addDay_month').outerHeight();
			return {top:of.top+_height+1,left:of.left};
		},
		onClick:function(obj){
			if(obj.is('li')){
				var id=obj.attr('key');
				if(month_repeat.find('span[id="'+id+'"]').length>0){$.closeCombox(); return;}
				month_repeat.append('<span class="days" id="'+id+'">'+obj.text()+'</span>');
				$.closeCombox();
			}
		}
	});
    if(repeattype=='3'&&schedules!=''){
		$.each(schedules.split(','),function(i,o){
			if(o!=''){
				month_repeat.append('<span class="days" id="'+o+'">'+o+'日'+'</span>');
			}
		});
	}
	//按年循环初始化
	$('#addDay_year').bind('click',function(e){
		showYearDayChoose();
		e.preventDefault();
		e.stopPropagation();
	});
	if(repeattype=='4'&&schedules!=''){
		$.each(schedules.split(','),function(i,o){
			if(o!=''&&o.length==4){
				var m=o.substring(0,2),d=o.substring(3,4);
				$('#showYear_repeat').append('<span class="days" id="'+o+'">'+m+'月'+d+'日'+'</span>');
			}
		});
	}
	//选中按月,按年循环时日期清除事件
	$('#showRepeatTr').bind('dblclick',function(e){
		var el=$(e.target || e.srcElement);
		if(el.is('span.days')){
			el.remove();
		}
	});
	//结束日期选择
	$('#repeatendDate').bind('click',function(){
		$('#repeatendtype3').attr('checked',true);
	});
	var changeRepeattype=function(type){
		 $('#showRepeatTr').find('div.hide').hide();
		 intrepeattype(type);
		 $('#repeatPoint_'+type).show();
	};
	 //重复类型 改变
    $('#c_repeattype').combox({onChange:function(values){ 
    	changeRepeattype(values.value);
    }}); 
    changeRepeattype($('#c_repeattype').val());
	$('#endCount').bind('blur',function(){
		$('#repeatendtype2').attr('checked',true);
	});
}
//初始循环重复日期数据
function intrepeattype(type){
	var str=$('#c_startDate').val(),date=Public.parseDate(str,'%Y-%M-%D');
	var d=date.getDate(),m=date.getMonth()+1,day=date.getDay(),div;
	switch (type) {
	   case '2' :
		   div=$('#showWeek_repeat');
	       if(div.find('input:checked').length==0){
			   div.find('input').get(day).checked=true;
		   }
		   break;
	   case '3' :
		   div=$('#showMonth_repeat');
		   if(div.find('span').length==0){
			   d=d<10?'0'+d:d;
			   div.append('<span class="days" id="'+d+'">'+d+'日'+'</span>');
		   }
		   break;
	   case '4' :
		   div=$('#showYear_repeat');
		   if(div.find('span').length==0){
			   d=d<10?'0'+d:d;
			   m=m<10?'0'+m:m;
			   div.append('<span class="days" id="'+(m+d)+'">'+m+'月'+d+'日'+'</span>');
		   }
		   break;
	   default :
		   break;
	} 

}
//按年重复日期选择框
function showYearDayChoose(){
	var str=$('#c_startDate').val(),date=Public.parseDate(str,'%Y-%M-%D');
	var month=date.getMonth(),monthDays=[31,29,31,30,31,30,31,31,30,31,30,31];
	var choose=$('#showYear_choose'),add=$('#addDay_year'),of=add.offset();
	if(choose.length==0){
		choose=$("<div id='showYear_choose'><div><a class='left' href='#'></a><span id='showyear_choose_month'></span><a class='right' href='#'></a></div><ul id='showYear_choose_content'></ul></div>").appendTo(document.body);;
	    choose.bind('click',function(e){
			var el=$(e.target || e.srcElement);
			e.preventDefault();
			e.stopPropagation();
			if(el.is('a.left')){//减少一个月
				var m=$('#showyear_choose_month').attr('month');
				m=parseInt(m,10);
				m=isNaN(m)?month-1:m-1;
				if(m==-1)m=11;
				showDates(m);
			}
			if(el.is('a.right')){//增加一个月
				var m=$('#showyear_choose_month').attr('month');
				m=parseInt(m,10);
				m=isNaN(m)?month+1:m+1;
				if(m==12)m=0;
				showDates(m);
			}
			if(el.is('li')){//日期选择
				var m=$('#showyear_choose_month').attr('month'),d=el.attr('id');
				m=parseInt(m,10);
				m=isNaN(m)?month+1:m+1;
				m=m<10?'0'+m:m;
				d=d.length==1?'0'+d:d;
				if($('#showYear_repeat').find('span[id="'+(m+d)+'"]').length>0){hideYearDayChoose(); return;}
				$('#showYear_repeat').append('<span class="days" id="'+(m+d)+'">'+m+'月'+d+'日'+'</span>');
				hideYearDayChoose();
			}
		});
	}
	function showDates(m){
		var htmls=[];
		$('#showyear_choose_month').text(fullcalendarOption.monthNames[m]).attr('month',m);
		for(var i=1;i<=monthDays[m];i++){
			htmls.push('<li id="'+i+'">',i,'</li>');
		}
		$('#showYear_choose_content').html(htmls.join(''));
	}
	showDates(month);
	choose.css({top:of.top+add.height()+3,left:of.left}).show();
	$(document).bind('click.showYearDayChoose',hideYearDayChoose);
}
function hideYearDayChoose(){
	$('#showYear_choose').hide();
	$(document).unbind('click.showYearDayChoose');
}
//日期大小比较
function compareForDate(start,end){
	start=start.replace(/-/g,'').replace(/ /g,'').replace(/:/g,'');
	end=end.replace(/-/g,'').replace(/ /g,'').replace(/:/g,'');
	start=parseInt(start,10);
	end=parseInt(end,10);
	if(isNaN(start)||isNaN(end)){
		Public.tip('日期不能正确解析!');
		return false;
	}
	if(start>end){
		Public.tip('开始时间不能大于结束时间!');
		return false;
	}
	return true;
}
//执行日历保存
function doSaveCalendar(){
	var className=$('#c_className').val();
	className=className==''?'system':className;
	var data={
		id:$('#c_id').val(),
		subject:encodeURI($('#c_subject').val()),
		calendarType:$('#c_calendartype').val(),
		description:encodeURI($('#c_description').val()),
		className:className
	};
	if(data['subject']==''){
		Public.tip('请输入日程内容!');
		$('#c_subject').focus();
		return false;
	}
	var isalldayevent=$('#c_isalldayevent').is(':checked')?1:0;
	data['isAlldayevent']=isalldayevent;
	if(isalldayevent===1){
		data['startTime']=$('#c_startDate').val();
		data['endTime']=$('#c_endDate').val();
	}else{
		data['startTime']=$('#c_startDate').val()+' '+$('#c_startTime').val();
		data['endTime']=$('#c_endDate').val()+' '+$('#c_endTime').val();
	}
	if(!compareForDate(data['startTime'],data['endTime'])) return false;
	var isrepeat=$('#c_isrepeat').is(':checked')?1:0;
	data['isRepeat']=isrepeat;
	if(isrepeat===1){//重复
		data['repeatType']=$('#c_repeattype').val();
		data['frequency']=$('#c_frequency').val();
		data['repeatStartDate']=$('#temp_startDate').val();
		if(data['repeatStartDate']==''){
			Public.tip('重复开始日期不能为空!');
			setTimeout(function(){$('#temp_startDate').triggerHandler('click');},0);
			return false;
		}
		if($('#repeatendtype1').is(':checked')){
			data['repeatEndType']=1;
		}
		if($('#repeatendtype2').is(':checked')){
			if($('#endCount').val()==''){
				Public.tip('请输入重复次数!');
				$('#endCount').focus();
				return false;
			}
			data['repeatEndType']=2;
			data['amount']=$('#endCount').val();
		}
		if($('#repeatendtype3').is(':checked')){
			if($('#repeatendDate').val()==''){
				Public.tip('请输入结束日期!');
				setTimeout(function(){$('#repeatendDate').triggerHandler('click');},0);
				return false;
			}
			data['repeatEndType']=3;
			data['repeatEndDate']=$('#repeatendDate').val();
		}
		
		var schedules=[];
		if(data['repeatType']=='2'){//按周重复
			$('#showWeek_repeat').find('input:checked').each(function(){
				schedules.push($(this).val());
			});
		}
		if(data['repeatType']=='3'){
			$('#showMonth_repeat').find('span.days').each(function(){
				schedules.push($(this).attr('id'));
			});
		}
		if(data['repeatType']=='4'){
			$('#showYear_repeat').find('span.days').each(function(){
				schedules.push($(this).attr('id'));
			});
		}
		if(data['repeatType']!='1'&&!schedules.length){
			Public.tip('请选择重复日期!');
			return false;
		}
		data['schedules']=schedules.join(',');
	}
	var _self=this;
	Public.ajax(web_app.name+'/personOwnAction!saveParticularCalendar.ajax', data, function(msg) {
		$('#calendar').fullCalendar('refetchEvents');
		_self.close();
	});
}