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
<div class="ui-form" style="width: 99%;">
		<div class="subject">新开发课程审批表</div>
		<form method="post" action="" id="submitForm">
		 <div class="bill_info">
				<span style="float:left;">
					单据号码：<strong><c:out value="${billCode}"/></strong>
					&nbsp;&nbsp;
					申请日期：<strong><x:format name="fillinDate" type="date"/> </strong>
				</span>
				<span style="float:right;">
					申请人：<strong><c:out value="${personMemberName}"/></strong>
				</span>
		</div>
       <div class="blank_div"></div>
		<table class='tableInput' id='queryTable'>
			<x:layout proportion="100px,160px,100px,160px,100px,160px" />
			<x:hidden name="courseApplyId" />
			<x:hidden name="organId" />
			<x:hidden name="deptId" />
			<x:hidden name="positionId" />
			<x:hidden name="personMemberId" />
			<x:hidden name="fullId" />
			<x:hidden name="organName" />
			<x:hidden name="fillinDate" type="date"/>
			<x:hidden name="billCode" />
			<x:hidden name="deptName" />
			<x:hidden name="positionName" />
			<x:hidden name="personMemberName" />
		    <x:hidden name="trainingCourseId"/>
		    <x:hidden name="status"/>
		    <x:hidden name="courseOrganId"/>
	        <x:hidden name="courseCenterId"/>
	    <tr>
		<x:inputTD name="name" required="true" label="课程名称" maxLength="128"/>
        <x:inputTD name="code" required="false" label="课程编号" maxLength="128"/>
        <x:inputTD name="courseOrganName" required="true" label="所属公司"  />		
        </tr>
	    <tr>
	  	<x:inputTD name="courseCenterName" required="true" label="中心/部门"  />	
        <x:selectTD name="systemType" required="false" label="体系"   />		
        <x:inputTD name="period" required="false" label="标准学时" mask="nnn"  value="1"/>
        </tr>
	    <tr>
		<x:hidden name="trainingTeacherId"/>
		<x:hidden name="teacherType"/>
		<x:inputTD name="trainingTeacherName" required="true" label="课程开发者"    colspan="5"/>		
	    </tr>
        <tr>
        <x:textareaTD name="outline" required="false" label="课程大纲" maxLength="512"  colspan="5"  rows="4"/>
        </tr>
        <tr>
        <x:textareaTD name="purpose" required="false" label="培训目标" maxLength="512"  colspan="5"  rows="4"/>
        </tr>
        <tr>
        <x:textareaTD name="adjustArchives" required="false" label="适用学员" maxLength="256"  colspan="5"  rows="3"/>
        </tr>
	 </table>
	 <x:fileList bizCode="trainingCourse" bizId="trainingCourseId" id="trainingCourseFileList" />
  </form>
</div>
</body>
</html>