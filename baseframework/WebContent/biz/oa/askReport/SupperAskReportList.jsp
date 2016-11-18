<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<link href='<c:url value="/themes/default/button.css"/>' rel="stylesheet" type="text/css"/>
<x:base include="attachment,dialog" />
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/bpm/BpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/askReport/SupperAskReportList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<table class='tableInput'  style="width:98%" id="mainTable">
			<thead>
				<tr class="table_grid_head_tr">
					<th style="width:3%;">序号</th>
					<th style="width:30%;">报告</th>
					<th style="width:40%;" >附件</th>
					<th style="width:27%;">操作</th>
				</tr>
			</thead>
			<tbody id="supperAskReportTbody">
				<c:import url="/biz/oa/askReport/SupperAskReport.jsp" />
			</tbody>
		</table>
	</div>
</body>
</html>
