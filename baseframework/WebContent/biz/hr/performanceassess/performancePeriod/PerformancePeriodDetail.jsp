<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width:270px;">
		<x:layout proportion="90px,180px" />
		<tr>
			<x:hidden name="periodId" />
			<x:inputTD name="periodName" required="true" label="名称" maxLength="64" />
		</tr>
		<tr>
			<x:inputTD name="code" required="true" label="编码" maxLength="32" />
		</tr>
		<tr>
			<x:selectTD name="performassessKind" required="true" label="类别" maxLength="1" list="#{'1':'绩效','2':'测评','3':'调查'}" emptyOption="false"/>
		</tr>
		<tr>
			<x:inputTD name="periodDay" required="false" label="周期天数" mask="nnn" />
		</tr>
	<%-- 	<tr>
			<x:inputTD name="upRange" required="false" label="向上浮动值" mask="nnn" />
		</tr> --%>
		<tr>
			<x:inputTD name="downRange" required="false" label="向下浮动值"  mask="nnn" />
		</tr>
		<tr>
			<x:selectTD name="model" required="true" label="模式" maxLength="22" />
		</tr>
		<tr>
			<x:inputTD name="sequence" required="true" label="序号" maxLength="22" mask="nnn" />
		</tr>
	</table>
</form>
