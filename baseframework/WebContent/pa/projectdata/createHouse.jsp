<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form method="post" action="" id="submitForm">
    <x:hidden name="buildId" id="buildId"/>
    <x:hidden name="projectId" id="projectId"/>
    <x:hidden name="floorList" id="floorList"/>
    <div class='ui-form' id='queryTable'>
        <table class='tableInput' style="width: 500px;">
            <x:layout proportion="17%,34%,15%,34%"/>
            <tr>
                <x:inputTD name="projectName" id="projectName" label="所属项目"
                           readonly="true"/>
                <x:inputTD name="code" id="code" label="编码" readonly="true"/>
            </tr>
            <tr>
                <x:inputTD name="name" id="name" label="名称" readonly="true"/>

                <x:inputTD name="fullName" id="fullName" label="楼栋全称"
                           readonly="true"/>
            </tr>
            <tr>
                <x:inputTD name="xPos" id="xPos" label="X坐标" readonly="true"
                           spinner="true" mask="nnnnnn.nnnnnn" dataoptions="min:0"/>
                <x:inputTD name="yPos" id="yPos" label="Y坐标" readonly="true"
                           spinner="true" mask="nnnnnn.nnnnnn" dataoptions="min:0"/>
            </tr>
            <tr>
                <x:inputTD name="unitNum" id="unitNum" label="单元数" required="true"
                           readonly="false" spinner="true" dataoptions="min:0"/>
                <x:inputTD name="floorNum" id="floorNum" label="楼层数" required="true"
                           readonly="false" spinner="true" dataoptions="min:0"/>
            </tr>
            <tr>
                <x:inputTD name="startUnitNum" id="startUnitNum" label="起始单元号"
                           required="true" readonly="false" spinner="true" dataoptions="min:1"/>
                <x:inputTD name="doorNum" id="doorNum" label="单元户数" required="true"
                           readonly="false" spinner="true" dataoptions="min:0"/>
            </tr>
        </table>
    </div>
</form>
