<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="20%,30%,15%,35%" />
		<tr>
			<x:hidden name="weixinMessageKindId" id="detailWeixinMessageKindId" />
			<x:inputTD name="name" required="true" label="类别名称" maxLength="30" />
			<x:inputTD name="code" required="true" label="类别编码" maxLength="16" />
		</tr>
		<tr>
			<x:selectTD name="msgType"  label="发送类别" required="true" list="WeixinMsgTypeList" id="detailMsgType"/>
			<x:inputTD name="sequence" required="false" label="序号" mask="nnnn" cssStyle="width:80px;" id="detailSequence"/>
		</tr>
		<tr>
			<x:inputTD name="title" required="false" label="默认标题" maxLength="120" colspan="3" />
		</tr>
		<tr>
			<x:inputTD name="linkUrl" required="false" label="连接地址" maxLength="120" colspan="3" />
		</tr>
		<tr>
			<x:textareaTD name="remark" required="false" label="默认描述" maxLength="200" colspan="3" rows="3"/>
		</tr>
	</table>
</form>
<div class="blank_div"></div>
<x:fileList bizCode="weixinMessageKind" bizId="weixinMessageKindId" id="weixinMessageKindIdFileList"/>