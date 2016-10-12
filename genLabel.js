
 /*genLabel.git
  * Tommy Rojo
  *  tommy.rojo@stu.bmcc.cuny.edu
  *
  *
  */

var env = require("./config.js");
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs"); //truncated, dont need anymore
var blobStream = require("blob-stream");
var path = require("path"); //apparently i need __dirname, no relative roots
var PDFDocument = require("pdfkit");

var app = express();


/****************************************
 * Begin PDFKit Configuration (1x1.5 sticky label)
 ****************************************
 */

doc = new PDFDocument(
 { //72.00 - 1 inch, 108.00 - 1.5 inch?
  size:[108.00,72.00],
  margin:10
 }
);
doc.fontSize(18);


///////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:"true" }));

app.listen(env.port,function() {
 console.log("genLabel -- PDF Generator for zebra label makers");
 console.log("Tommy Rojo -- tommy.rojo@stu.bmcc.cuny.edu");
 console.log("[INFO] Starting genLabel daemon on port: " + env.port);
});
/*
app.route("/")
 .get(function(req,res){
   res.sendFile(path.join(__dirname+"/views/index.html"));
 }
); //end .get request
*/

app.use("/", express.static("./views"));

app.post("/genLabel", function(req,res) {
 console.log("/genLabel query:", req.body);
 genPdf(doc, blobStream, req.body.docTitle,req.body.docPayload); //make sure to change this, do i need a callback?
 res.send(req.body);

});

function genPdf(doc, blobStream, docTitle, docPayload, callback) {
 console.log("genPdf() Payload: ", docTitle, docPayload);
 doc.text(docTitle, { //First line
  align:'center'
 });
 doc.text(docPayload, {
  align:'center'
 });

 stream = doc.pipe(blobStream())
 //console.log("STREAM", stream);
 doc.end()

 stream.on('finish', function(){
  blob = stream.toBlob('application/pdf')
  url = stream.toBlobURL('application/pdf')
  iframe.src = url;
 });
}
