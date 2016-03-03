
//Google Apps User Manager Script v1.0
//add to a google sheet via the script editior

function suspenduser() {
var sheet = SpreadsheetApp.getActiveSpreadsheet();
var suspensiononly = sheet.getSheetByName("Suspension only");
var range = suspensiononly.getDataRange();
var numRows = range.getNumRows();
var values = range.getValues();
var timedatenow = new Date();
  
for(i=1;i<values.length;++i){
var datecell = suspensiononly.setActiveSelection("D"+[i+1])
var blankcheck = datecell.isBlank()
var suspendedalready = suspensiononly.setActiveSelection("E"+[i+1])
var errorcheck = suspendedalready.getValue()
Logger.log("IS DATE FIELD BLANK THIS ITERATION " + i + " " + blankcheck)


if (values[i][3] > timedatenow || blankcheck == true) {
    Logger.log(values[i][3] +" IS LATER THAN " + timedatenow)
    Logger.log("NO ACTION REQUIRED FOR " + values[i][2] )
  } 
  
   else {
   Logger.log(values[i][3] +" IS EARLIER THAN " + timedatenow)
   var setsuspendflag = {suspended: true} 
   Logger.log(errorcheck)
      if (errorcheck != "YES" && errorcheck != "ERROR"){
      
        try {
        var dosuspend = AdminDirectory.Users.update(setsuspendflag, values[i][2] + "@example.com" )
        var JSONresponsestr = JSON.stringify(dosuspend)
        Logger.log(JSONresponsestr + "\n"+ "\n");
        var parseresponse = JSONresponsestr.indexOf('"suspended":true');
        if (parseresponse > -1) 
          var suspstr = "SUSPEND STRING FOUND!"
        else
          var suspstr = "NO SUSPEND STRING FOUND!"  
        Logger.log(suspstr)
        } catch (e) {
          var sheet = SpreadsheetApp.getActiveSpreadsheet();
          var suspensiononly = sheet.getSheetByName("Suspension only");
          var range = suspensiononly.getDataRange();
          var numRows = range.getNumRows();
          var values = range.getValues();
          var suspendedalready = suspensiononly.setActiveSelection("E"+[i+1])
          //Logger.log(suspendedalready)
          suspendedalready.setValue("ERROR")
          var errorcode = suspensiononly.setActiveSelection("F"+[i+1])
          errorcode.setValue(e.message+ " " + e.fileName + " " + "line: " + e.lineNumber)
          MailApp.sendEmail("msadler@example.com",
                 "GAUM Script FAILED to suspend " + "  " + values[i][2] + "  ",
                            "Check you have typed the email address right and that the account exists " + "\n" + "\n" + "Requested by: " + values[i][1] + "\n" + "\n" + "ERROR Details: " + "\n" + "\n" + e.message+ "\n" + e.fileName + "\n" + "line number" + e.lineNumber );
          
          Logger.log("EXCEPTION CAUGHT:" + e.message+ "\n" + e.fileName + "\n" + "line: " + e.lineNumber)
          }
      
   
}
var errorcheck = suspendedalready.getValue()     
Logger.log(errorcheck)
 if (errorcheck != "ERROR" && errorcheck != "YES" && values[i][3] < timedatenow && blankcheck != true && parseresponse > -1) {
      Logger.log("REACHED HERE")
      Logger.log(parseresponse)
      suspendedalready.setValue("YES")
      MailApp.sendEmail("msadler@example.com",
                   values[i][2] + " has been successfully suspended by GAUM",
                    " This was requested by: " + values[i][1] + "\n" +"\n" + "Below is the returned JSON response"+ "\n" + "\n" + suspstr + "\n"+ "\n" + JSONresponsestr);
 }

}
}
}




//function adduser() {
//var sheet = SpreadsheetApp.getActiveSpreadsheet();
//var createandsuspend = sheet.getSheetByName("Creation/Suspension");
//var range = createandsuspend.getDataRange();
//var numRows = range.getNumRows();
//var values = range.getValues();
//
//var timedatenow = new Date();
//  
//for(i=1;i<values.length;++i){
//var datecell = createandsuspend.setActiveSelection("J"+[i+1])
//var blankcheck = datecell.isBlank()
//Logger.log("IS DATE FIELD BLANK THIS ITERATION " + i + " " + blankcheck)
//
//if (values[i][9] > timedatenow || blankcheck == true) {
//    Logger.log(values[i][9] +" IS LATER THAN " + timedatenow)
//    Logger.log("NO ACTION REQUIRED")
//  } 
//  
//   else {
//   Logger.log(values[i][9] +" IS EARLIER THAN " + timedatenow)
//   //var setsuspendflag = {suspended: true}
//   var createdalready = createandsuspend.setActiveSelection("L"+[i+1])
//var errorcheck = createdalready.getValue() 
//Logger.log(errorcheck)
//      if (errorcheck != "YES" && errorcheck != "ERROR"){
//      
//        try {
//          var desc = values[i][7]
//          Logger.log(desc)
//          var user1= {  
//    
//    name: [
//  {
//      givenName: values[i][2],
//      familyName: values[i][3],
//    }
//      ],
//  organizations: [
//  {
//    description: desc 
//  }
//    ],
//  emails: [
//  {
//   address: values[i][4],
//   type: "custom",
//   customType: ""
//  },
// {
//   address: values[i][5] +"@example.com",
//   "primary": true
//  }         
//          ],
//          }
//          
//          var docreate = AdminDirectory.Users.update(user1, values[i][5] + "@example.com" )
//        var JSONresponsestr = JSON.stringify(docreate)
//        Logger.log(JSONresponsestr + "\n"+ "\n");
//        //var parseresponse = JSONresponsestr.indexOf('"suspended":true');
//        //Logger.log(parseresponse)
//        } catch (e) {
//          var sheet = SpreadsheetApp.getActiveSpreadsheet();
//          var createandsuspend = sheet.getSheetByName("Creation/Suspension");
//          var range = createandsuspend.getDataRange();
//          var numRows = range.getNumRows();
//          var values = range.getValues();
//          var createdalready = createandsuspend.setActiveSelection("L"+[i+1])
//          Logger.log(createdalready)
//          createdalready.setValue("ERROR")
//          var errorcode = createandsuspend.setActiveSelection("N"+[i+1])
//          errorcode.setValue(e.message+ " " + e.fileName + " " + "line: " + e.lineNumber)
//MailApp.sendEmail("msadler@example.com",
//     "GAUM Script FAILED to create " + "  " + values[i][5] + "  ",
//                 "" + "\n" + "\n" + "Requested by: " + values[i][1] + "\n" + "\n" + "ERROR Details: " + "\n" + "\n" + e.message+ "\n" + e.fileName + "\n" + "line number" + e.lineNumber );
//          
//          Logger.log("EXCEPTION CAUGHT:" + e.message+ "\n" + e.fileName + "\n" + "line: " + e.lineNumber)
//          }
//      
//   
//}
//var errorcheck = createdalready.getValue()     
//Logger.log(errorcheck)
//
////add && blankcheck == true
//if (errorcheck != "ERROR" && errorcheck != "YES" && values[i][9] > timedatenow && blankcheck == true ) {
//      Logger.log("REACHED HERE")
//      createdalready.setValue("YES")
//      MailApp.sendEmail("email@example.com",
//                   values[i][5] + " has been successfully updated by GAUM",
//                    " This was requested by: " + values[i][1] + "\n" +"\n" + "Below is the returned JSON response"+ "\n"+ "\n" + JSONresponsestr);
// }
//
//}
//}
//}
