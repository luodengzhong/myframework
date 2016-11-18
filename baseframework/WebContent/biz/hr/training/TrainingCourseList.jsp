<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="dialog,grid,dateTime,tree,combox,layout,attachment"/>
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/hr/training/TrainingCourse.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
    <div id="mainWrapperDiv">
    	<div id="layout">
				<div position="left" title="课程类别" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="培训课程列表">
				<x:hidden name="parentId" id="treeParentId" />
				<x:hidden name="flagCode"  />
				<x:title title="搜索" hideTable="queryDiv" />
	   <div class="ui-form" id="queryDiv" style="width:900px;">
         <form method="post" action="" id="queryMainForm">
                <x:hidden name="trainingCourseId"/>
                <x:inputL name="name" required="false" label="课程名称" maxLength="128"/>
                <x:selectL name="status" required="false" label="课程状态" list="courseStatusValues"/>
                <x:selectL name="systemType" required="false" label="体系" />
                <div class="clear"></div>
                <x:inputL name="trainingTeacherName" required="false" label="课程开发者" maxLength="22"/>
                <dl>
                    <x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
                    <x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
                </dl>
         </form>
       </div>
        <div class="blank_div"></div>
        <div id="maingrid" style="margin: 2px"></div>
    </div>
</div>
</body>
</html>
