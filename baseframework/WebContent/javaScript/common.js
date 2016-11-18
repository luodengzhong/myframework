/**********************************
 * 通用JS方法定义
 * xiexin
 * 2014-01-03
 * *************************************/
var Public = Public || {};
Public.isReadOnly=false;//判断当前页面是否只读(查看模式)
Public.manageTypeParmName='sys_Manage_Type';//系统业务管理权限参数名称
/**只读方法匹配正则表达式**/
Public.readOnlyAttributes=['save*','update*','delete*','add*','insert*','edit*','remove*','batchUpdate*'];
//页面初始化方法
$(document).ready(function() {
	//从URL中读取只读参数
	Public.isReadOnly=Public.getQueryStringByName("isReadOnly")==='true';
	setTimeout(function(){
		$('#screenOverLoading').hide();
	},0);
	/* 屏蔽回车事件 */
	$(document).keydown(function(event) {
		var k = event.charCode || event.keyCode || event.which;
		var $el = $(event.target || event.srcElement);
		/* 不能屏蔽textarea的回车事件 */
		if (k == '13' && !$el.is('textarea')) {
			event.preventDefault();
			event.stopPropagation();
			return false;
		}
	});
	Public.autoInitializeUI();
});
//判断输入的name 是否匹配只读方法正则表达式
Public.testReadOnlyAttributes=function(name){
	if(Public.isBlank(name)){
		return false;
	}
	var flag=false,re=null;
	$.each(Public.readOnlyAttributes,function(i,o){
		re=new RegExp(o,"i");
		if(re.test(name)){
			flag=true;
			return true;
		}
	});
	return flag;
};
//自动加载UI插件
Public.autoInitializeUI=function($doc){
	$doc=$doc||$('body');
	if($.fn.combox){
		$('select',$doc).each(function(i,o){
			if($(this).hasClass('noWrapper')) return;
			try{$(o).combox();}catch(e){return false;}
		});
	}
	$('textarea',$doc).each(function(i,o){
		if($(this).hasClass('textareaReadonly')){
			if(!$(this).parents('div.ui_content').length){
				$(this).textareaAutoHeight();
			}
		}else{
			if($.fn.maxLength){
				try{$(o).maxLength();}catch(e){return false;}
			}
		}
	});
	$('input[type="text"]',$doc).each(function(i,o){
		var $o=$(o),dataOptions=$.trim($o.attr('dataOptions'));
		if($.fn.mask){
			var mask=$o.attr('mask');
			if(mask=='money'){
				$o.mask('nnnnnnnnnnn.99',{number:true,money:true});
			}else if(mask=='positiveMoney'){
				$o.mask('9999999999.99',{number:true,money:true});
			}else if(mask=='date'){
				$o.mask('9999-99-99');
			}else if(mask=='dateTime'){
				$o.mask('9999-99-99 99:99');
			}else if(mask=='number'){
				var length=parseInt($o.attr('maxLength')),precision=parseInt($o.attr('precision'));
				var tempMask=[];
				if(length&&!isNaN(length)){
					for(var i=0;i<length;i++){
						tempMask.push('n');
					}
				}
				if(precision&&!isNaN(precision)&&precision>0){
					tempMask.push('.');
					for(var i=0;i<precision;i++){
						tempMask.push('n');
					}
				}
				if(tempMask.length>0){
					$o.mask(tempMask.join(''),{number:true});
				}
			}else if(mask){
				$o.mask(mask,{number:/^[0-9|n|.]+$/i.test(mask)});
			}
		}
		dataOptions=Public.getJSONDataSource(dataOptions);
		if($o.is('[date]')){
			if($.fn.datepicker){$o.datepicker().mask('9999-99-99');}
		}else if($o.is('[dateTime]')){
			if($.fn.datepicker){$o.datepicker({useTime:true}).mask('9999-99-99 99:99');}
		}else if($o.is('[spinner]')){
			if($.fn.spinner){$o.spinner(dataOptions);}
		}else if($o.is('[select]')){
			if($.fn.combox&&dataOptions){
				$o.searchbox(dataOptions);
			}
		}else if($o.is('[combo]')){
			if($.fn.combox&&dataOptions){
				$o.combox(dataOptions);
			}
		}else if($o.is('[tree]')){
			if($.fn.combox&&dataOptions){
				if(dataOptions.name=='org'){
					$o.orgTree(dataOptions);
				}else{
					$o.treebox(dataOptions);
				}
			}
		}else if($o.is('[dictionary]')){
			if($.fn.combox&&dataOptions){
				$o.remotebox(dataOptions);
			}
		}
	});
};
Public.getJSONDataSource=function(dataSource){//读取Json数据源
	try{
		if(dataSource && typeof dataSource=='string'){
			if (dataSource.substring(0, 1) != "{"){
				dataSource = ["{" , dataSource , "}"].join('');
			}
			dataSource=(new Function("return "+dataSource))();
		}
		return dataSource;
	}catch(e){
		return {};
	}
};
Public.closeWebPage=function(){
	if (navigator.userAgent.indexOf("MSIE") > 0) {  
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {  
            window.opener = null; window.close();  
        }  
        else {  
            window.open('', '_top'); window.top.close();  
        }  
    }  
    else if (navigator.userAgent.indexOf("Firefox") > 0) {  
        window.location.href = 'about:blank ';
    }  
    else {  
        window.opener = null;   
        window.open('', '_self', '');  
        window.close();  
    }  
}
//使用post方式打开 open窗口
Public.openPostWindow=function(url,param){
	if(!$.browser.msie){
		var name="form"+new Date().getTime();
		var tempForm=$('<form method="post"></form>');
		tempForm.attr('action',url);
		tempForm.attr('target',name);
		$.each(param,function(p,v){
			if(!v) return;
			var hideInput=$('<input type="hidden" name="'+p+'"/>');
			hideInput.val(encodeURI(v));
			tempForm.append(hideInput);
		});
		tempForm.appendTo('body');
		tempForm.on('submit',function(){
			window.open('about:blank',name);   
		});
		tempForm.trigger('submit');
		tempForm.remove();
	}else{
		var newWin=window.open('about:blank','_blank');   
		var body=$(newWin.document.body);
		body.html('<form method="post" >数据加载中,请稍候.....</form>');
		var tempForm=$('form',body);
		tempForm.attr('action',url);
		var html=[];
		$.each(param,function(p,v){
			if(!v) return;
			html.push('<input type="hidden" name="',p,'" value="',encodeURI(v),'"/>');
		});
		tempForm.html(html.join(''));
		tempForm.trigger('submit');
	}
    return false;
};
Public.encodeURI=function(msg){
	if(Public.isBlank(msg)){
		return '';
	}
	var value = encodeURI(msg);
	value = value.replace(/\&/g, "%26");  
	value = value.replace(/\+/g, "%2B");
	return encodeURI(value);
};
/*JS StringBuilder 类*/
function StringBuilder() {
    this._strings_ = new Array;
}

StringBuilder.prototype.append = function (str) {
    this._strings_.push(str);
};

StringBuilder.prototype.toString = function () {
    return this._strings_.join("");
};

$.extend(String.prototype,{
	endsWith:function(f){
		var reg = new RegExp("\\s*"+f+"($)", "i"); 
		if (reg.test(this))
			return true; 
		return false;
	},
	startsWith:function(f){
		var reg = new RegExp("(^)"+ f +"\\s*", "i"); 
		if (reg.test(this))
			return true; 
		return false;
	}
}); 
/*将参数中的方法逐个调用，返回第一个成功执行的方法的返回值 */
Public.these = function() {
    var returnValue=null;
    for (var i = 0; i < arguments.length; i++) {
        var fn = arguments[i];
        try {
            returnValue = fn();
            break;
        } catch(e) {}
    }
    return returnValue;
};
Public.isBlank = function(obj) {
	if(typeof obj=='undefined'){
		return true;
	}
	if(obj==null){
		return true;
	}
	if(obj===''){
		return true;
	}
	return false;
};
Public.checkImgExists = function(src,callback) {
	var imgObj = new Image(); //判断图片是否存在
	imgObj.src = src; //没有图片，则返回-1 
	if(imgObj.fileSize==-1){
		callback.call(window)
	}
	imgObj.onload = function(){
		if (imgObj.width <= 0 && imgObj.height <= 0) {
			callback.call(window)
		}
	};
	imgObj.onerror = function(){//图片不存在时显示默认
		callback.call(window)
	};
};
Public.compareObject=function(o1,o2){
	if(typeof o1 != typeof o2) return false;
	if(typeof o1 == 'object'){
	    for(var o in o1){
	    	if(typeof o2[o] == 'undefined')return false;
	    	if(!Public.compareObject(o1[o],o2[o]))return false;
	    }
		for(var o in o2){
			if(typeof o1[o] == 'undefined')return false;
			if(!Public.compareObject(o2[o],o1[o]))return false;
	    }
	    return true;
	}else{
	    return o1 === o2;
	}
};
//字符串转数字
Public.toNumber = function(value,def) {
	var n=parseFloat(value,10);
	if(isNaN(n)){
		if(Public.isBlank(def)){
			return null;
		}else{
			n=def;
		}
	}
	return n;
};

Public.encode = function(value) {
	if(Public.isBlank(value)){
		return '';
	}
	value = encodeURI(value);
	value = value.replace(/\&/g, "%26");  
	value = value.replace(/\+/g, "%2B");
	return encodeURI(value);
};
/*默认对话框宽度*/
function getDefaultDialogWidth() {
    var width = $(window).width();
    width = width * 80 / 100;
    if (width < 800) width = 800;
    return width;
}
/*默认对话框高度*/
function getDefaultDialogHeight() {    
    var height = $(window).height();
    height = height * 80 / 100;
    if (height < 300) height = 300;
    return height;
}

/* 获取URL参数值 */
Public.getQueryStringByName = function(name) {
	var param, url = location.search, theRequest = {};
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for ( var i = 0, len = strs.length; i < len; i++) {
			param = strs[i].split("=");
			theRequest[param[0]] = decodeURIComponent(param[1]);
		}
	}
	return name ? theRequest[name] : theRequest;
};

/*管理权限鉴权方法*/
Public.authenticationManageType = function (manageType,fullId,fn) {
	var url=web_app.name+'/authenticationManageType.ajax';
	Public.ajax(url,{manageType:manageType,fullId:fullId},function(data){
		if($.isFunction(fn)){
			fn.call(window,((data+'')=='true'));
		}
	});
};
/******考核主体单位权限验证*****/
Public.authenticationAssessSubject = function (manageType,fullId,async,fn) {
	var url=web_app.name+'/authenticationAssessSubject.ajax';
	var ajaxFn=Public.ajax;
	if(async===false){
		ajaxFn=Public.syncAjax;
	}
	ajaxFn(url,{manageType:manageType,fullId:fullId},function(data){
		if($.isFunction(fn)){
			fn.call(window,((data+'')=='true'));
		}
	});
};
/****验证是否是工资主体单位***/
Public.authenticationWageOrg = function (manageType,fullId,async,fn) {
	var url=web_app.name+'/authenticationWageOrg.ajax';
	var ajaxFn=Public.ajax;
	if(async===false){
		ajaxFn=Public.syncAjax;
	}
	ajaxFn(url,{manageType:manageType,fullId:fullId},function(data){
		if($.isFunction(fn)){
			fn.call(window,((data+'')=='true'));
		}
	});
};
/* 格式化金额 */
Public.currency = function(val) {
    if(Public.isBlank(val)){
    	return '';
    }
    if(typeof val=='string'){
    	try{
    		val=val.replace(/[,]/g, '');
    	}catch(e){
    		
    	}
    }
	val = parseFloat(val,10);
	if(isNaN(val)){
		return '';
	}
	if (val === 0 ) {
		return '0.00';
	}
	val = val.toFixed(2);
	var reg = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
	return val.replace(reg, "$1,");
};
/* 格式化金额 */
Public.number = function(val, mask) {
	val = parseFloat(val, 10);
	if (isNaN(val))
		return '';
	var d = parseInt(mask);
	if (typeof mask == 'string') {
		var ms = mask.split('.');
		if (ms.length > 1)
			d = ms[1].length;
	}
	if (isNaN(d))
		return '';
	return val.toFixed(d);
};
/* 金额格式转浮点数*/
Public.moneyToFloat = function (amount) {
	amount = parseFloat((amount + "").replace(/[,]/g, ""));
	return amount;
};
/*判断是否为日期格式*/
Public.isDate=function(dateString){
	if(Public.isBlank(dateString)) return true;
    var r=dateString.match(/^(\d{1,4})(-|\/|\.)(\d{1,2})\2(\d{1,2})$/); 
    if(r==null){
    	return false;
    }
    var d=new Date(r[1],r[3]-1,r[4]);   
    var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
    return (num!=0);
};
/*判断是否为日期加时间格式*/
Public.isDateTime=function(dateString){
    if(Public.isBlank(dateString)) return true;
    var r=dateString.match(/^(\d{1,4})(-|\/|\.)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/); 
    if(r==null){
    	return false;
    }
    var d=new Date(r[1],r[3]-1,r[4],r[5],r[6],0);   
    var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
    return (num!=0);
};
Public.isDateTimeSecond=function(dateString){
    if(Public.isBlank(dateString)) return true;
    var r=dateString.match(/^(\d{1,4})(-|\/|\.)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/); 
    if(r==null){
    	return false;
    }
    var d=new Date(r[1],r[3]-1,r[4],r[5],r[6],r[7]);   
    var num = (d.getFullYear()==r[1]
    			&&(d.getMonth()+1)==r[3]
    			&&d.getDate()==r[4]
    			&&d.getHours()==r[5]
    			&&d.getMinutes()==r[6]
    			&&d.getSeconds()==r[7]
    			);
    return num
};
/* 根据类型验证输入的数据 */
Public.validator = function(type, value) {
	if (Public.isBlank(value)){
		return true;
	}
	switch (type) {
	case 'email':
		return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
				.test(value);
	case 'url':
		return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
				.test(value);
	case 'ip':
		return /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(0)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))(\/\d+)?$/
				.test(value);
	case 'length':
		var len = $.trim(value).length;
		return len >= arguments[2] && len <= arguments[3];
	case 'phone':
		return /^(\+?(86))?0?1\d{10}$/i.test(value);
	case 'qq':
		return /[1-9][0-9]{4,}/i.test(value);
	case 'number':
		return /^[0-9|\-|\.]*$/i.test(value);
	case 'identity':
		return /^\d{15}|\d{}18$/i.test(value);
	case 'letter':
		return /^[A-Za-z0-9|-]+$/i.test(value);
	default:
		var reg = new RegExp(type, "g");
		return reg.test(value);
		return true;
	}
};
/* 将时间对象 按格式转化为字符串 */
Public.formatDate = function(da, fmt) {
	if (!da)
		return '';
	fmt=fmt||'%Y-%M-%D';
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
	s["%M"] = (m < 9) ? ("0" + (1 + m)) : (1 + m);
	s["%m"] = (1 + m);
	s["%I"] = (min < 10) ? ("0" + min) : min;
	s["%i"] = min;
	s["%n"] = "\n";
	s["%s"] = sec;
	s["%S"] = (sec < 10) ? ("0" + sec) : sec;
	s["%t"] = "\t";
	s["%y"] = ('' + y).substr(2, 2);
	s["%Y"] = y;
	s["%%"] = "%";
	var re = /%./g, a = fmt.match(re);
	for ( var i = 0; i < a.length; i++) {
		var tmp = s[a[i]];
		if (tmp) {
			re = new RegExp(a[i], 'g');
			fmt = fmt.replace(re, tmp);
		}
	}
	return fmt;
};
/* 解析字符串为时间对象str 字符串 fmt 格式化参数 */
Public.parseDate = function(str, fmt) {
	var today = new Date();
	if (!str || str == '')
		return today;
	fmt=fmt||'%Y-%M-%D';
	var y = 0, m = -1, d = 0;
	var a = str.split(/\W+/);
	var b = fmt.match(/%./g);
	var i = 0, j = 0;
	var hr = 0, min = 0, ss = 0;
	for (i = 0; i < a.length; ++i) {
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
	if (isNaN(y))
		y = today.getFullYear();
	if (isNaN(m))
		m = today.getMonth();
	if (isNaN(d))
		d = today.getDate();
	if (isNaN(hr))
		hr = today.getHours();
	if (isNaN(min))
		min = today.getMinutes();
	if (isNaN(ss))
		ss = today.getSeconds();
	if (y != 0 && m != -1 && d != 0)
		return new Date(y, m, d, hr, min, ss);
	y = 0;
	m = -1;
	d = 0;
	for (i = 0; i < a.length; ++i) {
		if (parseInt(a[i], 10) <= 12 && m == -1) {
			m = a[i] - 1;
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
};
//日期大小比较
Public.compareDate=function(max,min){
   var re = /-/g;
   var rs = / /g;
   var ra = /:/g;
   if(max.length>10){
   		max=max.substring(0,10);
   }
   if(min.length>10){
   		min=min.substring(0,10);
   }
   var newmax=max.replace(re,"");
   newmax=newmax.replace(rs,"");
   newmax=newmax.replace(ra,"");
   var newmin=min.replace(re,"");
   newmin=newmin.replace(rs,"");
   newmin=newmin.replace(ra,"");
   if (newmax >= newmin){
        return true;
    }else{
        return false;
    }
};
Public.dateCompare=function(max,min){
   var re = /-/g;
   var rs = / /g;
   var ra = /:/g;
   if(max.length>10){
   		max=max.substring(0,10);
   }
   if(min.length>10){
   		min=min.substring(0,10);
   }
   var newmax=max.replace(re,"");
   newmax=newmax.replace(rs,"");
   newmax=newmax.replace(ra,"");
   var newmin=min.replace(re,"");
   newmin=newmin.replace(rs,"");
   newmin=newmin.replace(ra,"");
   if (newmax > newmin){
        return 1;
    }else  if (newmax == newmin){
        return 0;
    }else{
    	return -1;
    }
};
/******js 日期加减处理*********************/
Public.timeCom = function(dateValue) {
	var newCom = dateValue;
	if (typeof dateValue == 'string') {
		if (dateValue.length > 11) {
			newCom = Public.parseDate(dateValue, '%Y-%M-%D %H:%I');
		} else {
			newCom = Public.parseDate(dateValue);
		}
	}
	this.year = newCom.getFullYear();
	this.month = newCom.getMonth() + 1;
	this.day = newCom.getDate();
	this.hour = newCom.getHours();
	this.minute = newCom.getMinutes();
	this.second = newCom.getSeconds();
	this.msecond = newCom.getMilliseconds();
	this.week = newCom.getDay();
};
//取时间差
Public.dateDiff = function(interval, date1, date2) {
	var TimeCom1 = new Public.timeCom(date1);
	var TimeCom2 = new Public.timeCom(date2);
	var result;
	switch (String(interval).toLowerCase()) {
	case "y":
	case "year":
		result = TimeCom1.year - TimeCom2.year;
		break;
	case "n":
	case "month":
		result = (TimeCom1.year - TimeCom2.year) * 12 + (TimeCom1.month - TimeCom2.month);
		break;
	case "d":
	case "day":
		result = Math.round((Date.UTC(TimeCom1.year, TimeCom1.month - 1, TimeCom1.day) - Date.UTC(TimeCom2.year, TimeCom2.month - 1, TimeCom2.day)) / (1000 * 60 * 60 * 24));
		break;
	case "h":
	case "hour":
		result = Math.round((Date.UTC(TimeCom1.year, TimeCom1.month - 1, TimeCom1.day, TimeCom1.hour) - Date.UTC(TimeCom2.year, TimeCom2.month - 1, TimeCom2.day, TimeCom2.hour)) / (1000 * 60 * 60));
		break;
	case "m":
	case "minute":
		result = Math.round((Date.UTC(TimeCom1.year, TimeCom1.month - 1, TimeCom1.day, TimeCom1.hour, TimeCom1.minute) - Date.UTC(TimeCom2.year, TimeCom2.month - 1, TimeCom2.day, TimeCom2.hour, TimeCom2.minute)) / (1000 * 60));
		break;
	case "s":
	case "second":
		result = Math.round((Date.UTC(TimeCom1.year, TimeCom1.month - 1, TimeCom1.day, TimeCom1.hour, TimeCom1.minute, TimeCom1.second) - Date.UTC(TimeCom2.year, TimeCom2.month - 1, TimeCom2.day, TimeCom2.hour, TimeCom2.minute, TimeCom2.second)) / 1000);
		break;
	case "ms":
	case "msecond":
		result = Date.UTC(TimeCom1.year, TimeCom1.month - 1, TimeCom1.day, TimeCom1.hour, TimeCom1.minute, TimeCom1.second, TimeCom1.msecond) - Date.UTC(TimeCom2.year, TimeCom2.month - 1, TimeCom2.day, TimeCom2.hour, TimeCom2.minute, TimeCom2.second, TimeCom1.msecond);
		break;
	case "w":
	case "week":
		result = Math.round((Date.UTC(TimeCom1.year, TimeCom1.month - 1, TimeCom1.day) - Date.UTC(TimeCom2.year, TimeCom2.month - 1, TimeCom2.day)) / (1000 * 60 * 60 * 24)) % 7;
		break;
	default:
		result = "invalid";
	}
	return (result);
};
//时间加减
Public.dateAdd = function(interval, num, dateValue) {
	var newCom = new Public.timeCom(dateValue);
	switch (String(interval).toLowerCase()) {
	case "y":
	case "year":
		newCom.year += num;
		break;
	case "n":
	case "month":
		newCom.month += num;
		break;
	case "d":
	case "day":
		newCom.day += num;
		break;
	case "h":
	case "hour":
		newCom.hour += num;
		break;
	case "m":
	case "minute":
		newCom.minute += num;
		break;
	case "s":
	case "second":
		newCom.second += num;
		break;
	case "ms":
	case "msecond":
		newCom.msecond += num;
		break;
	case "w":
	case "week":
		newCom.day += num * 7;
		break;
	default:
		return ("invalid");
	}
	var now = newCom.year + "/" + newCom.month + "/" + newCom.day + " " + newCom.hour + ":" + newCom.minute + ":" + newCom.second;
	return (new Date(now));
};
// 按指定字节截取字符串
Public.getBlength = function (str) {  
	for (var i = str.length, n = 0; i--;) {
		n += str.charCodeAt(i) > 255 ? 2 : 1;
	}
	return n;
}
//按指定字节数截取字符串
Public.cutByte = function(str,len,endstr){
  	var len = +len, endstr = typeof(endstr) == 'undefined' ? "..." : endstr.toString();  
	function n2(a){ 
		var n = a / 2 | 0; 
		return (n > 0 ? n : 1);
	}
	// 用于二分法查找
	if (!(str + "").length || !len || len <= 0) {
		return "";
	}
	if (Public.getBlength(str) <= len) {
		return str;
	}
	var lenS = len - Public.getBlength(endstr), _lenS = 0, _strl = 0;
	while (_strl <= lenS) {
		var _lenS1 = n2(lenS - _strl);
		_strl += Public.getBlength(str.substr(_lenS, _lenS1));
		_lenS += _lenS1
	}  
	return str.substr(0,_lenS-1) + endstr;
}
/**
 * 显示岗位对话框
 */
/*
Public.showPosDialog = function(data){
	var html=[];
	html.push('<table width="100%" border=0 cellspacing=0 cellpadding=0 >','<thead>','<tr>');
	html.push('<th>机构</th>','<th>部门</th>','<th>岗位</th>','</tr>','</thead>');
	$.each(data, function(i, o){
	    	html.push('<tr class="list" orgId="',o['id'], '">');
	    	html.push('<td>',o['ognName'],'</td>');
	    	html.push('<td>',o['deptName'],'</td>');
	    	html.push('<td>',o['posName'],'</td>');
	    	html.push('</tr>');
	    	parent.$("#operator").data(o['id'], o);
	});
	html.push('</table>');
	var options={
			title:'选择岗位',
			content:html.join(''),
			width: 400,
			opacity:0.1,
			onClick:function($el){
				if($el.is('td')){
					var orgId = $el.parent().attr('orgId');
					//Public.Context.Operator = parent.$("#operator").data(orgId);
					Public.ajax(web_app.name + '/setOperatorOrgInfo.ajax', { id: orgId }, function(data) {
						window.location.href = web_app.name +'/Index.jsp';
					});
			    }
			},
			onMousemove:function($el){
				var $tr= $el.parent('tr'), table = $tr.parent();
				if($tr.length==0 || !$tr.hasClass('list') || $tr.hasClass('over') || $tr.hasClass('seleced')) return false;
				table.find('tr.over').removeClass('over');
				$tr.addClass('over');
			}
	};
	Public.dialog(options);
};
*/

Public.dialog=function(options){
	var html = ['<div class="showPublicDialog">',
				'<div class="title publicDialogTitle">',
				'<span class="icos_title">&nbsp;</span>',
				'<span class="msg_title">',(options.title||''),'</span>',
				'<span class="icos"><a href="javascript:void(0)" hidefocus  class="close">&nbsp;</a></span>',
			    '</div>',
			    '<div class="content">'];
	html.push(options.content||'');
	html.push('</div></div>');
	var div = $(html.join('')).appendTo('body');
	div.drag({ handle: 'div.publicDialogTitle',opacity: 0.8,start:function(){
		div.addClass('ui_state_drag');
	},stop:function(){
		div.removeClass('ui_state_drag');
	}});
	this.close=function(){
		if($.isFunction(options.onClose)){
			options.onClose.call(window);
		}
		div.removeAllNode();
		screenOver.hide();
	};
	var screenOver=$('#jquery-screen-over');
	if(!screenOver.length){
		screenOver=$('<div id="jquery-screen-over" style="position:absolute;top:0px;left:0px;width:0;height:0;z-index:10000;display:none;"></div>').appendTo('body');
	}
	var d = $(document), w=d.width(), h=d.height(), mt = d.scrollTop(), ml = d.scrollLeft();
	var rootEl=document.compatMode=='CSS1Compat'?document.documentElement:document.body;	//根元素
	var width= options.width || 300;
	var height= options.height || 300;
	if(height<300){
		height=300;
	}
	var diagtop = (rootEl.clientHeight-height)/2;
	var diagleft = (rootEl.clientWidth-width+ml)/2;
	var opacity=options.opacity||0;
	var _self=this;
	div.css({width:width,top:diagtop,left:diagleft}).show();
	screenOver.css({
			width:'100%',
			height:'100%',
			background:'#001',
			filter:'alpha(opacity='+(opacity*100)+')',
			opacity:opacity
	}).show();
	div.find('a.close').on('mousedown',function(){
		_self.close();
	});
	div.on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($.isFunction(options.onClick)){
			options.onClick.call(_self,$clicked);
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}).on('mousemove',function(e){
		if($(this).hasClass('ui_state_drag')) return;
		var $el = $(e.target || e.srcElement);
		if($.isFunction(options.onMousemove)){
			options.onMousemove.call(window,$el);
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}).on('keyup',function(e){
		if($.isFunction(options.onKeyup)){
			options.onKeyup.call(_self,e);
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	});
	return div;
};
/** *模式遮盖提示层*** */
Public.tip = function(message) {
	return new Public.Tips({type:2,content:message});
};
Public.successTip = function(message) {
	return new Public.Tips({type:0, content:message});
};
Public.errorTip = function(message) {
	return new Public.Tips({type:1,content:message});
};
Public.tips = function(options) {
	return new Public.Tips(options);
};
Public.removeTips=function(){
	$('div.ui-tips').remove();
	$('div.tipsScreenOver').remove();
}; 
Public.tip.topDiff=0;
Public.Tips = function(options) {
	var defaults = {
		color : '#001', // 遮罩透明色
		alpha : 0, // 遮罩透明度
		content : '&nbsp;数据加载中，请稍候......',// 提示语言
		autoClose : true,// 是否自动关闭
		time : null,// 延迟关闭时间
		lock:null,//是否锁屏
		type : null, // 类别
		top : 2,// 位置
		width : 200,// 显示宽度
		height :'auto'// 显示高度
	};
	this.options = $.extend({}, defaults, options);
	this.init();
};
Public.Tips.prototype = {
	init : function() {
		var _self = this, opts = this.options, time;
		if (opts.autoClose) {
			time = opts.time || (opts.type == 1 ? 3000 : 2000);
			window.setTimeout(function() {
				_self.remove();
			}, time);
		}
		if(typeof opts.lock !='boolean'){
			//this.options.lock=opts.type==2?false:true;
			this.options.lock=Public.isBlank(opts.type);
		}
		this.create();
	},
	change:function(op){
		this.options=$.extend({},this.options, op||{});
		if(op.content){
			this.content(op.content);
		}
		if(typeof op.type !='undefined'){
			this.setType(op.type);
		}
		if(op.time){
			this.time(op.time);
		}
		this.removeLock();
	},
	content : function(content) {
		this.obj.html(content);
	},
	time :function(time){
		var _self = this;
		window.setTimeout(function() {
			_self.remove();
		}, time);
	},
	create : function() {
		var opts = this.options,_self=this;
		if(opts.lock){
			this._divScreenOver = $('<div class="tipsScreenOver"/>').css({
				position : 'absolute',top : 0,left : 0,width : 0,height : 0,
				backgroundColor : opts.color,
				textAlign : 'center',
				zIndex : 100000,
				opacity : opts.alpha,
				filter : "Alpha(Opacity=" + opts.alpha * 100 + ")"
			}).hide().appendTo('body');
		}
		this.obj = $('<div class="ui-tips"><i></i><span class="close"></span></div>').append(opts.content).appendTo(
				'body').hide();
		this.setType(opts.type);
		this.setPos();
		this.obj.find('span.close').bind('click',function(){
			_self.remove();
		});
	},
	setType:function(type){
		this.obj.removeClass('ui-tips-success').removeClass('ui-tips-error').removeClass('ui-tips-warning');
		switch (type) {
		case 0:
			this.obj.addClass('ui-tips-success');
			break;
		case 1:
			this.obj.addClass('ui-tips-error');
			break;
		case 2:
			this.obj.addClass('ui-tips-warning');
			break;
		}
	},
	setPos : function(_div) {
		var _self = this, opts = this.options;
		var w = parseInt(opts.width), h = parseInt(opts.height);
		if (!isNaN(w)) {
			this.obj.width( w);
		}
		if (!isNaN(h)) {
			this.obj.height(h);
		}
		var _setPos = function() {
			var winH = $(window).height(), scrollTop = $(window).scrollTop();
			var winW = $(window).width(), scrollLeft = $(window).scrollLeft();
			var top = parseInt(opts.top);
			/*if (isNaN(top)) {
				top = (winH - _self.obj.outerHeight()) / 2;
			}*/
			top += scrollTop;
			_self.obj.css({
				position : 'fixed',
				left : '50%',
				top :2+Public.tip.topDiff,
				zIndex : 100001,
				marginLeft : -_self.obj.outerWidth() / 2
			});
		};
		_setPos();
		window.setTimeout(function() {
			_self.obj.show().css({
				marginLeft : -_self.obj.outerWidth() / 2
			});
			var docHeight = Math.max(document.documentElement.scrollHeight,document.documentElement.clientHeight);
			var docWidth = Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth);
			if(opts.lock){
				_self._divScreenOver.css({width:docWidth-20,height:docHeight-20}).show();
			}
		}, 50);
		
	},
	remove : function() {
		this.obj.fadeOut(200, function() {
			$(this).remove();
		});
		if(this.options.lock&&this._divScreenOver){
			this._divScreenOver.remove();
		}
	},
	removeLock:function(){
		if(this.options.lock&&this._divScreenOver){
			this._divScreenOver.remove();
		}
	}
};
/** ******ajax 请求*********** */
// url:请求地址， params：传递的参数{...}， callback：请求成功回调
Public.ajax = function(url, params,successCallback,failCallback) {
	var tip=Public.tips({content:'&nbsp;数据操作中，请稍候......',autoClose:false});
	return $.ajax({type: "POST",url : url,cache : false, async : true,dataType : "json",data : params||{},
		// 当异步请求成功时调用
		success : function(data) {
			tip.remove();
			Public.ajaxCallback(data, successCallback, failCallback);
		},
		// 当请求出现错误时调用
		error : function(err) {
			tip.change({ type: 1, content : '操作失败了哦！', time: 3000 });
		}
	});
};
Public.syncAjax = function(url, params,successCallback,failCallback) {
	var tip=Public.tips({content:'&nbsp;数据操作中，请稍候......',autoClose:false});
	$.ajax({type: "POST",url : url,cache : false, async : false,dataType : "json",data : params||{},
		// 当异步请求成功时调用
		success : function(data) {
			tip.remove();
			Public.ajaxCallback(data, successCallback, failCallback);
		}
	});
};
// url:请求地址， params：传递的参数{...}， callback：请求成功回调
Public.load = function(url, params, callback) {
	var tip=Public.tips({autoClose:false});
	$.ajax({type : "POST",url : url,cache : false,async : true,dataType : "text",data : params,
		// 当异步请求成功时调用
		success : function(data) {
			tip.remove();
			if ($.isFunction(callback)) {
				callback.call(window, data);
			}
		},
		// 当请求出现错误时调用
		error : function(err) {
			tip.change({type : 1,content : '操作失败了哦！',time:3000});
		}
	});
};
/*ajax 回调方法*/
Public.ajaxCallback = function(data,successCallback,failCallback){
	var status = parseInt(data.status,10);
	var tips = Public.tips,dialog;
	try{
		dialog =parent.$.dialog;
		if(!dialog){
			dialog=$.dialog;
		}
	}catch(e){
		dialog=$.dialog;
	}
	switch (status) {
	   case 0 :
		    if ($.isFunction(successCallback)) {
				successCallback(data.data);
			}
		    break;
	   case 1:
		    tips({content : data.message||'数据操作成功!',type:0,time:1500});
			if ($.isFunction(successCallback)) {
				successCallback(data.data);
			}
		    break;
	   case 2:
		  /* tips({type:1, content : data.message});
		   if ($.isFunction(failCallback)) {
				failCallback(data.data);
		   }
		   break;*/
	   case 3:
		   if ($.isFunction(failCallback)) {
				failCallback(data.data);
			}
	   	   if(!dialog){
	   	   		tips({type:1, content : data.message});
	   	   		return;
	   	   }
	   	   var message=data.message,mkeys='TaskListener:';
	   	   message=message||'空指针错误!';
	   	   var index=message.lastIndexOf(mkeys);
	   	   if(index>-1){
	   	   	  message=message.substring(index+(mkeys.length));
	   	   }
	   	   mkeys="ApplicationException:";
	   	   var index=message.lastIndexOf(mkeys);
	   	   if(index>-1){
	   	   	  message=message.substring(index+(mkeys.length));
	   	   }
	   	   UICtrl.setDialogPath();
		   dialog({
				title: '系统提示',
				icon: 'alert.gif',
				fixed: true,
				lock: true,
				resize: false,
				ok: function(){
					if(data.isAuth){
						if($.isFunction(window['doLogout'])){
							window['doLogout'].call(window);
						}else {
							try{parent.doLogout();}catch(e){}
						}
					}
					return true;
				},
				content:'<div style="word-break:break-all;">'+ message+'</div>'
			});
		    
		    break;
	   default :
		    alert('回调状态无法识别!');
	   return;
	}
};

Public.bindEnterSkip = function(obj, func){
	var args = arguments;
	$(obj).on('keydown', 'input:visible:not(:disabled)', function(e){
		if (e.keyCode == '13') {
			var inputs = $(obj).find('input:visible:not(:disabled)');
			var idx = inputs.index($(this));
			idx = idx + 1;
			if (idx >= inputs.length) {
				if (typeof func == 'function') {
					var _args = Array.prototype.slice.call(args, 2 );
					func.apply(null,_args);
				}
			} else {
				inputs.eq(idx).focus();
			}
		}
	});
};
/**获取环境信息**/
var ContextUtil = ContextUtil||{};
ContextUtil.getOperator = function (key){
	var Operator={};
	if(!Public.isBlank(window['ContextOperator'])){
		Operator=window['ContextOperator'];
	}else if(!Public.isBlank(parent['ContextOperator'])){
		Operator=parent['ContextOperator'];
	}
	if(key){
		return Operator[key];
	}else{
		return Operator;
	}
};
/**数据操作工具类**/
var DataUtil = DataUtil||{};

/**
 * 得到选择数据的id数组
 */
DataUtil.getSelectedIds = function (options){
	var data = options.gridManager.getSelectedRows();
	if (!data || data.length < 1) {
		Public.tip(options.nochooseMessage||'请选择数据！');
		return false;
	}
	var idFieldName = options.idFieldName || "id"; 
	var ids = new Array();
	for (var i = 0; i < data.length; i++) {
		ids[i] = data[i][idFieldName];
		if($.isFunction(options.onCheck)){
			if(options.onCheck.call(window,data[i])===false){
				return false;
			}
		}
	}
	return ids;
};

/**
 * 删除
 */
DataUtil.del = function(options){
	DataUtil.updateById($.extend({message: options.message || '您确定删除选中数据吗?'},options));
};

DataUtil.delSelectedRows = function (options){
	var data = options.gridManager.getSelectedRows();
	if (!data || data.length < 1) {
		Public.tip('请选择数据！');
		return false;
	}
	var idFieldName = options.idFieldName || "id"; 
	var ids = new Array(),flag=true;
	var _do=function(){
		$.each(data,function(i,o){
			if(Public.isBlank(o[idFieldName])){//没有主键的数据在页面删除
				options.gridManager.options.clearScroll=true;
				options.gridManager.deleteRow(o);
				options.gridManager.deletedRows=null;
				return;
			}
			ids.push(o[idFieldName]);
			if($.isFunction(options.onCheck)){
				if(options.onCheck.call(window,o)===false){
					flag=false;
					return false;
				}
			}
		});
		if(flag===false) return;
		if(ids.length>0){
			var params = options.param||{};
			params.ids = $.toJSON(ids);
			Public.ajax(web_app.name + '/' + options.action, params, function(data) {
				if ($.isFunction(options.onSuccess))
					options.onSuccess(data);
			});
		}else{
			if ($.isFunction(options.onDelete)){
					options.onDelete.call(window);
			}
		}
	};
	if(options.inDialog){
		if(window.confirm(options.message || '您确定删除选中数据吗?')){
			_do();
		}
	}else{
		UICtrl.confirm(options.message || '您确定删除选中数据吗?', function() {_do();});
	}
};
/**
 * 更新todo
 */
DataUtil.updateById = function(options){
	options=$.extend({message:false},options);
	var ids = DataUtil.getSelectedIds(options);
	if(!ids) return;
	var params = options.param||{};
	params.ids = $.toJSON(ids);
	var _do=function(){
		Public.ajax(web_app.name + '/' + options.action, params, function(data) {
			if ($.isFunction(options.onSuccess))
				options.onSuccess(data);
		});
	};
	if(options.message===false){
		_do();
	}else{
		UICtrl.confirm(options.message, function() {_do();});
	}
};
//获取改变数据
DataUtil.getUpdateAndAddData = function(grid){
	grid.endEdit();
	var data = [];
    $.merge(data, grid.getUpdated());
    $.merge(data, grid.getAdded());
	return data;
};

//获取表格数据
DataUtil.getGridData = function(options){
	options=options||{};
	if(!options.gridManager){
		Public.tip("没有数据!");
		return false;
	}
	var grid=options.gridManager;
	var needCompareObject=true;//是否需要对比新增数据
	if(options['needCompareObject']===false){
		needCompareObject=false;
	}
	grid.endEdit();
	var data=grid.getChanges(),params=[],flag=true;
	//只寻找可以编辑的控件
	var editColumns=$.grep(options.gridManager.columns,function(n,i){
		return $.isPlainObject(n.editor);
	});
	$.each(data,function(i,o){
		var temp=$.extend({},o); delete temp['__id']; //ligerGrid 中未删除__id属性
		if(needCompareObject&&Public.compareObject(UICtrl.getAddGridData(options.gridManager),temp)){//判断是否改变新增的数据
			return;
		}
		if($.isFunction(options.onCheck)){
			flag=options.onCheck.call(window,o);
		}else{
			$.each(editColumns,function(j,c){
				if(c.editor['required']){
					if(Public.isBlank(o[c.name])){
						Public.tip(c.display+"不能为空!");
						var obj=grid.getCellObj(o,c);
			        	if(obj){
			        		setTimeout(function(){
			        			grid._applyEditor(obj);
			        		},10);
			        	}
						flag=false;
						return false;
					}
				}
				if(c.editor['match']){
					if (!Public.validator(c.editor['match'],o[c.name])) {
						Public.tip(c.display  + '输入错误，请检查!');
						var obj=grid.getCellObj(o,c);
			        	if(obj){
			        		setTimeout(function(){
			        			grid._applyEditor(obj);
			        		},10);
			        	}
						flag=false;
						return false;
					}
				}
			});
		}
		if(flag===false){
			return false;
		}
		params.push(o);
	});
	return flag?params:false;
};
/**
 * 更新排序号
 */
DataUtil.updateSequence = function(options){
	var data = options.gridManager.getData();

	if (!data || data.length < 1) {
		Public.tip("没有数据，无法保存!");
		return;
	}

	var updateRowCount = 0;
	var idFieldName = options.idFieldName || "id"; 
	var sequenceFieldName = options.sequenceFieldName || "sequence"; 
	var params = new Map();	
	for (var i = 0; i < data.length; i++) {
		var txtSequence = "#txtSequence_" + data[i][idFieldName];
		var sequeceValue = $.trim($(txtSequence).val());
		if (sequeceValue == "" || isNaN(sequeceValue)) {
			Public.tip("排序号格式错误[必填项且只能是数字].");
			$(txtSequence).focus();
			return;
		}
		var sequence = parseInt(sequeceValue);
		if (data[i][sequenceFieldName] != sequence) {
			params.put(data[i][idFieldName], sequence);
			updateRowCount++;
		}
	}
	
	if (updateRowCount == 0) {
		Public.tip("没有排序号修改!");
		return;
	}

	Public.ajax(web_app.name + "/" + options.action, {data: params.toString()}, function(data) {
		if ($.isFunction(options.onSuccess))
			options.onSuccess(data);
	});
};
//修改功能菜单图标为小图标
DataUtil.changeFunctionIcon=function(icon){
	if(Public.isBlank(icon)){
		return null;
	}
	var miniIcon=icon.replace(/functions/i,'minifunctions');
	return web_app.name + miniIcon;
};
DataUtil.getFunctionIcon=function(icon){
	var iconHtml=DataUtil.changeFunctionIcon(icon);
	if(iconHtml){
		 return "<div style='margin-top:2px;'><img src='"+ iconHtml + "' width='22' height='22'/></div>";
	}
};
DataUtil.composeURLByParam=function(action,param){
	var url=web_app.name + "/" +action;
	var paramString=[];
	$.each(param,function(p,v){
		paramString.push(p+'='+v);
	});
	url+=((url.indexOf("?") != -1)?'&':'?')+paramString.join('&');
	return url;
};
/**
 * 数据字典工具类
 */
var DictUtil = DictUtil || {} ;

DictUtil.getNameByValue = function(values, value){
	var result = '';
	$.each(values, function(i, o){
		if (o.value == value){
			result = o.text;
			return false;
		}
	});
	return result;
};
/**
 * 日期工具
 * **/
var DateUtil = DateUtil || {} ;
/**
 * 获取当前月的第一天
 */
DateUtil.getCurrentMonthFirstDay=function(){
	var date=new Date();
	date.setDate(1);
	return date;
};
/**
 * 获取当前月的最后一天
 */
DateUtil.getCurrentMonthLastDay=function(){
	 var date=new Date();
	 var currentMonth=date.getMonth();
	 var nextMonth=++currentMonth;
	 var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
	 var oneDay=1000*60*60*24;
	 return new Date(nextMonthFirstDay-oneDay);
};
/**
 * 
 * 获取下月第一天
 */
DateUtil.getLastMonthFirstDay=function(){
	 var date=new Date();
	 var currentMonth=date.getMonth();
	 var nextMonth=++currentMonth;
	 var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
	 return new Date(nextMonthFirstDay);
};
/**
 * 
 * 获取下月最后一天
 */
DateUtil.getLastMonthLastDay=function(){
	 var date=new Date();
	 var currentMonth=date.getMonth();
	 var nextMonth=currentMonth+2;
	 var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
	 var oneDay=1000*60*60*24;
	 return new Date(nextMonthFirstDay-oneDay);
};

/** 
 * Simple Map 
 *  
 *  
 * var m = new Map(); 
 * m.put('key','value'); 
 * ... 
 * var s = ""; 
 * m.each(function(key,value,index){ 
 *      s += index+":"+ key+"="+value+"\n"; 
 * }); 
 * alert(s); 
 *  
 */  
function Map() {  
    /** 存放键的数组(遍历用到) */  
    this.keys = new Array();  
    /** 存放数据 */  
    this.data = new Object();  
      
    /** 
     * 放入一个键值对 
     * @param {String} key 
     * @param {Object} value 
     */  
    this.put = function(key, value) {  
        if(this.data[key] == null){  
            this.keys.push(key);  
        }  
        this.data[key] = value;  
    };  
      
    /** 
     * 获取某键对应的值 
     * @param {String} key 
     * @return {Object} value 
     */  
    this.get = function(key) {  
        return this.data[key];  
    };  
    
    /** 
     * 删除某键对应的值 
     * @param {String} key 
     */  
    this.remove = function(key) {
       var index=$.inArray(key,this.keys);
       if(index!=-1){
    	   this.keys.splice.call(this.keys,index,1);
    	   delete this.data[key];
       }
    };
    /** 
     * 清除数据
     */ 
    this.clear = function() {
    	this.keys = null;  
   	 	this.data = null;  
    	this.keys = new Array();  
    	this.data = new Object();  
    };
    /** 
     * 遍历Map,执行处理函数 
     *  
     * @param {Function} 回调函数 function(key,value,index){..} 
     */  
    this.each = function(fn){  
        if(typeof fn != 'function'){  
            return;  
        }  
        var len = this.keys.length;  
        for(var i=0;i<len;i++){  
            var k = this.keys[i];  
            fn(k,this.data[k],i);  
        }  
    };  
      
    /** 
     * 获取键值数组(类似Java的entrySet()) 
     * @return 键值对象{key,value}的数组 
     */  
    this.entrys = function() {  
        var len = this.keys.length;  
        var entrys = new Array(len);  
        for (var i = 0; i < len; i++) {  
            entrys[i] = {  
                key : this.keys[i],  
                value : this.data[i]  
            };  
        }  
        return entrys;  
    };  
    
    this.values = function() {  
        var values = [];  
        var len = this.keys.length;  
        for(var i=0;i<len;i++){  
            var k = this.keys[i];  
            values.push(this.data[k]);
        } 
        return values;  
    };
      
    /** 
     * 判断Map是否为空 
     */  
    this.isEmpty = function() {  
        return this.keys.length == 0;  
    };  
      
    /** 
     * 获取键值对数量 
     */  
    this.size = function(){  
        return this.keys.length;  
    };  
      
    /** 
     * 重写toString  
     */  
    this.toString = function(){  
        var s = "{";  
        for(var i=0;i<this.keys.length;i++,s+=','){  
            var k = this.keys[i];  
            s += k+"='"+this.data[k] + "'";  
        }  
        s+="}";  
        return s;  
    };  
}  

/* 以下代码用于读取表单内输入框数据 */
(function($) {
	/* 返回控件类型 */
	var getType = function(el) {
		var t = el.type;
		switch (t) {
		case "select":
		case "select-one":
		case "select-multiple":
			t = "select";
			break;
		case "text":
		case "hidden":
		case "textarea":
		case "password":
		case "button":
		case "submit":
			t = "text";
			break;
		case "checkbox":
		case "radio":
			t = t;
			break;
		}
		return t;
	};
	/* 返回select控件值 */
	var getOptionVal = function(el) {
		return jQuery.browser.msie && !(el.attributes['value'].specified) ? el.text
				: el.value;
	};
	/* 判断输入值是否存在 */
	var valueExists = function(a, v) {
		return a ? ($.inArray(v, a) > -1) : false;
	};
	/* 获取必输标志 */
	$.fn.isRequired = function() {
		var required;
		if (document.querySelector) {
			required = $(this).attr("required");
			if (required === undefined || required === false) {
				return undefined;
			}
			return true;
		} else {
			try{
				var outer = $(this).get(0).outerHTML, part = outer.slice(0, outer
					.search(/\/?['"]?>(?![^<]*<['"])/));
				return /\srequired\b/i.test(part) ? true : undefined;
			}catch(e){
				/*alert($(this)[0]);*/
				return undefined;
			}
			
		}
	};
	/* 输入框默认验证方法 */
	$.fn.defaultCheckVal = function(match) {
		var required = $(this).isRequired(),  label = $(this).attr('label');
		var notCheck=$(this).attr('notCheck');
		if(notCheck=='true') return true;
		if(!label)label=$(this).attr('title');
		try{
			var fn=$(this).data('combox-before-close');
			if($.isFunction(fn)){
				fn.call(window);
			}
		}catch(e){}
		var value = $(this).getValue();
		if (required && value == '') {
			Public.tips({type:2,content:label + '不能为空!'});
			$(this).focus();
			return false;
		}
		match = match || $(this).attr('match');
		/* 控件上有表达式 */
		if (match && value != '') {
			/* 使用该表达式进行验证 */
			var flag = Public.validator(match, value);
			if (!flag) {
				Public.tips({type:2,content:label + '输入错误，请检查!'});
				$(this).focus();
				return false;
			}
		}
		return true;
	};
	/* 读取输入控件值 isEncode返回的数据是否执行encodeURI()方法 */
	$.fn.getValue = function(isEncode) {
		var v = [], text ,obj=this;
		var getParent=function(selector){
			return function(){
				var parents=obj.parents(selector);
				if(parents.length>0){
					return parents[0];
				}else{
					throw new Error("");
				}
			};
		};
		if(this.hasClass("ui-maskedinput")){//maskedinput 输入校验
			this.checkValue();
		}
		this.each(function() {
			var t = getType(this);
			switch (t) {
			case "radio":
				var doc = Public.these(getParent('form'),getParent('div.textGrid'),function() {return document;});
				$("input:radio[name='" + this.name + "']", doc).each(function(i, o) {
					if (o.checked) {
						v.push(o.value);
						return false;
					}
				});
				break;
			case "checkbox":
				var doc = Public.these(getParent('form'),getParent('div.textGrid'),function() {return document;});
				var values=[];
				$("input:checkbox[name='" + this.name + "']", doc).each(function(i, o) {
					if (o.checked) {
						values.push(o.value);
					}
				});
				if (values.length > 0){
					v.push(values.join(','));
				}else{
					v.push(0);
				}
				break;
			case "select":
				if (this.type == "select-one") {
					v.push((this.selectedIndex == -1) ? ""
							: getOptionVal(this[this.selectedIndex]));
				} else {
					for ( var i = 0; i < this.length; i++) {
						if (this[i].selected) {
							v.push(getOptionVal(this[i]));
						}
					}
				}
				break;
			case "text":
				var va = this.value;
				if ($(this).is('[mask="money"]')||$(this).is('[mask="positiveMoney"]')) {
					va = va.replace(/[,]/g, '');
				}
				v.push(va);
				break;
			}
		});
		text = $.trim(v.join(','));
		return isEncode ? encodeURI(text) : text;
	};
	$.fn.setValue = function(v) {
		var obj=this;
		if(Public.isBlank(v)){
			v='';
		}
		return this.each(function() {
			var t = getType(this), x;
			switch (t) {
			case "checkbox":
				v=$.isArray(v)?v:(v+'').split(',');
				if (valueExists(v, this.value)){
					this.checked = true;
				}else{
					this.checked = false;
				}
				break;
			case "radio":
				var getParent=function(selector){
					return function(){
						var parents=obj.parents(selector);
						if(parents.length>0){
							return parents[0];
						}else{
							throw new Error("");
						}
					};
				};
				var doc = Public.these(getParent('form'),getParent('div.textGrid'),getParent('dd'),function() {return document;});
				$("input:radio[name='" + this.name + "']", doc).each(function(i, o) {
					if (o.value == v) {
						o.checked = true;
					} else {
						o.checked = false;
					}
				});
				break;
			case "select":
				var bSelectOne = (this.type == "select-one");
				var bKeepLooking = true;
				for ( var i = 0; i < this.length; i++) {
					x = getOptionVal(this[i]);
					bSelectItem = valueExists(v, x);
					if (bSelectItem) {
						this[i].selected = true;
						if (bSelectOne) {
							bKeepLooking = false;
							break;
						}
					} else if (!bSelectOne)
						this[i].selected = false;
				}
				if (bSelectOne && bKeepLooking && !!this[0]) {
					this[0].selected = true;
				}
				break;
			case "text":
				this.value = v || '';
				break;
			}
		});
	};
	/* 返回json对象 */
	$.fn.formToJSON = function(op) {
		op = $.extend({
			encode : true,// 返回的数据是否执行encodeURI()方法
			check : true,// 是否进行输入验证
			checkFunction : null
		// 数据验证方法
		}, op || {});
		var json = {}, flag = true;
		this.filter("form").each(function() {
			var els = this.elements, el, n, stProcessed = {}, jel=null,value=null;
			for ( var i = 0, elsMax = els.length; i < elsMax; i++) {
				el = els[i];
				n = el.name;
				if (!n || stProcessed[n])
					continue;
				jel = $(el), value = jel.getValue();
				if(jel.is('[noaccess]')){//字段无访问权限不执行取值
					stProcessed[n] = true;
					continue;
				}
				if (op.check) {
					if (typeof op.checkFunction == 'function') {
						flag = op.checkFunction.call(window, jel, value);
					} else {
						flag = jel.defaultCheckVal();
					}
					// 验证不通过
					if (flag === false)
						return false;
					else
						flag = true;
				}
				if(op.encode){
					value = encodeURI(value);
					value = value.replace(/\&/g, "%26");  
					value = value.replace(/\+/g, "%2B");
				}
				json[n] = op.encode ? encodeURI(value) : value;
				stProcessed[n] = true;
			}
		});
		return flag ? json : false;
	};
	/* from 内输入框赋值 */
	$.fn.formSet = function(inHash) {
		this.filter("form").each(function() {
			var els = this.elements, el, n, stProcessed = {}, jel;
			for ( var i = 0, elsMax = els.length; i < elsMax; i++) {
				el = els[i];
				n = el.name;
				if (!n || stProcessed[n])
					continue;
				if (typeof inHash[n] == 'string'||typeof inHash[n] == 'number')
					$(el).setValue(inHash[n]);
				stProcessed[n] = true;
			}
		});
	};
	/* 重置From */
	$.fn.formClean = function(fields) {
		var fs = fields ? fields.join(',') + ',' : '';
		this.filter("form").each(function() {
			var els = this.elements, el, n, stProcessed = {}, jel;
			for ( var i = 0, elsMax = els.length; i < elsMax; i++) {
				el = els[i];
				n = el.name;
				if (fs != '' && fs.indexOf(n + ',') > -1)
					continue;
				if (el.type == 'button')
					continue;
				if (!n || stProcessed[n])
					continue;
				$(el).setValue('');
				stProcessed[n] = true;
			}
		});
	};
	/*form ajax 提交*/
	$.fn.ajaxSubmit = function(opts) {
		opts=opts||{};
		opts.async = opts.async === 'undefined' ?true:opts.async;
		var isCheck=true;
		var attrCheck=$(this).attr('check');
		if(typeof attrCheck !='undefined'){ 
			if (typeof attrCheck == 'string'&& attrCheck==='false') {
				isCheck=false;//不验证输入判断条件
			}
			if (typeof attrCheck == 'boolean'&& attrCheck===false) {
				isCheck=false;//不验证输入判断条件
			}
			$(this).removeAttr('check');
		}else{
			isCheck=opts.isCheck||true;
		}
		var formData=$(this).formToJSON({check:isCheck});
		if(!formData) return;
		var url=opts.url;
		if(opts.param===false) return;
		var param=opts.param||{};
		var successCallback=opts.success;
		var failCallback=opts.fail;
		param=$.extend(formData,param||{});
		if (opts.async == false){
			Public.syncAjax(url,param,successCallback,failCallback);
		}else{
			Public.ajax(url,param,successCallback,failCallback);
		}
	};
	/* 删除DOM方法,避免内存泄露 */
	$.fn.removeAllNode = function() {
		var item = $(this);
		var clearItem = $('#clear-use-memory');
		if (clearItem.length == 0) {
			jQuery('<div/>').hide().attr('id', 'clear-use-memory').appendTo('body');
			clearItem = jQuery('#clear-use-memory');
		}
		item.appendTo(clearItem);
		jQuery('*', clearItem).each(
				function(i, e) {
					(events = jQuery.data(this, 'events'))
							&& jQuery.each(events, function(i, e1) {
								jQuery(e).unbind(i + '.*');
							});
					jQuery.event.remove(this);
					jQuery.removeData(this);
				});
		clearItem[0].innerHTML = '';
		item = null;
	};
	//在当前对象光标处插入指定的内容
	$.fn.insertAtCaret=function (textFeildValue) {
		var textObj=$(this).get(0);
		if(document.all&&textObj.createTextRange&&textObj.caretPos) {
			var caretPos=textObj.caretPos;
			caretPos.text=caretPos.text.charAt(caretPos.text.length-1)==''?textFeildValue+'':textFeildValue;
		}else if(textObj.setSelectionRange) {
			var rangeStart=textObj.selectionStart;
			var rangeEnd=textObj.selectionEnd;
			var tempStr1=textObj.value.substring(0,rangeStart);
			var tempStr2=textObj.value.substring(rangeEnd);
			textObj.value=tempStr1+textFeildValue+tempStr2;
			textObj.focus();
			var len=textFeildValue.length;
			textObj.setSelectionRange(rangeStart+len,rangeStart+len);
			textObj.blur();
		}else {
			textObj.value+=textFeildValue;
		}
		textObj.focus();
	};
	/********************************
	title:    分页菜单控件
	初始化:   $('#jqueryTab').tab();
	*********************************/
	$.fn.tab=function(className){
		className=className||'ui-simple-tab';
		this.addClass(className);
		return this.each(function() {
			var content=$(">div.ui-tab-content",this),menu=$('>div.ui-tab-links > ul',this);
			$('li',menu).each(function(i){
				$(this).attr('index',"li_"+i);
				if(className=='ui-nav-tab'||className=='ui-simple-float-tab'){
					var text=$(this).text();
					var html=['<div class="left"></div>','<div class="right"></div>'];
					html.push('<a>',text,'</a>');
					$(this).empty();
					$(this).append(html.join(''));
				}
			});
			$('>div.layout',content).each(function(i){
				$(this).attr('index',"content_li_"+i);
			});
			function show(id){
				var _content=$('div[index="content_'+id+'"]',content);
				_content.siblings().hide();
				_content.show();
				$('li[index="'+id+'"]',menu).addClass("current").siblings().removeClass("current");
			}
			menu.click(function(e){
				var $clicked = $(e.target || e.srcElement);
				if($clicked.is('li')){
					show($clicked.attr('index'));
				}else if($clicked.parent().is('li')){
					show($clicked.parent().attr('index'));
				}
			});
			show('li_0');
		});
	};
	//获取文件编号处理
	$.fn.loadDispatchNo=function(op){
		var value=$(this).val();
		var options=$.extend({
			getBizId:null,
			onShow:null,
			onCheck:function(){
				//已存在文号或在只读审核状态下不能修改文号
				if(!Public.isBlank(value)){
					return false;
				}
				if(Public.isReadOnly||!UICtrl.isApplyProcUnit()){
					return false;
				}
				return true;
			},
			title:null,
			bizUrl:null,
			callback:null
		},op||{});
		if($.isFunction(options['onCheck'])){
			var flag=options['onCheck'].call(window);
			if(!flag){
				return;
			}
		}
		return this.each(function() {
			var _self=$(this).addClass('textChoose').attr('readonly',true);
			_self.val('请先保存业务表单再点击获取文件编号').addClass('grayColor');
			_self.on('click',function(e){
				if($.isFunction(options['onShow'])){
					if(!options['onShow'].call(window)){
						return;
					}
				}
				var bizId='',no=_self.val();
				if($.isFunction(options['getBizId'])){
					bizId=options['getBizId'].call(window);
					if(bizId===false){
						return;
					}
				}
				if(Public.isBlank(bizId)){
					Public.tip('请先保存表单后再获取发文号');
					return;
				}
				if(!_self.hasClass('grayColor')){
					return;
				}
				var title=options['title'],callback=options['callback'],bizUrl=options['bizUrl'];
				if($.isFunction(title)){
					title=title.call(window);
				}
				if($.isFunction(bizUrl)){
					bizUrl=bizUrl.call(window);
				}
				UICtrl.getDispatchNo({bizId:bizId,title:title,bizUrl:bizUrl,callback:function(data){
					if($.isFunction(callback)){
						callback.call(this,data);
					}else{
						_self.val(data['dispatchNo']).removeClass('grayColor');
						this.close();
					}
				}});
			});
		});
	};
	$.fn.checkDispatchNo=function(){
		var val=$(this).val();
		if(Public.isBlank(val)){
			return false;
		}
		return !$(this).hasClass('grayColor');
	};
	//cookie
	$.cookie = function(name, value, options) {
	    if (typeof value != 'undefined') { // name and value given, set cookie
	        options = options || {};
	        if (value === null) {
	            value = '';
	            options.expires = -1;
	        }
	        var expires = '';
	        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
	            var date;
	            if (typeof options.expires == 'number') {
	                date = new Date();
	                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
	            } else {
	                date = options.expires;
	            }
	            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
	        }
	        var path = options.path ? '; path=' + options.path : '';
	        var domain = options.domain ? '; domain=' + options.domain : '';
	        var secure = options.secure ? '; secure' : '';
	        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	    } else { // only name given, get cookie
	        var cookieValue = null;
	        if (document.cookie && document.cookie != '') {
	            var cookies = document.cookie.split(';');
	            for (var i = 0; i < cookies.length; i++) {
	                var cookie = jQuery.trim(cookies[i]);
	                // Does this cookie string begin with the name we want?
	                if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                    break;
	                }
	            }
	        }
	        return cookieValue;
	    }
	};
	/**textareat 自动适应大小**/
	$.fn.textareaOnAutoHeight=function (options) {
        this._options = {
            minHeight: 0,
            maxHeight: 1000
        } 
        this.init = function () {
            for (var p in options) {
                this._options[p] = options[p];
            }
            if (this._options.minHeight == 0) {
                this._options.minHeight=parseFloat($(this).height());
            }
            for (var p in this._options) {
                if ($(this).attr(p) == null) {
                    $(this).attr(p, this._options[p]);
                }
            }
            $(this).keyup(this.resetHeight).change(this.resetHeight).focus(this.resetHeight);
        }
        this.resetHeight = function () {
            var _minHeight = parseFloat($(this).attr("minHeight"));
            var _maxHeight = parseFloat($(this).attr("maxHeight")); 
            if (!$.browser.msie) {
                $(this).height(0);
            }
            var h = parseFloat(this.scrollHeight);
            h = h < _minHeight ? _minHeight :h > _maxHeight ? _maxHeight : h;
            $(this).height(h).scrollTop(h);
            if (h >= _maxHeight) {
                $(this).css("overflow-y", "scroll");
            } else {
                $(this).css("overflow-y", "hidden");
            }
        }
        this.init();
    };
    
	$.fn.textareaAutoHeight=function (options) {
		return this.each(function() {
			var id=$(this).attr('id');
			 this._options = {minHeight: 0,maxHeight: 1000};
			 for (var p in options) {
	             this._options[p] = options[p];
	         }
			 var _minHeight =this._options.minHeight;
			 var _maxHeight =this._options.maxHeight;
			 if (_minHeight == 0) {
				 _minHeight=parseFloat($(this).height());
	         }
			 var po =  parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
	         var h = $(this)[0].scrollHeight;
	         h=isNaN(h)?0:h;
	         h = h < _minHeight ? _minHeight :h > _maxHeight ? _maxHeight : h;
	         $(this).height(h+po).scrollTop(h+po);
	         if (h >= _maxHeight) {
	             $(this).css("overflow-y", "scroll");
	         } else {
	             $(this).css("overflow-y", "hidden");
	         }
		});
	};
})(jQuery);