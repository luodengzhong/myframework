<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="id"/>
	<x:hidden name="approvalRuleId"/>

	<div position="center" id='tabPage'>
		<div class="ui-tab-links">
			<ul style="left: 10px;">
				<li id="l1" divid="d1">基本信息</li>
				<li id="l2" divid="d2">字段权限</li>
			</ul>
		</div>
		<div class="ui-tab-content" style="border: 0; padding: 2px;">
			<div id="d1" class="layout">
				<table class="tableInput" width="100%">
					<x:layout proportion="12%,21%,12%,21%"/>
					<tr>
						<x:selectTD name="allowAdd" required="false" label="允许加签" dictionary="yesorno"
									emptyOption="false" value="1"/>
						<x:selectTD name="allowSubtract" required="false" label="允许被减签" dictionary="yesorno"
									emptyOption="false" value="1"/>
					</tr>
					<tr>
						<x:selectTD name="allowAbort" required="false" label="允许中止" dictionary="yesorno"
									emptyOption="false" value="1"/>
						<x:selectTD name="allowTransfer" required="false" label="允许转交" dictionary="yesorno"
									emptyOption="false" value="1"/>
					</tr>
					<tr>
						<x:selectTD name="needTiming" required="false" label="是否计时" dictionary="yesorno"
									emptyOption="false" value="1"/>
						<x:inputTD type="text" name="helpSection" required="false" label="审批要点"/>
					</tr>
					<tr>
						<x:inputTD type="text" name="groupId" spinner="true" mask="nnn" dataoptions="min:1"
								   required="true"
								   label="审批分组"/>
						<x:inputTD type="text" name="sequence" spinner="true" mask="nnn" dataoptions="min:1"
								   required="true"
								   label="审批序号"/>
					</tr>
				</table>
				<x:title name="group" title="协办人列表" hideTable="#assistantGrid" />
				<div id="assistantGrid" style="margin-top: 2px;"></div>
				<x:title name="group" title="抄送人列表" hideTable="#ccGrid" />
				<div id="ccGrid" style="margin-top: 2px;"></div>
			</div>
		</div>
		<div class="ui-tab-content" style="border: 0; padding: 2px;">
			<div id="d2" class="layout" style="margin: 2px;">
				<div id="fieldPermissionGrid" style="margin-top: 2px; width: 100%"></div>
			</div>
		</div>
	</div>
</form>