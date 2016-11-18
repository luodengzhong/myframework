function disableContextmenu(){
	//屏蔽右键等操作
	$.each(['contextmenu','keydown','keyup','keypress'],function(i,eventType){
		$(document).bind(this.options.eventType,function(e){
				try{
					e.stopPropagation(); 
					e.preventDefault();
					return false;
				}catch(e){}
		});
	});
}
function onUnLoad() {
	  try {
		   //交互OfficeServer的OPTION="SAVEFILE"  注：WebSave()是保存复合格式文件，包括OFFICE内容和手写批注文档；如只保存成OFFICE文档格式，那么就设WebSave(true)
	     if(!webform.WebOffice.WebSave()){
	       //StatusMsg(webform.WebOffice.Status);
	     }
	     if(!webform.WebOffice.WebClose()){
	        StatusMsg(webform.WebOffice.Status);
	     } else {
	       StatusMsg("关闭文档...");
	     }
	  }catch(e){
		 alert(e.description);
	  }
}
function StatusMsg(){
}
//作用：打开文档
function LoadDocument() {
	StatusMsg("正在打开文档...");
    if (!webform.WebOffice.WebOpen()) {  	//打开该文档    交互OfficeServer的OPTION="LOADFILE"
      StatusMsg(webform.WebOffice.Status);
    }else {
      StatusMsg(webform.WebOffice.Status);
    }
}
//作用：保存文档
function SaveDocument() {
  //webform.WebOffice.WebSetMsgByName("MyDefine1","自定义变量值1");  //设置变量MyDefine1="自定义变量值1"，变量可以设置多个  在WebSave()时，一起提交到OfficeServer中
  if (!webform.WebOffice.WebSave()) {    //交互OfficeServer的OPTION="SAVEFILE"  注：WebSave()是保存复合格式文件，包括OFFICE内容和手写批注文档；如只保存成OFFICE文档格式，那么就设WebSave(true)
      StatusMsg(webform.WebOffice.Status);
      return false;
  } else {
      StatusMsg(webform.WebOffice.Status);
      return true;
  }
}
function SaveDocument_Next() {
   SaveDocument();
}
//作用：存为本地文件
function WebSaveLocal() {
    try {
        webform.WebOffice.WebSaveLocal();
        StatusMsg(webform.WebOffice.Status);
    } catch(e) {
        alert(e.description);
    }
}

//作用：显示或隐藏痕迹[隐藏痕迹时修改文档没有痕迹保留]  true表示隐藏痕迹  false表示显示痕迹
function ShowRevision(mValue) {
    if (mValue) {
        webform.WebOffice.WebShow(true);
        StatusMsg("显示痕迹...");
    } else {
        webform.WebOffice.WebShow(false);
        StatusMsg("隐藏痕迹...");
    }
}



//作用：页面设置
function WebOpenPageSetup() {
    try {
        if (webform.WebOffice.FileType == ".doc") {
            webform.WebOffice.WebObject.Application.Dialogs(178).Show();
        }
        if (webform.WebOffice.FileType == ".xls") {
            webform.WebOffice.WebObject.Application.Dialogs(7).Show();
        }
    } catch(e) {
        alert(e.description);
    }
}

//作用：打印文档
function WebOpenPrint() {
    try {
        webform.WebOffice.WebShow(false); //打印前隐藏痕迹
        webform.WebOffice.WebOpenPrint();
        StatusMsg(webform.WebOffice.Status);
    } catch(e) {
        alert(e.description);
    }
}

//作用：模版套红功能
function WebUseTemplate() {
    var template = ___OpenModalWindow("FileTemplate.aspx", 360, 200, false, false, false, null);
    //判断用户是否选择模板           
    if (!template || template == "") {
        StatusMsg("未选择套红模板文件，取消套红.");
        return false;
    } else {
        if (WebAcceptAllRevisions() == false) { //清除正文痕迹的目的是为了避免痕迹状态下出现内容异常问题。
            StatusMsg("清除正文痕迹失败，套红中止.");
            return false;
        }
        SaveDocument(); //保存当前编辑的文档
        webform.WebOffice.WebSetMsgByName("COMMAND", "INSERTFILE"); //设置变量COMMAND="INSERTFILE"，在WebLoadTemplate()时，一起提交到OfficeServer中     <参考技术文档>
        webform.WebOffice.Template = template; //全局变量Template赋值，此示例读取服务器目录中模板，如读取数据库中模板，Template值为数据库中的模板编号，则上句代码不需要，如Template="1050560363767"，模板名称为“Word公文模板”，注：模板中有要标签Content，区分大小写，可以自行修改
        webform.WebOffice.EditType = "1"; //控制为不保留痕迹的状态
        if (webform.WebOffice.WebLoadTemplate()) { //交互OfficeServer的OPTION="LOADTEMPLATE"
            //SetBookmarks("Title","关于中间件研发工作会议通知");     //填充模板其它基本信息，如标题，主题词，文号，主送机关等
            if (webform.WebOffice.WebInsertFile()) { //填充公文正文   交互OfficeServer的OPTION="INSERTFILE"
                StatusMsg("文档套红成功.");
                return true;
            } else {
                StatusMsg(webform.WebOffice.Status);
                return false;
            }
        } else {
            StatusMsg(webform.WebOffice.Status);
            return false;
        }
    }
}

//接受文档中全部痕迹
function WebAcceptAllRevisions() {
    webform.WebOffice.WebObject.Application.ActiveDocument.AcceptAllRevisions();
    var mCount = webform.WebOffice.WebObject.Application.ActiveDocument.Revisions.Count;
    if (mCount > 0) {
        return false;
    } else {
        return true;
    }
}

//作用：签名印章
function WebOpenSignature() {
    try {
        webform.WebOffice.WebOpenSignature(); //交互OfficeServer的 A签章列表OPTION="LOADMARKLIST"    B签章调出OPTION="LOADMARKIMAGE"    C确定签章OPTION="SAVESIGNATURE"    <参考技术文档>
        StatusMsg(webform.WebOffice.Status);
    } catch(e) {
        StatusMsg(e.description);
    }
}

function NextStep() {
    if (!SaveDocument()) {
        alert(webform.WebOffice.Status);
    } else {
        window.returnValue = "";
        window.close();
    }
}

function WinClose() {
    window.close();
}


// 获取浏览器类型
function getBrowser() {
	var userAgent = navigator.userAgent, rMsie = /(msie\s|trident.*rv:)([\w.]+)/, rFirefox = /(firefox)\/([\w.]+)/, rChrome = /(chrome)\/([\w.]+)/, rSafari = /version\/([\w.]+).*(safari)/;
	var browser;
	var version;
	var ua = userAgent.toLowerCase();
	function uaMatch(ua) {
		var match = rMsie.exec(ua);
		if (match != null) {
			return {
				browser : "IE",
				version : match[2] || "0"
			};
		}
		var match = rFirefox.exec(ua);
		if (match != null) {
			return {
				browser : match[1] || "",
				version : match[2] || "0"
			};
		}
		var match = rChrome.exec(ua);
		if (match != null) {
			return {
				browser : match[1] || "",
				version : match[2] || "0"
			};
		}
		var match = rSafari.exec(ua);
		if (match != null) {
			return {
				browser : match[2] || "",
				version : match[1] || "0"
			};
		}
		if (match != null) {
			return {
				browser : "",
				version : "0"
			};
		}
	}
	var browserMatch = uaMatch(userAgent.toLowerCase());
	if (browserMatch.browser) {
		browser = browserMatch.browser;
		version = browserMatch.version;
	}
	return browser;
}


/**
 * 显示文件历史
 */
function showFileHistory(recordId) {
    var openUrl =web_app.name + "/iWebOffice/FileHistory.jsp?recordId="+recordId;//弹出窗口的url
    var iWidth=370; //弹出窗口的宽度;
    var iHeight=400; //弹出窗口的高度;
    var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
    var browser = getBrowser(); //获取浏览器的类型
	if (browser.indexOf('IE') == 0 ) {
		 showModelessDialog(openUrl,window,"status:false;dialogWidth:"+iWidth+"px;dialogHeight:"+iHeight+"px");
	}else{
        window.open(openUrl,"","height="+iHeight+", width="+iWidth+", top="+iTop+", left="+iLeft); 
	}
}

function downiWebPlugin(){
	var openUrl=web_app.name + "/iWebOffice/iWebPlugin.exe";//弹出窗口的url
	window.open(openUrl); 
}