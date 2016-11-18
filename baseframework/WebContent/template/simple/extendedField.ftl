<#setting number_format="#">
<#if parameters.tagExtendedFieldGroupList?? && parameters.tagExtendedFieldGroupList?size gt 0> 
<#list parameters.tagExtendedFieldGroupList as groupData>
	<div class='navTitle'><span> ${groupData.name}</span></div>
	<hr style="margin:2px;"/>
	<table class='tableInput' cellspacing="0" cellpadding="0"><#rt/>
	<#if groupData.tableLayout??>
	<COLGROUP><#rt/>
		<#list groupData.tableLayout?split(",") as proportion>
			<COL width='${proportion}' /><#rt/>
		</#list><#rt/>
	</COLGROUP><#rt/>
	</#if>
	<#if groupData.fields?? && groupData.fields?size gt 0>
		<#assign col=groupData.cols />
		<#assign index=0 />
		<#assign colspan=1 />
		<#list groupData.fields as fieldData>
			<#assign visible=(fieldData.visible!'1')?number/>
			<#if visible==1>
				<#assign colspan=(fieldData.colSpan!'1')?number />
				<#assign isNewLine=fieldData.newLine!0/>
				<#if isNewLine==1>
					<#if col-index gt 0>
						<td class='title' colspan='${col-index}'>&nbsp;</td>
					</#if>
	            	</tr>
	            	<tr>
	            	<#assign colspan=col-1 />
	            	<#assign index=col />
				<#else>
						<#if (index+1+colspan) gt col>
							<#assign colspan=col-1-index />
						<#elseif (index+1+colspan) == (col-1)>
							<#assign colspan=colspan+1 />
						</#if>
						<#if colspan lt 1>
							<#assign colspan=1 />
						</#if>
						<#if index%col==0>
							<#if index==col>
								</tr><#rt/>
								<#assign index=0 />
							</#if>
							<tr><#rt/>
						</#if>
						<#assign index=index+1+colspan />
						<#if index gt col>
							<#assign index=col /><#rt/>
						</#if>
				</#if>
				<td class='title'><#rt/>
					<span class="labelSpan"><#rt/>
						${fieldData.fieldCname?html}&nbsp;:<#rt/>
					</span><#rt/>
				</td><#rt/>
				<td colspan='${colspan}' class='title'><#rt/>
					<div class="textLabel">${fieldData.fieldNameValue?html}</div>
				</td><#rt/>
			</#if>
		</#list>
		<#if col-index gt 0>
			<td class='title' colspan='${col-index}'>&nbsp;</td>
		</#if>
		</tr><#rt/>
	</#if>
	</table><#rt/>
</#list>
</#if>