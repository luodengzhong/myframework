<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form method="post" action="" id="submitForm">
    <x:hidden name="functionDefineId" id="functionDefineId"/>
    <x:hidden name="parentId" id="parentId"/>
    <x:hidden name="nodeKindId" id="nodeKindId"/>
    <x:hidden name="sysFunId" id="sysFunId"/>
    <div class='ui-form' id='queryTable'>
        <x:radioL list="kindList" name="kindId" id="kindId" label="执行类型" labelWidth="65" width="165" onchange="kindIdChange(this) "/>
        <x:inputL name="sysFunName" id="sysFunName" wrapper="tree" dataOptions="name:'opFunction', back:{text:'#sysFunName', value: '#sysFunId'},onChange:function(n,d){checkMemu(n,d)}"
                  required="false" label="系统菜单" labelWidth="65" width="260"/>
        <x:inputL name="code" id="code" required="true" label="编码"
                  readonly="false" labelWidth="65" width="260"/>
        <x:inputL name="name" id="name" required="true" label="标题"
                  readonly="false" labelWidth="65" width="260"/>
        <div class="row">
            <x:inputL name="iconUrl" id="iconUrl" label="图标" readonly="false"
                      labelWidth="65" width="210"/>
            <x:button value="..." onclick="chooseImg()"
                      cssStyle="min-width:30px;"/>
        </div>
        <x:inputL name="parameterValue" id="parameterValue" required="false"
                  label="参数值" readonly="false" labelWidth="65" width="260"/>
        <x:inputL name="procKey" id="procKey" required="false"
                  label="流程key" readonly="false" labelWidth="65" width="260"/>
        <x:inputL name="serviceName" id="serviceName" required="false"
                  label="Service名" readonly="false" labelWidth="65" width="260"/>
        <x:inputL name="sequence" id="sequence" required="false" label="排序号"
                  readonly="false" spinner="true" mask="nnn" dataoptions="min:1"
                  labelWidth="65" width="65"/>
        <x:textareaL name="description" id="description" label="描述"
                     readonly="false" labelWidth="65" width="260" rows="3"></x:textareaL>
    </div>
</form>
