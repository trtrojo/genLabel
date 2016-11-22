
 /*genLabel.git
  * Tommy Rojo
  *  tommy.rojo@stu.bmcc.cuny.edu
  *
  *
  */

var env = require("./config.js");
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs"); //writing to /tmp
//var blobStream = require("blob-stream");
var path = require("path"); //apparently i need __dirname, no relative roots
var PDFDocument = require("pdfkit");
var randToken = require("rand-token");
var barcode = require('barcode');

var app = express();


/****************************************
 * Begin PDFKit Configuration (1x1.5 sticky label)
 ****************************************
 */

/*
doc = new PDFDocument(
 { //72.00 - 1 inch, 108.00 - 1.5 inch?
  size:[108.00,72.00],
  margin:10
 }
);
doc.fontSize(18);
*/

///////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:"true" }));

app.listen(env.port,function() {
 console.log("genLabel -- PDF Generator for zebra label makers");
 console.log("Tommy Rojo -- tommy.rojo@eataly.com");
 console.log("[INFO] Starting genLabel daemon on port: " + env.port);
});

app.use("/", express.static("./views"));

app.get("/genLabel", function(req,res) {
 console.log("/genLabel query:", req.query);

// if (typeof req.query.barcode !== 'undefined') {
  //make sure to provide barcode data
  var c128Image = barcode('code128', {
   data:"it works",
   width:400,
   height:30
  });
  c128Image.saveImage("/tmp/barcode.PNG", function(err){
   if (err) throw err;
   console.log("PLEASE FOR THE LOVE OF GOD FIX THE PROBLEM ON LINE 62");
  });
// }


 doc = new PDFDocument(
 { //72.00 - 1 inch, 108.00 - 1.5 inch?
  size:[108.00,72.00],
  margin:1
 }
);

if (typeof req.query.fontSize !== 'undefined') {
 doc.fontSize(req.query.fontSize);
} else {
doc.fontSize(16);
}
  doc.font('Helvetica')
  doc.text(req.query.line1, { //First line
  align:'left'
 });
 doc.text(req.query.line2, {
  align:'left'
 });
 doc.text(req.query.line3, {
  align: 'left'
 });
 doc.image(
  /*c128Image.getStream(
   function(err,readStream) { 
     if (err){throw err;}
     readStream.pipe(CdnWriteStream); //todo: figure out how not to write image to disk
    })*/ //this ends the getStream function.

  '/tmp/barcode2.PNG',{scale:0.25}
 );
 doc.fontSize(10).text(req.query.line5,{
  align: 'center'
 });
 


doc.pipe(res);
 doc.end();

});

function genPdf(doc, docTitle, docPayload, callback) {
 console.log("genPdf() Payload: ", docTitle, docPayload);
 doc.text(docTitle, { //First line
  align:'center'
 });
 doc.text(docPayload, {
  align:'center'
 });
 var outFilename = randToken.generate(32);
 var outPath = ("/tmp/genLabel/" + outFilename + ".pdf");
 writeStream = fs.createWriteStream(outPath);
  console.log(outPath);
 //doc.pipe(writeStream);
 doc.end();
 writeStream.on('finish', function() { });
 //doc.end();
 
 return doc.pipe();
}
