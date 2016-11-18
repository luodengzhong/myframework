<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree"/>
    <script src='<c:url value="/biz/demo/hr/LeaveBill.js"/>'
            type="text/javascript"></script>
      <script src='<c:url value="/biz/masterdata/util/projectUtil.js"/>'
            type="text/javascript"></script>
</head>
<body>
<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
    <form method="post" action="" id="submitForm">
        <div style="margin: 0 auto;">
            <x:hidden name="id" id="id"/>
            <x:hidden name="organId"/>
            <x:hidden name="deptId"/>
            <x:hidden name="positionId"/>
            <x:hidden name="personMemberId"/>
            <x:hidden name="positionName"/>
            <x:hidden name="deputyId"/>
            <x:hidden name="deputyDeptId"/>
            <x:hidden name="deputyDeptName"/>
            <x:hidden name="processDefinitionKey"/>
            <x:hidden name="procUnitId"/>

            <div class="subject">请 休 假 申 请 单</div>
            <table class='tableInput' style="width: 99%;">
                <x:layout proportion="10%,21%,12%,21%,10%"/>
                <tr>
                    <x:inputTD name="organName" disabled="true" required="false"
                               label="公司名称" maxLength="64"/>
                    <x:inputTD name="billCode" disabled="true" required="false"
                               label="单据号码" maxLength="32"/>
                    <x:inputTD name="fillinDate" disabled="true" required="false"
                               label="填表日期" maxLength="7" wrapper="dateTime"/>
                </tr>
                <tr>
                    <x:inputTD name="deptName" disabled="true" required="false"
                               label="部门" maxLength="64"/>
                    <x:inputTD name="personMemberName" disabled="true" required="false"
                               label="姓名" maxLength="64"/>
                               
                    <!--
						<x:inputTD name="deputyName" required="false" label="代理人"
							maxLength="64" />
							-->
                    <x:inputTD name="leaveKindId" required="false" label="请假类别"
                               maxLength="32"/>
                </tr>
                <tr>
                    <x:inputTD name="startDate" required="false" label="开始日期 "
                               wrapper="dateTime" maxLength="7"/>
                    <x:inputTD name="endDate" required="false" label="结束日期"
                               maxLength="7" wrapper="dateTime"/>
                    <x:inputTD name="totalTime" required="false" label="请休假小时"
                               maxLength="11"/>
                </tr>
               <tr>
            <x:hidden name="projectId"/>
         	<x:inputTD name="projectName" required="false" label="项目" maxLength="128" colspan="3"  wrapper="select"/>	
                               
            <x:inputTD name="mdFullName" required="false" label="全路径"
                               maxLength="11"/>
               </tr>
                <tr>
                    <x:textareaTD name="leaveReason" required="false" label="请假原因"
                                  width="744" rows="5" colspan="5">
                    </x:textareaTD>
                </tr>
                <tr>
                    <x:textareaTD name="memo" required="false" label="备注" width="744"
                                  rows="3" colspan="5">
                    </x:textareaTD>
                </tr>
                <tr>
                <tr style="height: 50px;">
                    <td colspan="5">
                        <x:button value="..." cssStyle="min-width:50px;" id="btnSelectPerson"/>
                    </td>
                </tr>
                </tr>
                <tr>
                    <x:textareaTD name="verificationReason" required="false"
                                  label="核销不一致原因" rows="3" width="744" colspan="5"></x:textareaTD>
                </tr>
                <tr>
                    <x:inputTD name="verificationStartDate" required="false"
                               label="核销开始日期" maxLength="7" wrapper="dateTime"/>
                    <x:inputTD name="verificationEndDate" required="false"
                               label="核销结束日期" maxLength="7" wrapper="dateTime"/>
                    <x:inputTD name="verificationTotalTime" required="false"
                               label="核销小时" maxLength="11"/>
                </tr>
            </table>
        </div>
    </form>
</div>
</body>
</html>
