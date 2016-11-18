<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" >
		<x:hidden name="dispatchKindId" id="detailDispatchKindId"/>
		<x:inputL name="code" required="true" label="编码" maxLength="16" labelWidth="70" width="200"/>		
		<x:inputL name="name" required="true" label="名称" maxLength="60" labelWidth="70" width="200"/>
		<dl><dt style="width:70px;">规则如:</dt><dd style="color:#ff0000;">和骏人力（{年}）{月}-{号}号</dd></dl>
		<x:inputL name="ruleContent" required="true" label="生成规则"  maxLength="100" labelWidth="70" width="200"/>		
		<x:selectL name="loopRule" required="true" label="循环规则"  labelWidth="70" width="200" list="dispatchLoopRule"/>
		<x:inputL name="value"  label="当前值" labelWidth="70" width="200" mask="nnnnn"/>	
		<x:hidden name="dispatchKindTypeId" id="detailDispatchKindTypeId"/>
		<x:inputL name="dispatchKindTypeName"  id="detailDispatchKindTypeName" required="false"  label="类别" labelWidth="70" width="200" wrapper="tree"/>
		<x:inputL name="lastUpdateDate" disabled="true" label="修改时间" labelWidth="70" width="200" mask="dateTime"/>
		<dl>
			<dt style="width:70px">序号</dt>
			<dd style="width:200px">
				<x:input name="sequence" required="true" label="序号" mask="nnnn" cssStyle="width:60px;" id="detailSequence" />&nbsp;
			    <x:checkbox name="letsChooseCancel" label="选择作废数据"  value="1"/>
		    </dd>
		</dl>
		<x:textareaL name="remark" required="false" label="备注" maxLength="256" rows="4" labelWidth="70" width="200"/>		
	</div>
</form>