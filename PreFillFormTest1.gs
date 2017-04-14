/**
 * Use Form API to generate pre-filled form URLs
 */
function betterBuildUrls() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("Backup");
  var data = ss.getDataRange().getValues();  // Data for pre-fill

  var formUrl = ss.getFormUrl();             // Use form attached to sheet
  var form = FormApp.openByUrl(formUrl);
  var items = form.getItems();

  // Skip headers, then build URLs for each row in Sheet1.
  for (var i = 1; i < data.length; i++ ) {

    // Get a row object
    var rowData = data[i];
    Logger.log(rowData.birthDate);
    Logger.log(rowData.fathersEmail);
    
    // Create a form response object, and prefill it
    var formResponse = form.createResponse();

    // Prefill ID
    var formItem = items[0].asTextItem();
    var response = formItem.createResponse(data[i][1]);
    formResponse.withItemResponse(response);

    // Prefill First Name
    var formItem = items[1].asTextItem();
    var response = formItem.createResponse(data[i][2]);
    formResponse.withItemResponse(response);

    // Prefill Birthday
    formItem = items[3].asDateItem();
    response = formItem.createResponse(data[i][4]);
    formResponse.withItemResponse(response);

    // Get prefilled form URL
    var url = formResponse.toPrefilledUrl();
    Logger.log(url);  // You could do something more useful here.
    // MailApp.sendEmail(rowData.fathersEmail, emailSubject, emailText);
    var emailSubject = "Hi " + data[i][2] + ", This is your registration link";
    //MailApp.sendEmail(data[i][11], emailSubject, url);
  }
};

