<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,layout,attachment" />
<script src='<c:url value="/biz/hr/evaluate/stat/EvaluateOrgStat.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="evaluateStartId"/>
			<div id="maingridDiv">
				<div style="color:red;padding-left: 30px">如果没有数据请执行重新统计!</div>
				<div id="maingrid" style="margin: 2px;"></div>
			</div>
			<div id="statScoreDetailGridDiv" style="display: none">
				<div class="ui-form" style="width:1200px;" id="statScoreDetailType">
					  <x:radioL list="#{'0':'全部显示','1':'总部职能评价城市公司/专业公司/事业部','2':'城市公司/专业公司/事业部评价总部职能','3':'总部职能评价总部职能'}" name="radio1" value="0"  label="显示类别"  labelWidth="70" width="900"/>
				</div>
				<div id="statScoreDetailGrid" style="margin: 2px;"></div>
			</div>
			<div id="indexAvgScoreDetailDiv" style="display: none">
				 <div  id='indexAvgScoreDetailToolBar' style="margin: 2px;"></div>
				 <div id="divTreeArea" style="overflow-x: hidden; overflow-y: auto; width: 100%;">
					<div id="indexAvgScoreDetail" style="margin: 2px;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>