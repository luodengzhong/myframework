<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<table class='tableInput' style="width:500px;">
	<tr>
		<td style="width: 40%;">
			<div id="chooseFieldsDiv" style="overflow:auto;margin:2px;border-top:1px #d6d6d6 solid;"></div>
		</td>
		<td style='width: 50%'>
			<div id="showFieldsDiv" style="overflow:auto;margin:2px;"></div>
		</td>
		<td style='width: 10%'>
			  <x:button value="删 除" cssStyle="min-width:30px;" onclick="removeShowFields()"/>
			  <div class="blank_div"></div>
			  <x:button value="上 移" cssStyle="min-width:30px;" onclick="upShowFields()"/>
			 <div class="blank_div"></div>
			  <x:button value="下 移" cssStyle="min-width:30px;" onclick="downShowFields()"/>
		</td>
	</tr>
</table>