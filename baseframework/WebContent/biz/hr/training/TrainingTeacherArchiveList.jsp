<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="dialog,grid,dateTime,combox,tree"/>
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/hr/training/TrainingTeacherArchive.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
    <div id="mainWrapperDiv">
        <x:title title="师资档案" hideTable="queryDiv"/>
        <form method="post" action="" id="queryMainForm">
            <div class="ui-form" id="queryDiv" style="width:900px;">
                <x:hidden name="trainingTeacherId"/>
                <x:inputL name="staffName" required="false" label="讲师姓名" maxLength="32"/>
                <x:selectL name="teacherType" required="false" label="讲师类别" maxLength="32"/>
                <div  class="clear"></div>
                <x:selectL name="TLevel" list="teacherLevels" required="false" label="讲师级别" maxLength="32"/>
                <x:select name="teacherCriterias" list="teacherCriterias" emptyOption="false" cssStyle="display:none;"/>
                <x:select name="teacherHolidayCriterias" list="teacherHolidayCriterias" emptyOption="false" cssStyle="display:none;"/>
                <dl>
                    <x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
                    <x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
                </dl>
            </div>
        </form>
        <div class="blank_div"></div>
        <div id="maingrid"></div>
    </div>
</div>
</body>
</html>
