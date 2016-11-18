<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="dialog,grid,dateTime,combox,tree"/>
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/hr/training/TrainingClassStudentScore.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
    <div id="mainWrapperDiv">
        <x:title title="班级学员"  name="group" />
        <x:hidden name="trainingSpecialClassId" />
        <div class="blank_div"></div>
        <div id="maingrid"></div>
    </div>
</div>
</body>
</html>
