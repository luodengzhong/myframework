<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		<x:hidden name="remindId"/>
		<x:inputL name="code" required="true" label="编码" maxLength="32" labelWidth="90" width="355"/>	
		<x:inputL name="name" required="true" label="标题" maxLength="128" labelWidth="90" width="355"/>	
		<x:textareaL name="remindTitle" required="true" label="提示文本" maxLength="256" labelWidth="90" width="355" height="60" rows="4"/>		
		<x:textareaL name="remindUrl" required="false" label="连接地址" maxLength="256" labelWidth="90" width="355" height="45" rows="3"/>		
		<x:textareaL name="executeFunc" required="false" label="函数" maxLength="512" labelWidth="90" width="355" height="45" rows="3"/>
		<x:radioL name="openKind" label="页面打开方式 "  value="0" list="#{'0':'新窗口','1':'弹出'}" labelWidth="90" width="140"/>
		<x:inputL name="sequence" required="true" label="序号" spinner="true" labelWidth="60" width="80"/>
		<x:radioL name="replaceKind" label="替换类别 "  value="0" list="#{'0':'顺序替换','1':'名称替换','2':'存在则显示'}" labelWidth="90" width="355"/>
	</div>
</form>
