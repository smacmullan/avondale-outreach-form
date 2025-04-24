function doPost(e) {

  if (!e.postData || !e.postData.contents) {
    return ContentService.createTextOutput("Invalid Request").setMimeType(ContentService.MimeType.TEXT);
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Append data
    sheet.appendRow([data.name, data.email, data.address, data.phone, data.newsletters, data.blockClubInterest, data.formVersion, new Date()]);

    return ContentService.createTextOutput(JSON.stringify({ status: "Success", message: "Data added" }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "Error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}