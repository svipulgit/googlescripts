function sendEmailToParents() {
  var dbSheetName = "DB";
  var emailDataSheetName = "Email Template";
  var statusColumnIndex = "W1";
  var timeStampColumnIndex = "X1";

  var ss = SpreadsheetApp.getActive();
  var dbSheet = ss.getSheetByName( dbSheetName );
  var emailSheet = ss.getSheetByName( emailDataSheetName );

  var emailTemplate = emailSheet.getRange("A1").getValue();

  // Start from first row and column
  var numRows = dbSheet.getMaxRows();
  var numColumns = dbSheet.getMaxColumns();
  var numEmailsSent = 0;
  var numEmailsLimit = 98;   // Limit the number of emails sent per day to 100
  var dataRange = dbSheet.getRange( 1, 1, numRows, numColumns );

  // Create one JavaScript object per row of data.
  var objects = getRowsData(dbSheet, dataRange, 1);
  
  // Skip headers, then build URLs for each row in Sheet1.
  for (var i = 0; i < objects.length; ++i) {
    if (i == 0) {
      // Skip header row
      continue;
    }
    
    // Get a row object
    var rowData = objects[i];

    var emailAddr1 = rowData.fatherEmail;
    var emailAddr2 = rowData.motherEmail;
    var toEmailAddr = "";
    var numEmails = 0;
    if (emailAddr1 && emailAddr2) {
      toEmailAddr = emailAddr1 + "," + emailAddr2;
      numEmails = 2;
    } else if (emailAddr1) {
      toEmailAddr = emailAddr1;
      numEmails = 1;
    } else if (emailAddr2) {
      toEmailAddr = emailAddr2;
      numEmails = 1;
    } else {
      // This should not happen. We should have at least one valid email!!
      continue;
    }
    
    if (numEmailsSent + numEmails > numEmailsLimit) {
      break;
    }
    // Send an email only if 'Email Status' column is 'send'
    if ( ( !rowData.emailStatus ) || ( rowData.emailStatus.toLowerCase() != "send" ) ) {
      continue;
    }
        
    // Generate a personalized email.
    // Given a template string, replace markers (for instance ${"First Name"}) with
    // the corresponding value in a row object (for instance rowData.firstName).
    var emailText = fillInTemplateFromObject(emailTemplate, rowData);
    var emailSubject = "[SJ Mandir] Gujarati Class Exam Result for " + rowData.studentFirstName;
    // MailApp.sendEmail(toEmailAddr, emailSubject, emailText);
    MailApp.sendEmail(toEmailAddr, emailSubject, "", { htmlBody: emailText } );
    
    // Update email sent status
    var now = new Date();
    emailSentTime = now.toLocaleString();
    dbSheet.getRange( statusColumnIndex ).offset( i, 0 ).setValue( "Sent" );
    dbSheet.getRange( timeStampColumnIndex ).offset( i, 0 ).setValue( emailSentTime );

    numEmailsSent += numEmails;
  }
  
  Logger.log( "Number of emails sent = " + numEmailsSent );
};



// Replaces markers in a template string with values define in a JavaScript data object.
// Arguments:
//   - template: string containing markers, for instance ${"Column name"}
//   - data: JavaScript object with values to that will replace markers. For instance
//           data.columnName will replace marker ${"Column name"}
// Returns a string without markers. If no data is found to replace a marker, it is
// simply removed.
function fillInTemplateFromObject(template, data) {
  var email = template;
  // Search for all the variables to be replaced, for instance ${"Column name"}
  var templateVars = template.match(/\$\{\"[^\"]+\"\}/g);

  // Replace variables from the template with the actual values from the data object.
  // If no value is available, replace with the empty string.
  for (var i = 0; i < templateVars.length; ++i) {
    // normalizeHeader ignores ${"} so we can call it directly here.
    var variableData = data[normalizeHeader(templateVars[i])];
    email = email.replace(templateVars[i], variableData || "");
  }

  return email;
}
