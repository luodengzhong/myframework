package com.brc.util.excel.reader;

import java.util.List;

public abstract interface IExcelRowReader
{
  public abstract void getRows(int paramInt1, int paramInt2, List<String> paramList);
}

