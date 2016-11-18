<#setting number_format="#">
<#assign pageIsReadOnly=false />
<#if parameters.isReadOnly?? && parameters.isReadOnly>
<#assign pageIsReadOnly=true />
</#if>
<#-- 定义宏ProcUnitTask -->
<#macro ProcUnitTask task group index>
 <tr><#rt/>
 <#if index==0>
 	<td rowspan="${group.rowSpan}" class="title" style="text-align:center;">${group.groupName}<#rt/></td>
 </#if>
 <#if !pageIsReadOnly&&!task.readonly?default(true)>
 	<td colspan="6" style='padding:0px;'><#rt/>
 	<textarea id="handleOpinion" class="textarea" style='height:36px;' maxLength="300">${task.opinion?html}<#rt/></textarea><#rt/>
 	<input type="hidden" id="currentHandleId" name="id" value="${task.id}"/>
    <input type="hidden" id="currentHandleGroupId" name="groupId" value="${task.groupId}"/>
    <input type="hidden" id="currentHandleSequence" name="sequence" value="${task.sequence}"/>
    <input type="hidden" id="currentHandleCooperationModelId" name="cooperationModelId" value="${task.cooperationModelId}"/>
    <input type="hidden" id="currentHandleTaskExecuteModeId" name="taskExecuteModeId" value="${task.taskExecuteModeId}"/>
    <input type="hidden" id="currentHandleAllowAdd" name="allowAdd" value="${task.allowAdd}"/>
    <input type="hidden" id="currentHandleAllowSubtract" name="allowSubtract" value="${task.allowSubtract}"/>
    <input type="hidden" id="currentHandleAllowTransfer" name="allowTransfer" value="${task.allowTransfer}"/>
    <input type="hidden" id="currentHandleAllowAbort" name="allowAbort" value="${task.allowAbort}"/>
    <input type="hidden" id="currentHandleHelpSection" name="helpSection" value="${task.helpSection}"/>
    <input type="hidden" id="currentHandleChiefId" name="chiefId" value="${task.chiefId}"/>
    <input type="hidden" id="currentApprovalRuleId" name="approvalRuleId" value="${task.approvalRuleId}"/>
    <input type="hidden" id="currentHandleKindId" name="handleKindId" value="${task.handleKindId}"/>
    <#-- 添加评论数据 -->
    <#if task.comments?? && task.comments?size gt 0>
    <hr/>
    <#list task.comments as comment>
		<div class="comment" style="color:#555555;font-style:italic;"><b>&nbsp;@${comment.userId}&nbsp;${comment.time?string("yyyy-MM-dd HH:mm:ss")}&nbsp;:&nbsp;</b>${comment.fullMessage}</div><#rt/>
	</#list>
    </#if>
    </td>
<#else>
	<td class="disable <#if task.statusId??&&task.statusId!='ready'>opinionTextTD</#if>" id="opinionTextTD${task.id?html}" handlerName="${task.handlerName?html}" colspan="6" <@getBackGroundColor task=task/>><#rt/>
    <div class='opinionTextLabel' <@getBackGroundColor task=task/>><#rt/>${task.opinion?html}</div><#rt/>
    <input type="hidden" id="handleId" name="id" value="${task.id?html}"/>
    <#-- 添加评论数据 -->
    <#if task.comments?? && task.comments?size gt 0>
    <#list task.comments as comment>
		<div class="comment" style="color:#555555;font-style:italic;"><b>&nbsp;@${comment.userId}&nbsp;${comment.time?string("yyyy-MM-dd HH:mm:ss")}&nbsp;:&nbsp;</b>${comment.fullMessage}</div><#rt/>
	</#list>
    </#if>
    </td><#rt/>
</#if>
</tr><#rt/>
<tr style="<@getFontStyle task=task/>"><#rt/>
	<#if parameters.hasResult?default(true)>
		<td class="title" <@getBackGroundColor task=task/>><#rt/>
	        处理结果&nbsp;<#rt/>
	    <#if !pageIsReadOnly&&!task.readonly?default(true)>
	    <font color=red>*</font>
	    </#if>
	    :<#rt/>
	    </td><#rt/>
	    <#if !pageIsReadOnly&&!task.readonly?default(true)>
	    <td style='padding:0px;' class="disable" <@getBackGroundColor task=task/>><#rt/>
	        <input type="text" id="handleResult" name="jobPageResult" required="true" label="处理结果" combo="true" value="${task.result?html}" dataOptions="data:{'1':'同意','2':'不同意', 3:'已阅'},readOnly:true"/>
	    </td>
	    <#else>
	    <td class="disable" <@getBackGroundColor task=task/>><#rt/>
	        <div class='textLabel' <@getBackGroundColor task=task/>>${task.resultDisplayName?html}</div><#rt/>
	    </td>
	    </#if>
    </#if>
    <td class="title" <@getBackGroundColor task=task/>><#rt/>
       处理人&nbsp;:<#rt/>
    </td><#rt/>
    <td class="disable" <@getBackGroundColor task=task/>><#rt/>
        <div class='textLabel' <@getBackGroundColor task=task/>>${task.handlerName?html}</div><#rt/>
    </td><#rt/>
    <td class="title" <@getBackGroundColor task=task/>><#rt/>
        办理时间&nbsp;:<#rt/>
    </td><#rt/>
    <td class="disable" <@getBackGroundColor task=task/>><#rt/>
        <div class='textLabel' <@getBackGroundColor task=task/>>${task.handleTime?html}</div><#rt/>
    </td><#rt/>
    <#if !parameters.hasResult?default(true)>
    	<td class="title" <@getBackGroundColor task=task/> colspan="2">&nbsp;
    		<#if !pageIsReadOnly&&!task.readonly?default(true)>
    			<input type="hidden" id="handleResult" name="jobPageResult" value="1"/>
    		</#if>
    	</td><#rt/>
    </#if>
</tr><#rt/>
</#macro> 
<#-- 定义宏getFontStyle 修改字体显示颜色-->
<#macro getFontStyle task>
<#if task.cooperationModelId=='assistant'>
color:#666666;font-style:italic;
</#if>
</#macro> 
<#-- 定义宏getBackGroundColor  修改显示背景色-->
<#macro getBackGroundColor task>
<#if task.isCurrentProcUnit?default("false")=='true'>
 style="background-color:#a5edf9;"
 <#else>
 	<#if task.taskIndex?default(0)%2==0>
 		style="background-color:#efefef;"
 	<#else>
 		style="background-color:#fafafa;"
 	</#if>
</#if>
</#macro> 
<#if parameters.taskExecutionList?? && parameters.taskExecutionList?size gt 0>
<table class="tableInput taskExecutionListTable" cellspacing="0" cellpadding="0"><#rt/>
<COLGROUP><#rt/>
<#list parameters.proportions as proportion>
	<COL width='${proportion}'/><#rt/>
</#list>
</COLGROUP><#rt/>
<#list parameters.taskExecutionList as group>
<#list group.handlers as handler>
   <@ProcUnitTask task=handler group=group index=handler_index/>
</#list>
</#list>
</table><#rt/>
</#if>