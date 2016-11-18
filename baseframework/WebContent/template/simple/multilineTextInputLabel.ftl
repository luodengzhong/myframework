<dl<#rt/>
<#if parameters.height??><#rt/>
 style="height:${parameters.height?html}px"<#rt/>
</#if><#rt/>
><#rt/>
<dt<#rt/>
<#if parameters.labelWidth??><#rt/>
 style="width:${parameters.labelWidth?html}px"<#rt/>
</#if><#rt/>
><#rt/>
${parameters.label?default("")?html}<#rt/>
<#if parameters.required?default(false)><#rt/>
<font color="#FF0000">*</font><#rt/>
</#if><#rt/>
&nbsp;:<#rt/>
</dt><#rt/>
<dd<#rt/>
<#if parameters.width??><#rt/>
 style="width:${parameters.width?html}px"<#rt/>
</#if><#rt/>
><#rt/>
<#include "/${parameters.templateDir}/simple/multilineTextInput.ftl" />
</dd><#rt/>
</dl><#rt/>