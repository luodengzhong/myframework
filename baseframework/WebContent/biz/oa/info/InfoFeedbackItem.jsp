<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox" />
	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/biz/oa/info/InfoFeedbackItem.js"/>' type="text/javascript"></script>
	<style>html{overflow:hidden;}</style>
</head>
<body>
	<div class="mainPanel">
		<div style="padding: 5px;line-height: 20px;">
			<x:hidden name="infoPromulgateId" />
			<x:hidden name="modifFlag" />
			您可以根据实际需要,为即将发布的信息定义一些反馈项,收集大家对此信息的意见,看法或特定的调查结果,然后进行统计或分析。
			</br>
			当"显示类型"为"单项选择"或"多项选择"时,可设定"选择范围";"选择范围"间用逗号","(英文)分割,如"1,2,3,4,5"，"A,B,C,D"。
		</div>
		<div id="infoFeedbackTemplateItemGrid"></div>
	</div>
</body>
</html>