/*---------------------------------------------------------------------------*\
|  title:         日期选择控件                                                |
|  Author:        xiexin                                                      |
|  Created:       2009-10-20                                                  |
|  LastModified:  2014-01-05  修改显示样式                                                |
|  需求:<link rel="stylesheet" type="text/css" href="jquery.calender.css">    |
|       <script src="jquery.js" type="text/javascript"></script>              |
|       <script src="ui.mouse.js" type="text/javascript"></script>            |
|       <script src="ui.draggable.js" type="text/javascript"></script>        |
|       <script src="ui.slider.js" type="text/javascript"></script>           |
|  使用如:                                                                    |
|   $('#test01').datepicker();//不带时间                                      |
|   $('#test02').datepicker({useTime:true}); //含有时间                       |
|   $('#imgs').datepicker({out:'#test03',useTime:true});//输出到其他对象      |
\*---------------------------------------------------------------------------*/
(function($) {
	function datepicker(){ //定义日志控件对象
		this.options=null;
		this.element=null;
		this.outDate=null;		//存放对象的日期
		this._date={y:'',m:'',d:'',h:'',i:'',s:''};
		this.mainID='ui_datepicker_div';
		this.create();
	};
	$.extend(datepicker.prototype,{
		create:function(){
			var div=$("<div class='ui-datepicker-div' id='main_"+this.mainID+"'></div>"),obj=this;
			var html=["<TABLE class='ui-datepicker-table' border=0 cellpadding=0 cellspacing=0><TR><TD><TABLE class='head' id='head_"+this.mainID+"'><TR>",
						  "<TD class='beforeYear' id='beforeYear'><span></span></TD><TD class='beforeMonth' id='beforeMonth'><span></span></TD><TD class='yearHead' id='yearHead'></TD>",
						  "<TD class='monthHead' id='monthHead'></TD><TD class='afterMonth' id='afterMonth'><span></span></TD><TD class='afterYear' id='afterYear'><span></span></TD></TR></TABLE></TD></TR>",
						  "<TR><TD><TABLE class='ui-datepicker-day-table' id='date_"+this.mainID+"'  border=0 cellpadding=0 cellspacing=0>",
						  "<TR class='ui-dialog-titlebar'><TH></TH><TH></TH><TH></TH><TH></TH><TH></TH><TH></TH><TH></TH></TR>",
						  "<TR><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD></TR>",
						  "<TR><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD></TR>", 
						  "<TR><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD></TR>",
						  "</TABLE></TD></TR><TR><TD><TABLE class='choose' id='choose_"+this.mainID+"' border=0 cellpadding=1 cellspacing=1><TR>",
						  "<TD class='showTime' id='showTime' title='时间选择'></TD><TD class='hourHead' id='hourHead'></TD><TD class='minuteHead' id='minuteHead'></TD>",
						  "<TD class='clear' id='clear'></td><TD class='now' id='now'></td><TD class='close' id='close'></TD></TR></TABLE></TD></TR>",
						  "<TR class='ui-datepicker-worktime-tr'><TD><TABLE class='work_time' id='workTime_"+this.mainID+"' border=0 cellpadding=1 cellspacing=1><TR>",
						  "<TD id='chooseWorkTime'></TD><TD id='chooseWorkTime'></TD><TD id='chooseWorkTime'></TD><TD id='chooseWorkTime'></TD></TR></TABLE></TD></TR>",
						  "<TR class='ui-datepicker-datetime-tr'><TD><TABLE class='ui-datepicker-datetime' id='ui_datepicker_datetime_"+this.mainID+"'>",
						  "<TR><TD colspan=3><div id='slider_"+this.mainID+"' class='test001'><div class='ui-slider-handle'></div></div></TD></TR></TABLE></TD></TR></TABLE>"];
			html.push("<div id='chooseTimes_"+this.mainID+"' class='ui-datepicker-choosetime'></div>");
			div.html(html.join('')).appendTo('body');
			this.getELByID('choose').find('td').hover(function(){var id=this.id;$(this).toggleClass(id).toggleClass(id+'-hover');},function(){var id=this.id;$(this).toggleClass(id).toggleClass(id+'-hover');});
			this.getELByID('workTime').find('td').hover(function(){$(this).toggleClass('workTime-hover');},function(){$(this).toggleClass('workTime-hover');});
			this.getELByID('date').find('td').hover(function(){$(this).addClass('ui-datepicker-day-dover');},function(){$(this).removeClass('ui-datepicker-day-dover');});
			this.getELByID('head').find('td').hover(function(){var id=this.id;$(this).addClass(id+'-hover');},function(){var id=this.id;$(this).removeClass(id+'-hover');});
			this.getELByID('date').find('th').each(function(i,o){$(this).text(datepicker.dayNames[i]);});
			if($.fn.drag){
				div.drag({ handle: '.ui-dialog-titlebar',opacity: 0.8});
				$('.ui-dialog-titlebar',div).css('cursor','move');
			}else{
				$('.ui-dialog-titlebar',div).css('cursor','default');
			}
			div.click(function(e){
				var $clicked = $(e.target || e.srcElement);
				obj.getELByID('select').hide();
				if(!$clicked.hasClass('time')){
					if(!$clicked.is('td')){
						$clicked=$clicked.parent();
						if(!$clicked.is('td')) return false;
					}
				}
				obj._onClick($clicked);
				datepicker.stopEvent(e);
				return false;
			}).hide();
		},
		init:function(el,op){
			this.close();
			this.element=$(el).addClass('ui-datepicker-show').get(0);
			var offset=$(el).offset();
			op=op||op;
		    this.options=$.extend({
				out:el,//输出对象 默认当前对象
				useTime:false,//是否使用 时分秒
				workTime:false,//上班时间显示
				beforeWrite:null,//回写日期前执行函数
				afterWrite:null,//日期回写事件
				top:$(el).outerHeight()+offset.top+2,//显示位置
				left:offset.left
			},op);
			this.daFormat=op.daFormat||((this.options.useTime||this.options.workTime)?datepicker.daFormat.dateTime:datepicker.daFormat.date);
			this.outDate=null;
			var val=$(this.options.out).val();
			var da=datepicker.parseDate(val,this.daFormat);
			this.outDate=da;
			with(this._date){
				y=da.getFullYear(); //定义年的变量的初始值
				m=da.getMonth()+1; //定义月的变量的初始值
				d=da.getDate();	//定义日的变量的初始值	
				h=da.getHours();	//定义小时变量的初始值
				i=da.getMinutes();//定义分钟变量的初始值
				s=da.getSeconds();//定义秒变量的初始值
			}
			if(this.options.workTime){
				//获取人员上班时间
				getContextOperatorOndutyTime();
				if(!Public.isDateTime(val)){//默认为上班时间
					var workBeginTime=datepicker.workTime[0];
					this._date.h=workBeginTime.substring(0,2);
					this._date.i=workBeginTime.substring(3);
				}
			}
			this.show();
		},
		getELByID:function(name){
			return $('#'+name+'_'+this.mainID); 
		},
		show:function(){//显示日历
			var div=this.getELByID('main'),slider=this.getELByID('slider'),_self=this;
			this.getELByID('choose').find('td.datetime-click').removeClass('datetime-click');
			this.getELByID('chooseTimes').hide();
			if(this.options.useTime){
				try{slider.slider().slider('option','value',0).slider('disable');}catch(e){}
				$('.ui-datepicker-datetime-tr',div).show();
				setTimeout(function(){
					_self._slider($('#hourHead'),'hourHead');
				},10);
				this.initTimesDiv();
			}else{
				try{slider.slider('destroy').html("<div class='ui-slider-handle'></div>");}catch(e){}
				$('.ui-datepicker-datetime-tr',div).hide();
			}
			if(this.options.workTime){
				this.getELByID('workTime').find('td').each(function(i,o){
					$(this).html(datepicker.workTime[i]);
				});
				$('.ui-datepicker-worktime-tr',div).show();
				this.initTimesDiv();
			}else{
				$('.ui-datepicker-worktime-tr',div).hide();
			}
			if(!this.options.useTime&&!this.options.workTime){//不显示时间按钮
				this.getELByID('choose').find('.showTime').hide();
			}else{
				this.getELByID('choose').find('.showTime').show();
			}
			this.writeDateTime();
			var scrollTop=$(document).scrollTop();
			var opTop=this.options.top,opLeft=this.options.left;
			if($.isFunction(opTop)){
				opTop=opTop.call(window);
			}
			if($.isFunction(opLeft)){
				opLeft=opLeft.call(window);
			}
			div.css({top:opTop,left:opLeft});
			div.show();
			var th=opTop+div.outerHeight(),dh=$(window).height()+scrollTop;
			if(th>(dh+30)){//日历内容向上展现
				if(opTop-div.outerHeight()-30>scrollTop){
					th=opTop-div.outerHeight()-30;
					div.css({top:th});
				}
			}
		},
		_onClick:function($clicked){
			var id=$clicked.attr('id');
			switch(id){
				case 'clear'       : //清空
					if(typeof this.options.beforeWrite=='function'){
						var flag=this.options.beforeWrite.call(this,'');
						if(flag===false) return;
					}
					$(this.options.out).val('');this.close();   
					break;
				case 'now'         : this.chooseToday();     break;//当前时间
				case 'close'       : this.close();           break;//关闭
				case 'beforeMonth' : this.getNextMonth(-1);this.getELByID('chooseTimes').hide();  break;//前一月
				case 'afterMonth'  : this.getNextMonth(1);this.getELByID('chooseTimes').hide();   break;//后一月
				case 'beforeYear'  : this.getNextYear(-1);this.getELByID('chooseTimes').hide();   break;//前一年
				case 'afterYear'   : this.getNextYear(1);this.getELByID('chooseTimes').hide();    break;//后一年
				case 'yearHead'    : this.selectYearHTML($clicked);this.getELByID('chooseTimes').hide();   break;//年选择
				case 'monthHead'   : this.selectMonthHTML($clicked);this.getELByID('chooseTimes').hide();   break;//月选择
				case 'chooseWorkTime' : this.clickWorkTime($clicked.html());this.getELByID('chooseTimes').hide(); break;//上下班时间设置
				case 'showTime' : //显示时间点
					var chooseTimes=this.getELByID('chooseTimes');
					if(chooseTimes.is(':hidden')){
						chooseTimes.show().scrollTop(60);
					}else{
						chooseTimes.hide();
					}
					break;
				case 'time' : this.clickWorkTime($clicked.html());this.getELByID('chooseTimes').hide(); break;//时间点
				case 'hourHead': case 'minuteHead': case 'secondHead':
					this._slider($clicked,id);
					this.getELByID('chooseTimes').hide();
					break;
				case  'day'        : this.dayClick($clicked); break;
			}
		},
		_slider:function(temp,id){
            if(!this.options.useTime) return;
			var slider=this.getELByID('slider'),text=datepicker.dateNames.s,obj=this;
			this.getELByID('choose').find('td').removeClass('datetime-click');
			temp.addClass('datetime-click');
			var startValue=parseInt(temp.text(),10);
			var maxValue=59;
			if(id=='hourHead'){
				maxValue=23;//如果是小时滑快最大为23
				text=datepicker.dateNames.h;
			}else if(id=='minuteHead'){
				text=datepicker.dateNames.i;
			}
			var options={max:maxValue,value:startValue,slide:function(e,o){//定义新滑快
				temp.html(datepicker.format(o.value)+text);
				if($(temp).hasClass('hourHead')){
					obj._date.h=o.value;
				}else if($(temp).hasClass('minuteHead')){ 
					obj._date.i=o.value;
				}else{
					obj._date.s=o.value;
				}
				obj.writeDateTo();
			}};
			$.each(options,function(p,v){
				slider.slider('option',p,v);
			});
			try{slider.slider('enable');}catch(e){}//取消以前注册的滑快
		},
		clickWorkTime:function(value){
			var h=value.substring(0,2);
			var m=value.substring(3);
			this._date.h=h;
			this._date.i=m;
			var choose=this.getELByID('choose');
			choose.find("td.hourHead").text(h+datepicker.dateNames.h); 
			choose.find("td.minuteHead").text(m+datepicker.dateNames.i);
			this.writeDateTo();
		},
	    initTimesDiv:function(){
	    	var div=this.getELByID('chooseTimes');
	    	var timesHtml=[];
	    	for(var i=0;i<24;i++){
	    		timesHtml.push('<div class="time" id="time">',datepicker.format(i)+":00",'</div>');
	    		timesHtml.push('<div class="time" id="time" style="color:#CD0000;">',datepicker.format(i)+":30",'</div>');
	    	}
	    	div.html(timesHtml.join(''));
	    },
		writeDateTime:function(){//往 head 中写入当前的年与月
			var head=this.getELByID('head');
			head.find('td.yearHead').text(this._date.y +datepicker.dateNames.y);
			head.find('td.monthHead').text(datepicker.format(this._date.m) +datepicker.dateNames.m);
			var choose=this.getELByID('choose');
			//插入当前小时、分
			if(this.options.useTime){//使用时间
				choose.find("td.hourHead").text(datepicker.format(this._date.h)+datepicker.dateNames.h); 
				choose.find("td.minuteHead").text(datepicker.format(this._date.i)+datepicker.dateNames.i);
				//datetime.find("td.secondHead").text(datepicker.format(this._date.s)+datepicker.dateNames.s);
			}else{
				choose.find("td.hourHead").text(''); 
				choose.find("td.minuteHead").text('');
			}
			this.setDay();
		},
		setDay:function(){
			var days=new Array(42),i=0;	//定义写日期的数组
			for (i = 0; i < 42; i++){days[i]="";};	//将显示框的内容全部清空
			var outDate=this.outDate,da=new Date();
			var yy=this._date.y,mm=this._date.m;
			var day1 = 1,day2=1,firstday = new Date(yy,mm-1,1).getDay();//某月第一天的星期几
			var monthCount= datepicker.getMonthCount(yy,mm);//当前月天数
			for (i=0;i<firstday;i++){days[i]=datepicker.getMonthCount(mm==1?yy-1:yy,mm==1?12:mm-1)-firstday+i+1;}//上个月的最后几天
			for (i = firstday;day1<monthCount+1; i++){days[i]=day1;day1++; }//本月天数
			for (i=firstday+monthCount;i<42;i++) {days[i]=day2;day2++;}//下月天数
			this.getELByID('date').find('td').each(function(j){
				var flag=0,color='#000000',className='';
				$(this).removeClass().attr('id','');
				if(days[j]!=""){
					if(j<firstday){//上个月的
						flag=-1;color='#BCBABC';
					}else if (j>=firstday+monthCount)	{//下个月的
						flag=1;color='#BCBABC';
					}else{//本月的
						if(yy==da.getFullYear() && mm ==da.getMonth()+1 && days[j] == da.getDate()){
							 className='ui-datepicker-day-now';//设置当前日期样式
						}
						if(outDate){//将选中的日期显示其他的背景
							if(yy==outDate.getFullYear() && mm== outDate.getMonth() + 1 && days[j]==outDate.getDate()){
								className='ui-datepicker-day-click';
							}
						}
						if(j%7==0||(j+1)%7==0){//周末时间显示其他颜色 #CD0000
							color='#CD0000';
						}
					}
					$(this).attr({flag:flag,id:'day'}).addClass('ui-datepicker-day-td').html(days[j]).css({color:color});
					if(className!='') $(this).addClass(className);
				}
			});	
		},
		dayClick:function(el){	//点击显示框选取日期
			var n=el.text(),ex=el.attr('flag');
			this._date.d=n;
			var yy=this._date.y,mm = parseInt(this._date.m,10)+parseInt(ex,10);//ex表示偏移量，用于选择上个月份和下个月份的日期
			if(mm<1){
				yy--;
				mm=12+mm;
			}else if(mm>12){
				yy++;
				mm=mm-12;
			}
			this._date.y=yy;
			this._date.m=mm;
			this.outDate=new Date(yy,mm-1,n);
			this.writeDateTo();
			if(this.options.useTime){//偏移量不为0重构日历
				if(ex!=0){
					this.writeDateTime();
				}else{
					el.parents('table.ui-datepicker-day-table').find('td.ui-datepicker-day-click').removeClass('ui-datepicker-day-click');
					el.addClass("ui-datepicker-day-click");
				}
			}else if(this.options.workTime){
				
			}else{
				this.close();
			}
		},
		getNextMonth:function(type){	//往后翻月份 type 1 增加一月 or -1 减少一月
			if(type==1){
				if(this._date.m==12){
					this._date.y++;
					this._date.m=1;
				}else{
					this._date.m++;
				}
			}else{
				if(this._date.m>1){
					this._date.m--;
				}else{
					this._date.y--;
					this._date.m=12;
				}
			}
			this.writeDateTime();
		},
		getNextYear:function(type){	//往后翻月份 type 1 增加一年 or -1 减少一年
			this._date.y=this._date.y+type;
			if(this._date.y>9999) this._date.y=9999;
			if(this._date.y<1000) this._date.y=1000;
			this.writeDateTime();
		},
		selectYearHTML:function(o){ //年份的下拉框
			var strYear=o.text();
			var m = (strYear) ? parseInt(strYear,10) : new Date().getFullYear();
			if (m < 1000 || m > 9999) {alert("年份值不在 1000 到 9999 之间！");return;}
			var n = m - 50;
			if (n < 1000) n = 1000;
			if (n + 101 > 9999) n = 9974;
			var select=this._selectEvent();
			var selectedIndex=0,option=['<ul id="y">'];
			for (var i = n; i < n + 101; i++){
				if(i==m) {
					selectedIndex=i-n;
					option.push('<li id="'+i+'" class="selected">'+i+datepicker.dateNames.y+'</li>');
				}else{
					option.push('<li id="'+i+'">'+i+datepicker.dateNames.y+'</li>');
				}
			}
			option.push('<ul>');
			select.html(option.join('')).css({top:26,left:50,width:'63px'}).show();
            setTimeout(function (){select.scrollTop((selectedIndex-3)*20);},10);
		},
		selectMonthHTML:function(o){ //月份的下拉框
            var strMonth=o.text();
			var m = (strMonth) ? parseInt(strMonth,10) : new Date().getMonth() + 1;
            var select=this._selectEvent();
			var selectedIndex=0,option=['<ul id="m">'];
			for (var i = 1; i < 13; i++){
				if(i==m){
					selectedIndex=i-1;
					option.push('<li id="'+i+'" class="selected">'+i+datepicker.dateNames.m+'</li>');
				}else{
					option.push('<li id="'+i+'">'+i+datepicker.dateNames.m+'</li>');
				}
			}
			option.push('<ul>');
			select.html(option.join('')).css({top:26,left:99,width:'63px'}).show();
			setTimeout(function (){select.scrollTop((selectedIndex-3)*20);},10);
		},
		_selectEvent:function(){
			var select=this.getELByID('select'),_self=this;
			if(!!select.length) return select;
			select=$('<div class="select" id="select_'+this.mainID+'"></div>').appendTo(this.getELByID('main'));
			select.bind('mousemove',function(e){
				var $clicked = $(e.target || e.srcElement);
				if($clicked.is('li')){
					if(!$clicked.is('.over')){
						$clicked.siblings('li.over').removeClass('over');
						$clicked.addClass('over');
					}
				}
				datepicker.stopEvent(e);
				return false;
			}).bind('mousedown',function(e){
				var $clicked = $(e.target || e.srcElement);
				if($clicked.is('li')){
					var type=$clicked.parent('ul').attr('id'),id=$clicked.attr('id');
					switch(type){//类型 y年 ,m月
						case 'y' :_self._date.y=id;break;
						case 'm' :_self._date.m=id;break;
					}
					_self.writeDateTime();
					$(this).hide();
				}
				return false;
			}).bind('mouseleave',function(e){
				$(this).hide();
				return false;
			});
			return select;
		},
		writeDateTo:function(){
			var da,text;
			with(this._date){
			   da=new Date(y, m-1, d, h, i, s);
			}
			text=datepicker.formatDate(da,this.daFormat);
			if($.isFunction(this.options.beforeWrite)){
				var flag=this.options.beforeWrite.call(this,text);
				if(flag===false) return;
			}
			$(this.options.out).val(text);
			if($.isFunction(this.options.afterWrite)){
				this.options.afterWrite.call(this,text);
			}
		},
		chooseToday:function(){	//当前日期
			var da=new Date();
			with(this._date){
				y=da.getFullYear();
				m=da.getMonth()+1;
				d=da.getDate();
				h=da.getHours();
				i=da.getMinutes();
				s=da.getSeconds();
			}
			this.writeDateTo();
			this.close();
		},
		close:function(){//关闭日历
			var div=this.getELByID('main');
			if(!div.length&&div.is(':hidden')) return;
			if(this.options) this.options.out=null;
			if(this.element){
				$(this.element).removeClass('ui-datepicker-show');
				try{$(this.element).checkValue();}catch(e){}
			}	
			this.element=null;
			this.getELByID('select').hide();
			div.hide();
		}
	});
    $.extend(datepicker,{
		monHead:[31,28,31,30,31,30,31,31,30,31,30,31],//定义阳历中每个月的最大天数
		dayNames: ['日', '一', '二', '三', '四', '五', '六'],
		dateNames:{y:'年',m:'月',d:'日',h:'时',i:'分',s:'秒'},
	    daFormat:{date:'%Y-%M-%D',dateTime:'%Y-%M-%D %H:%I'},//默认日期格式化参数'%Y-%M-%D %H:%I:%S'
	    workTime:['09:00','12:00','13:30','18:00'],//上下班时间
		stopEvent:function(ev) {//阻止事件起泡
			try{
				ev.preventDefault();
				ev.stopPropagation();
			}catch(e){}
		},
		isPinYear:function(year){	//判断是否闰平年
			if (0==year%4&&((year%100!=0)||(year%400==0)))
				return true;
			else
				return false;
		},
		getMonthCount:function(year,month){	//闰年二月为29天
			var c=this.monHead[month-1];
			if((month==2)&&datepicker.isPinYear(year))
				 c++;
			return c;
		},
		getWeek:function(day,month,year){	//求某天的星期几
			var dt=new Date(year,month-1,day).getDay()/7;
		    return dt;
		},
		format:function(n)	{//格式化数字为两位字符表示
			var m=new String();
			var tmp=new String(n);
			if (tmp.length<2){
				m="0"+n;
			}else if(tmp.length>2){
                m=tmp.substring(1,tmp.length);
			}else{
				m=n;
			}
			return m;
		},
		/*解析字符串为时间对象
          str  字符串
		  fmt  格式化参数
		*/
		parseDate:function(str, fmt) {
			var today = new Date();
			if(!str||str=='') return today;
			var y = 0, m = -1,d = 0;
			var a = str.split(/\W+/);
			var b = fmt.match(/%./g);
			var hr = 0,min = 0,ss=0;
			for (var i = 0; i < a.length; ++i) {
				if (!a[i])
					continue;
				switch (b[i]) {
					case "%d":
					case "%D":
					d = parseInt(a[i], 10);
					break;

					case "%M":
					case "%m":
					m = parseInt(a[i], 10) - 1;
					break;

					case "%Y":
					case "%y":
					y = parseInt(a[i], 10);
					(y < 100) && (y += (y > 29) ? 1900 : 2000);
					break;

					case "%H":
					case "%h":
					hr = parseInt(a[i], 10);
					break;
					
					case "%I":
					case "%i":
					min = parseInt(a[i], 10);
					break;

					case "%S":
					case "%s":
					ss = parseInt(a[i], 10);
					break;
				}
			}
			if (isNaN(y)) y = today.getFullYear();
			if (isNaN(m)) m = today.getMonth();
			if (isNaN(d)) d = today.getDate();
			if (isNaN(hr)) hr = today.getHours();
			if (isNaN(min)) min = today.getMinutes();
			if (isNaN(ss)) ss = today.getSeconds();
			if (y != 0 && m != -1 && d != 0)
				return new Date(y, m, d, hr, min,ss);
			y = 0; m = -1; d = 0;
			for (i = 0; i < a.length; ++i) {
				if (parseInt(a[i], 10) <= 12 && m == -1) {
					m = a[i]-1;
				} else if (parseInt(a[i], 10) > 31 && y == 0) {
					y = parseInt(a[i], 10);
					(y < 100) && (y += (y > 29) ? 1900 : 2000);
				} else if (d == 0) {
					d = a[i];
				}
			}
			if (y == 0)
				y = today.getFullYear();
			if (m != -1 && d != 0)
				return new Date(y, m, d, hr, min, ss);
			return today;
		},
		/*将时间对象 按格式转化为字符串*/
		formatDate:function (da,fmt) {
			var s = {};
			var m = da.getMonth();
			var d = da.getDate();
			var y = da.getFullYear();
			var hr = da.getHours();
			var min = da.getMinutes();
			var sec = da.getSeconds();
			s["%d"] = d;
			s["%D"] = (d < 10) ? ("0" + d) : d;
			s["%H"] = (hr < 10) ? ("0" + hr) : hr;
			s["%h"] = hr;
			s["%M"] = (m < 9) ? ("0" + (1+m)) : (1+m);
			s["%m"] = (1+m);
			s["%I"] = (min < 10) ? ("0" + min) : min;
			s["%i"] = min;
			s["%n"] = "\n";
			s["%s"] = sec;
			s["%S"] = (sec < 10) ? ("0" + sec) : sec;
			s["%t"] = "\t";
			s["%y"] = ('' + y).substr(2, 2);
			s["%Y"] = y;
			s["%%"] = "%";
			var re = /%./g;
			var a = fmt.match(re);
			for (var i = 0; i < a.length; i++) {
				var tmp = s[a[i]];
				if (tmp) {
					re = new RegExp(a[i], 'g');
					fmt = fmt.replace(re, tmp);
				}
			}
			return fmt;
		}
	});
	$(document).ready(function() {
		$.datepicker=new datepicker();
		$(document).click(function(e){
			var div=$('#main_ui_datepicker_div');
			if(!!div.length&&div.is(':visible')){//日历控件存在且可见
				var el=e.target || e.srcElement;
				if(el==$.datepicker.element){return;}
				$.datepicker.close();
			}
		});
	});

    $.fn.datepicker=function(op){
	    op=op||{};
	    return this.each(function(){
	    	var _self=$(this);
			if(_self.is('input[type="text"]')&&!_self.hasClass('textDate')&&!_self.parent().is('div.ui-combox-wrap')){
				//var width=_self.outerWidth();
				var combox_html='<div class="ui-combox-wrap"><span class="date"></span></div>';
				var combox_wrap=$(combox_html).insertAfter(_self);
				//combox_wrap.width(width);
				_self.prependTo(combox_wrap);
				combox_wrap.datepicker($.extend({out:_self},op||{}));
				return;
			}
			_self.on('keydown.datepicker',function(e){
				 if (e.keyCode === 13||e.keyCode==40) {
					 $(this).trigger('click');
					 return false;
				 }
			});
			_self.add(_self.siblings('span')).on('click.datepicker',function(event){
				if(_self.hasClass("ui-datepicker-show")){
					return;
				}
				if(_self.is('[readonly]')||_self.find('input[type="text"]').is('[readonly]')){
					return;
				}
				if(_self.hasClass("ui-datepicker")) {
					//强制关闭快捷选择控件
					try{$.closeCombox();}catch(e){}
					$.datepicker.init(_self,op);
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
			});
			if(_self.is(':disabled')||_self.is('[readonly]')){
				_self.datepickerDisabled();
			}else{
				_self.addClass('ui-datepicker');
			}
		});
	};
	$.fn.datepickerEnable=function(){
		return $(this).each(function(){
			if($(this).is('input[type="text"]')){
				var td=$(this).parent().parent('td.edit');
				if(td.length>0){
					td.removeClass('disable');
				}
				$(this).removeAttr('readonly').removeClass('textReadonly');
			}
			$(this).addClass('ui-datepicker').removeClass('ui-datepicker-disable');
			$(this).next('span').show();
		});
	};
	$.fn.datepickerDisabled=function(){
		return $(this).each(function(){
			if($(this).is('input[type="text"]')){
				var td=$(this).parent().parent('td.edit');
				if(td.length>0){
					td.addClass('disable');
				}
				$(this).attr('readonly',true).addClass('textReadonly');
			}
			$(this).removeClass('ui-datepicker').addClass('ui-datepicker-disable');
			$(this).next('span').hide();
		});
	};
	$.setDatepickerWorkTime=function(workTime){
		datepicker.workTime=workTime;
	};
	//获取环境中的人员上班时间
	function getContextOperatorOndutyTime(){
		try{
			var ondutyTime=ContextUtil.getOperator('ondutyTime');
			if(!Public.isBlank(ondutyTime)){
				var workTime=ondutyTime.split(',');
				if(workTime.length==4){
					$.setDatepickerWorkTime(workTime);
				}
			}
		}catch(e){}
	}
})(jQuery);