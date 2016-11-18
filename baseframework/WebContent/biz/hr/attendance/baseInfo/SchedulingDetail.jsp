<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
	<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<form method="post" action="" id="submitForm">
		<x:hidden name="schedulingId"/>
		<x:hidden name="workShiftId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="orgId"/>
		<x:hidden name="schOrgId"/>
		<x:hidden name="status"/>
		<div class="ui-form" id="queryDiv" style="width: 600px;">
			<div class="row">
				<x:inputL name="orgName" disabled="true" label="机构名称" readonly="true" />
				<x:inputL name="workDate" disabled="true" label="上班日期" readonly="true" />
			</div>
			<div class="row">
				<x:inputL name="workShiftName" disabled="true" label="班次名称" readonly="true" />
				<x:inputL name="workCode" disabled="true" label="班次编号" readonly="true" />
			</div>
			<div class="row">
				<x:hidden name="ownerPersonId"/>
				<x:inputL name="ownerPersonName" required="true" disabled="true" label="排班人员" readonly="true" />
				<x:selectL name="ownerPersonSituation" required="true" label="排班人员情况" dictionary="workSituation" />
			</div>
			<div class="row">
				<x:hidden name="executorPersonId"/>
				<x:inputL name="executorPersonName" label="出勤人员" wrapper="select" />
				<x:selectL name="executorPersonSituation" label="出勤人员情况" dictionary="workSituation" />
			</div>
			<div class="row">
				<x:selectL name="workKind" disabled="true" label="工种类型" readonly="true" />
				<x:selectL list="overtimeSettlementKindList" emptyOption="true" name="overtimeSettlement" label="加班结算方式" />
			</div>
			<div class="row">
				<x:textareaL name="remark" required="false" label="备注"
							rows="2" width="456" maxLength="128"/>
			</div>
		</div>
	
</form>
