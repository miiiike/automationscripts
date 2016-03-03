//Fail2ban email log analysis script v1.0

//runs on script.google.com 

function getEmails() {

  
  //month names to display the month name in the email supject using datenow.getMonth as the array index
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  
  //gmail label to watch (the label of the user that runs the script)
  var label = "Fail2Ban";
  var servername1attacks = 0
  var servername2attacks = 0
  var datenow = new Date(); 
  var prevmonth = new Date(datenow.getTime()-30*(24*3600*1000));
  var getlabel = GmailApp.getUserLabelByName(label);
  var threads = getlabel.getThreads();

  var speadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet1 = speadsheet.getSheetByName("Sheet1");
  var datarange = sheet1.getDataRange(); 
  var RowNum = 1;
  var messages = GmailApp.getMessagesForThreads(threads); //gets messages in 2D array
  var servername1IPlist = {}; //objects for the IPs (used objects instead of arrays because elements can be assigned properties e.g. an associated duplicate counter) 
  var servername2IPlist = {};
  var nonsshnum = 0;
  var nonssharray = [];
  for (i = 0; i < messages.length; ++i)  { //iterates through the threads 
      var ThreadLen = messages[i];
      
    for (j = 0; j < ThreadLen.length; ++j) {  //iterates through the messages in each thread
       
       //var messageBody = ThreadLen[j].getPlainBody(); //gets body of message in Plain Text
       var messageSubject = ThreadLen[j].getSubject(); 
       var messageDate = ThreadLen[j].getDate(); 
       //var messageFrom = messages[i][j-1].getFrom();
          
      var parsedIP = messageSubject.match(/\b([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\b/); //regex selects IP addresses 
      if (messageSubject.indexOf("ssh") <=0){
      nonssh++
        nonssharray[nonssharray.length] = messageSubject
      }
      
      if (messageDate >= prevmonth && messageSubject.indexOf("servername1") >0){
      
        if(!servername1IPlist.hasOwnProperty(parsedIP[0])) {
          servername1IPlist[parsedIP[0]] = 1;
        } else {
            servername1IPlist[parsedIP[0]] = servername1IPlist[parsedIP[0]] + 1;
        }
        //Logger.log(parsedIP[0] + " " + messageDate)
      }
      else if (messageDate >= prevmonth && messageSubject.indexOf("servername2") >0){ 
      if(!servername2IPlist.hasOwnProperty(parsedIP[0])) {
          servername2IPlist[parsedIP[0]] = 1;
        } else {
            servername2IPlist[parsedIP[0]] = servername2IPlist[parsedIP[0]] + 1;
        //servername2IPlist[servername2IPlist.length] = parsedIP[0]
      
        //Logger.log(parsedIP[0] + " " + messageDate)
        }
      } 
      else {continue} //end of separate array creation 
      
      

      if (messageSubject.indexOf("servername1") >0){servername1attacks++}
    if (messageSubject.indexOf("servername2") >0){servername2attacks++}       
       } // end of for loop
}
Logger.log("servername1 has been attacked " + servername1attacks + " times");
Logger.log("servername2 has been attacked " + servername2attacks + " times");


var servername1dupcount = [];
var servername2dupcount = [];

createkeypair(servername1IPlist,servername1dupcount);
createkeypair(servername2IPlist,servername2dupcount);
  
  //turns the ip objects into an array of key/value pairs with tot being the amount of times that ip was found again in the list 
  function createkeypair(IParray, dupcounter){
  for (var k in IParray) {
        if (IParray.hasOwnProperty(k)) {
          dupcounter.push( { 'ip': k, 'tot': IParray[k] } );
        }
    }
} 
  
  sortlist(servername1dupcount);
  sortlist(servername2dupcount);
  
  //sorts the keyedpair objects into descending order by total column  
  function sortlist(keyedpair) {
  keyedpair.sort(function (a, b) {
  if (a.tot > b.tot) {
    return -1;
  }
  if (a.tot < b.tot) {
    return 1;
  }
  // a must be equal to b
  return 0;
})
  }
  
// print the appropriate non-ssh attack notify string for the email 
  var sshnotify
  var totalattacks = servername1attacks + servername2attacks
if (nonsshnum > 0){
  sshnotify = "There have been "+ nonsshnum + " non-ssh based attacks this month"
  Logger.log(nonssharray)
  } 
  else {sshnotify = "There have been 0 non-ssh based attacks this month" }
  
MailApp.sendEmail("msadler@example.com",
                  "Fail2ban Report for "+  monthNames[datenow.getMonth()] + " " + datenow.getYear(),
                   "Total Attacks This Month: " + totalattacks + "\n" + "\n" + "servername1 has been attacked " + servername1attacks + " times" + "\n" + "\n" + "servername2 has been attacked " + servername2attacks + " times" + "\n" + "\n" + "Top 5 Ip Addresses attacking servername1" + "\n" + "\n" +
                  ("1.  " + servername1dupcount[0].ip + ' attacked ' + servername1dupcount[0].tot + ' times')+ "\n" +
                  ("2.  " + servername1dupcount[1].ip + ' attacked ' + servername1dupcount[1].tot + ' times')+ "\n" +
                  ("3.  " + servername1dupcount[2].ip + ' attacked ' + servername1dupcount[2].tot + ' times')+ "\n" +
                  ("4.  " + servername1dupcount[3].ip + ' attacked ' + servername1dupcount[3].tot + ' times')+ "\n" +
                  ("5.  " + servername1dupcount[4].ip + ' attacked ' + servername1dupcount[4].tot + ' times')+ "\n" +
                  "\n" + "\n" + 
                  "Top 5 Ip Addresses attacking servername2" + "\n" + "\n" +
                  ("1. " + servername2dupcount[0].ip + ' attacked ' + servername2dupcount[0].tot + ' times')+ "\n" +
                  ("2. " + servername2dupcount[1].ip + ' attacked ' + servername2dupcount[1].tot + ' times')+ "\n" +
                  ("3. " + servername2dupcount[2].ip + ' attacked ' + servername2dupcount[2].tot + ' times')+ "\n" +
                  ("4. " + servername2dupcount[3].ip + ' attacked ' + servername2dupcount[3].tot + ' times')+ "\n" +
                  ("5. " + servername2dupcount[4].ip + ' attacked ' + servername2dupcount[4].tot + ' times')+ "\n" +
                  "\n" + "\n" + 
                   sshnotify)
  
  
} //end of getEmails function 
    
