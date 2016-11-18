<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator" prefix="decorator"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/page" prefix="page"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title><decorator:title default="蓝光协同"/></title>
		<meta http-equiv="expires" content="0">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<link href='<s:url value="/themes/default/style.css?a=2"/>' rel="stylesheet" type="text/css" />
		<link href='<s:url value="/themes/default/ui.css"/>' rel="stylesheet" type="text/css" />
		<script src='<s:url value="/javaScript/WEB_APP.js"/>' type="text/javascript"></script>
		<script src='<s:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
		<script src='<s:url value="/lib/jquery/jquery.json-2.4.min.js"/>' type='text/javascript'></script>
		<link href='<s:url value="/themes/ligerUI/Aqua/css/ligerui-layout.css"/>' type="text/css" rel="stylesheet"/>
    	<link href='<s:url value="/themes/ligerUI/Gray/css/layout.css"/>' rel="stylesheet" type="text/css" />
    	<script src='<c:url value="/common/TaskContext.jsp"/>' type="text/javascript"></script>
		<script src='<s:url value="/lib/ligerUI/core/base.js"/>' type="text/javascript"></script>
    	<script src='<s:url value="/lib/ligerUI/ligerui.all.js"/>' type="text/javascript"></script>
    	<link href='<s:url value="/themes/ligerUI/Aqua/css/ligerui-grid.css'"/> rel="stylesheet" type="text/css" />
		<link href='<s:url value="/themes/ligerUI/Gray/css/grid.css"/>' rel="stylesheet" type="text/css" />
		<script src='<s:url value="/lib/ligerUI/plugins/ligerGrid.js'"/> type="text/javascript"></script>
    	<script src='<s:url value="/javaScript/common.js?a=4"/>' type="text/javascript"></script>
		<script src='<s:url value="/lib/jquery/jquery.maskinput.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.maxlength.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.spinner.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.dragEvent.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.tooltip.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.combox.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.toolBar.js"/>' type="text/javascript"></script>
		<script src='<s:url value="/javaScript/chineseLetter.js"/>' type="text/javascript"></script>
		<script src='<s:url value="/lib/locale/task-lang-zh_CN.js"/>' type="text/javascript"></script>
		<script src='<s:url value="/javaScript/job.js?a=19"/>' type="text/javascript"></script>
		<script src='<s:url value="/system/bpm/AdvanceQueryDialog.js?a=7"/>' type="text/javascript"></script>		
		<script src='<s:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
		<decorator:head/>
		<script src='<s:url value="/common/OPpermission.jsp"/>' type="text/javascript"></script>
	    <script src='<s:url value="/javaScript/UICtrl.js?a=5"/>' type="text/javascript"></script>
	    <script src='<s:url value="/system/bpm/BpmUtil.js?a=6"/>' type="text/javascript"></script>
	</head>
	<body>
		<div id='screenOverLoading' class='ui-tab-loading' style='display:block;top:0;'></div>
		<font color='#ff0000'><s:actionerror/><s:fielderror/></font>
		<x:hidden name="bizID" id="jobPageBizID"/>
		<x:hidden name="procUnitId" id="jobPageProcUnitId"/>
		<x:hidden name="isReportModel"/>
		<div class="mainPanel">
			<div id="mainWrapperDiv">
				 <div id="jobPageLayout">
				 	<div position="top">
				 		<div class="ui-panelBar" id='toolBar' checkAccess="false" style="border-width:0;"></div>
				 	</div>
		            <div position="center" id="jobPageCenter" style="overflow-x: hidden; overflow-y: auto;">
		            	<x:hidden name="processDefinitionFile" />
				        <x:hidden name="processDefinitionKey" />
				        <x:hidden name="procUnitId" />
				        <div id="jobBizBillBody">
		            	<decorator:body/>
		            	</div>
		            	<div class="clear"></div>
		            	<c:if test="${param.useDefaultHandler!=0&&useDefaultHandler!=0}">
		            	<div style="margin:5px; width: 99%; " id="jobTaskExecutionList">
		            		<x:taskExecutionList procUnitId="procUnitId" defaultUnitId="Approve" bizId="bizId" />
		            	</div>
		            	</c:if>
		            </div>
		           <c:if test="${useRightHandlerPage!=false}">
		           <div position="right">
		            	<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="jobPageRight">
		            		<x:title title="关联任务" name="group"  />
		            		<div id="showHiTaskinstRelations"  style="overflow-x: hidden; overflow-y: auto; display: none"></div>
						</div>
		            </div>
		            </c:if>
		        </div> 
       		 </div>
        </div>
	</body>
</html>