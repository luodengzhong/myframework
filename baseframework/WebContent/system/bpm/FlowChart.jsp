<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<link href='<c:url value="/themes/default/ui.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/raphael-min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/common.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.tooltip.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/bpm/FlowChart.js"/>' type="text/javascript"></script>
<style type="text/css">
*{font-family:"微软雅黑","宋体",Arial,sans-serif;}
.taskTip{font-size: 12px;}
.taskTip .taskTitle{text-align:center;}
.taskTip .taskLine{
	margin-top: 2px;
	border-top: 1px dotted #BBBBBB;
	text-align:center;
	height: 3px;
	clear: both;
}
.taskTip .taskTip-usercard{
    color: #737373;
    line-height: 17px;
    overflow: hidden;
    padding: 3px 0;
    white-space: normal;
}
</style>
</head>
<body>
<input type='hidden' id="bizId" value="<c:out value="${param.bizId}"/>">
<input type='hidden' id="getProcedureInfoUrl" value="<c:url value="/workflowAction!getProcedureInfo.ajax"/>">
<div id="flowChartDiv" style="top:0px;left:0px;position: absolute;z-index: 999;"></div>	
<script type="text/javascript">
var nodesList={};
try{
	nodesList=<c:out value="${nodeList}" escapeXml="false" />;
}catch(e){
   alert('数据错误,无法生成甘特图!');
}
</script>
</body>
</html>