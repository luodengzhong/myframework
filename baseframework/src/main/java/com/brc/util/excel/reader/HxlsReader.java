 package com.brc.util.excel.reader;
 
 import java.io.FileInputStream;
 import java.io.IOException;
 import java.util.ArrayList;
 import java.util.List;

import org.apache.poi.hssf.eventusermodel.EventWorkbookBuilder;
 import org.apache.poi.hssf.eventusermodel.EventWorkbookBuilder.SheetRecordCollectingListener;
 import org.apache.poi.hssf.eventusermodel.FormatTrackingHSSFListener;
 import org.apache.poi.hssf.eventusermodel.HSSFEventFactory;
 import org.apache.poi.hssf.eventusermodel.HSSFListener;
 import org.apache.poi.hssf.eventusermodel.HSSFRequest;
 import org.apache.poi.hssf.eventusermodel.MissingRecordAwareHSSFListener;
 import org.apache.poi.hssf.eventusermodel.dummyrecord.LastCellOfRowDummyRecord;
 import org.apache.poi.hssf.eventusermodel.dummyrecord.MissingCellDummyRecord;
 import org.apache.poi.hssf.record.BOFRecord;
 import org.apache.poi.hssf.record.BlankRecord;
 import org.apache.poi.hssf.record.BoolErrRecord;
 import org.apache.poi.hssf.record.BoundSheetRecord;
 import org.apache.poi.hssf.record.FormulaRecord;
 import org.apache.poi.hssf.record.LabelRecord;
 import org.apache.poi.hssf.record.LabelSSTRecord;
 import org.apache.poi.hssf.record.NumberRecord;
 import org.apache.poi.hssf.record.Record;
 import org.apache.poi.hssf.record.SSTRecord;
 import org.apache.poi.hssf.record.StringRecord;
 import org.apache.poi.hssf.record.common.UnicodeString;
 import org.apache.poi.hssf.usermodel.HSSFWorkbook;
 import org.apache.poi.poifs.filesystem.POIFSFileSystem;
 
 public class HxlsReader
   implements HSSFListener
 {
   private IExcelRowReader rowReader;
   private int titleRow = 0;
 
   private int rowsize = 0;
   private POIFSFileSystem fs;
   private boolean outputFormulaValues = true;
   private EventWorkbookBuilder.SheetRecordCollectingListener workbookBuildingListener;
   private HSSFWorkbook stubWorkbook;
   private SSTRecord sstRecord;
   private FormatTrackingHSSFListener formatListener;
   private int sheetIndex = -1;
   private BoundSheetRecord[] orderedBSRs;
   private ArrayList boundSheetRecords = new ArrayList();
   private int nextRow;
   private int nextColumn;
   private boolean outputNextStringRecord;
   private int curRow;
   private List<String> rowlist;
   private String sheetName;
 
   public void setRowReader(IExcelRowReader rowReader)
   {
     this.rowReader = rowReader;
   }
 
   public HxlsReader(POIFSFileSystem fs)
     throws Exception
   {
     this.fs = fs;
     this.curRow = 0;
     this.rowlist = new ArrayList();
   }
 
   public HxlsReader(String file) throws Exception {
     this(new POIFSFileSystem(new FileInputStream(file)));
   }
 
   public void process()
     throws IOException
   {
     MissingRecordAwareHSSFListener listener = new MissingRecordAwareHSSFListener(this);
     this.formatListener = new FormatTrackingHSSFListener(listener);
 
     HSSFEventFactory factory = new HSSFEventFactory();
     HSSFRequest request = new HSSFRequest();
 
     if (this.outputFormulaValues) {
       request.addListenerForAllRecords(this.formatListener);
     } else {
       this.workbookBuildingListener = new EventWorkbookBuilder.SheetRecordCollectingListener(this.formatListener);
       request.addListenerForAllRecords(this.workbookBuildingListener);
     }
 
     factory.processWorkbookEvents(request, this.fs);
   }
 
   public void processRecord(Record record)
   {
     int thisRow = -1;
     int thisColumn = -1;
     String value = null;
     switch (record.getSid()) {
     case 133:
       this.boundSheetRecords.add(record);
       break;
     case 2057:
       BOFRecord br = (BOFRecord)record;
       if (br.getType() == 16)
       {
         if ((this.workbookBuildingListener != null) && (this.stubWorkbook == null)) {
           this.stubWorkbook = this.workbookBuildingListener.getStubHSSFWorkbook();
         }
 
         this.sheetIndex += 1;
         if (this.orderedBSRs == null) {
           this.orderedBSRs = BoundSheetRecord.orderByBofPosition(this.boundSheetRecords);
         }
         this.sheetName = this.orderedBSRs[this.sheetIndex].getSheetname(); } break;
     case 252:
       this.sstRecord = ((SSTRecord)record);
       break;
     case 513:
       BlankRecord brec = (BlankRecord)record;
 
       thisRow = brec.getRow();
       thisColumn = brec.getColumn();
 
       this.rowlist.add(thisColumn, "");
 
       break;
     case 517:
       BoolErrRecord berec = (BoolErrRecord)record;
       thisRow = berec.getRow();
       thisColumn = berec.getColumn();
       this.rowlist.add(thisColumn, berec.getBooleanValue() + "");
       break;
     case 6:
       FormulaRecord frec = (FormulaRecord)record;
       thisRow = frec.getRow();
       thisColumn = frec.getColumn();
       try
       {
         value = this.formatListener.formatNumberDateCell(frec).trim();
         this.rowlist.add(thisColumn, value);
       } catch (Exception e) {
         this.rowlist.add(thisColumn, "");
       }
 
     case 519:
       if (this.outputNextStringRecord)
       {
         StringRecord srec = (StringRecord)record;
         value = srec.getString().trim();
         thisRow = this.nextRow;
         thisColumn = this.nextColumn;
         this.outputNextStringRecord = false;
         this.rowlist.add(thisColumn, value);
       }break;
     case 516:
       LabelRecord lrec = (LabelRecord)record;
       this.curRow = (thisRow = lrec.getRow());
       thisColumn = lrec.getColumn();
       value = lrec.getValue().trim();
       this.rowlist.add(thisColumn, value);
       break;
     case 253:
       LabelSSTRecord lsrec = (LabelSSTRecord)record;
       this.curRow = (thisRow = lsrec.getRow());
       thisColumn = lsrec.getColumn();
       if (this.sstRecord == null) {
         this.rowlist.add(thisColumn, "");
       } else {
         value = this.sstRecord.getString(lsrec.getSSTIndex()).toString().trim();
         this.rowlist.add(thisColumn, value);
       }
       break;
     case 515:
       NumberRecord numrec = (NumberRecord)record;
       this.curRow = (thisRow = numrec.getRow());
       thisColumn = numrec.getColumn();
       value = this.formatListener.formatNumberDateCell(numrec).trim();
       this.rowlist.add(thisColumn, value);
       break;
     }
 
     if ((record instanceof MissingCellDummyRecord)) {
       MissingCellDummyRecord mc = (MissingCellDummyRecord)record;
       this.curRow = (thisRow = mc.getRow());
       thisColumn = mc.getColumn();
       this.rowlist.add(thisColumn, "");
     }
 
     if ((record instanceof LastCellOfRowDummyRecord)) {
       int tmpCols = this.rowlist.size();
       if ((this.curRow > this.titleRow) && (tmpCols < this.rowsize)) {
         for (int i = 0; i < this.rowsize - tmpCols; i++) {
           this.rowlist.add(this.rowlist.size(), "");
         }
       }
       this.rowReader.getRows(this.sheetIndex, this.curRow, this.rowlist);
       if (this.curRow == this.titleRow) {
         this.rowsize = this.rowlist.size();
       }
       this.rowlist.clear();
     }
   }
 }

