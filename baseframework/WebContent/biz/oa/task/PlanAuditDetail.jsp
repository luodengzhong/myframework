<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,attachment,tree,combox" />
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/PlanAuditDetail.js"/>' type="text/javascript"></script>
<script src='<c:url value="/common/FileUpUtil.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height: 30px;">
			<b style="font-size: 24px;">任务计划制定</b>
		</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;">
				 单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp; 
				 制单日期：<strong><x:format name="fillinDate" type="date" /></strong>
			</span> 
			<span style="float: right; margin-right: 10px;">
			 发送人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">	
			<table class='tableInput' style="width: 100%;">
				<x:layout  proportion="10%,40%,10%,10%,10%,10%,10%"/>
				<c:if test="${requestScope.relevanceTaskId!=null&&requestScope.relevanceTaskId!=''}">
				<tr>
					<x:inputTD name="relevanceTaskName" disabled="true" label="关联名称" maxLength="60"/>
					<x:inputTD name="relevanceTaskKindName" disabled="true" label="关联类别" maxLength="60"/>
					<td class='title'><span class="labelSpan">计划日期&nbsp;:</span></td>
					<td class='title' colspan="2" style="min-height: 22px">
						&nbsp;<x:format name="relevanceTaskStartDate" type="date" />&nbsp;&nbsp;
						至&nbsp;&nbsp;<x:format name="relevanceTaskFinishDate" type="date" />
					</td>
				</tr>
				</c:if>
				<tr>
				 <x:inputTD name="planFullName" required="false" disabled="true" label="全路径" maxLength="60" colspan="2"/>
				   <td colspan="2" class="title" style="text-align: center; min-height: 22px; line-height: 22px;"><x:checkbox name="iscelerity" label="是否快速流程"  /></td>
				  <td colspan="2" class="title" style="text-align: center; min-height: 22px; line-height: 22px;"><x:checkbox name="planAuditType" label="开盘前计划"  /></td>
					<%-- <td class='title'><span class="labelSpan">全路径&nbsp;:</span></td>
					<td class='title' colspan="3" style="min-height: 22px">
						&nbsp;<c:out value="${planFullName}" />
					</td> --%>
				</tr>
				<tr>
					<x:hidden name="owningObjectId" /> 	
					<x:hidden name="managerType"/>
					<x:hidden name="critical" /> 
					<x:hidden name="planAuditId" />
					<x:hidden name="relevanceTaskId" />
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
					<x:hidden name="planTaskId" />
					<x:hidden name="personMemberName" />
					<x:hidden name="taskKindId" />
					<x:hidden name="oataskKindId" />
					<x:hidden name="businessUrl" />
					<x:hidden name="businessId" />
					<x:hidden name="businessCode" />
					<x:hidden name="idsInfo" />					
					<c:if test="${empty businessUrl}">  
				    <x:inputTD name="subject" required="true" label="主题" colspan="4"  maxLength="60"/>
				     </c:if> 	
					<c:if test="${not empty businessUrl}">  
				    <x:inputTD name="subject" required="true" label="主题" colspan="2"  maxLength="60"/>		
				    <td colspan="2" style="text-align: center;">
					<a href='##' id="openPlanSource"  onclick='openPlanSource()'>计划来源-源单据</a>&nbsp;&nbsp;
					</td>								
					 </c:if> 	
				   <x:selectTD name="managerType" disabled="true"  label="任务计划模块" />	
				</tr>
				<%-- <tr>
					<x:hidden name="oaTaskKindId" />
					<x:inputTD name="taskKindName"  required="true" label="计划类别" wrapper="tree"/>
					<x:selectTD name="taskLevel"  label="计划级别" required="true" list="taskLevelKind"/>
				</tr> --%>
				<tr>
					<x:textareaTD name="remark" required="false" label="备注" rows="3" maxlength="200" colspan="6"/>
				</tr>
			</table>
		</form>
		<div class="blank_div"></div> 
		
        <c:if test="${not empty businessId && businessId == -99&& not empty businessCode && businessCode == -99  }"> 
		<div id="mainWrapperDiv">
	        <div id="layout">
		        <div position="center" id='tabPage' style="margin: 0; border: 0">
		              <div class="ui-tab-links">
		                  <ul style="left: 10px;">
		                      <li id="maingridInfo" divid="mainGridTab">计划制定</li>
		                      <li id="addAttentionInfo" divid="addAttentionTab">计划引用</li> 
		                  </ul>
		              </div>
		        </div>
		        <div class="ui-tab-content" style="overflow-y:auto;height:90%;border: 0; padding: 2px;">
			        <div id="mainGridTab" class="layout" style="overflow-y:auto;height: 92%;">
						<div id="maingrid"></div>
						<div class="blank_div"></div>		
			        </div>
		         	<div id="addAttentionTab" class="layout" style="height: 92%;display: none">
		                   <div class="blank_div"></div>
		                   <div id="addAttentiongrid"></div>
		            </div> 
		        </div>
	        </div>
    	</div>     	
        </c:if> 
        <c:if test="${ empty businessId || businessId != -99&& empty businessCode || businessCode != -99  }"> 		
		<div id="maingrid"></div>
		<div class="blank_div"></div>			  	
        </c:if> 	
		<input type="file" id="upload" name="upload" style="display:none"/>
		<x:fileList bizCode="planAudit" bizId="planAuditId" id="planAuditFileList"/>
	</div>
</body>
</html>
