/**
 * Created by Papa on 3/22/2016.
 */

var LineReader = require('file-line-reader');

var reader = new LineReader('longfile.txt');

// Reads the file line of the longfile.txt file
reader.nextLine(function (err, line) {
    if (err) {
        // file not found, no read rights, ..
    }

    console.log(line);
});
