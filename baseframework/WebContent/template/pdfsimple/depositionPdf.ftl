<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>免职审批单</title>  
   <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            
            .brcImg{
			    position: absolute;
                top:0px;
                left:0px;
            }
            table{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
               border:solid 2px;
            }
           
            table tr{  
               text-align: left;
            } 
                        
            table td{
               border-right: 1px solid #000000;height:35px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word; 
               padding-left:1px;
            }
            table td.center{
                width:100px;
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
            }
            table td.left{
                width:200px;
            	text-align: left;
            	padding-left:20px;
            }
           
            @page {    
                size:  210mm 297mm;
           }   
        </style> 
</head>  
<body>
<div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
 <br></br>
   <br></br>
 <div align="center" style="font-weight:bold;font-size:20px;height:20px;">  
          <b>员工【${staffName}】免职审批单</b>
   </div>
    <br></br>
      <#include "/simple/taskExecutionList.ftl" />
    
</body>  
</html>   