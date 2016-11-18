<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 350px">
		<x:hidden name="id" id="buttonId"/>
		<x:hidden name="x" />
		<x:hidden name="y"/>
		<x:inputL name="text" required="true" id="buttonText" label="名称" maxLength="32" labelWidth="80" width="240"/>	
		<x:hidden name="functionId" />
		<x:hidden name="functionUrl" />
		<x:inputL name="title"  id="buttonTitle" required="false" label="系统功能" maxLength="30" labelWidth="80" width="240" wrapper="tree"/>	
		<x:inputL name="color" required="false" label="颜色" maxLength="30" labelWidth="80" width="240"/>	
		<x:inputL name="borderColor" required="false" label="背景色" maxLength="30" labelWidth="80" width="240"/>
		<x:inputL name="eclipse" required="false" label="圆角度" maxLength="2" labelWidth="80" width="80" mask="nn"/>
		<x:inputL name="fontSize" required="false" label="字体" maxLength="10" labelWidth="50" width="80" />
		<x:inputL name="width" required="false" label="宽度" maxLength="10" labelWidth="80" width="80" mask="nnn"/>
		<x:inputL name="height" required="false" label="高度" maxLength="10" labelWidth="50" width="80" mask="nnn"/>
	</div>
</form>
