package com.brc.util.excel.export;

import java.util.Map;
import org.dom4j.Element;

public abstract interface IExcelExport
{
  public abstract void setHeadRoot(Element paramElement);

  public abstract void setDatas(Map<String, Object> paramMap);

  public abstract String expExcel()
    throws Exception;
}

