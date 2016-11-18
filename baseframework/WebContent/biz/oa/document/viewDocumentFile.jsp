<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<x:title title="文档信息"  name="group"/>
<div class="ui-form" >
	<form method="post" action="" id="documentFileSubmitForm">
		<x:hidden name="oldDocumentLibraryId"/>
		<x:hidden name="replaceFlag" id="detailReplaceFlag"/>
		<x:inputL name="documentName" required="true" label="名称" maxLength="120"  width="350"/>
		<div class="clear"></div>
		<x:inputL name="remark" required="false" label="描述/关键字" maxLength="100" width="455"/>
		<div class="clear"></div>
	</form>
	<x:title title="扩展信息"  name="group"/>
	<form method="post" action="" id="documentFileExtendInfoForm">
		<x:inputL name="code1" required="false" label="档号" maxLength="30"/>
		<x:inputL name="code2" required="false" label="案卷号" maxLength="30" />
		<div class="clear"></div>
		<x:inputL name="code3" required="false" label="全宗号" maxLength="30" />
		<x:inputL name="code4" required="false" label="件号" maxLength="30" />
		<div class="clear"></div>
		<x:inputL name="code5" required="false" label="文号" maxLength="30" />
		<x:inputL name="security" required="false" label="密级" maxLength="16" />
		<div class="clear"></div>
		<x:inputL name="storagePlace" required="false" label="存放位置" maxLength="60"  width="455"/>
		<div class="clear"></div>	
		<x:inputL name="docRemark" required="false" label="备注" maxLength="100" width="455"/>
		<div class="clear"></div>
	</form>
	<x:title title="附件文件"  name="group"/>
	<div id="documentFileInfoDiv">
		<x:hidden name="fileId"  id="detailDocumentFileId"/>
		<x:inputL name="fileName" required="false" label="文件名"  readonly="true"   width="350"/>
		<div class="clear"></div>
		<x:inputL name="creatorName" required="false" label="上传人" readonly="true"  />
		<x:inputL name="createDate" required="false" label="上传时间" readonly="true"  />
		<x:inputL name="fileSize" required="false" label="文件大小" readonly="true" />
		<div class="clear"></div>
		<dl style="height:50px">
			<a href="javascript:void(0);" onclick="documentFileBack()" class="ui-button ui-button-back" id="documentFileBack">返 回</a>&nbsp;&nbsp; 
			<a href="javascript:void(0);" class="ui-button" id="documentFileHistory" >历史版本</a>&nbsp;&nbsp;
			<a href="javascript:void(0);" onclick="documentFileSave()" class="ui-button ui-button-tw"" id="documentFileSave" style="display: none;">保 存</a>&nbsp;&nbsp; 
			<a href="javascript:void(0);"  onclick="documentFilePreview()"class="ui-button" id="documentFilePreview" >预 览</a>&nbsp;&nbsp; 
			<a href="javascript:void(0);"  onclick="documentFileDownload()" class="ui-button" id="documentFileDownload" style="display: none;">下 载</a>&nbsp;&nbsp; 
			<a href="javascript:void(0);" class="ui-button" id="documentFileReplace" style="display: none;width: 30px;position: relative;*top: 8px;">替 换</a>&nbsp;&nbsp;
			<!-- <a href="javascript:void(0);" onclick="documentFileReplaceByFtp()"  class="ui-button" id="documentFileReplaceByFtp" style="display: none;">大文件替换</a>&nbsp;&nbsp; -->
		</dl>
	</div>
</div>
<div style="height: 50px">&nbsp;</div>