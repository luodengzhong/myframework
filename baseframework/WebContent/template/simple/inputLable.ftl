<input type = "hidden" name="${parameters.name?default("")?html}"<#rt/>
<#if parameters.id??>
 id="${parameters.id?html}"<#rt/>
</#if>
<#if parameters.nameValue??>
 value="${parameters.nameValue?html}"<#rt/>
</#if>
/><#rt/>
<div class="textLabel" id="${parameters.name?default("")?html}_view"><#rt/>
<#if parameters.showValue??>
${parameters.showValue?html}           
<#else>
<#if parameters.nameValue??>
${parameters.nameValue?html}
</#if>
</#if>
</div><#rt/>