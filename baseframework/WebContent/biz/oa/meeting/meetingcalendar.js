var colors=['system','yellow','blue','green','red'];//进度条可用颜色
var meetingStatusData={};
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
	columnFormat: {
		month: 'ddd',
		week: 'ddd M月d日',
		day: 'dddd M月d日'
	},
	timeFormat: {
		week: 'H:mm{-H:mm}',
		day: 'H:mm{-H:mm}',
		'': 'H:mm{-H:mm}' // default
	},
	axisFormat: {
		'': 'H:mm'
	},
	header: {
		left: 'prev,next today',
		center: 'title',
		right: 'month,agendaWeek,agendaDay'
	},
	minTime:'07:00',
	maxTime:'23:00',
	editable: false,
	diableResizing:true,
	selectable: true,
	selectHelper: true,
	allDaySlot: false,
	viewDisplay:function(){closeAddCalendarBubbleTip();},//每次日历加载以及日历的view改变的时候触发一次.
	dayClick: function(date, jsEvent, view) {
		$('#calendar').fullCalendar('gotoDate',date);
		$('#calendar').fullCalendar('changeView','agendaDay');
	},
	eventClick: function(event, jsEvent, view) {//日程点击事件
		var offset=$(this).offset(),x=offset.left+$(this).width()/2,y=view.name=='month'?offset.top+$(this).height()/2:jsEvent.pageY;
        var bubble=getBubbleTip(),pos=getbuddlepos(x,y);
        if (pos.hide) {$("#bubble_prong").css("visibility", "hidden").hide();}else {$("#bubble_prong").css("visibility", "visible").show();}
		var date=event.start,endTime=event.end||date,timeView;
		var ddds=fullcalendarOption.dayNamesShort[date.getDay()],ddde=fullcalendarOption.dayNamesShort[endTime.getDay()];
		if(date.getDate()==endTime.getDate()){//判断是否是同一天
			timeView=Public.formatDate(date,'%m月%d日')+'('+ddds+')&nbsp;';
			timeView+=Public.formatDate(date,'%H:%I')+'&nbsp;-&nbsp;'+Public.formatDate(endTime,'%H:%I');
		}else{
			timeView=Public.formatDate(date,'%m月%d日')+'('+ddds+')&nbsp;'+Public.formatDate(date,'%H:%I')+'&nbsp;-&nbsp;';
			timeView+=Public.formatDate(endTime,'%m月%d日')+'('+ddde+')&nbsp;'+Public.formatDate(endTime,'%H:%I');
		}
		bubble.data('chooseTime',{startTime:date,endTime:endTime});
		var html=['<table class="bubble-input-table" cellSpacing="0" cellPadding="0">'];
		html.push('<input type="hidden" id="bubble-id" value="',event.id,'">');
		html.push('<tr><td width="50" valign="top" class="title">主题：</td><td colspan="3" title="'+event.title+'"><div>',formatLength(event.title),'</div></td></tr>');
		html.push('<tr><td class="title">主持人：</td><td >',event.managerName,'</td>');
		html.push('<td class="title">负责人：</td><td >',event.dutyName,'</td></tr>');
		html.push('<tr><td class="title">类型：</td><td >',event.meetingKindName,'</td>');
		html.push('<td class="title">状态：</td><td >',meetingStatusData[event.status],'</td></tr>');
		html.push('<tr><td class="title">时间：</td><td colspan="3">',timeView,'</td></tr>');
		html.push('<tr><td valign="top" style="border-bottom:1px solid #cccccc;" class="title">会议室：</td><td colspan="3" style="border-bottom:1px solid #cccccc;" title="'+event.meetingPlace+'">',formatLength(event.meetingPlace),'</td>','</tr>');
		html.push('<tr><td >&nbsp;&nbsp;</td>');
		html.push('<td colspan="3" style="text-align:right;">&nbsp;&nbsp;<a href="#" class="editC">详细信息<strong>»</strong>&nbsp;&nbsp;</a></td></tr>');
		html.push('</table>');
		$('#bubbleContent1').html(html.join(''));
		bubble.css({ "visibility": "visible", left: pos.left, top: pos.top }).show();
	}
};

function formatLength(str){
	if(str.length>22){
		return str.substring(0,20)+"...";
	}
	else
		return str;
}
//页面初始化创建日历
$(document).ready(function(){
	meetingStatusData = $("#meetingStatusId").combox("getJSONData");
	UICtrl.autoSetWrapperDivHeight();
    var h=$(this).height(),w=$(this).width(); 
	$('#calendar').fullCalendar($.extend(fullcalendarOption,{
		height:h-80,
		width:w-200,
		events:function(start, end, callback) {
			var obj = $('#queryMainForm');
			var param = $(obj).formToJSON();
			param.start = start.getTime();
			param.end = end.getTime();
			Public.ajax(web_app.name+'/meetingAction!queryMeetingcalendar.ajax', param, function(data) {
				callback(data);
			});
		}
	}));
	UICtrl.layout("#layout", { leftWidth : 220,  heightDiff : -5});
	//$('#layout').find('div.l-layout-center').css({borderLeftWidth:0});
	initKindTree();
	$('#personName').searchbox({ type:"hr", name: "queryAllArchiveSelect",
		back:{
                 staffName:"#personName",personId:"#personId"
		}
	});
	$('#meetingRoomName').searchbox({ type:"oa", name: "chooseMeetingRoom",
		back:{
                 name:"#meetingRoomName",meetingRoomId:"#meetingRoomId"
		}
	});
});

function initKindTree(){
	$('#selectViewMeetingKind').treebox({
		treeLeafOnly: true,name:"meetingKind",
		beforeChange:function(data){
			if(data.nodeType=='f'){
				return false;
			}
			return true;
		},
		back:{text:'#selectViewMeetingKind',value:'#meetingKindId'}
    });
}
//计算显示对话框显示位置
function getbuddlepos(x, y) {
	 var tleft = x - 120; //先计算如果是显示箭头
	 var ttop = y - 240; //如果要箭头
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
				closeAddCalendarBubbleTip();
				return false;
			}
			if(el.is('a.editC')){//打开日程详细对话框
				showParticularCalendar();
				closeAddCalendarBubbleTip();
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

function showParticularCalendar(){
	var id=$('#bubble-id').val();
	var url=web_app.name+'/meetingAction!forwardMeetingView.load';
	var _self = this;
	UICtrl.showAjaxDialog({url:url,title:'会议概览',param:{id:id},top:50,width:560,
		ok:false,
		close:function(){
			_self.close();
		}
	});
}

function doQuery(){
	 $('#calendar').fullCalendar('refetchEvents');
}

