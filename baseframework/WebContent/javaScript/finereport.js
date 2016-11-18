var FRUtil = FRUtil || {};


//cjkEncode方法的实现代码，放在网页head中或者用户自己的js文件中   
FRUtil.cjkEncode = function(text){
	if (text == null) {          
		return "";          
	}          
//	var newText = "";          
//	for (var i = 0; i < text.length; i++) {          
//		var code = text.charCodeAt (i);           
//		if (code >= 128 || code == 91 || code == 93) {  //91 is "[", 93 is "]".          
//			newText += "[" + code.toString(16) + "]";          
//		} else {      
//			newText += text.charAt(i);          
//		}   
//	}          
//	return newText;    
	return text;
};