<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="110px,160px,110px,200px" />
		<tr>
		<x:hidden name="trainingCourseId" />
		<x:hidden name="status" />
		<x:inputTD name="name" required="true" label="课程名称" maxLength="128" />
		<x:inputTD name="code" required="false" label="课程编号" maxLength="128" />
		</tr>
		<tr>
		<x:hidden name="courseOrganId" />
		<x:hidden name="courseCenterId" />
		<x:inputTD name="courseOrganName" required="true" label="所属公司"  wrapper="select" />
		<x:inputTD name="courseCenterName" required="true" label="中心/部门" wrapper="select" />
		</tr>
		<tr>
		<x:selectTD name="systemType" required="true" label="体系" />
		<x:inputTD name="period" required="false" label="标准学时" mask="nnn" value="1" />
		</tr>
		<tr>
		<x:hidden name="trainingTeacherId" />
		<x:inputTD name="trainingTeacherName" required="true" label="课程开发者"   />
		<x:selectTD name="teacherType" required="true" label="开发者类别"    />
		</tr>
		<tr>
		 <x:textareaTD name="outline" required="true" label="课程大纲" maxLength="512" colspan="3" rows="4" />
		</tr>
		<tr>
		 <x:textareaTD name="purpose" required="false" label="课程目标" maxLength="512" colspan="3" rows="4" />
		</tr>
		<tr>
		<x:textareaTD name="adjustArchives" required="false" label="适用学员" maxLength="256" colspan="3" rows="3" />
		</tr>
	</table>
	<div class="blank_div"></div>
	<x:fileList bizCode="trainingCourse" bizId="trainingCourseId" id="trainingCourseFileList" />
</form>