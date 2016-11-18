<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form method="post" action="" id="submitForm">
    <x:hidden name="contractId" id="contractId"/>
    <x:hidden name="projectId" id="projectId"/>
    <x:hidden name="projectNodeId" id="projectNodeId"/>
    <x:hidden name="contractCategoryId" id="contractCategoryId"/>
    <x:hidden name="creatorId" id="creatorId"/>
    <div class='ui-form' id='queryTable'>
        <table class='tableInput' style="width: 500px;">
            <x:layout proportion="17%,33%,17%,33%"/>
            <tr>
                <x:inputTD name="projectName" id="projectName" label="项目"
                           readonly="true"/>
                <x:inputTD name="projectNodeName" id="projectNodeName" label="项目节点"
                           readonly="true"/>
            </tr>
            <tr>
                <x:inputTD name="contractCategoryName" id="contractCategoryName"
                           label="合同类别" readonly="false" wrapper="tree"
                           dataOptions="name:'contractCategory', back:{text:'#contractCategoryName', value: '#contractCategoryId'}"/>
                <x:inputTD name="creatorName" id="creatorName" required="false"
                           label="经办人" readonly="false" wrapper="tree"
                           dataOptions="name: 'org',checkbox:true ,back:{text:'#creatorName', value: '#creatorId'}"/>
            </tr>
            <tr>
                <x:inputTD name="code" id="code" required="true" label="编码"
                           readonly="false"/>
                <x:inputTD name="name" id="name" required="true" label="名称"
                           readonly="false"/>
            </tr>
            <tr>
                <x:inputTD name="aunit" id="aunit" required="true" label="甲方单位"
                           readonly="false"/>
                <x:inputTD name="acreator" id="acreator" required="true"
                           label="甲方经办人" readonly="false"/>
            </tr>
            <tr>
                <x:inputTD name="bunit" id="bunit" required="true" label="乙方单位"
                           readonly="false"/>
                <x:inputTD name="bcreator" id="bcreator" required="true"
                           label="乙方经办人" readonly="false"/>
            </tr>
            <tr>
                <x:inputTD name="contractAmount" id="contractAmount"
                           required="false" label="合同价(元)" readonly="false" spinner="true"
                           dataoptions="min:0"/>
                <x:inputTD name="signDate" id="signDate" required="false"
                           label="签订日期" readonly="false" maxLength="7" wrapper="date"/>
            </tr>
            <tr>
                <x:inputTD name="signAddress" id="signAddress" required="false"
                           label="签订地点" readonly="false" colspan="3"/>
            </tr>
            <tr>
                <x:inputTD name="description" id="description" required="false"
                           label="描述" readonly="false" colspan="3"/>
            </tr>
            <tr>
                <td class="title"><span class="labelSpan">附件：</span></td>
                <td class="edit" colspan="3"><x:fileList bizCode="ContractFile"
                                                         bizId="contractId" id="ContractFileList"/></td>
            </tr>
        </table>
    </div>
</form>
