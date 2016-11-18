<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width:270px;">
		<x:layout proportion="90px,180px" />
		<tr>
			<x:hidden name="welfareCommodityId" />
			<x:inputTD name="name" required="true" label="名称" maxLength="64" />
		</tr>
		<tr>
			<x:inputTD name="code" required="true" label="编码" maxLength="32" />
		</tr>
		<tr>
			<x:inputTD name="sequence" required="true" label="序号" maxLength="22" mask="nnn" />
		</tr>
	</table>
</form>
