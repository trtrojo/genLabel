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
 var path = require("path"); //apparently i need __dirname, no relative roots
 var PDFDocument = require("pdfkit");
 var randToken = require("rand-token");
 var barcode = require('barcode');
 var urljoin = require('url-join');
 var md5 = require('md5');

 var app = express();


 /****************************************
  * Begin PDFKit Configuration (1x1.5 sticky label)
  ****************************************
  */

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
   extended: "true"
 }));

 app.listen(env.port, function() {
   console.log("genLabel -- PDF Generator for zebra label makers");
   console.log("Tommy Rojo -- tommy.rojo@localhost");
   console.log("[INFO] Starting genLabel daemon on port: " + env.port);
 });

 app.use("/", express.static("./views"));

 app.get("/genLabel", function(req, res) {
 console.log("DEBUG: ", req.query);

   if ((typeof req.query.barcode == 'undefined') || (req.query.barcode != '')) {
     console.log("req.query.barcode: " + req.query.barcode.length);
     console.log(req.query);
     var c128Image = barcode('code128', {
       data: req.query.barcode,
       width: 400,
       height: 50
     });
     c128Image.saveImage("/tmp/barcode/barcode.PNG", function(err) {
       if (err) throw err;
       console.log("PLEASE FOR THE LOVE OF GOD FIX THE PROBLEM ON LINE 62");

       makePdf(req, res, '/tmp/barcode/barcode.PNG', req.query.barcode)

       //need to put callback here to wait for whatever
     });
   } else {
     makePdf(req, res)
   };


 });


 function makePdf(req, res, barcodeLoc, barcodeId) {
   doc = new PDFDocument({ //72.00 - 1 inch, 108.00 - 1.5 inch?
     size: [108.00, 72.00],
     margins: {
       top: 6,
       left: 4,
       right: 0,
       bottom: 0
     }
   });

   if (typeof req.query.fontSize !== 'undefined') {
     doc.fontSize(req.query.fontSize);
   } else {
     doc.fontSize(9);
   }
   doc.font('Helvetica')
   doc.text(req.query.line1, { //First line
     align: 'left'
   });
   if (typeof req.query.line2 !== 'undefined') {
     doc.text(req.query.line2, {
       align: 'left'
     });
   }
   if (typeof req.query.line3 !== 'undefined') {
     doc.text(req.query.line3, {
       align: 'left'
     });
   }

   if (typeof barcodeLoc !== 'undefined') {
     doc.image(
       barcodeLoc, {
         scale: 0.25
       }
     );
     doc.fontSize(10).text(barcodeId, {
       align: 'center'
     });
   }



   doc.pipe(res);
   doc.end();
 }
