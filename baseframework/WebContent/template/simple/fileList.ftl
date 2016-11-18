<#setting number_format="#">
<div class="ui-attachment-list" id="${parameters.id?default("")?html}"<#rt/>
<#if parameters.readonly?default(false)>
 readonly="true"<#rt/>
</#if>
 bizCode="${parameters.bizCode?default("")?html}" bizId="${parameters.bizId?default("")?html}"><#rt/>
<#if parameters.isWrap?default(true)>
<fieldset><#rt/>
    <legend><#rt/>
	<ul>
	    <li style="float:left; ">
			<span class="toggle" title="hide">&nbsp;</span><#rt/>
			${parameters.title?default("附件")?html}<#rt/>
			<span class="moreList" title="在窗口中查看">&nbsp;</span><#rt/>
		</li>
		<li style="float:left;"><span class="addFile" title="添加文件(保存表单后即可上传文件)">&nbsp;</span></li><#rt/>
	</ul>
    </legend><#rt/>
</#if><#rt/>
<div class="fileListMain"><#rt/>
<#if parameters.fileList?? && parameters.fileList?size gt 0> 
<#list parameters.fileList as fileObj>
<div class="file" id="${fileObj.id?html}" fileKind="${fileObj.fileKind?html}" attachmentCode="${fileObj.attachmentCode?html}" creatorName="${fileObj.creatorName?html}" fileSize="${fileObj.fileSize?html}" createDate="${fileObj.createDate?html}"><#rt/>
<span class="${fileObj.fileKind?html}">&nbsp;</span>&nbsp;<a href="##" hidefocus>${fileObj.fileName?html}</a></div><#rt/>
</#list>
</#if>
</div><#rt/>
<#if parameters.isWrap?default(true)>
</fieldset><#rt/>
</#if>
<iframe name="iframe_${parameters.id?default("")?html}" style="display:none;"></iframe><#rt/>
<input type="hidden" id="attachmentConvertUrl" value="${parameters.attachmentConvertUrl?default(" ")?html}"/><#rt/>
</div><#rt/>