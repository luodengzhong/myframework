/**
 * 解决Javascript浮点数数学运算时结果异常的问题
 * @author fujing
 * @date 2014-10-20
 * @Description: Number对象下增加
 *               div(num) 处理浮点数的除法
 *               mul(num) 处理浮点数的乘法
 *               add(num) 处理浮点数的加法
 *               sub(num) 处理浮点数的减法
                 同时重写了
                 toFixed(scale)
 */

/**
 * 左补齐字符串
 * 
 * @param nSize 要补齐的长度
 * @param ch 要补齐的字符
 * @return
 */
String.prototype.padLeft = function(nSize, ch) {
	var len = 0;
	var s = this ? this : "";
	ch = ch ? ch : '0';// 默认补0

	len = s.length;
	while (len < nSize) {
		s = ch + s;
		len++;
	}
	return s;
};

/**
 * 右补齐字符串
 * 
 * @param nSize 要补齐的长度
 * @param ch 要补齐的字符
 * @return
 */
String.prototype.padRight = function(nSize, ch) {
	var len = 0;
	var s = this ? this : "";
	ch = ch ? ch : '0';// 默认补0

	len = s.length;
	while (len < nSize) {
		s = s + ch;
		len++;
	}
	return s;
};
/**
 * 左移小数点位置（用于数学计算，相当于除以Math.pow(10,scale)）
 * 
 * @param scale 要移位的刻度
 * @return
 */
String.prototype.movePointLeft = function(scale) {
	var s, s1, s2, ch, ps, sign;
	ch = '.';
	sign = '';
	s = this ? this : "";

	if (scale <= 0)
		return s;
	ps = s.split('.');
	s1 = ps[0] ? ps[0] : "";
	s2 = ps[1] ? ps[1] : "";
	if (s1.slice(0, 1) == '-') {
		s1 = s1.slice(1);
		sign = '-';
	}
	if (s1.length <= scale) {
		ch = "0.";
		s1 = s1.padLeft(scale);
	}
	return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2;
};

/**
 * 右移小数点位置（用于数学计算，相当于乘以Math.pow(10,scale)）
 * 
 * @param scale 要移位的刻度
 * @return
 */
String.prototype.movePointRight = function(scale) {
	var s, s1, s2, ch, ps;
	ch = '.';
	s = this ? this : "";

	if (scale <= 0)
		return s;
	ps = s.split('.');
	s1 = ps[0] ? ps[0] : "";
	s2 = ps[1] ? ps[1] : "";
	if (s2.length <= scale) {
		ch = '';
		s2 = s2.padRight(scale);
	}
	return s1 + s2.slice(0, scale) + ch + s2.slice(scale, s2.length);
};

/**
 * 移动小数点位置（用于数学计算，相当于（乘以/除以）Math.pow(10,scale)）
 * 
 * @param scale 要移位的刻度（正数表示向右移；负数表示向左移动；0返回原值）
 * @return
 */
String.prototype.movePoint = function(scale) {
	if (scale >= 0)
		return this.movePointRight(scale);
	else
		return this.movePointLeft(-scale);
};

/**
 * 重写Number.toFixed，解决浏览器兼容问题
 * 
 * @param scale 要移位的刻度（正数表示向右移；负数表示向左移动；0返回原值）
 * @return
 */
Number.prototype.toFixed = function(scale)  
{  
    var s, s1, s2, start;  
  
    s1 = this + "";  
    start = s1.indexOf(".");  
    s = s1.movePoint(scale);  
  
    if (start >= 0)  
    {  
        s2 = Number(s1.substr(start + scale + 1, 1));  
        if (s2 >= 5 && this >= 0 || s2 < 5 && this < 0)  
        {  
            s = Math.ceil(s);  
        }  
        else  
        {  
            s = Math.floor(s);  
        }  
    }  
  
    return s.toString().movePoint(-scale);  
}; 

/**
 * 除法函数，用来得到精确的除法结果
 * @param arg1
 * @param arg2
 * @returns arg1除以arg2的精确结果
 */
function accDiv(arg1, arg2) {
	var t1 = 0, t2 = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		t1 = s1.split(".")[1].length;
	} catch (e) {
		t1 = 0;
	}
	try {
		t2 = s2.split(".")[1].length;
	} catch (e) {
		t2 = 0;
	}
	var r1 = Number(s1.replace(".", ""));
	var r2 = Number(s2.replace(".", ""));
	return Number((r1 / r2).toString().movePoint(t2 - t1));	
}

/**
 * 给Number类型增加一个div方法
 */
Number.prototype.div = function(arg) {
	return accDiv(this, arg);
};

/**
 * 乘法函数，用来得到精确的乘法结果
 * @param arg1
 * @param arg2
 * @returns arg1乘以arg2的精确结果
 */
function accMul(arg1, arg2) {
	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {
		m += 0;
	}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {
		m += 0;
	}
	var r1 = Number(s1.replace(".", ""));
	var r2 = Number(s2.replace(".", ""));	
	return Number((r1 * r2).toString().movePoint(-m));
}

/**
 * 给Number类型增加一个mul方法
 */
Number.prototype.mul = function(arg) {
	return accMul(this, arg);
};

/**
 * 加法函数，用来得到精确的加法结果
 * @param arg1
 * @param arg2
 * @returns arg1加arg2的精确结果
 */
function accAdd(arg1, arg2) {
	var t1 = 0, t2 = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		t1 = s1.split(".")[1].length;
	} catch (e) {
		t1 = 0;
	}
	try {
		t2 = s2.split(".")[1].length;
	} catch (e) {
		t2 = 0;
	}
	var m = Math.max(t1, t2);
	return Number((Number(s1.movePoint(m))+Number(s2.movePoint(m))).toString().movePoint(-m));	
}

/**
 * 给Number类型增加一个add方法
 */
Number.prototype.add = function(arg) {
	return accAdd(this, arg);
};

/**
 * 减法函数，用来得到精确的加法结果
 * @param arg1
 * @param arg2
 * @returns arg1减arg2的精确结果
 */
function accSub(arg1, arg2) {
	var t1 = 0, t2 = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		t1 = s1.split(".")[1].length;
	} catch (e) {
		t1 = 0;
	}
	try {
		t2 = s2.split(".")[1].length;
	} catch (e) {
		t2 = 0;
	}	
	var m = Math.max(t1, t2);
	return Number((Number(s1.movePoint(m))-Number(s2.movePoint(m))).toString().movePoint(-m));
}

/**
 * 给number类增加一个sub方法
 */
Number.prototype.sub = function(arg) {
	return accSub(this, arg);
};