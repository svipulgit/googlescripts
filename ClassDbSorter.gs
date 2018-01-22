function gujClassSorter() {
  var classType = "Gujarati"
  var classList = [  "G0", "G1", "G2", "G3", "G4", "G5", "G6" ];
  var dbSheetName = "DB";
  var targetFileName = "SJ Mandir Boys Gujarati Class DB";
  var targetSheetName = "";    // target sheet is same as class name
  var dataType = "DB"

  classSorter( classType, classList, dbSheetName, targetFileName, targetSheetName, dataType );
}

function musicClassSorter() {
  var classType = "Music"
  var classList = [ "K1", "K2", "K3", "K4", "T1", "T2", "T3", "T4", "T5" ];
  var dbSheetName = "DB";
  var targetFileName = "SJ Mandir Boys Music Class DB";
  var targetSheetName = "";    // target sheet is same as class name
  var dataType = "DB"

  classSorter( classType, classList, dbSheetName, targetFileName, targetSheetName, dataType );
}

function gujClassResultSorter() {
  var classType = "Gujarati"
  var classList = [  "G0", "G1", "G2", "G3", "G4", "G5", "G6" ];
  var dbSheetName = "DB";
  var targetFileName = "SJ Mandir Boys Gujarati Results 2018";
  var targetSheetName = "";    // target sheet is same as class name
  var dataType = "GujResult"

  classSorter( classType, classList, dbSheetName, targetFileName, targetSheetName, dataType );
}

function musicClassResultSorter() {
  var classType = "Music"
  var classList = [ "K1", "K2", "K3", "K4", "T1", "T2", "T3", "T4", "T5" ];
  var dbSheetName = "DB";
  var targetFileName = "SJ Mandir Boys Music Mid-term Results 2018";
  var targetSheetName = "";    // target sheet is same as class name
  var dataType = "MusicResult"

  classSorter( classType, classList, dbSheetName, targetFileName, targetSheetName, dataType );
}

// Not used
function gujParentsEmails() {
  var classType = "Gujarati"
  var classList = [  "G0", "G1", "G2" ];
  var dbSheetName = "DB";
  var targetFileName = "SJ Mandir Classes Parents Email";
  var targetSheetName = "BoysGuj";
  var dataType = "Emails"

  classSorter( classType, classList, dbSheetName, targetFileName, targetSheetName, dataType );
}

// Not used
function musicParentsEmails() {
  var classType = "Music"
  var classList = [ "K1", "K2", "K3" ];
  var dbSheetName = "DB";
  var targetFileName = "SJ Mandir Classes Parents Email";
  var targetSheetName = "BoysMusic";
  var dataType = "Emails"

  classSorter( classType, classList, dbSheetName, targetFileName, targetSheetName, dataType );
}

// Common for Gujarati & Music
function allEmails() {
  var classType = ""
  var classList = [];
  var dbSheetName = "DB";
  var targetFileName = "SJ Mandir Classes Parents Email";
  var targetSheetName = "BoysEmails";
  var dataType = "AllEmails"

  classSorter( classType, classList, dbSheetName, targetFileName, targetSheetName, dataType );
}

function classSorter(classType, classList, dbSheetName, targetFileName, targetSheetName, dataType) {
  var ss = SpreadsheetApp.getActive();
  var dbSheet = ss.getSheetByName( dbSheetName );

  var targetFiles = DriveApp.getFilesByName( targetFileName );
  var targetSs = SpreadsheetApp.open( targetFiles.next() );
  
  var numRows = dbSheet.getMaxRows();
  var numColumns = dbSheet.getMaxColumns();
  var dataRange = dbSheet.getRange( 1, 1, numRows, numColumns );

  // Create one JavaScript object per row of data.
  var objects = getRowsData(dbSheet, dataRange, 1);
  
  var tabName = targetSheetName;
  if ( (dataType == "Emails") || (dataType == "AllEmails") ) {
    classPrinter( objects, classType, targetSs, tabName, classList, dataType );
  } else {
    for (var c in classList ) {
      tabName = classList[ c ];
      classPrinter( objects, classType, targetSs, tabName, classList, dataType );
    }
  }
}

function classPrinter( objects, classType, targetSs, tabName, classList, dataType ) {
  var tr = 1;    // Target sheet row offset

  var targetTab = targetSs.getSheetByName( tabName );
  if( targetTab == null ) {
    targetSs.insertSheet( tabName );
    targetTab = targetSs.getSheetByName( tabName );
  }
  targetTab.clearContents();
    
  for (var i = 0; i < objects.length; ++i) {

    // Get a row object
    var rowData = objects[i];
    
    var firstName = rowData.studentFirstName;
    var lastName = rowData.studentLastName;
    var schoolGrade = rowData.schoolGradeGrade;
    var fatherName = rowData.fatherName;
    var motherName = rowData.motherName;
    var fatherEmail = rowData.fatherEmail;
    var motherEmail = rowData.motherEmail;
    var grade = "Unknown";
    
    // For empty field, the rowData vaule is 'None' and it is printed as 'undefined'.
    if (!fatherEmail) {
      fatherEmail = "";
    }
    if (!motherEmail) {
      motherEmail = "";
    }

    if (classType == "Music") {
      grade = rowData.musicClass;
    } else {
      grade = rowData.gujClass;
    }

    // Logger.log( firstName );
    
    // Filter the rows which doesn't meet the criteria
    if (dataType == "Emails") {
      if (i == 0) {
        // Skip header row when printing only emails
        continue;
      }
      if ( !grade ) {
        // skip emails where student grade is empty
        continue;
      }
    } else if (dataType == "AllEmails") {
      if (i == 0) {
        // Skip header row when printing only emails
        continue;
      }
    } else {
      if ( (i > 0) && (grade != tabName) ) {
        // For non-header row, try to match the gader with destination tabName
        continue;
      }
    }
    
    var targetValues = [];

    if (dataType == "DB") {
      targetValues = [ [ firstName, lastName, schoolGrade, fatherName, motherName, fatherEmail, motherEmail ],
                     ];
      targetTab.getRange( tr, 1, 1, targetValues[0].length ).setValues( targetValues );
      tr++;
    } else if (dataType == "MusicResult") {
      var q1 = "Q1";
      var q2 = "Q2";
      var q3 = "Q3";
      var q4 = "Q4";
      var q5 = "Q5";
      var tot = "Total";
      var comm = "Comments";
      if (i == 0) {
        // header row
        targetValues = [ [ firstName, lastName, q1, q1, q3, q4, q5, tot, comm ], ];
      } else {
        targetValues = [ [ firstName, lastName ], ];
      }
      targetTab.getRange( tr, 1, 1, targetValues[0].length ).setValues( targetValues );
      tr++;
    } else if (dataType == "GujResult") {
      var hw = "HW";
      var presence = "Presence";
      var midterm = "MidTerm (50)";
      var final = "Final (50)";
      var tot = "Total (100)";
      var pass = "Pass/Fail";
      var comm = "Comments";
      if (i == 0) {
        // header row
        targetValues = [ [ firstName, lastName, hw, presence, midterm, final, tot, pass, comm ], ];
      } else {
        targetValues = [ [ firstName, lastName ], ];
      }
      targetTab.getRange( tr, 1, 1, targetValues[0].length ).setValues( targetValues );
      tr++;
    } else {
      var numEmails = 0;
      if (fatherEmail && motherEmail) {
        targetValues = [ [ fatherEmail ], [ motherEmail ], ];
        numEmails = 2;
      } else if (fatherEmail) {
         targetValues = [ [ fatherEmail ], ];
         numEmails = 1;
      } else if (motherEmail) {
         targetValues = [ [ motherEmail ], ];
         numEmails = 1;
      }
      targetTab.getRange( tr, 1, numEmails, 1 ).setValues( targetValues );
      tr = tr + numEmails;
    }
                        
    //if (i > 20) {
    //  break;
    //}
  }
}
