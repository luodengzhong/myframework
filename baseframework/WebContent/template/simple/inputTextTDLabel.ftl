<td class="title"><#rt/>
<span class="labelSpan">${parameters.label?default("")?html}<#rt/>
<#if parameters.required?default(false)><#rt/>
<font color="#FF0000">*</font><#rt/>
</#if><#rt/>
&nbsp;:</span><#rt/>
</td><#rt/>
<td<#rt/>
<#if parameters.disabled?default(false)><#rt/>
 class="disable"<#rt/>
<#elseif parameters.readonly?default(false) && parameters.cssClass?default("")=="textReadonly">
 class="disable"<#rt/>
<#else><#rt/>
 class="edit"<#rt/>
</#if><#rt/>
 colspan="${parameters.colspan?default(1)?html}"<#rt/>
><#rt/>
<#include "/${parameters.templateDir}/simple/inputText.ftl" />
</td><#rt/>