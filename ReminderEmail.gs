var statusUpdateColumnIndex = "B1"
var sheetNameEnum = {
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
    ANYTIME: "Anytime",
}
  
function sendReminderEmail() {
  var ss = SpreadsheetApp.getActive();
  var emailSheet = ss.getSheetByName( "Email List" );

  // Get the list of emails
  var numRows = emailSheet.getMaxRows();
  var numColumns = 1;
  // skip reading header row
  var dataRange = emailSheet.getRange( 2, 1, numRows, numColumns );

  var emailList = dataRange.getValues();
  
  var allEmails = "";
  for (var i = 0; i < emailList.length; ++i) {
    var emailAddr = emailList[i].toString();
    if (emailAddr == "") {
      break;
    }
    
    if (emailAddr.toLowerCase() == "self") {
      emailAddr = Session.getEffectiveUser().getEmail();
    }
    
    if (allEmails == "") {
      allEmails = emailAddr;
    } else {
      allEmails = allEmails + "," + emailAddr;
    }
  }
  
  Logger.log(allEmails);
  for (i in sheetNameEnum) {
    processSheet( sheetNameEnum[i] );
  }
  
}

function processSheet( sheetName ) {  
  Logger.log("processSheet for " + sheetName);

  var ss = SpreadsheetApp.getActive();
  var dataSheet = ss.getSheetByName( sheetName );
  
  // Get the list of emails
  var numRows = dataSheet.getMaxRows();
  var numColumns = dataSheet.getMaxColumns();
  var dataRange = dataSheet.getRange( 1, 1, numRows, numColumns );
  
  // Create one JavaScript object per row of data.
  var objects = getRowsData(dataSheet, dataRange, 1);
  
  var numEmailsSent = 0;

  var now = new Date();
  var todayDay = now.getDate();  // Get only day
  var todayMonth = now.getMonth();
  
  // Skip headers, then build URLs for each row in Sheet1.
  for (var i = 0; i < objects.length; ++i) {
    if (i < 2) {
      // Skip 2 header rows
      continue;
    }
    
    // Get a row object
    var rowData = objects[i];
    
    var remindDay = 0;
    var remindMonth = "";
    var remindDate = ""
    if (sheetName == sheetNameEnum.MONTHLY) {
      remindDay = rowData.remindIt;
      if (remindDay != todayDay) {
        continue;
      }
    } else if (sheetName == sheetNameEnum.YEARLY) {
      remindDate = new Date(rowData.remindIt);
      remindDay = remindDate.getDate();
      remindMonth = remindDate.getMonth();
      if (remindDay != todayDay) {
        continue;
      }
      if (remindMonth != todayMonth) {
        continue;
      }      
    } else if (sheetName == sheetNameEnum.ANYTIME) {
      remindDate = new Date(rowData.remindIt);
      if (remindDate.toLocaleDateString() != now.toLocaleDateString()) {
        continue;
      }
    }
    
    var emailText = "Task " + rowData.task + " is due on " + rowData.dueDate;
    var emailSubject = "YAR - " + rowData.task;
    //MailApp.sendEmail(allEmails, emailSubject, "", { htmlBody: emailText } );
    
    // Update email sent status
    emailSentTime = now.toLocaleString();
    dataSheet.getRange( statusUpdateColumnIndex ).offset( i, 0 ).setValue( emailSentTime );

    numEmailsSent += 1;
    if (numEmailsSent >= 100) {
      // Send only 100 emails per day
      break;
    }
  }
  
  Logger.log( "Number of emails sent = " + numEmailsSent );
};
