<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,combox,grid,dateTime,tree" />
<script src='<c:url value="/lib/locale/task-lang-zh_CN.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/system/taskCenter/TaskCenter.js?a=1"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/bpm/BpmUtil.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="showPublicDialog" style="display: none;" id="advancedQueryDiv">
		<div class="title">
			<span class="icos_title">&nbsp;</span>
			<span class="msg_title">高级搜索</span>
			<span class="icos"><a href="javascript:void(0)" hidefocus  class="close">&nbsp;</a></span>
		</div>
		<div class="content" style="height: 430px">
			<table style="width: 99%; margin: 2px;text-align: left;">
			<tr>
				<td  id="taskKind" style="width:50%;vertical-align:top;"  valign="top">
					<div style="height:420px;overflow-x:hidden;overflow-y:auto ">
					<x:title title=" 任务分类" name="group" hideTable="#myselfTaskSearch" />
					<div class="tableInput"  style="overflow-x: hidden; overflow-y: auto; width: 97%; background-color: #fafafa; border: #d0d0d0 1px solid;" id="myselfTaskSearch">
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
						<div class="taskCenterSearch" style="border: 0px;" taskKind="6" id="myselfCollect">
							<span class="ui-icon-folder" style="margin-right: 2px;"></span>我的收藏
						</div>
					</div>
					<x:title title="搜索方案" name="group" hideTable="#shortcutTaskSearch" id="titleShortcutTaskSearch" />
					<div class="tableInput"  style="overflow-x: hidden; overflow-y: auto; display: none; width: 97%; background-color: #fafafa; border: #d0d0d0 1px solid;" id="shortcutTaskSearch"></div>
					</div>
				</td>
				<td id="condition"  style="width:50%;vertical-align:top;" valign="top">
					<form method="post" action="" id="queryMainForm">
						<div style="padding-left: 10px; height: 250px;" id="divConditionArea">
					     <x:title title="通用条件"  name="group"  hideIndex ="0"  hideTable = "#commonCondition" id="titleConditionArea" />
							<div  class="tableInput"  style=" padding:5px;overflow-x: hidden; overflow-y: auto; width: 95%; background-color: #fafafa; border: #d0d0d0 1px solid;" id="commonCondition">
								<div class="row">
									<x:selectL name="dateRange" id="selectDateRange"
										list="dateRangeList" emptyOption="false" label="日期范围" width="180" />
								</div>
								<div id="customDataRange" class="row" style="display: none;">
									<x:inputL name="startDate" id="editStartDate" required="false"
										label="开始日期" wrapper="date" width="180" />
									<x:inputL name="endDate" id="editEndDate" required="false"
										label="结束日期" wrapper="date" width="180" />
								</div>
								<!--  
								<div class="row">
									<x:inputL name="viewTaskKindList" id="selectViewTaskKind"
										required="false" label="任务分类" width="180" />
									<x:select name="viewTaskKindList1" list="viewTaskKindList"
										id="selectViewTaskKind1" emptyOption="false"
										cssStyle="display:none;" />
								</div>
								-->
								<div class="row">
									<x:inputL name="searchContent" required="false" label="在主题、提交人、编号中搜索" readonly="false" width="180" />
								</div>
							</div>
							
							<x:title title="管理的组织" name="group"  hideIndex ="1" hideTable="#administrativeOrg" id="administrativeOrgTitle" />
							<div class="tableInput" style="overflow-x: hidden; overflow-y: auto; display: none; width: 97%; background-color: #fafafa; border: #d0d0d0 1px solid;" id="administrativeOrg">
								<div class="row"  style="overflow-x: hidden; overflow-y: auto; height:200px; width: 210px;">
									<ul id="orgTree">
									
						            </ul>
								</div>
							</div>
							
							<x:title title="流程" name="group"  hideIndex ="2"  hideTable="#proc" id="procTitle" />
							<div class="tableInput"  style="overflow-x: hidden; overflow-y: auto; display: none; width: 97%; background-color: #fafafa; border: #d0d0d0 1px solid;" id="proc">
								<div class="row"  style="overflow-x: hidden; overflow-y: auto; height:200px; width: 210px;">
									<ul id="procTree">
						            </ul>
								</div>
							</div>
							
							<x:title title="任务选项" name="group"  hideIndex ="3" hideTable="#queryOpition" id="queryOpitionTitle" />
							<div   class="tableInput"  style="overflow-x: hidden; overflow-y: auto; display: none; width: 97%; background-color: #fafafa; border: #d0d0d0 1px solid;" id="queryOpition">
								<div class="row"  >
								   <x:checkbox  name="onlyQueryApplyProcUnit"
											cssStyle="margin-left:15px;" label="只查询流程发起环节"></x:checkbox>	<br>		
									<x:checkbox  name="singleProcInstShowOneTask"
	                                       cssStyle="margin-left:15px;" label="单一流程只显示一个任务" ></x:checkbox>						   
								</div>
							</div>
							
							<div class="row">
								<x:button value="查 询" id="btnQuery" onclick="query(this.form)" />
								<x:button value="保存查询方案" id="btnQuery" onclick="saveQueryScheme(this.form)" />
							</div>
						</div>
					</form>
				</td>
			</tr>
			</table>
		</div>
	</div>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="ui-panelBar" id='taskBar'><span style="width:120px;float: left;" id="procKindChoose">&nbsp;</span></div>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
	<div class="ui_css_navigation_bar" id="uiCssNavigationBar">
		<div class="ui_css_navigation_bar_btn">
			<h2><a href="javascript:;" id="uiCssNavigationTitle">流程任务分类</a></h2>
			<ul  id="uiCssNavigationBarUl"></ul>
		</div>
	</div>
</body>
</html>