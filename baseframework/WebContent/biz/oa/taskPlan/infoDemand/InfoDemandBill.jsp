<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,attachment" />
<script src='<c:url value="/biz/oa/taskPlan/infoDemand/InfoDemandBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
		<form method="post" action="" id="submitForm">
			<div style="margin: 0 auto;">
				<x:hidden name="infoDemandId" id="infoDemandId" />

				<x:hidden name="deptId" />
				<x:hidden name="personId" />
				<x:hidden name="funTypeId" />
				<x:hidden name="organId" />
				<x:hidden name="positionId" />
				<x:hidden name="positionName" />
				<x:hidden name="functionId" />
				<x:hidden name="processDefinitionKey" />
				<x:hidden name="procUnitId" />

				<div class="subject">信 息 化 需 求 单</div>
				<table class='tableInput' style="width: 99%;">
					<x:layout proportion="10%,21%,12%,21%,10%" />
					<tr>
						<x:inputTD name="organName" disabled="true" required="false"
							label="公司名称" maxLength="64" />
						<x:inputTD name="billCode" disabled="true" required="false"
							label="单据号码" maxLength="32" />
						<x:inputTD name="fillinDate" disabled="true" required="false"
							label="填表日期" maxLength="7" mask="date" />
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
							maxLength="10"
							list="infoDemandWorkList" 
							width="250" labelWidth="100" />
						<%--  <x:inputTD name="expectLoad" required="false" label="预估工作量"
                               maxLength="10"/> --%>
					</tr>
					<tr>
						<x:radioTD dictionary="yesorno" name="isPlan" value="1"
							label="是否计划内" labelWidth="100" />
						<%-- <x:inputTD name="isPlan" disabled="true" required="false"
							label="是否计划内" maxLength="10" /> --%>
						<x:selectTD name="urgentDegree" required="true"    label="优先级" maxLength="10"
							 list="infoDemandUrgentList"   width="250"
							labelWidth="100" />	
<%-- 						<x:inputTD name="urgentDegree" disabled="true" required="false"
							label="优先级" maxLength="10" /> --%>
						<x:inputTD name="expectDate" required="true" label="期望完成时间"
							maxLength="7" wrapper="dateTime" />
					</tr>
					<tr>
						<x:textareaTD name="title" required="true" label="需求标题"
							width="64" rows="2" colspan="5" maxLength="42">
						</x:textareaTD>
					</tr>
					<tr>
						<x:textareaTD name="description" required="false" label="需求描述"
							width="1000" rows="10" colspan="5" maxLength="682">
						</x:textareaTD>
					</tr>
					<tr>
						<x:inputTD name="functionName" required="false" label="功能模块"   wrapper="tree" maxLength="64" />
						<x:selectTD name="status" required="false" label="状态" disabled="true"/>	
						<x:inputTD name="lastDealDate" required="false" label="完成时间" disabled="true"  maxLength="7" wrapper="dateTime" />
					</tr>
					<c:if test="${status>0}">
					<tr>
						<x:hidden name="oaTaskKindId"/>
						<x:inputTD name="oaTaskKindName" required="false" label="任务类别" 	 wrapper="select"/>
						<x:hidden name="selfDeptId"/>
						<x:hidden name="dealPersonId"/>
						<x:inputTD name="selfDeptName" required="false" label="责任部门" maxLength="64" wrapper="tree" />
						<x:inputTD name="dealPersonName" required="false" label="责任人" maxLength="128"  wrapper="select"/>
					</tr>
					</c:if>
				</table>				
				<div class="blank_div"></div>
				<x:fileList bizCode="infoDemand" bizId="infoDemandId" id="infoDemandIdAttachment" />
			</div>
		</form>
	</div>
</body>
</html>
