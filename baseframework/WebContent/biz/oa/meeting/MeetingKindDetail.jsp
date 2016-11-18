
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="height: 135px">
		<x:hidden name="meetingKindId"/>
		<x:hidden name="parentId"/>		
		<x:inputL name="code" required="true" label="编码" maxLength="32"/>		
		<x:inputL name="name" required="true" label="名称" maxLength="64"/>	
		<x:selectL name="meetingLevel" required="true" list="meetingLevelList" label="会议等级" />	
		<x:selectL name="messageKindId" required="false" label="通知模式" list="messageKindList"/>
		<x:inputL name="aheadDays" required="true" label="预定提前天数" mask="nn"/>
		<x:selectL name="status" required="true" label="是否启用" dictionary="yesorno"/>
		<x:selectL name="freeFlow" required="true" label="纪要自由流" dictionary="yesorno"/>
		<x:selectL name="isSpecializedCommittee" required="true" label="专委会会议" dictionary="yesorno"/>
	</div>
</form>
<div id='meetingKindTab' style="width:99%;height: 240px">
	<div class="ui-tab-links">
		<h2 >类别属性</h2>
		<ul style="left:80px;">
			<li id="messageConfig">提前通知设置</li>
			<li id="participant">默认参与组织配置</li>
			<li id="taskConfig">计划条目配置</li>
			<li id="leaveOrgConfig">请假备案组织配置</li>
		</ul>
	</div>
	<div class="ui-tab-content"  style="padding: 2px;">
		<div class="layout" id="showMessageConfig" >
			<div id="meetingMessageConfigGrid" style="height: 200px;"></div>
		</div>
		<div class="layout" id="showParticipant">
			<div id="meetingKindParticipantGrid" style="height: 200px;"></div>
		</div>
		<div class="layout" id="showTaskConfig" >
			<div id="meetingKindTaskConfigGrid" style="height: 200px;"></div>
		</div>
		<div class="layout" id="showLeaveOrgConfig" >
			<div id="meetingKindLeaveOrgConfigGrid" style="height: 200px;"></div>
		</div>
	</div>
</div>
