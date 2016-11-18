<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="dialog,tree,grid,dateTime,combox,attachment"/>

    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
    <link href='<c:url value="/system/contact/Contact.css"/>' rel="stylesheet" type="text/css"/>
    <script src='<c:url value="/system/contact/Contact.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/demo/demo_list.js"/>' type="text/javascript"></script>

</head>
<body>
<div class="mainPanel">
    <div id="mainWrapperDiv">
        <x:title title="测试" hideTable="queryTable"/>
        <form method="post" action="" id="queryMainForm">
            <div class="ui-form" id="queryTable" style="width:900px;">
                <x:inputL name="sourcetable" required="false" label="对应表名"
                          readonly="false" id="main_sourcetable" mask="money"/>
                <x:selectL name="filename" required="false" label="文件名" dictionary="degree" filter="1" value="1"/>
                <x:hidden name="createby" id="main_createby"/>
                <x:inputL name="createbyname" id="main_createbyname" label="创建人"
                          wrapper="select"
                          dataOptions="type:'sys',name:'extendedFieldDefine',checkbox:true,valueIndex:'#main_createby',checkboxIndex:'defineId',callBackControls:{fieldCname:'#main_sourcetable',fieldEname:'#main_createbyname',defineId:'#main_createby'}"/>
                <x:radioL list="#{'1':'先生','0':'女士'}" name="radio1" value="1"
                          label="性别"/>
                <x:inputL name="testDatetime" required="false" label="testDatetime"
                          readonly="false" wrapper="dateTime"/>
                <x:inputL name="testTree" required="false" label="testTree"
                          readonly="false" id="testTree"/>
                <x:hidden name="testHidden"/>
                <x:inputL name="testCheckbox" required="true" label="testCheckbox"
                          readonly="false" id="testCheckbox" wrapper="select"/>
                <x:inputL name="testdictionary" required="false" label="testdictionary"
                          readonly="false" id="testdictionary" value="1"/>
                <x:inputL name="testTreeSearch" required="false" label="testTreeSearch"
                          readonly="false" id="testTreeSearch"/>
                 <x:inputL name="billCode" required="false" label="单据编号" id="main_bill_code" />
                <dl>

                    <x:button value="查 询" onclick="query(this.form)"/>
                    &nbsp;&nbsp;
                    <x:button value="重 置" onclick="resetForm(this.form)"/>
                    &nbsp;&nbsp;
                    <x:button value="选择对话框" id="hahaha"/>
                    <x:button value="上传测试" id="upFileTest"/>
                    <x:button value="测试薪酬变动" onclick="updateArchivesByBillCode()"/>
                </dl>

            </div>
        </form>
        <div id="testToolBar"></div>
        <x:fileList bizCode="test" bizId="aa" id="testFileList" title="附件自定义标题"/>
        <div class="blank_div"></div>
        <!-- <div id="maingrid"></div>-->
        <x:fileList bizCode="cs001" bizId="aa" id="testTableFileList" isClass="true"/>
        <div id="testDiv">assssssssssss</div>
        <table class='tableInput' style="width: 99%;" id="table_08">
            <colgroup>
                <col width="30%">
                <col width="70%">
            </colgroup>
            <tbody>
            <tr>
                <td class="title">
                    <span class="labelSpan">技术联系人:</span>
                </td>
                <td class="edit">
                    <div id="contactDIV" class="ui-contact-list"></div>
                </td>
            </tr>
            <tr>
                <td class="title">
                    <span class="labelSpan">管理联系人:</span>
                </td>
                <td class="edit">
                    <div id="contactDIV2" class="ui-contact-list"></div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>

</div>
</body>
</html>
