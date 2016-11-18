<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>

<x:base include="layout,dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/lib/jquery/jquery.color.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquert.htmlEditor.js"/>'
	type="text/javascript"></script>
<script
	src='<c:url value="/biz/oa/taskPlan/workContactFreeFlow/WorkContactBill.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div style="margin: 0 auto;">
			<div class="subject">工 作 联 系 单</div>
		</div>
		<form method="post" action="" id="submitForm">
			<x:hidden name="workContactId" />
			<x:hidden name="deptId" />
			<x:hidden name="personId" />
			<x:hidden name="funTypeId" />
			<x:hidden name="organId" />
			<x:hidden name="positionId" />
			<x:hidden name="positionName" />
			<x:select cssStyle="display:none;" list="infoDemandWorkList"
				name="infoDemandWorkList" />
			<x:select cssStyle="display:none;" list="infoDemandUrgentList"
				name="infoDemandUrgentList" />
			<x:hidden name="processDefinitionKey" />
			<x:hidden name="procUnitId" />
			<table class='tableInput' style="width: 99%;">
				<x:layout proportion="16%,19%,12%,19%,10%" />
				<tr>
					<x:inputTD name="title" required="true" label="标题" width="744"
						colspan="5" maxLength="128">
					</x:inputTD>
				</tr>
				<tr>
					<x:inputTD name="organName" disabled="true" required="false"
						label="公司名称" maxLength="64" />
					<x:inputTD name="billCode" disabled="true" required="false"
						label="单据号码" />
					<x:inputTD name="fillinDate" disabled="true" required="false"
						label="填表日期" maxLength="7" wrapper="dateTime" />
				</tr>
				<tr>
					<x:inputTD name="deptName" disabled="true" required="false"
						label="发起部门名称" maxLength="64" />

					<x:inputTD name="personName" disabled="true" required="false"
						label="发起人名称" maxLength="65" />
					<x:selectTD name="status" required="false" label="审核状态"
						disabled="true" maxLength="10" list="billStatusMap" />
				</tr>
				<tr>
					<x:selectTD name="expectLoad" required="false" label="预估工作量"
						list="infoDemandWorkList" />
					<x:inputTD name="expectDate" required="true" label="完成时间"
						maxLength="7" wrapper="dateTime" />
					<td colspan="2"></td>
				</tr>
				<tr style="display: none" id="chooseHandlerTd">
					<td class='title'><span class="labelSpan"> 处理人&nbsp;: <a
							href='##' class="addLink" id="handlerChooseLink"
							onclick='showChooseHandlerDialog()'>选择</a>&nbsp;&nbsp; <a
							href='##' class="clearLink" id="handlerClearLink"
							onclick='clearChooseArray("handler")'>清空</a>
					</span>
						<div style="text-align: right; padding-right: 5px;">
							<a href='##' class="GridStyle" id="chooseProcessTemplateLink"
								onclick='chooseProcessTemplate()'>选择模板</a>&nbsp;&nbsp; <a
								href='##' class="GridStyle" id="saveProcessTemplateLink"
								onclick='saveProcessTemplate()'>保存为模板</a>&nbsp;&nbsp;
						</div></td>
					<td class="title" colspan="5"><div id="handlerShowDiv"
							style="min-height: 25px; line-height: 25px;"></div></td>
				</tr>
				<tr>
					<x:textareaTD name="remark" required="false" label="备注信息"
						width="744" rows="3" colspan="5" maxLength="512">
					</x:textareaTD>
				</tr>

			</table>

		</form>
		<div class="blank_div"></div>
		<x:fileList bizCode="workContact" bizId="workContactId"
			id="workContactIdAttachment" />
		<div class="blank_div"></div>
		<x:title title="联 系 事 项" name="group" />
		<div id="maingrid" style="width: 99%;"></div>
		<div class="blank_div"></div>
	</div>
</body>
</html>
