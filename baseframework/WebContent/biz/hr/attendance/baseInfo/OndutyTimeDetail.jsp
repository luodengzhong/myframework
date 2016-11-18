<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
		<x:hidden name="ondutyTimeId"/>
		<x:hidden name="organId"/>
		<div class="ui-form" id="queryDiv" style="width: 600px;">
			<div class="row">
				<x:inputL name="organName" disabled="true" label="机构名称" readonly="true" />
				<x:inputL name="workingHour" required="true" label="工作时间" mask="nn.n" />
			</div>
			<div class="row">
				<x:inputL name="startDate" required="true" label="开始日期" wrapper="date"/>
				<x:inputL name="endDate" required="true" label="结束日期" wrapper="date"/>
			</div>
			<div class="row">
				<x:inputL name="amStartTime" required="true" label="上午上班时间" mask="nn:nn"/>
				<x:inputL name="amEndTime" required="true" label="上午下班时间" mask="nn:nn" />
			</div>
			<div class="row">
				<x:selectL name="amEndCheck" required="true" label="上午下班考勤" dictionary="yesOrNo"/>
				<x:selectL name="pmStartCheck" required="true" label="下午上班考勤" dictionary="yesOrNo"/>
			</div>
			<div class="row">
				<x:inputL name="pmStartTime" required="true" label="下午上班时间" mask="nn:nn"/>
				<x:inputL name="pmEndTime" required="true" label="下午下班时间" mask="nn:nn" />
			</div>
			<div class="row">
				<x:inputL name="compartTime" required="true" label="分隔点" mask="nn:nn"/>
			</div>
		</div>
	
</form>