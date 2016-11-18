<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<x:base include="dialog" />
<link href='<c:url value="/themes/default/jquery.dragDesk.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/ui/jquery.ui.core.min.js"/>' type='text/javascript'></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.widget.min.js"/>' type='text/javascript'></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.mouse.min.js"/>' type='text/javascript'></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.draggable.min.js"/>' type='text/javascript'></script>
<script src='<c:url value="/lib/jquery/jquery.dragDesk.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/HomePage.js?a=2"/>' type="text/javascript"></script>
<script src='<c:url value="/system/bpm/BpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/echart/echarts-all-min-2.2.3.js"/>'   type="text/javascript"></script>
<title>工作台</title>
</head>
<body>
	<table border="0" cellpadding="0" cellspacing="10" width="100%"
		id="parentTable">
		<tr>
			<td width="75%" class='dragDesk-frameTd'>
				<div id='needTimingWaitingTasks' class="dragDesk-div">
					<div class='dragDesk-title' more="true" refresh="true" 日
						id="needTimingWaitingTasksTitle">
						<span class='title'><img src="<c:url value="/themes/default/images/icons/list_security.gif"/>" alt=""></img>&nbsp;&nbsp;计时待办任务</span>
					</div>
					<div class='dragDesk-content' id="needTimingWaitingTasksComponent">
						<c:forEach items="${needTimingTasks}" var="task">
							<div class="container_list">
								<span class="message">
								 <a href='javascript:void(null);'
									class="tLink"
									processDefinitionKey="<c:out value="${task.processDefinitionKey}"/>"
									procUnitId="<c:out value="${task.taskDefKey}"/>"
									catalogId="<c:out value="${task.catalogId}"/>"
									taskKindId="<c:out value="${task.kindId}"/>"
									procInstId="<c:out value="${task.procInstId}"/>"
									procUnitHandlerId="<c:out value="${task.procUnitHandlerId}"/>"
									bizId="<c:out value="${task.bizId}"/>"
									bizCode="<c:out value="${task.bizCode}"/>"
									taskId="<c:out value="${task.id}"/>"
									statusId="<c:out value="${task.statusId}"/>"
									name="<c:out value="${task.name}"/>"
									url="<c:out value="${task.executorUrl}"/>">
										<c:out value="${task.description}" /><c:if test="${task.statusId=='sleeping'}">(已暂缓)</c:if>
								</a>
								</span> 
								<span class="person"> 
									<c:out value="${task.creatorPersonMemberName}" /> 
									<c:out value="${task.startTime}" />
								</span>
							</div>
						</c:forEach>
						<c:if test="${needTimingTasks!= null && fn:length(needTimingTasks) > 14}">
							<div class="container_list">
								<span class="person"> 
									<a href="javascript:openWaitingTasksTab();" class="moreBtn" title="更多...">&nbsp;</a>
								</span>
							</div>
						</c:if>
					</div>
				</div>
				<div id='notNeedTimingWaitingTasks' class="dragDesk-div">
					<div class='dragDesk-title' more="true" refresh="true" id="notNeedTimingWaitingTasksTitle">
						<span class='title'><img src="<c:url value="/themes/default/images/icons/list_settings.gif"/>" alt=""></img>&nbsp;&nbsp;不计时待办任务</span>
					</div>
					<div class='dragDesk-content' id="notNeedTimingWaitingTasksComponent">
						<c:forEach items="${notNeedTimingTasks}" var="task">
							<div class="container_list">
								<span class="message">
								 <a href='javascript:void(null);'
									class="tLink"
									processDefinitionKey="<c:out value="${task.processDefinitionKey}"/>"
									procUnitId="<c:out value="${task.taskDefKey}"/>"
									catalogId="<c:out value="${task.catalogId}"/>"
									taskKindId="<c:out value="${task.kindId}"/>"
									procInstId="<c:out value="${task.procInstId}"/>"
									procUnitHandlerId="<c:out value="${task.procUnitHandlerId}"/>"
									bizId="<c:out value="${task.bizId}"/>"
									bizCode="<c:out value="${task.bizCode}"/>"
									taskId="<c:out value="${task.id}"/>"
									statusId="<c:out value="${task.statusId}"/>"
									name="<c:out value="${task.name}"/>"
									url="<c:out value="${task.executorUrl}"/>">
									 <c:out value="${task.description}" />
								</a>
								</span> 
								<span class="person">
								      <c:out value="${task.creatorPersonMemberName}" />
								      <c:out value="${task.startTime}" />
								</span>
							</div>
						</c:forEach>
						<c:if test="${notNeedTimingTasks!= null && fn:length(notNeedTimingTasks) > 14}">
							<div class="container_list">
								<span class="person"> <a href="javascript:openWaitingTasksTab();" class="moreBtn" title="更多...">&nbsp;</a></span>
							</div>
						</c:if>
					</div>
				</div>
				<div id='trackTasks' class="dragDesk-div">
					<div class='dragDesk-title' more="true" refresh="true" id="trackingTasksTitle">
						<span class='title'><img src="<c:url value="/themes/default/images/icons/list_links.gif"/>" alt=""></img>&nbsp;&nbsp;跟踪事项</span>
					</div>
					<div class='dragDesk-content' id="trackingTasksComponent">
						<c:forEach items="${trackingTasks}" var="task">
							<div class="container_list">
								<span class="message"> 
								<a href='javascript:void(null);'
									class="tLink" procInstId="<c:out value="${task.procInstId}"/>"
									procInstId="<c:out value="${task.procInstId}"/>"
									procUnitId="<c:out value="${task.taskDefKey}"/>"
									catalogId="<c:out value="${task.catalogId}"/>"
									taskKindId="<c:out value="${task.kindId}"/>"
									taskId="<c:out value="${task.id}"/>"
									bizId="<c:out value="${task.bizId}"/>"
									bizCode="<c:out value="${task.bizCode}"/>"
									name="<c:out value="${task.name}"/>"
									statusId="<c:out value="${task.statusId}"/>"
									url="<c:out value="${task.executorUrl}"/>"> <c:out
											value="${task.description}" />
								</a>
								</span> 
								<span class="person"> 
									<c:out value="${task.creatorPersonMemberName}" /> 
									<c:out value="${task.startTime}" />
								</span>
							</div>
						</c:forEach>
						<c:if test="${trackingTasks!= null && fn:length(trackingTasks) > 14}">
							<div class="container_list">
								<span class="person"> <a href="javascript:openTrackingTasksTab();" class="moreBtn" title="更多...">&nbsp;</a></span>
							</div>
						</c:if>
					</div>
				</div>
				<div id='otherSystemTemplate' class="dragDesk-div">
					<div class='dragDesk-title'  refresh="true" id="otherSystemTasks">
						<span class='title'><img src="<c:url value="/themes/default/images/icons/application.png"/>" alt="" />&nbsp;&nbsp;其它系统待办</span>
					</div>
					<div class='dragDesk-content' id="otherSystemTasksComponent">
					</div>
				</div>
				<div id='taskPlanView' class="dragDesk-div">
					<div class='dragDesk-title'  id="taskPlanViewTitle">
						<span class='title'><img src="<c:url value="/themes/default/images/icons/list_users.gif"/>" alt="" />&nbsp;&nbsp;我的任务计划</span>
					</div>
					<div class='dragDesk-content' id="taskPlanViewComponent">
						<div style="padding: 5px;">
							<span style="float: left;margin-left:30px;margin-bottom: 5px;margin-top:5px; " id="radioDateRangeTypeSpan">
								您有<font color="red" id="oaTaskPlanCount"><c:out value="${requestScope.OATaskPlan.count}" /></font>条待办任务计划&nbsp;&nbsp;
								<label><input type="radio" name="radioDateRange"   checked="true" value="1"  id="reportingDateRangeAll"/>&nbsp;全部</label>
								<label><input type="radio" name="radioDateRange"  value="2" />&nbsp;今天</label>
								<label><input type="radio" name="radioDateRange"    id="reportingDateRangeWeek" value="4"/>&nbsp;本周</label>
								<label><input type="radio" name="radioDateRange"   value="6" />&nbsp;本月</label>
							</span>
							<span style="float:right;margin-right:30px;margin-bottom: 5px;margin-top:5px;" id="radioTaskPlanTypeSpan">
								<label><x:hidden   name="radioTaskType"   value="all"  />
								<!-- <input type="radio" name="radioTaskType"  checked="true" value="all" id="reportingWorkAll"/> &nbsp;全部-->
								</label>
								<!-- <label><input type="radio" name="radioTaskType"  value="quarter"/>&nbsp;季度计划</label>
								<label><input type="radio" name="radioTaskType"  value="month"/>&nbsp;月度计划</label>
								<label><input type="radio" name="radioTaskType"  value="week"/>&nbsp;周计划</label> -->&nbsp;&nbsp;
								 <a href="javascript:openTaskCenterPage(0);" class="moreBtn" title="更多..." style="margin:0px;">&nbsp;</a>
							</span>
						</div>
						<table class='tableInput'  style="width:99%;margin: 5px;">
							<thead>
								<tr class="table_grid_head_tr">
									<th style="width:12%;">类别</th>
									<th style="width:29%;">工作名称</th>
									<th style="width:19%;">完成标准</th>
									<th style="width:11%;">开始时间</th>
									<th style="width:11%;">完成时间</th>
									<th style="width:8%;">责任人</th>
									<th style="width:5%;">选项</th>
									<th style="width:5%;">详细</th>
								</tr>
							</thead>
							<tbody id="OATaskPlanTbody" >
							<c:forEach items="${requestScope.OATaskPlan.datas}" var="obj" varStatus="rs">
								<tr style="min-height: 25px;" class="listColor listColor<c:out value="${rs.index%2}" />">
									<td title="<c:out value="${obj.reportingWorkViewText}" />"><c:out value="${obj.reportingWorkViewText}" /></td>
									<td title="<c:out value="${obj.taskName}" />"><c:out value="${obj.taskName}" /></td>
									<td title="<c:out value="${obj.finishStandard}" />"><c:out value="${obj.finishStandard}" /></td>
									<td><fmt:formatDate value="${obj.startDate}" type="both" pattern="yyyy-MM-dd" /></td>
									<td><fmt:formatDate value="${obj.finishDate}" type="both" pattern="yyyy-MM-dd" /></td>
									<td title="<c:out value="${obj.ownerName}" />"><c:out value="${obj.ownerName}" /></td>
									<td title="<c:out value="${obj.planPrivateKindTextView}" />"><c:out value="${obj.planPrivateKindTextView}" /></td>
									<td><a href="##" class="GridStyle" id="<c:out value="${obj.taskId}" />">查看</a></td>
								</tr>
							</c:forEach>
							</tbody>
						</table>
					</div>
				</div>
			</td>
			<td width="25%" class='dragDesk-frameTd'>
				<div id='processStatCharMainDiv' class="dragDesk-div" style="display: none">
					<div class='dragDesk-title'  id="processStatCharTitle">
						<span class='title'><img src="<c:url value="/themes/default/images/icons/chart_bar.png"/>" alt="" />&nbsp;&nbsp;<span id="processStatCharName">个人已处理任务平均时效排名</span></span>
					</div>
					<div class='dragDesk-content'  id="processStatCharComponent" >
						<div class="tabLinksClearfix" id="processStatCharTabLinks">
							<a  class="more" href="##">更多&gt;&gt;</a>
							<div class="pageLink">
								<span class="page active" id="person_done_avg" title="个人已处理任务平均时效排名">1</span>
								<span class="page"  id="person_todo_total" title="个人未处理任务数排名">2</span>
								<span class="page"  id="org_todo_total" title="机构未处理任务数排名" >3</span>
								<span class="page"  id="org_done_avg" title="机构已处理任务平均时效排名">4</span>
							</div>
						</div>
						<div id="processStatCharView" class="charView"></div>
					</div>
				</div>
				<div id='notifications' class="dragDesk-div">
					<div class='dragDesk-title' refresh="true" id="messageRemindTitle">
						<span class='title'><img src="<c:url value="/themes/default/images/icons/icon_email.gif"/>" alt=""></img>&nbsp;&nbsp;消息提醒</span>
					</div>
					<div class='dragDesk-content' id="messageRemindContent">
						<c:forEach items="${reminds}" var="remind" varStatus="rs">
							<div class="container_list listColor<c:out value="${rs.index%2}" />">
								<span class="message">
								 <a href='javascript:void(null);'
									class="tLink" code="<c:out value="${remind.code}"/>"
									name="<c:out value="${remind.name}"/>"
									openKind="<c:out value="${remind.openKind}"/>"
									url="<c:out value="${remind.remindUrl}"/>"> 
									<c:out value="${remind.remindTitle}" escapeXml="false" />
								</a>
								</span>
								<div class="bottomLine"></div>
							</div>
						</c:forEach>
					</div>
				</div>
				
				<div id='infoPromulgates' class="dragDesk-div">
					<div class='dragDesk-title' more="<c:out value="${infoPermissions}" />" refresh="<c:out value="${infoPermissions}" />"  id="infoPromulgateTitle">
						<span class='title'><img src="<c:url value="/themes/default/images/icons/comment_yellow.gif"/>" alt="" />&nbsp;&nbsp;信息中心</span>
					</div>
					<div class='dragDesk-content' id="infoPromulgateComponent">
						<c:forEach items="${infos}" var="info" varStatus="is">
							<div class="infoWrapper listColor<c:out value="${is.index%2}" />"  id="<c:out value="${info.infoPromulgateId}" />">
								<div class="leftImg"><img width="32" height="32" src="<c:url value="${info.imgPath}"/>" /></div>
								<div class="rightContent">
									<div class="infoTitle"><c:out value="${info.subject}" /></div>
									<div class="infoAlt">
										 <c:out value="${info.personMemberName}" /> 
										 <fmt:formatDate value="${info.finishTime}" type="both" pattern="yyyy-MM-dd HH:mm" />
									</div>
								</div>
							</div>
						</c:forEach>
						<c:if test="${infos!= null && fn:length(infos) > 5}">
							<div class="container_list">
								<span class="person"> <a href="javascript:openInfoPromulgateTab();" class="moreBtn" title="更多...">&nbsp;</a></span>
							</div>
						</c:if>
					</div>
				</div>
			</td>
		</tr>
	</table>
	<!-- 
	<div id='appInfoView' class="dragDesk-div">
					<div class='dragDesk-title'>
						<span class='title'>
							<img src="<c:url value="/themes/default/images/icons/phone_sound.png"/>" alt="" />&nbsp;&nbsp;蓝光移动办公</span>
					</div>
					<div class='dragDesk-content'>
						<h1 style="font-size: 14px;margin: 5px;">蓝光移动办公Android（安卓）版</h1>
						<div style='line-height: 22px;min-height:145px;margin: 5px;padding-right: 145px;background: url(<c:url value="/images/view_qr_code.png"/>) no-repeat right center;'>
							<div>
								安装后以<font color="Tomato">OA账号/密码</font>登录。
							</div>
							<div style="color: #7d7d7d;">IOS版本稍后发布，若想试用请联系黄自鹏(18782212810)安装。</div>
							<div style="text-align: center">
								<a href="http://app.brc.com.cn:8080/BrcOa.apk" hidefocus
									class="orangeBtn" target="_blank"><span>下载到电脑</span></a>
							</div>
						</div>
					</div>
				</div>
	-->
</body>
</html>