<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		<x:hidden name="attachmentConfigId" id="attachmentConfigId"/>
		<x:inputL name="bizCode" required="true" label="编码" maxLength="50" labelWidth="60"/>		
		<x:inputL name="bizName" required="true" label="名称" maxLength="50" labelWidth="60"/>
		<x:radioL name="isDelAuthority"  label="控制删除权限" list="#{'1':'是','0':'否'}" value="1" labelWidth="80" width="80"/>	
		<x:inputL name="remark" required="false" label="备注" maxLength="128" width="635" labelWidth="60"/>	
	</div>
</form>
<div id="attachmentConfigDetailGrid" style="margin: 2px;"></div>