<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
		<x:hidden name="workShiftId"/>
		<x:hidden name="schOrgId"/>
		<x:hidden name="orgId"/>
		<div class="ui-form" id="queryDiv" style="width: 600px;">
			<div class="row">
				<x:inputL name="orgName" disabled="true" label="机构名称" readonly="true" />
				<x:inputL name="schOrgName" disabled="true" label="排班组织" readonly="true" />
			</div>
			<div class="row">
			<x:inputL name="workShiftName" required="true" label="班次名称" />
				<x:inputL name="workCode" required="true" label="班次编号" mask="nnnnnnnnnn"/>
				
			</div>
			<div class="row">
				<x:inputL name="startTime" required="true" label="上班时间" mask="nn:nn"/>
				<x:inputL name="endTime" required="true" label="下班时间" mask="nn:nn"/>
			</div>
			<div class="row">
				<x:selectL name="workKind" required="true" label="工种类型" />
				<x:selectL name="status" required="true" label="是否启用" dictionary="yesOrNo" />
			</div>
			<div class="row">
				<x:inputL name="workNum" required="true" label="班次计数" mask="n.nn"/>
			</div>
			<div class="row">
				<x:textareaL name="fullName" readonly="true" label="排班组织全路径" width="460" rows="3"/>
			</div>
		</div>
	
</form>