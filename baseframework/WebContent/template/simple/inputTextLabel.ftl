<dl><#rt/>
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
<#include "/${parameters.templateDir}/simple/inputText.ftl" />
</dd><#rt/>
</dl><#rt/>