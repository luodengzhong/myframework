<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,combox,tree" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/master/AddPayMaster.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" style="text-align: center;">
		<div class="subject">新建工资表指定业务期间</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput'
				style="width: 500px; margin: auto; margin-top: 3px;">
				<x:layout proportion="90px,130px,90px,130px" />
				<tr>
					<x:hidden name="orgUnitId"/>
					<x:inputTD name="orgUnitName" label="工资主体单位" required="true" colspan="3" wrapper="tree"/>
				</tr>
				<tr>
					<x:inputTD name="year" label="业务年" required="true" cssStyle="width:80px;" />
					<x:hidden name="periodId"/>
					<x:inputTD name="periodName" label="业务期间" required="true" wrapper="combo"/>
				</tr>
				<tr>
					<x:inputTD name="periodBeginDate" label="开始时间" readonly="true" mask="date"/>
					<x:inputTD name="periodEndDate" label="结束时间" readonly="true" mask="date"/>
				</tr>
				<tr>
					<x:radioTD name="payStaffType" label="人员类别"  required="true"  colspan="3" list="payStaffType"/>
				</tr>
				<tr>
					<td colspan='4' style="height: 35px; text-align: center;">
						<!--<x:button value="变动比对" onclick="" />&nbsp;&nbsp;--> 
						<x:button value="确 定" onclick="createPay()" />&nbsp;&nbsp; 
						<x:button value="关 闭" onclick="closeWindow()" />&nbsp;&nbsp;</td>
				</tr>
			</table>
		</form>
	</div>
</body>
</html>
