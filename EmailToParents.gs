function sendEmailToParents() {
  var dbSheetName = "DB";
  var emailDataSheetName = "Email Template";
  var statusColumnIndex = "AA1";
  var timeStampColumnIndex = "AB1";
  //var sendEmailTo = "Father";
  var sendEmailTo = "Mother";

  var ss = SpreadsheetApp.getActive();
  var dbSheet = ss.getSheetByName( dbSheetName );
  var emailSheet = ss.getSheetByName( emailDataSheetName );

  var emailTemplate = emailSheet.getRange("A1").getValue();

  // Start from first row and column
  var numRows = dbSheet.getMaxRows();
  var numColumns = dbSheet.getMaxColumns();
  var numEmailsSent = 0;
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

    if (sendEmailTo == "Father") {
      var emailAddr = rowData.fatherEmail;
    } else {
      var emailAddr = rowData.motherEmail;
    }
    if (!emailAddr) {
      continue;
    }
    
    // Send an email only if 'Email Status' column is 'send'
    if ( ( !rowData.email1Status ) || ( rowData.email1Status.toLowerCase() != "send" ) ) {
      continue;
    }
    
    Logger.log( emailAddr );
    
    // Generate a personalized email.
    // Given a template string, replace markers (for instance ${"First Name"}) with
    // the corresponding value in a row object (for instance rowData.firstName).
    var emailText = fillInTemplateFromObject(emailTemplate, rowData);
    var emailSubject = "[SJ Mandir] Classes Registration Confirmation for " + rowData.studentFirstName;
    // MailApp.sendEmail(emailAddr, emailSubject, emailText);
    MailApp.sendEmail(emailAddr, emailSubject, "", { htmlBody: emailText } );
    
    // Update email sent status
    var now = new Date();
    emailSentTime = now.toLocaleTimeString();
    dbSheet.getRange( statusColumnIndex ).offset( i, 0 ).setValue( "Sent" );
    dbSheet.getRange( timeStampColumnIndex ).offset( i, 0 ).setValue( emailSentTime );

    numEmailsSent += 1;
    if (numEmailsSent >= 100) {
      // Send only 100 emails per day
      break;
    }
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

/*
 * Function to populate pre-filled URL for every student record
 */
function updateContactURL() {
  var dbSheetName = "DB";
  var urlColumnIndex = "AC1";

  var ss = SpreadsheetApp.getActive();
  var dbSheet = ss.getSheetByName( dbSheetName );

  var formURL = SpreadsheetApp.getActive().getFormUrl();
  var form = FormApp.openByUrl(formURL);
  var items = form.getItems();
 
  // Start from first row and column
  var numRows = dbSheet.getMaxRows();
  var numColumns = dbSheet.getMaxColumns();
  var dataRange = dbSheet.getRange( 1, 1, numRows, numColumns );

  // Create one JavaScript object per row of data.
  var objects = getRowsData(dbSheet, dataRange, 1);
  
  // Skip headers, then build URLs for each row in Sheet.
  for (var i = 0; i < objects.length; ++i) {
    if (i == 0) {
      // Skip header row
      continue;
    }
    
    // Get a row object
    var rowData = objects[i];

    var formResponse = form.createResponse();

    var formItem = items[1].asTextItem();
    var response = formItem.createResponse( rowData.studentFirstName );
    formResponse.withItemResponse(response);

    var formItem = items[2].asTextItem();
    var response = formItem.createResponse( rowData.studentLastName );
    formResponse.withItemResponse(response);

    var formItem = items[3].asMultipleChoiceItem();
    var response = formItem.createResponse( rowData.gender );
    formResponse.withItemResponse(response);

    // Skip Section Header item #4
    
    var formItem = items[5].asTextItem();
    var response = formItem.createResponse( rowData.fatherName );
    formResponse.withItemResponse(response);

    var formItem = items[6].asTextItem();
    var response = formItem.createResponse( rowData.motherName );
    formResponse.withItemResponse(response);

    if (rowData.fatherEmail) {
      var formItem = items[7].asTextItem();
      var response = formItem.createResponse( rowData.fatherEmail );
      formResponse.withItemResponse(response);
    }

    if (rowData.motherEmail) {
      var formItem = items[8].asTextItem();
      var response = formItem.createResponse( rowData.motherEmail );
      formResponse.withItemResponse(response);
    }

    if (rowData.fatherCellNumber) {
      var formItem = items[9].asTextItem();
      var response = formItem.createResponse( rowData.fatherCellNumber );
      formResponse.withItemResponse(response);
    }

    if (rowData.motherCellNumber) {
      var formItem = items[10].asTextItem();
      var response = formItem.createResponse( rowData.motherCellNumber );
      formResponse.withItemResponse(response);
    }

    var formItem = items[11].asTextItem();
    var response = formItem.createResponse( rowData.address );
    formResponse.withItemResponse(response);

    var formItem = items[12].asTextItem();
    var response = formItem.createResponse( rowData.city );
    formResponse.withItemResponse(response);

    var formItem = items[13].asMultipleChoiceItem();
    var response = formItem.createResponse( rowData.state );
    formResponse.withItemResponse(response);

    var formItem = items[14].asTextItem();
    var response = formItem.createResponse( rowData.zipCode );
    formResponse.withItemResponse(response);
    
    var preFilledUrl = formResponse.toPrefilledUrl();
    dbSheet.getRange( urlColumnIndex ).offset( i, 0 ).setValue( preFilledUrl );    
  }
}


//////////////////////////////////////////////////////////////////////////////////////////
//
// The code below is reused from the 'Reading Spreadsheet data using JavaScript Objects'
// tutorial.
//
//////////////////////////////////////////////////////////////////////////////////////////

// getRowsData iterates row by row in the input range and returns an array of objects.
// Each object contains all the data for a given row, indexed by its normalized column name.
// Arguments:
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - columnHeadersRowIndex: specifies the row number where the column names are stored.
//       This argument is optional and it defaults to the row immediately above range;
// Returns an Array of objects.
function getRowsData(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getEndColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return getObjects(range.getValues(), normalizeHeaders(headers));
}

// For every row of data in data, generates an object that contains the data. Names of
// object fields are defined in keys.
// Arguments:
//   - data: JavaScript 2d array
//   - keys: Array of Strings that define the property names for the objects to create
function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}

// Returns an Array of normalized Strings.
// Arguments:
//   - headers: Array of Strings to normalize
function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}

// Normalizes a string, by removing all alphanumeric characters and using mixed case
// to separate words. The output will always start with a lower case letter.
// This function is designed to produce JavaScript object property names.
// Arguments:
//   - header: string to normalize
// Examples:
//   "First Name" -> "firstName"
//   "Market Cap (millions) -> "marketCapMillions
//   "1 number at the beginning is ignored" -> "numberAtTheBeginningIsIgnored"
function normalizeHeader(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}

// Returns true if the cell where cellData was read from is empty.
// Arguments:
//   - cellData: string
function isCellEmpty(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}

// Returns true if the character char is alphabetical, false otherwise.
function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}

// Returns true if the character char is a digit, false otherwise.
function isDigit(char) {
  return char >= '0' && char <= '9';
}
