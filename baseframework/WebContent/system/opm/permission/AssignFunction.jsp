<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/permission/AssignFunction.js"/>' type="text/javascript"></script>
<style>body{overflow-y:hidden;}</style>
<title>分配功能</title>
</head>
<div class="mainPanel" style="margin-top: 10px;">
	<table cellpadding="0" cellspacing="0" style='width:99%;'>
		<x:layout proportion="45%,10%,45%"/>
		<tr>
			<td colspan=3>
				<div style="width:200px;font-size:13px;font-weight:bold;text-align:right;float:left;line-height:25px;">功能菜单&nbsp;<font color=red>*</font>:</div>
				<div style="width:20px;float:left;">&nbsp;</div>
				<div style="width:300px;float:left;">
				<input type="hidden" id="chooseFunctionId">
				<select id="rootFunction">
					<c:forEach items="${rootFunction}" var="fun" >
					<option value="<c:out value="${fun.id}"/>"><c:out value="${fun.name}"/>(<c:out value="${fun.code}"/>)</option>
					</c:forEach>
				</select>
				</div>
			</td>
		</tr>
		<tr>
			<td style="font-size:13px;font-weight:bold;padding-bottom:4px;">功能树：</td>
			<td></td>
			<td style="font-size:13px;font-weight:bold;padding-bottom:4px;">已选功能：</td>
		</tr>
		<tr>
			<td valign="top">
				<div id="divfunctionTree" style="height: 360px; border: 1px #eaeaea solid; overflow-y: auto; overflow-x: hidden;">
					<ul id="functionTree"></ul>
				</div>
			</td>
			<td>
				<div style="text-align:center;">
					<x:button value="=>" cssStyle="min-width:50px;" id="divAdd" onclick="addData()"/>
					<br /> <br /><br />
					<x:button value="<=" cssStyle="min-width:50px;" id="divDelete" onclick="deleteData()"/>
					<br /> <br /><br />
					<x:button value="清空已选" cssStyle="min-width:50px;" id="divDeleteAll" onclick="doDeleteAll()"/>
					<br /> <br />
					<br /> <br />
					<br /> <br />
				</div>
			</td>
			<td valign="top">
				<div id="divfunctionTree2" style="height: 360px; border: 1px #eaeaea solid; overflow-y: auto; overflow-x: hidden;">
					<ul id="functionTree2"></ul>
				</div>
			</td>
		</tr>
	</table>
</div>