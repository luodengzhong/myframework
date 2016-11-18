<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/train/trainingChangeApply/TrainingChangeCourseSelect.js"/>' type="text/javascript"> 	</script>
<title></title>
</head>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  	<div id="layout">
				<div position="left" title="锁定班级列表" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="classtree"></ul>
					</div>
				</div>
			<div position="center" title="课程列表">
			<x:title title="搜索" hideTable="queryTable" />
				<form method="post" action="" id="queryMainForm">
				<div class='ui-form' id='queryTable'>
	    	    <x:hidden name="changeApplyId"/>
		         <x:inputL name="courseName" required="false" label="课程名称" maxLength="32"/>					
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="courseMaingrid" style="margin-left: 2px"></div>
		</div> 
	</div>
	</div>
	</div>
	</html>
	
