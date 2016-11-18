var str = '';
var browser = getBrowser(); //获取浏览器的类型
if (browser.indexOf('IE') == 0 ) {
	// IE
	str = '<object id="WebOffice" width="100%" height="100%" TYPE="application/kg-activex" '
		+ ' classid="clsid:8B23EA28-2009-402F-92C4-59BE0E063499" codebase="'+ web_app.name+'/iWebOffice/iWebOffice2009.cab#version=10,7,2,8" copyright="www.brc.com.cn">'
		+ ' </object>';
} else if (browser.indexOf('safari') == 0 || browser.indexOf('chrome') == 0 || browser.indexOf('firefox') == 0) {
	//替换②Safari、Google、Chrome、FireFox中使用的<object>
	str = "<object id='WebOffice' TYPE='application/kg-activex'"
		+ "  ALIGN='baseline' BORDER='0'" 
		+ "  WIDTH='100%' HEIGHT='100%'"
		+ "  clsid='{8B23EA28-2009-402F-92C4-59BE0E063499}'"
		+ "  copyright='www.brc.com.cn'" 
		+ "  event_OnToolsClick='OnToolsClick'>" 
		+ "  </object>";
}
document.write(str);