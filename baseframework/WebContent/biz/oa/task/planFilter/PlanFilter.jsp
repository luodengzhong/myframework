<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<link href='<c:url value="/lib/Gantt/scripts/miniui/themes/icons.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/lib/Gantt/scripts/miniui/themes/default/miniui.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/lib/Gantt/scripts/miniui/themes/gray/skin.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/lib/Gantt/css/core.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/Gantt/scripts/miniui/miniui.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/miniui/locale/zh_CN.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/ganttJS/ProjectMenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/ganttJS/TableColumns.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/ganttJS/TaskWindow.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/ganttJS/services.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/ThirdLibs/swfobject/swfobject.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/taskDetailUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/taskEditUtil.js"/>'  type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/planFilter/PlanFilter.js"/>'  type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
					<!-- 使用两个页签,一个使用选择计划类型,计划节点和目录,一个用于计划筛选,
					计划筛选使用计划后台的模式,通过计划的树结构节点,计划的类型常用搜索条件进行查找 ,并引用到列表中,引用不支持树形结构引用-->
		<div id="mainWrapperDiv">
		<div id="layout">
				<div position="left" title="计划所属对象">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;position: relative;" id="divTreeArea">
						 
						 <x:title id = "orgImporttitle" title="重要方案" name="group" hideTable="#orgImportTreeSearch" />
	                 	<div style="width: 97%;margin-left:3px; background-color: #fafafa;"  id="orgImportTreeSearch">
						<div style="overflow-x: hidden; overflow-y: auto; "
							id="orgImportTreeArea">
							<ul id="orgImportTree">
							</ul>
						</div>
						</div> 
						
						<x:title id = "funLeadOrgtitle" title="职能牵头" name="group" hideTable="#FunLeadOrgTreeSearch" />
	                 	<div style="width: 97%;margin-left:3px; background-color: #fafafa;"  id="FunLeadOrgTreeSearch">
						<div style="overflow-x: hidden; overflow-y: auto; "
							id="FunLeadOrgTreeArea">
							<ul id="FunLeadOrgTree">
							</ul>
						</div>
						</div> 
						
						<x:title id = "myOrgtitle" title="月度重点" name="group" hideTable="#myOrgSearch" />
	                 	<div style="width: 97%;margin-left:3px; background-color: #fafafa;"  id="myOrgSearch">
						<div style="overflow-x: hidden; overflow-y: auto; "
							id="divTreeArea">
							<ul id="orgTree">
							</ul>
						</div>
						</div> 
						
						<x:title id = "execIndivTasktitle" title="高管个人" name="group" hideTable="#ExecIndivTaskTreeSearch" />
	                 	<div style="width: 97%;margin-left:3px; background-color: #fafafa;"  id="ExecIndivTaskTreeSearch">
						<div style="overflow-x: hidden; overflow-y: auto; "
							id="ExecIndivTaskTreeArea">
							<ul id="ExecIndivTaskTree">
							</ul>
						</div>
						</div> 
						
						<%-- <x:title id = "auditUperVisiontitle" title="审计督办" name="group" hideTable="#auditUperVisionTreeSearch" />
	                 	<div style="width: 97%;margin-left:3px; background-color: #fafafa;"  id="auditUperVisionTreeSearch">
						<div style="overflow-x: hidden; overflow-y: auto; "
							id="auditUperVisionTreeArea">
							<ul id="auditUperVisionTree">
							</ul>
						</div>
						</div>  --%>
						
						<x:title id="myProtitle" title="项目计划" name="group" hideTable="#myProSearch" />
	                 	<div style="width: 97%;margin-left:3px; background-color: #fafafa; " id="myProSearch">
						<div class='ui-form' id='queryTable'>
							<x:inputL name="projectName" required="false" label="项目" labelWidth="35" width="100" wrapper="select" />
						</div>
						<div style="overflow-x: hidden; overflow-y: auto; "
							id="divProTreeArea">
							<ul id="proTree">
							</ul>
						</div>
						</div>	 
						
						<x:title id="myBusiProtitle" title="商业运营计划" name="group" hideTable="#myBusiProSearch" />
	                 	<div style="width: 97%;margin-left:3px; background-color: #fafafa; " id="myBusiProSearch">
						<div class='ui-form' id='queryTable'>
							<x:inputL name="projectBusiName" required="false" label="项目" labelWidth="35" width="100" wrapper="select" />
						</div>
						<div style="overflow-x: hidden; overflow-y: auto; "
							id="divBusiProTreeArea">
							<ul id="proBusiTree">
							</ul>
						</div>
						</div>	 
						 <x:title id="deptCollection" title="计划分类" name="group" hideTable="#myselfTaskSearch" />
	                 	<div style="width: 97%;margin-left:3px; background-color: #fafafa; " id="myselfTaskSearch">	
								<div class="taskCenterSearch" queryKind="99" managerType="41"  >
								<span class="ui-icon-query" style="margin-right: 2px;"></span>董事长下达计划
								</div>
								<div class="taskCenterSearch" queryKind="99" managerType="42"  >
									<span class="ui-icon-query" style="margin-right: 2px;"></span>总裁下达计划
								</div>
								<div class="taskCenterSearch" queryKind="99" managerType="61"  >
									<span class="ui-icon-query" style="margin-right: 2px;"></span>经营目标计划
								</div>
								<div class="taskCenterSearch" queryKind="99"  managerType="64"  >
									<span class="ui-icon-query" style="margin-right: 2px;"></span>策略类计划
								</div>
								<div class="taskCenterSearch" queryKind="99"  managerType="65"   >
									<span class="ui-icon-query" style="margin-right: 2px;"></span>督办类计划
								</div>
								<div class="taskCenterSearch" queryKind="99"   managerType="-99"  >
									<span class="ui-icon-query" style="margin-right: 2px;"></span>未分组计划
								</div>
								 <div style="display: none;border-top: #d0d0d0 1px solid;" id="shortcutSearch"></div>
						    </div>  
				     </div>
				</div>
				<div position="center" style="border:0px;">             	
							<x:hidden name="pageType" value = "facestage"/>
							<x:hidden name="pageHigheType" value = "facestage"/>   	
							<x:hidden name="managerType"  />	                  	
							<x:hidden name="owningObjectId"  value = "-99" />	    	
        <x:title title="计划搜索" id="queryDivtitle" name="group" hideTable="#queryDiv"/>
            <div class="ui-form" id="queryDiv">
        <form method="post" action="" id="queryMainForm">
            
				<%-- 	<form method="post" action="" id=queryMainForm>	    
						<x:title title="计划搜索" id = "myplantitle"  name="group" hideTable="queryDiv" />
						<div class="ui-form"  id="queryDiv" style="width:900px;">           --%>       	
							<x:hidden name="managerTypeBase"  />	                  	
							<x:hidden name="owningObjectIdBase"  value = "-99" />	    	
							<x:hidden name="planTaskId"/>	            	
							<x:hidden name="queryKind" value = "99"/>
							
							<div id="customDataRange" class="row" style="display: none;">
								<x:inputL name="startDate" id="editStartDate" required="false" label="上线开始日期" wrapper="date" width="180" />
								<x:inputL name="endDate" id="editEndDate" required="false"  label="上线结束日期" wrapper="date" width="180" />
							</div>
							<div id="customEndDataRange" class="row" style="display: none;">
								<x:inputL name="endStartDate" required="false" label="完成开始日期" wrapper="date" width="180" />
								<x:inputL name="endEndDate" required="false"  label="完成结束日期" wrapper="date" width="180" />
							</div>
									
							<x:selectL name="dateRange" id="selectDateRange" list="dateRangeList" emptyOption="false" label="开始日期范围" width="180" />
							
							<x:selectL name="endDateRange" id="selectEndDateRange" list="dateRangeList" emptyOption="false" label="结束日期范围" width="180" />
							
				 			<x:selectL name="taskStatus" id="taskStatus"  list="#{'0':'执行中','1':'已完成','2':'已中止','3':'未完','-10':'全部'}"  emptyOption="false" label="计划状态" width="180" />
									
							<x:selectL name="taskLevelKind"  id="mainTaskLevelKind" list="taskLevelKind" label="计划级别" width="180" />
						
							<x:hidden name="taskKindId" id="selectViewTaskKindId"/><%-- 
							<x:inputL name="taskKindNmae" id="selectViewTaskKind" required="false" label="计划分类" width="180" wrapper="tree"/> --%>
						
							<x:inputL name="keywords" required="false" 	label="关键字" readonly="false" width="180" />
							
									
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								<x:button value="重 置" onclick="resetForm(this.form)" />
							</dl>
					</form>
						</div>
					<div id="ganttView"></div>
					<%-- <div class="bill_info">
							<span style="float: left; margin-left: 10px;">
								 单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp; 
								 制单日期：<strong><x:format name="fillinDate" type="date" /></strong>
							</span> 
							<span style="float: right; margin-right: 10px;">
							 调整人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
							</span>
						</div>	--%>
				</div>

				<div position="right">         
					<div id="chooseFilterTaskGrid"></div> 
				</div>
					
			</div>
		
			
					

	
		</div>
	</div>
</body>
</html>
