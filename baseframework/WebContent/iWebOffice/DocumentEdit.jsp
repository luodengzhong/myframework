<%@ page contentType="text/html; charset=gbk" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<title>文档在线编辑</title>
<style>
* {margin: 0px;padding: 0px;}
</style>
<script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.json-2.4.min.js"/>' type='text/javascript'></script>
<script src='<c:url value="/lib/jquery/jquery.dragEvent.js"/>' type='text/javascript'></script>
<script src='<c:url value="/javaScript/WEB_APP.js"/>' type="text/javascript"></script>
<script src='<c:url value="/iWebOffice/OfficeDocument.js"/>' type="text/javascript"></script>
<!-- IE -->
<script language="javascript" for=WebOffice event="OnToolsClick(vIndex,vCaption)">
  // alert('编号:'+vIndex+'\n\r'+'条目:'+vCaption+'\n\r'+'请根据这些信息编写按钮具体功能');
  if (vIndex==14){SaveDocument();}
  if (vIndex==15){WebSaveLocal();}
  if (vIndex==16){WebGetRevisions();}
  if (vIndex==17){showFileHistory("${id}");}
</script>
<!-- Firefox、chrome -->
<script language=javascript for=WebOffice>
   function OnToolsClick(vIndex,vCaption){
	   if (vIndex==14){SaveDocument();}
	   if (vIndex==15){WebSaveLocal();}
	   if (vIndex==16){WebGetRevisions();}
	   if (vIndex==17){showFileHistory("${id}");}
}
</script>

<script language=javascript>
/*
form表单名称:webform
iWebOffice名称:WebOffice
WebObject文档对象接口，相当于：
如果是Word  文件，WebObject 是Word  VBA的ActiveDocument对象
如果是Excel 文件，WebObject 是Excel VBA的ActiveSheet对象

如：webform.WebOffice.WebObject
*/


//作用：显示操作状态
function StatusMsg(mString){
  // webform.StatusBar.value=mString;
  alert(mString);
}

//作用：载入iWebOffice
function Load(){
  $("#WebOffice").attr("height",$(window).height()-6);
  var fileId='${id}',fileType='${fileType}',editType='${editType}';
  if(fileType==''){
	  fileType='docx';
  }
  if(editType==''){
	  editType='1';
  }
  try{
	var WebOffice = document.getElementById('WebOffice');
	WebOffice.Compatible=false;
    //以下属性必须设置，实始化iWebOffice
	WebOffice.WebUrl="${mServerUrl}";//WebUrl:系统服务器路径，与服务器文件交互操作，如保存、打开文档，重要文件
	WebOffice.RecordID=fileId;//RecordID:本文档记录编号
	WebOffice.FileType="."+fileType;//FileType:文档类型  .doc  .xls  .wps
	WebOffice.UserName="${operatorKey}";//UserName:操作用户名，痕迹保留需要
	/*** 
		调用格式：WebOffice.EditType="A,B,C,D,E,F,G,H"
		他们的含义如下：
		A  必须为“-1”
		B  是否保护文档		“0” 不保护文档， “1” 保护文档， “2” 特殊保护
		C  是否显示痕迹		“0” 不显示痕迹， “1” 显示痕迹
		D  是否保留痕迹		“0” 不保留痕迹， “1” 保留痕迹
		E  是否打印痕迹		“0” 不打印痕迹， “1” 打印痕迹
		F  是否显示审阅工具	“0” 不显示工具， “1” 显示工具
		G  是否允许拷贝操作	“0” 不允许拷贝， “1” 允许拷贝
		H  是否允许手写批注	“0” 不可以批注， “1” 可以批注
		如：需要不保护文档，有显示痕迹，有痕迹保留，不打印痕迹，不显示审阅工具，允许拷贝，允许手写批注操作，就可以设置为 WebOffice.EditType="-1,0,1,1,0,0,0,1";。
 	*/
	WebOffice.EditType="-1,0,0,1,0,1,1,1";
	//以下为自定义菜单↓
	WebOffice.VisibleTools("新建文件",false);
	WebOffice.VisibleTools("打开文件",false);
	WebOffice.VisibleTools("保存文件",false);
	//WebOffice.DisableMenu("宏(&M);选项(&O)...");    //禁止某个（些）菜单项
	if ("0" == editType.substring(0,1)){
		WebOffice.ShowToolBar=0;
	}else{
		WebOffice.ShowToolBar=1;
		WebOffice.AppendTools("17","查看修改历史",17);
		WebOffice.AppendTools("16","查看修改痕迹",16);
		WebOffice.AppendTools("15","另存为文件",2);
		WebOffice.AppendTools("14","保存远程文件",2);
	}
	WebOffice.ShowMenu=0;
	//以上为自定义菜单↑
	
	WebOffice.CopyType = "0";
	WebOffice.EnablePrint = "0";
	WebOffice.MaxFileSize = 16 * 1024; //最大的文档大小控制，默认是8M，现在设置成4M。
	WebOffice.Language = "CH"; //Language:多语言支持显示选择   CH 简体 TW繁体 EN英文
	WebOffice.PenColor = "#FF0000"; //PenColor:默认批注颜色
	WebOffice.PenWidth = "1"; //PenWidth:默认批注笔宽
	WebOffice.Print = "0"; //Print:默认是否可以打印:1可以打印批注,0不可以打印批注
	WebOffice.AllowEmpty = false;                     //控制不允许保存空白内容的文档
	WebOffice.CopyType = true;
	
	//WebOffice.FullSize(); //全屏
	//WebSetRibbonUIXML();                                  //控制OFFICE2007的选项卡显示
	WebOffice.WebOpen();                            //打开该文档    交互OfficeServer  调出文档OPTION="LOADFILE"    调出模板OPTION="LOADTEMPLATE"     <参考技术文档>
	//StatusMsg(WebOffice.Status);                    //状态信息
	$('#screenOverLoading').hide();
  }
  catch(e){
	  var browser = getBrowser(); //获取浏览器的类型
	  if(browser.indexOf('safari') == 0 || browser.indexOf('chrome') == 0 || browser.indexOf('firefox') == 0) {
		//提示下载插件
		var html="<div style='text-align:center;'><div>请点击<a href='javascript:downiWebPlugin();'>这里</a>下载安装文档编辑控件!</div>";
		html+="<div>安装完成后请刷新本页面</div></div>";
		$(html).prependTo('body');
	  }else{
		alert(e.message);                                   //显示出错误信息
	  }
  }
}

//作用：退出iWebOffice
function UnLoad(){
  try{
    if (!webform.WebOffice.WebClose()){
      StatusMsg(webform.WebOffice.Status);
    }
    else{
      //StatusMsg("关闭文档...");
    }
  }
  catch(e){
	  //alert(e.message);
  }
}

//作用：获取痕迹
function WebGetRevisions(){
	try{
  var Rev = webform.WebOffice.WebObject.Revisions;		//获取痕迹对象
  var Text="";
  for (i = 1;i <= Rev.Count;i++){
    Text=Text +"“"+ Rev.Item(i).Author+"”";
    // Rev.Item(i).date;
    if (Rev.Item(i).Type=="1"){
      Text=Text + '进行插入：'+Rev.Item(i).Range.Text+"\r\n";
    }else if (Rev.Item(i).Type=="2"){
      Text=Text + '进行删除：'+Rev.Item(i).Range.Text+"\r\n";
    }
	else {
      Text=Text + '进行其他操作，操作内容：“'+Rev.Item(i).Range.Text+ '”；操作：“'+Rev.Item(i).FormatDescription+"”。\r\n";
    }
  }
  alert("痕迹内容：\r\n\r\n"+Text);
	}catch(e){alert(e.message);}
}

</script>
</head>
<body bgcolor="#ffffff" onLoad="Load()" onUnload="UnLoad()">  <!--引导和退出iWebOffice-->
<div id='screenOverLoading' class='ui-tab-loading' style='display: block; top: 0;'></div>
  <form name="webform" method="post" action=""><!--保存iWebOffice后提交表单信息-->
	<table id="tbOffice" width=100%>
      <tr>
        <td>
          <!--调用iWebPicture，注意版本号，可用于升级-->
	      <script src='<c:url value="/iWebOffice/iWebOffice2009.js"/>'></script>
        </td>
      </tr>
    </table>    
  </form>
</body>
</html>