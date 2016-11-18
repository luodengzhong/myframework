<#setting number_format="#">
	<div class="ui-attachment-list"  isClass="true" id="${parameters.id?default("")?html}"<#rt/>
	<#if parameters.readonly?default(false)>
		readonly="true"<#rt/>
	</#if>
	bizCode="${parameters.bizCode?default("")?html}" bizId="${parameters.bizId?default("")?html}"><#rt/>
	<table class='tableInput<#if parameters.inTable?default(false)> attachmentInTable</#if>'><#rt/>
	<#if parameters.proportions?? && parameters.proportions?size gt 0>
	<COLGROUP><#rt/>
		<#list parameters.proportions as proportion>
			<COL width='${proportion}' /><#rt/>
		</#list><#rt/>
	</COLGROUP><#rt/>
	</#if>
	<#if parameters.groupList?? && parameters.groupList?size gt 0>
		<#assign cols=parameters.proportions?size />
		<#assign index=0 />
		<#assign colspan=1 />
		<#list parameters.groupList as group>
			<#assign colspan=group.colspan />
			<#if (index+1+colspan) gt cols>
				<#assign colspan=cols-1-index />
			<#elseif (index+1+colspan) == (cols-1)>
				<#assign colspan=colspan+1 />
			</#if>
			<#if colspan lt 1>
				<#assign colspan=1 />
			</#if>
			<#if index%cols==0>
				<#if index==cols>
					</tr><#rt/>
					<#assign index=0 />
				</#if>
				<tr><#rt/>
			</#if>
			<#assign index=index+1+colspan />
			<#if index gt cols>
				<#assign index=cols /><#rt/>
			</#if>
			<td class='title'><#rt/>
				<span class="addFieldFloat">
					<span class="addFieldGroup" <#if parameters.readonly?default(false)>style="display:none;"</#if>  title="添加文件(保存表单后即可上传文件)" isMore="${group.isMore?html}" attachmentCode="${group.attachmentCode?html}" filetype="${group.fileKind?html}">&nbsp;</span>
				</span>
				<span class="labelSpan"><#rt/>
					${group.attachmentName?html}&nbsp;:<#rt/>
				</span><#rt/>
			</td><#rt/>
			<td colspan='${colspan}' class='edit'><#rt/>
				<div class="groupFileList ${group.attachmentCode?html}" attachmentCode="${group.attachmentCode?html}" isMore="${group.isMore?html}" id="groupFileList${group.configDetailId}">
					<#if group.fileList?? && group.fileList?size gt 0>
					<#list group.fileList as fileObj>
					<@getFileView fileObj=fileObj/>
					</#list>
					</#if>
				</div>
			</td><#rt/>
		</#list>
		<#if cols-index gt 0>
			<td class='title' colspan='${cols-index}'>&nbsp;</td>
		</#if>
		</tr><#rt/>
	</#if>
	</table><#rt/>
	<iframe name="iframe_${parameters.id?default(" ")?html}" style="display:none;"></iframe><#rt/>
	<input type="hidden" id="attachmentConvertUrl" value="${parameters.attachmentConvertUrl?default(" ")?html}"/><#rt/>
	</div><#rt/>
	<#-- 定义宏getFileView -->
	<#macro getFileView fileObj>
		<div class="file" id="${fileObj.id?html}" fileKind="${fileObj.fileKind?html}" attachmentCode="${fileObj.attachmentCode?html}" style="display:none;" creatorName="${fileObj.creatorName?html}" fileSize="${fileObj.fileSize?html}" createDate="${fileObj.createDate?html}"><#rt/>
				<span class="delFile" title="删除文件">&nbsp;</span><#rt/>
				<span class="${fileObj.fileKind?html}">&nbsp;</span><#rt/>
				<a href="##" hidefocus>${fileObj.fileName?html}</a><#rt/>
		</div><#rt/>
	</#macro>