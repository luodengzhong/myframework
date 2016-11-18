<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,date,tree,combox,attachment" />
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/echart/echarts-all-min-2.2.3.js"/>'   type="text/javascript"></script>
<script src='<c:url value="/biz/hr/evaluate/stat/EvaluateStatCharts.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="查询类别" id="mainmenu" style="padding:5px;">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<x:hidden name="taskId" id="chartsTaskId"/>
						<x:hidden name="evaluateStartId"/>
						<x:hidden name="evaluateReportId"/>
						<x:hidden name="attachmentConvertUrl"/>
						<x:hidden name="evaluateKind" id="chartsEvaluateKind"/>
						<c:forEach items="${fileList}" var="file">
							<div class="list_view">
								<a href="javascript:void(0);" id="file"  fileId="<c:out value="${file.id}" />" class="GridStyle">
									<c:out value="${file.fileName}" />
								</a>
							</div>
						</c:forEach>
						<div class="list_view">
								<a href="javascript:void(0);" id="cityCorp-HQ"  class="GridStyle">城市公司对总部各职能中心总体评价</a>
						</div>
						<div class="list_view">
								<a href="javascript:void(0);" id="HQ-HQ"  class="GridStyle">总部职能对总部各职能中心总体评价</a>
						</div>
						<div class="list_view">
								<a href="javascript:void(0);" id="HQ-cityCorp"  class="GridStyle">总部职能对城市公司、经营单位总体评价</a>
						</div>
					</div>
				</div>
				<div position="center">
					<div id="centerLayout">
						<div position="top" title="图表" >
							<div id="evaluateStatCharView" style="height:380px;"></div>
						</div>
						<div position="center"  id="previewInfoMainDiv">
							<div id="maingrid" style="margin: 2px;"></div>
						</div>
					</div>
					<div id="showAttachmentFile" style="position: absolute;top:0;left:0;z-index: 1000;width:100%;display: none;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
