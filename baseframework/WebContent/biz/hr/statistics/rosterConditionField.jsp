<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<table class='tableInput' style="width: 700px;">
	<tr>
		<td style="width: 25%;">
			<div id="chooseFieldsDiv" style="overflow:auto;margin:2px;border-top:1px #d6d6d6 solid;"></div>
		</td>
		<td style='width: 75%'>
			<table class='tableInput' style="width: 99%;">
				<tr class='table_grid_head_tr'>
					<th style="width:7%;">序号</th>
					<th style="width:25%;">字段</th>
					<th style="width:20%;">操作符</th>
					<th style="width:40%;">条件值</th>
					<th style="width:8%;">操作</th>
				</tr>
			</table>
			<div style="overflow:auto;margin-top:1px" id="conditionFieldsDiv">
					<table class='tableInput' style="width: 99%;" id='conditionFieldsTable'>
					</table>
			</div>
			<div style="height: 100px;overflow:hidden;margin-top:1px;display:none;border-top:1px #d6d6d6 solid;" id="conditionSetDiv">
				<table style="width: 99%;" >
					<tr>
					    <td style="width: 70%;border:0px;">
					    	<div>条件如({1} and ({2} or {3}))<font color="red"> (and = 并且)(or = 或则)</font></div>
							<x:textarea name="conditionSet" cssStyle="height:78px;border:1px #d6d6d6 solid;width:98%;"/>
						</td>
						<td style="width: 30%;border:0px;text-align:center;">
							<div>
								<x:button value="并且" cssStyle="min-width:30px;" onclick="insertAtCaret(' and' )"/>
								<x:button value="或则" cssStyle="min-width:30px;" onclick="insertAtCaret(' or ')"/>
							</div>
							<div>
								<x:button value="(" cssStyle="min-width:30px;" onclick="insertAtCaret('(')"/>
								<x:button value=")" cssStyle="min-width:30px;" onclick="insertAtCaret(')')"/>
							</div>
							<div>
								<x:button value="清空" cssStyle="min-width:30px;" onclick="insertAtCaret()"/>
							</div>
						</td>
					</tr>
			</div>
		</td>
	</tr>
</table>