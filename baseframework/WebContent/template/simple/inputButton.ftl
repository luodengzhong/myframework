<span class="ui-button"><span class="ui-button-left"></span><span class="ui-button-right"></span>
<input type="${parameters.type?default("button")?html}"<#rt/>
 name="${parameters.name?default("")?html}"<#rt/>
<#if parameters.nameValue??>
 value="${parameters.value?default("")?html}"<#rt/>
</#if>
<#if parameters.id??>
 id="${parameters.id?html}"<#rt/>
</#if>
 class="ui-button-inner"<#rt/>
<#if parameters.cssStyle??>
 style="${parameters.cssStyle?html}"<#rt/>
</#if>
<#if parameters.disabled?default(false)>
 disabled="disabled"<#rt/>
</#if>
<#include "/${parameters.templateDir}/simple/scripting-events.ftl" />
 hidefocus/>
</span>