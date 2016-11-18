<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
  	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/biz/hr/attendance/process/ActivityHolidayApply.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv" style="width: 99%;">
			<div class="subject">活动假申请单</div>
			<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
				<form method="post" action="" id="submitForm">
					<div style="margin: 0 auto;">
						<x:hidden name="activityHolidayId" />
						<x:hidden name="fullId" />
						<x:hidden name="organId" />
						<x:hidden name="centerId" />
						<x:hidden name="centerName" />
						<x:hidden name="deptId" />
						<x:hidden name="positionId" />
						<x:hidden name="personMemberId" />
						<x:hidden name="positionName" />
						<x:hidden name="processDefinitionFile" />
						<x:hidden name="processDefinitionKey" />
						<x:hidden name="procUnitId" />
						<x:hidden name="status" value="0" />

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
									label="部门" maxLength="64" />
								<x:inputTD name="personMemberName" disabled="true"
									required="false" label="姓名" maxLength="64" />
								<td class="title" colspan="2"></td>
							</tr>
							<tr>
								<x:textareaTD name="remark" required="false" maxLength="200"
									label="备注" rows="2" colspan="5" />
							</tr>
						</table>
						<div class="blank_div"></div>
						<div id="maingrid"></div>
					</div>
				</form>
			</div>
		</div>
	</div>
</body>
</html>
