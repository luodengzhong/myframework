<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,layout,attachment" />
<script src='<c:url value="/biz/hr/evaluate/task/EvaluateGrade.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="evaluateStartPersonId"/>
			<div id="layout">
				<div position="left" title="待评价列表" id="mainmenu" style="padding: 5px;">
					<div style="overflow-x: hidden; overflow-y: auto; width:100%;" id="evaluateGradeList">
						<c:forEach items="${orgRelevanceList}" var="org">
							<div class="list_view">
								<a href="javascript:void(0);" id="${org.evaluateOrgRelevanceId}"  class="GridStyle" title="${org.orgUtilName}" status="${org.status}">
									<c:out value="${org.orgUtilName}" />
									<c:choose>
											<c:when test="${org.status==0||org.status==1}">
												(<font color="red">未评价</font>)
											</c:when>
											<c:otherwise>
												(<font color="green">已评价</font>)
											</c:otherwise>
									</c:choose>
								</a>
							</div>
						</c:forEach>
					</div>
				</div>
				<div position="center" title="详情" style="padding: 3px;" id="evaluateGradeCenter">
					<x:title title="填写说明" hideTable="#evaluateGradeTitleDiv" name="group"/>
					<div id="evaluateGradeTitleDiv">
						<table class='tableInput' style="width:98%">
							<thead>
								<tr class="table_grid_head_tr">
									<th style="width: 33%;">评价方式</th>
									<th style="width: 33%;">参评人员（均包含技术职务）</th>
									<th style="width: 34%;">评价范围</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td class="title">总部职能评价城市公司/商业经营管理集团/现代服务业事业部</td>
									<td class="title">总部各职能中心总经理助理级及以上人员</td>
									<td class="title">评价所有城市公司/商业经营管理集团/现代服务业事业部</td>
								</tr>
								<tr >
									<td class="title" rowspan="2">城市公司/商业经营管理集团/现代服务业事业部评价总部职能</td>
									<td class="title">城市公司/商业经营管理集团/现代服务业事业部副总经理级及以上人员</td>
									<td class="title">评价所有总部职能</td>
								</tr>
								<tr>
									<td class="title">城市公司/商业经营管理集团/现代服务业事业部总经理助理级至副经理级人员</td>
									<td class="title">评价总部对口职能及强相关职能</td>
								</tr>
								<tr>
									<td class="title" rowspan="2">总部职能评价总部职能</td>
									<td class="title">各职能中心副总经理级及以上人员</td>
									<td class="title">评价所有总部职能</td>
								</tr>
								<tr>
									<td class="title">各职能中心总经理助理级至副经理级人员</td>
									<td class="title">评价强相关职能</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div id="evaluateGradeDiv">
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>