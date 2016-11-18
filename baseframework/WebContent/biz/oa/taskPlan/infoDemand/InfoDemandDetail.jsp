<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div id="InfoDemandDetailDiv" class="ui-form">
	<form method="post" action="" id="submitForm">
		<x:hidden name="infoDemandId" />
		<x:hidden name="organId" />
		<x:hidden name="deptId" />
		<x:hidden name="personId" />
		<x:hidden name="functionId" />
		<table class='tableInput' style="width: 99%;">
			<x:layout proportion="10%,21%,12%,21%,10%" />
			<tr>
				<x:inputTD name="organName" disabled="true" required="false"
					label="公司名称" maxLength="64" />
				<x:inputTD name="billCode" disabled="true" required="false"
					label="单据号码" maxLength="32" />
				<x:inputTD name="fillinDate" disabled="true" required="false"
					label="填表日期" maxLength="7" wrapper="dateTime" />
			</tr>
			<tr>
				<x:inputTD name="deptName" disabled="true" required="false"
					label="发起部门名称" maxLength="64" />

				<x:inputTD name="personName" disabled="true" required="false"
					label="发起人名称" maxLength="65" />
				<!--
						<x:inputTD name="deputyName" required="false" label="代理人"
							maxLength="64" />
							-->
				<x:selectTD name="expectLoad" required="true" label="预估工作量"
					maxLength="10" list="infoDemandWorkList" width="250"
					labelWidth="100" />
				<%--  <x:inputTD name="expectLoad" required="false" label="预估工作量"
                               maxLength="10"/> --%>
			</tr>
			<tr>
				<x:radioTD dictionary="yesorno" name="isPlan" value="1"
					label="是否计划内" labelWidth="100" />
				<%-- <x:inputTD name="isPlan" disabled="true" required="false"
							label="是否计划内" maxLength="10" /> --%>
				<x:selectTD name="urgentDegree" required="true" disabled="true"
					label="优先级" maxLength="10" list="infoDemandUrgentList" width="250"
					labelWidth="100" />
				<%-- 						<x:inputTD name="urgentDegree" disabled="true" required="false"
							label="优先级" maxLength="10" /> --%>
				<x:inputTD name="expectDate" required="false" label="期望完成时间"
					maxLength="7" wrapper="dateTime" />
			</tr>
			<tr>
				<x:textareaTD name="title" required="false" label="需求标题" width="64"
					rows="2" colspan="5" maxLength="42">
				</x:textareaTD>
			</tr>
			<tr>
				<x:textareaTD name="description" required="false" label="需求描述"
					width="1000" rows="10" colspan="5" maxLength="682">
				</x:textareaTD>
			</tr>
			<tr>
				<x:inputTD name="functionName" required="false" label="功能模块"
					wrapper="tree" maxLength="64" />
				<x:selectTD name="status" required="false" label="审核状态"
					disabled="true" maxLength="10" list="billStatusMap" />
				<x:inputTD name="lastDealDate" required="false" label="完成时间"
					disabled="true" maxLength="7" wrapper="dateTime" />
			</tr>
		</table>
		<div class="blank_div"></div>
		<x:fileList bizCode="infoDemand" bizId="infoDemandId" id="infoDemandIdAttachment" />
	</form>
</div>
