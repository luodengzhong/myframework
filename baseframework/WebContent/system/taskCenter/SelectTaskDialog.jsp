<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,combox,grid,dateTime,tree" />
<script src='<c:url value="/system/taskCenter/SelectTaskDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/bpm/BpmUtil.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="任务" id="mainmenu" style="padding: 5px;">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;position: relative;"
						id="divTreeArea">
						<x:title title="我的事务" name="group" hideTable="#myselfTaskSearch" />
						<div
							style="overflow-x: hidden; overflow-y: auto; width: 97%; background-color: #fafafa; border: #d0d0d0 1px solid;"
							id="myselfTaskSearch">
							<div class="taskCenterSearch taskCenterChoose" taskKind="1">
								<span class="ui-icon-plus" style="margin-right: 2px;"></span>待办任务
							</div>
							<div class="taskCenterSearch" taskKind="4">
								<span class="ui-icon-last" style="margin-right: 2px;"></span>待发任务
							</div>
							<div class="taskCenterSearch" taskKind="5">
								<span class="ui-icon-next" style="margin-right: 2px;"></span>本人发起
							</div>
							<div class="taskCenterSearch" taskKind="3">
								<span class="ui-icon-next" style="margin-right: 2px;"></span>提交任务
							</div>
							<div class="taskCenterSearch" taskKind="2">
								<span class="ui-icon-query" style="margin-right: 2px;"></span>已办任务
							</div>
							<div class="taskCenterSearch" style="border: 0px;" taskKind="6"
								id="myselfCollect">
								<span class="ui-icon-folder" style="margin-right: 2px;"></span>我的收藏
							</div>
						</div>
						<div class="blank_div"></div>
						<x:title title="任务搜索" hideTable="#divConditionArea"
							id="titleConditionArea" />
						<form method="post" action="" id="queryMainForm">
							<div style="padding-left: 10px; height: 250px;"
								id="divConditionArea">
								<div class="row">
									<x:selectL name="dateRange" id="selectDateRange"
										list="dateRangeList" emptyOption="false" label="日期范围"
										width="180" />
								</div>
								<div id="customDataRange" class="row" style="display: none;">
									<x:inputL name="startDate" id="editStartDate" required="false"
										label="开始日期" wrapper="date" width="180" />
									<x:inputL name="endDate" id="editEndDate" required="false"
										label="开始日期" wrapper="date" width="180" />
								</div>
								<div class="row">
									<x:inputL name="viewTaskKindList" id="selectViewTaskKind"
										required="false" label="任务分类" width="180" />
									<x:select name="viewTaskKindList1" list="viewTaskKindList"
										id="selectViewTaskKind1" emptyOption="false"
										cssStyle="display:none;" />
								</div>
								<div class="row">
									<x:inputL name="searchContent" required="false"
										label="在主题、提交人、编号中搜索" readonly="false" width="180" />
								</div>
								<div class="row">
									<x:button value="查 询" id="btnQuery" onclick="query(this.form)" />
								</div>
							</div>
						</form>
					</div>
				</div>
				<div position="center"  style="padding: 3px;">
					<div id="maingrid" class="operating"></div>		
					<div class="blank_div"></div>
					<div id="selectedgrid" class="operating"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>