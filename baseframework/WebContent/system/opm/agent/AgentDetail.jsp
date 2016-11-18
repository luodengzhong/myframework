<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="id" />
	<table class='tableInput' style="width: 600px;">
		<x:layout proportion="20%,30%,20%,*" />
		<tr>
			<x:hidden name="orgId" />
			<x:hidden name="orgFullId" />
			<x:hidden name="orgFullName" />
			<x:hidden name="creatorId" />
			<x:hidden name="creatorName" />
			<x:hidden name="createDate" type="datetime"/>
			<x:inputTD name="orgName" required="true" label="委托人"
				wrapper="select" />
			<x:hidden name="agentId" />
			<x:inputTD name="agentName" required="true" label="代理人"
				wrapper="select" />
		</tr>
		<tr>
			<x:inputTD name="startDate" required="true" label="开始时间"
				wrapper="dateTime" />
			<x:inputTD name="finishDate" required="true" label="结束时间"
				wrapper="dateTime" />
		</tr>
		<tr>
			<x:radioTD list="#{'1':'启用','0':'禁用'}" name="status" value="1"
				label="状态" />
			<x:radioTD list="#{'1':'全部','2':'自定义流程'}" name="procAgentKindId"
				value="1" label="代理方式" />
		</tr>
		<tr>
			<x:textareaTD name="remark" label="备注" readonly="false" rows="3"
				colspan="3" />
		</tr>
	</table>
</form>
<div id="detailGrid" style="margin: 2px;"></div>