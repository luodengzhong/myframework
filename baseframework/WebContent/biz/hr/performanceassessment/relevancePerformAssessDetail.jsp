<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width:340px;">
		<x:layout proportion="30%,70%" />
		<tr>
			<x:hidden name="underAssessmentId" />
			<x:hidden name="personId" id="detailPersonId"/>
			<x:inputTD name="personName" id="detailPersonName" required="true" label="人员名称" maxLength="16" wrapper="select"/>
		</tr>
		<tr>
			<x:hidden name="evaluationId" />
			<x:inputTD name="templetName" required="true" label="考核表" maxLength="22" wrapper="select"/>
		</tr>
		<tr>
			<x:inputTD name="periodCode" required="true" label="考核类别" maxLength="22" id="detailPeriodCode"/>
		</tr>
		<tr>
			<x:hidden name="orgnId" id="detailOrgnId"/>
			<x:inputTD name="orgnName" id="detailOrgnName" required="false" label="考核排名单位" maxLength="64" wrapper="select"/>
		</tr>
		<tr>
		<td colspan="2" style="color:red;font-size:12px">
		(考核排名单位,特指绩效考核成绩在**单位排名,如本人绩效考核排名在总部战略管理信息中心,则考核排名单位选择总部战略管理信息中心,属于垂直体系的人员,如成都公司招标采购中心,请选择总部招标采购中心,依次类推。)
		</td>
		</tr>
		<tr>
			<x:textareaTD rows="4" name="formName" id="detailFormName" required="false" label="考核任务名称" maxLength="128"/>
		</tr>
	</table>
</form>
