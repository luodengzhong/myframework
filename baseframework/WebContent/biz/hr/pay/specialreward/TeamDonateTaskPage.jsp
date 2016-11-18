<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,combox" />
<script src='<c:url value="/biz/hr/pay/specialreward/TeamDonateTaskPage.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="subject">团队捐赠填报</div>
			<form method="post" action="" id="submitForm">
				<table class='tableInput' style="width: 99%;">
					<x:layout />
					<x:hidden name="teamDonateId" />
					<x:hidden name="taskId" />
					<tr>
						<x:inputTD name="billCode" required="false" disabled="true" label="单据号码" />
						<x:inputTD name="fillinDate" required="false" disabled="true" label="填表日期" mask="date" />
						<x:inputTD name="createByName" required="false" disabled="true" label="指定人" />
					</tr>
					<tr>
						<x:inputTD name="title" disabled="true" label="奖罚事由" maxLength="64" colspan="5" />
					</tr>
					<tr>
						<x:selectTD name="rewardApplyKind" disabled="true" label="类别" />
						<x:inputTD name="amount" disabled="true" label="总金额(元)" mask="money" />
						<x:inputTD name="groupRatio" disabled="true" label="团队比例(%)" />
					</tr>
					<tr>
						<x:inputTD name="proportion" label="捐赠比例(%)" disabled="true" />
						<!--<x:inputTD name="tmpDonateAmount" disabled="true" label="捐赠金额(元)"
							mask="money" />-->
						<x:inputTD name="donateAmount" required="true" label="捐赠金额(元)" mask="positiveMoney" />
						<td class="title" colspan="2">&nbsp;</td>
					</tr>
					<tr>
						<x:inputTD name="remark" label="备注" maxLength="100" colspan="5" />
					</tr>
					<tr>
						<td class="title" colspan="6" style="text-align:right;margin-right: 20px;">
							    <x:button value="保 存" onclick="doSave(this.form)" />
								&nbsp;&nbsp;
								<x:button value="提 交" onclick="doSubmit(this.form)" />
								&nbsp;&nbsp;
						</td>
					</tr>
				</table>
			</form>
		</div>
	</div>
</body>
</html>