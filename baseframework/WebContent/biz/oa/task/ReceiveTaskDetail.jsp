<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/taskEditUtil.js"/>'  type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/ReceiveTaskDetail.js"/>' type="text/javascript"></script>
</head>
<body>
    <div class="mainPanel">
        <div class="subject" style="height: 30px;">
            任务接收<c:out value="${subject}" />
        </div>
        <div class="bill_info">
            <span style="float: left; margin-left: 10px;">
                单据号码:<strong><c:out value="${billCode}" /></strong>&nbsp;&nbsp; 
                制单日期:<strong><x:format name="fillinDate" type="date" /></strong>
            </span>
            <span style="float: right; margin-right: 10px;">
                计划安排人：
                <strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
            </span>
        </div>
        <div class="ui-form">
            <x:radioL list="#{'1':'接受任务','0':'拒绝任务'}" name="isReceive" required="true"  label="计划处理类别" />
        </div>
        <div id="receiveTaskDiv">
            <form method="post" action="" id="submitForm">
                <table class='tableInput' style="width: 99.9%;">
                    <x:layout />
                    <tr>
                        <x:hidden name="receiveTaskId" />
                        <x:hidden name="parentTaskId" />
                        <x:select name="taskReportingWork" cssStyle="display:none;" id="mainTaskReportingWork" emptyOption="false" />
                        <x:inputTD name="taskName" required="true" label="计划名称" maxLength="100" colspan="3" />
                        <x:hidden name="taskKindId" />
                        <x:hidden name="businessCode" />
                        <x:inputTD name="taskKindName" required="true" label="计划类别" wrapper="tree"/>
                    </tr>
                    <tr>
                        <x:selectTD name="taskLevel" label="计划级别" required="true" list="taskLevelKind"/>
                        <x:inputTD name="startDate" label="计划开始时间" required="true" wrapper="date"/>
                        <x:inputTD name="finishDate" label="计划完成时间" required="true" wrapper="date"/>
                    </tr>
                    
                    <tr>
                        <x:hidden name="parentTaskId" />
                        <x:inputTD name="parentTaskName" label="父级计划名称" required="fasle" wrapper="select"/>
                        <x:inputTD name="parentStartDate" label="父级计划开始时间" readonly="true" mask="date"/>
                        <x:inputTD name="parentFinishDate" label="父级计划完成时间" readonly="true" mask="date"/>
                    </tr>
                    <tr>
						<x:selectTD name="planningCycle" label="计划周期" required="true" />
						<x:inputTD name="taskReportKindId" label="汇报类型" required="false" />
						<td colspan="2" class="title" style="padding-left: 20px;"><x:checkbox name="milestone" label="标记为里程碑" /></td>
					</tr>
					<tr>
                        <x:hidden name="dutyDeptId" />
                        <x:inputTD name="dutyDeptName" label="责任部门" required="true" wrapper="tree"/>
                        <x:hidden name="ownerId" />
                        <x:inputTD name="ownerName" label="责任人" required="true" wrapper="tree"/>
                        <td colspan="2" class="title" style="padding-left: 20px;"><x:checkbox name="summary" label="标记为摘要任务" /></td>
                    </tr>
                    <tr>
                        <x:selectTD name="constraintType" label="任务限制类型" />
                        <x:inputTD name="constraintDate" label="限制日期" wrapper="date" />
                        <td colspan="2" class="title" style="padding-left: 20px;"><x:checkbox name="critical" label="标记为关键任务" /></td>
                    </tr>
                    <tr>
                        <x:textareaTD name="remark" label="计划说明" colspan="5" rows="4" maxlength="200"/>
                    </tr>
                    <tr>
                        <td class='title'>
                            <span class="labelSpan">下游评价人&nbsp;:</span>
                        </td>
                        <td class="title" colspan="4">
                            <div id="managerShowDiv" style="min-height:25px;line-height:25px;"></div>
                        </td>
                        <td class="title">
                            <a href='##' class="GridStyle" onclick='showChooseManagerDialog()'>选择</a>&nbsp;&nbsp;
                            <a href='##' class="GridStyle" onclick='clearChooseArray("manager")'>清空</a>
                        </td>
                    </tr>
                    <tr>
                        <td class='title'>
                            <span class="labelSpan">执&nbsp;行&nbsp;人:</span>
                        </td>
                        <td class="title" colspan="4">
                            <div id="executorShowDiv" style="min-height:25px;line-height:25px;"></div>
                        </td>
                        <td class="title">
                            <a href='##' class="GridStyle" onclick='showChooseExecutorDialog()'>选择</a>&nbsp;&nbsp;
                            <a href='##' class="GridStyle" onclick='clearChooseArray("executor")'>清空</a>
                        </td>
                    </tr>
                </table>
            </form>
            <div id="taskExtendedField"></div>
            <div class="blank_div"></div>
            <x:fileList bizCode="oaTask" bizId="receiveTaskId" id="taskDetailFileList"/>
        </div>
        <div id="notReceiveTaskDiv" style="display:none;">
            <form method="post" action="" id="notReceiveSubmitForm">
                <table class='tableInput' style="width: 99.9%;">
                    <x:layout proportion="16%,84%" />
                    <tr>
                        <x:hidden name="receiveTaskId" />
                        <x:hidden name="taskName" />
                        <x:textareaTD name="reason" required="true" rows="4" label="拒绝原因" />
                    </tr>
                </table>
            </form>
        </div>
    </div>
</body>
</html>
