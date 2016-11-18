<%@ page contentType="text/html; charset=gbk" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<title>�ĵ����߱༭</title>
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
  // alert('���:'+vIndex+'\n\r'+'��Ŀ:'+vCaption+'\n\r'+'�������Щ��Ϣ��д��ť���幦��');
  if (vIndex==14){SaveDocument();}
  if (vIndex==15){WebSaveLocal();}
  if (vIndex==16){WebGetRevisions();}
  if (vIndex==17){showFileHistory("${id}");}
</script>
<!-- Firefox��chrome -->
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
form������:webform
iWebOffice����:WebOffice
WebObject�ĵ�����ӿڣ��൱�ڣ�
�����Word  �ļ���WebObject ��Word  VBA��ActiveDocument����
�����Excel �ļ���WebObject ��Excel VBA��ActiveSheet����

�磺webform.WebOffice.WebObject
*/


//���ã���ʾ����״̬
function StatusMsg(mString){
  // webform.StatusBar.value=mString;
  alert(mString);
}

//���ã�����iWebOffice
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
    //�������Ա������ã�ʵʼ��iWebOffice
	WebOffice.WebUrl="${mServerUrl}";//WebUrl:ϵͳ������·������������ļ������������籣�桢���ĵ�����Ҫ�ļ�
	WebOffice.RecordID=fileId;//RecordID:���ĵ���¼���
	WebOffice.FileType="."+fileType;//FileType:�ĵ�����  .doc  .xls  .wps
	WebOffice.UserName="${operatorKey}";//UserName:�����û������ۼ�������Ҫ
	/*** 
		���ø�ʽ��WebOffice.EditType="A,B,C,D,E,F,G,H"
		���ǵĺ������£�
		A  ����Ϊ��-1��
		B  �Ƿ񱣻��ĵ�		��0�� �������ĵ��� ��1�� �����ĵ��� ��2�� ���Ᵽ��
		C  �Ƿ���ʾ�ۼ�		��0�� ����ʾ�ۼ��� ��1�� ��ʾ�ۼ�
		D  �Ƿ����ۼ�		��0�� �������ۼ��� ��1�� �����ۼ�
		E  �Ƿ��ӡ�ۼ�		��0�� ����ӡ�ۼ��� ��1�� ��ӡ�ۼ�
		F  �Ƿ���ʾ���Ĺ���	��0�� ����ʾ���ߣ� ��1�� ��ʾ����
		G  �Ƿ�����������	��0�� ���������� ��1�� ������
		H  �Ƿ�������д��ע	��0�� ��������ע�� ��1�� ������ע
		�磺��Ҫ�������ĵ�������ʾ�ۼ����кۼ�����������ӡ�ۼ�������ʾ���Ĺ��ߣ���������������д��ע�������Ϳ�������Ϊ WebOffice.EditType="-1,0,1,1,0,0,0,1";��
 	*/
	WebOffice.EditType="-1,0,0,1,0,1,1,1";
	//����Ϊ�Զ���˵���
	WebOffice.VisibleTools("�½��ļ�",false);
	WebOffice.VisibleTools("���ļ�",false);
	WebOffice.VisibleTools("�����ļ�",false);
	//WebOffice.DisableMenu("��(&M);ѡ��(&O)...");    //��ֹĳ����Щ���˵���
	if ("0" == editType.substring(0,1)){
		WebOffice.ShowToolBar=0;
	}else{
		WebOffice.ShowToolBar=1;
		WebOffice.AppendTools("17","�鿴�޸���ʷ",17);
		WebOffice.AppendTools("16","�鿴�޸ĺۼ�",16);
		WebOffice.AppendTools("15","���Ϊ�ļ�",2);
		WebOffice.AppendTools("14","����Զ���ļ�",2);
	}
	WebOffice.ShowMenu=0;
	//����Ϊ�Զ���˵���
	
	WebOffice.CopyType = "0";
	WebOffice.EnablePrint = "0";
	WebOffice.MaxFileSize = 16 * 1024; //�����ĵ���С���ƣ�Ĭ����8M���������ó�4M��
	WebOffice.Language = "CH"; //Language:������֧����ʾѡ��   CH ���� TW���� ENӢ��
	WebOffice.PenColor = "#FF0000"; //PenColor:Ĭ����ע��ɫ
	WebOffice.PenWidth = "1"; //PenWidth:Ĭ����ע�ʿ�
	WebOffice.Print = "0"; //Print:Ĭ���Ƿ���Դ�ӡ:1���Դ�ӡ��ע,0�����Դ�ӡ��ע
	WebOffice.AllowEmpty = false;                     //���Ʋ�������հ����ݵ��ĵ�
	WebOffice.CopyType = true;
	
	//WebOffice.FullSize(); //ȫ��
	//WebSetRibbonUIXML();                                  //����OFFICE2007��ѡ���ʾ
	WebOffice.WebOpen();                            //�򿪸��ĵ�    ����OfficeServer  �����ĵ�OPTION="LOADFILE"    ����ģ��OPTION="LOADTEMPLATE"     <�ο������ĵ�>
	//StatusMsg(WebOffice.Status);                    //״̬��Ϣ
	$('#screenOverLoading').hide();
  }
  catch(e){
	  var browser = getBrowser(); //��ȡ�����������
	  if(browser.indexOf('safari') == 0 || browser.indexOf('chrome') == 0 || browser.indexOf('firefox') == 0) {
		//��ʾ���ز��
		var html="<div style='text-align:center;'><div>����<a href='javascript:downiWebPlugin();'>����</a>���ذ�װ�ĵ��༭�ؼ�!</div>";
		html+="<div>��װ��ɺ���ˢ�±�ҳ��</div></div>";
		$(html).prependTo('body');
	  }else{
		alert(e.message);                                   //��ʾ��������Ϣ
	  }
  }
}

//���ã��˳�iWebOffice
function UnLoad(){
  try{
    if (!webform.WebOffice.WebClose()){
      StatusMsg(webform.WebOffice.Status);
    }
    else{
      //StatusMsg("�ر��ĵ�...");
    }
  }
  catch(e){
	  //alert(e.message);
  }
}

//���ã���ȡ�ۼ�
function WebGetRevisions(){
	try{
  var Rev = webform.WebOffice.WebObject.Revisions;		//��ȡ�ۼ�����
  var Text="";
  for (i = 1;i <= Rev.Count;i++){
    Text=Text +"��"+ Rev.Item(i).Author+"��";
    // Rev.Item(i).date;
    if (Rev.Item(i).Type=="1"){
      Text=Text + '���в��룺'+Rev.Item(i).Range.Text+"\r\n";
    }else if (Rev.Item(i).Type=="2"){
      Text=Text + '����ɾ����'+Rev.Item(i).Range.Text+"\r\n";
    }
	else {
      Text=Text + '���������������������ݣ���'+Rev.Item(i).Range.Text+ '������������'+Rev.Item(i).FormatDescription+"����\r\n";
    }
  }
  alert("�ۼ����ݣ�\r\n\r\n"+Text);
	}catch(e){alert(e.message);}
}

</script>
</head>
<body bgcolor="#ffffff" onLoad="Load()" onUnload="UnLoad()">  <!--�������˳�iWebOffice-->
<div id='screenOverLoading' class='ui-tab-loading' style='display: block; top: 0;'></div>
  <form name="webform" method="post" action=""><!--����iWebOffice���ύ����Ϣ-->
	<table id="tbOffice" width=100%>
      <tr>
        <td>
          <!--����iWebPicture��ע��汾�ţ�����������-->
	      <script src='<c:url value="/iWebOffice/iWebOffice2009.js"/>'></script>
        </td>
      </tr>
    </table>    
  </form>
</body>
</html>