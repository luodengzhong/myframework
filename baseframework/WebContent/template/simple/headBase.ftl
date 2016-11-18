<#if parameters.base?default(false)>
<link href='${parameters.webApp?default("")?html}/themes/default/style.css' rel="stylesheet" type="text/css" />
<link href='${parameters.webApp?default("")?html}/themes/default/ui.css' rel="stylesheet" type="text/css" />
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery-1.7.2.min.js' type="text/javascript"></script>
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery.json-2.4.min.js' type='text/javascript'></script>
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery.maskinput.js' type='text/javascript'></script>
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery.spinner.js' type='text/javascript'></script>
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery.dragEvent.js' type='text/javascript'></script>
<script src='${parameters.webApp?default("")?html}/javaScript/WEB_APP.js' type="text/javascript"></script>
<script src='${parameters.webApp?default("")?html}/javaScript/common.js' type="text/javascript"></script>
<script src='${parameters.webApp?default("")?html}/javaScript/UICtrl.js' type="text/javascript"></script>
</#if>
<#if parameters.dialog?default(false)>
<link href='${parameters.webApp?default("")?html}/themes/lhgdialog/idialog.css' rel='stylesheet' type='text/css'/>
<script src='${parameters.webApp?default("")?html}/lib/jquery/lhgdialog.js?self=true' type='text/javascript' id='lhgdialoglink'></script>
</#if>
<#if parameters.grid?default(false) ||parameters.blueGrid?default(false) || parameters.tree?default(false) || parameters.layout?default(false) || parameters.accordion?default(false)>
<link href='${parameters.webApp?default("")?html}/themes/ligerUI/ligerui-icons.css' rel="stylesheet" type="text/css" />
<script src='${parameters.webApp?default("")?html}/lib/ligerUI/core/base.js' type="text/javascript"></script>
<script src='${parameters.webApp?default("")?html}/lib/ligerUI/ligerui.all.js' type="text/javascript"></script>
</#if>
<#if parameters.grid?default(false)>
<link href='${parameters.webApp?default("")?html}/themes/ligerUI/Aqua/css/ligerui-grid.css' rel="stylesheet" type="text/css" />
<link href='${parameters.webApp?default("")?html}/themes/ligerUI/Gray/css/grid.css' rel="stylesheet" type="text/css" />
<script src='${parameters.webApp?default("")?html}/lib/ligerUI/plugins/ligerGrid.js' type="text/javascript"></script>
</#if>
<#if parameters.blueGrid?default(false)>
<link href='${parameters.webApp?default("")?html}/themes/ligerUI/Aqua/css/ligerui-grid.css' rel="stylesheet" type="text/css" />
<script src='${parameters.webApp?default("")?html}/lib/ligerUI/plugins/ligerGrid.js' type="text/javascript"></script>
</#if>
<#if parameters.tree?default(false)>
<link href='${parameters.webApp?default("")?html}/themes/ligerUI/Aqua/css/ligerui-tree.css' rel="stylesheet" type="text/css" />
<script src='${parameters.webApp?default("")?html}/lib/ligerUI/plugins/ligerTree.js' type="text/javascript"></script>
</#if>
<#if parameters.layout?default(false) || parameters.accordion?default(false)>
<link href='${parameters.webApp?default("")?html}/themes/ligerUI/Aqua/css/ligerui-layout.css' rel="stylesheet" type="text/css" />
<link href='${parameters.webApp?default("")?html}/themes/ligerUI/Gray/css/layout.css' rel="stylesheet" type="text/css" />
</#if>
<#if parameters.layout?default(false)>
<script src='${parameters.webApp?default("")?html}/lib/ligerUI/plugins/ligerLayout.js' type="text/javascript"></script>
</#if>
<#if parameters.accordion?default(false)>
<script src='${parameters.webApp?default("")?html}/lib/ligerUI/plugins/ligerAccordion.js' type="text/javascript"></script>
</#if>
<#if parameters.attachment?default(false)>
<link href='${parameters.webApp?default("")?html}/themes/default/attachment/style.css?a=1' rel='stylesheet' type='text/css'/>
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery.contextmenu.js' type='text/javascript'></script>
<script src='${parameters.webApp?default("")?html}/lib/webUploader/webuploader.js' type="text/javascript"></script>
<script src='${parameters.webApp?default("")?html}/lib/webUploader/jquery.webuploader.js' type="text/javascript"></script>
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery.attachment.js?a=3' type='text/javascript'></script>
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery.thickbox.js' type="text/javascript"></script>
</#if>
<#if parameters.dateTime?default(false)>
<script src='${parameters.webApp?default("")?html}/lib/jquery/ui/jquery.ui.core.min.js' type='text/javascript'></script>
<script src='${parameters.webApp?default("")?html}/lib/jquery/ui/jquery.ui.widget.min.js' type='text/javascript'></script>
<script src='${parameters.webApp?default("")?html}/lib/jquery/ui/jquery.ui.mouse.min.js' type='text/javascript'></script>
<script src='${parameters.webApp?default("")?html}/lib/jquery/ui/jquery.ui.slider.min.js' type='text/javascript'></script>
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery.datepicker.js' type='text/javascript'></script>
</#if>
<#if parameters.date?default(false)>
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery.datepicker.js' type='text/javascript'></script>
</#if>
<#if parameters.combox?default(false)>
<script src='${parameters.webApp?default("")?html}/lib/jquery/jquery.combox.js' type='text/javascript'></script>
</#if>