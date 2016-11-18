<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width:590px;">
		<x:layout proportion="15%,35%,15%,35%"/>
		<tr>
			<x:hidden name="otherOrgId" id="detailId"/>
			<x:inputTD name="name" required="true" label="名称" maxLength="25" id="detailName"/>
			<x:inputTD name="code" required="false" label="编码" maxLength="16" id="detailCode"/>
		</tr>
		<tr>
			<x:inputTD name="linkMan" required="false" label="联系人" maxLength="20" />
			<x:inputTD name="linkInfo" required="false" label="联系方式" maxLength="100" />
		</tr>
		<tr>
			<x:inputTD name="remark" required="false" label="备注" maxLength="200" colspan="3"/>
		</tr>
	</table>
</form>
