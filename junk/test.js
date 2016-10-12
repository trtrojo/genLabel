var PDFDocument, doc;
var fs = require("fs");
PDFDocument = require('pdfkit');

doc = new PDFDocument(
 { //72.00 - 1 inch, 108.00 - 1.5 inch?
  size:[108.00,72.00],
  margin:10
 }
); 
doc.fontSize(18);
//size:"A4" makes everthing better

// Set the paragraph width and align direction
doc.text('Sell by',{
    align:'center'
    //width: 410,
    //align: 'left'
});
doc.text('99/99/99',{align:'center'});

doc.pipe(fs.createWriteStream('output.pdf'));

// PDF Creation logic goes here

doc.end();

