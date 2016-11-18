<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/taskEditUtil.js"/>'  type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/BatchAdjustTaskDetail.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/PlanAddDetailUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/common/FileUpUtil.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
				
				<div class="ui-panelBar" style="display:none;"  id='taskBar'>
						<ul>
							<li id="updateInstitutionTree"><a href="javascript:void(0);"
															   class="edit"><span>保存</span></a></li>
							<li class="line"></li>
						</ul>
					</div>
					
					
					
		<div class="subject" style="height: 30px;">计划刷版</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;">
				 单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp; 
				 制单日期：<strong><x:format name="fillinDate" type="date" /></strong>
			</span> 
			<span style="float: right; margin-right: 10px;">
			 调整人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99.9%;">
				<x:layout proportion="15%,55%,15%,15%"/>
				<tr>
					<x:hidden name="adjustAskId" />
					<x:hidden name="planTaskId" />
					<x:hidden name="parentTaskId" />
					<x:hidden name="organId" />
					<x:hidden name="deptId" />
					<x:hidden name="positionId" />
					<x:hidden name="personMemberId" />
					<x:hidden name="fullId" />
					<x:hidden name="organName" />
					<x:hidden name="fillinDate" type="date" />
					<x:hidden name="billCode" />
					<x:hidden name="deptName" />
					<x:hidden name="positionName" />
					<x:hidden name="personMemberName" />
					<x:hidden name="owningObjectId" />
					<x:hidden name="managerType"/>
					<x:hidden name="critical"/>
					<x:hidden name="isPlanningSpecialist"/>
					<x:hidden name="iscreate"/>
					<x:inputTD name="subject" required="true" label="主题" maxLength="42" />
					<%-- <x:inputTD name="managerTypeName" disabled="true" label="任务计划模块" maxLength="60"/> --%>
					<%-- <x:selectTD name="adjustTaskKind"   label="调整类型" required="true" /> --%>
					<x:selectTD name="status" required="false" label="审核状态" disabled="true" 
							maxLength="10"  />
					<%-- <x:radioTD list="#{'0':'计划调整','1':'终止计划'}" name="isAborted" required="true"  label="计划处理" /> --%>
				</tr>
				<tr>
					<x:textareaTD name="adjustReason" label="调整原因" colspan="3" rows="3" maxlength="200"/>
				</tr>
			</table>

		<x:fileList bizCode="oaTask" bizId="planTaskId" id="taskDetailFileList"/>
		
		<input type="file" id="upload" name="upload" style="display:none"/>
		<div class="blank_div"></div>
			<span style="float: left; margin-left: 10px;">
			刷版修改任务：
			</span> 
		<br/>
		<div id="relationGrid"></div>
		<div class="blank_div"></div>
			<span style="float: left; margin-left: 10px;">
			新增、未完新增任务：
			</span> 
			
		<br/>
		<div id="addmaingrid"></div>		
	</div>
</body>
</html>
