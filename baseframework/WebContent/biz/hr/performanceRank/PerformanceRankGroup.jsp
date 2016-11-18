<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script
	src='<c:url value="/biz/hr/performanceRank/PerformanceRankGroup.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="发起排名">
<%--                  <div  style="margin-top: 10px;color: red;font-size:18px"  align="center"  id="tipdiv">${warningtip}</div>
 --%>					<div class="subject">发起绩效排名</div>
					<form method="post" action="" id="submitForm">
						<table class='tableInput'
							style="width: 500px; margin: auto; margin-top: 3px;">
							<x:layout proportion="10%,20%" />

							<x:hidden name="performanceRankGroupId" />
							<x:hidden name="organId" />
							<x:hidden name="deptId" />
							<x:hidden name="positionId" />
							<x:hidden name="fillinDate" type="date" />
							<x:hidden name="personMemberId" />
							<x:hidden name="fullId" type="date" />
							<x:hidden name="organName" />
							<x:hidden name="deptName" />
							<x:hidden name="positionName" />
							<x:hidden name="personMemberName" />

							<x:hidden name="status" value="0" />

							<!-- 排名负责人 -->
							<x:hidden name="organizationId" />
							<x:hidden name="organizationName" />
							<x:hidden name="centerId" />
							<x:hidden name="centerName" />
							<x:hidden name="dptId" />
							<x:hidden name="dptName" />
							<x:hidden name="posId" />
							<x:hidden name="posName" />
							<x:hidden name="archivesId" />
							<x:hidden name="underAssessmentId" />
							<x:hidden name="underAssessmentName"/>
							<x:select name="performanceLevel" id="mainPerformanceLevel"
								dictionary="performanceLevel" cssStyle="display:none;"
								emptyOption="false" />
							<tr>
								<x:selectTD list="period" name="periodCode" emptyOption="false"
									required="true" label="考核周期" />
							</tr>
							<tr>
								<x:inputTD name="periodIndex" required="true" label="考核时间" />
							</tr>
							<tr>
								<x:inputTD name="staffName" required="true" label="排名负责人"
									wrapper="select" />
							</tr>
							<tr style="color:red;font-size:14px">
							<td  colspan="2">排名负责人请选择负责排名的领导</td>
							</tr>
						</table>
					</form>
					<div style="margin-left: 430px; float: left; margin-top: 20px">
						<x:button value="生成排名数据" onclick="createRankPerson()" />
						  <x:button value="查看排名数据" onclick="viewRankPerson()" />
					</div>
				</div>
			</div>
		</div>
</body>
</html>
