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
