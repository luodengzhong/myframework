<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="archivesId" />
	<div class='ui-form'>
		<div class="row">
			<x:inputL name="staffName" required="true" label="姓名" labelWidth="60"/>
		</div>
		<div class="row">
			<x:inputL name="personId" label="用户ID" labelWidth="60"/>
		</div>
		<div class="row">
			<x:inputL name="f07"  label="账号" labelWidth="60"/>
		</div>
		<div class="row">
			<x:inputL name="idCardNo"  label="身份证号" labelWidth="60"/>
		</div>
		<div class="row">
			<x:inputL name="clockingCardCode"  label="考勤号" labelWidth="60"/>
		</div>
	</div>
</form>