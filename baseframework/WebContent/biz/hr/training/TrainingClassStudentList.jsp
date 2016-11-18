<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="dialog,grid,dateTime,combox,tree"/>
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/hr/training/TrainingClassStudent.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
    <div id="mainWrapperDiv">
        <x:title title="班级学员"  name="group" />
        <x:hidden name="trainingSpecialClassId" />
         <form method="post" action="" id="queryMainForm">
			    <div class="ui-form" id="queryDiv" style="width:900px;">
		        <x:inputL name="staffName" required="false" label="姓名" maxLength="64"/>
		        <x:select name="tempArchivesState" list="archivesState" cssStyle="display:none;"/>
		        
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
        
        <div class="blank_div"></div>
        <div id="maingrid"  style="margin: 2px"></div>
    </div>
</div>
</body>
</html>
