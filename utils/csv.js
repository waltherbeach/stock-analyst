const dates = require('./dates');

/**
 * Parses CSV from String to an array of arrays
 * @param {String} csv Content of a CSV file as a String
 */
const toArray = function(csv) {
  //Split csv String into an array of lines
  let lines = csv.split(/\r\n|\n/);
  // Create a result array and set its 0 index to be the headers array
  let result = [];
  let headers = lines[0].split(',');
  result.push(headers);
  // Remove headers (first line) from lines
  lines.shift();
  // Split rest of the csv file lines into arrays and push them into result
  lines.forEach(line => {
    lineArray = line.split(',');
    if (lineArray[0].length === 10) {
      date = new Date(lineArray[0])
      lineArray[0] = date.toDateString();
      lineArray[1] = parseFloat(lineArray[1].replace(/\$/, '')),
      lineArray[2] = parseFloat(lineArray[2]),
      lineArray[3] = parseFloat(lineArray[3].replace(/\$/, '')),
      lineArray[4] = parseFloat(lineArray[4].replace(/\$/, '')),
      lineArray[5] = parseFloat(lineArray[5].replace(/\$/, ''))
      result.push(lineArray);
    }
  });
  return result;
}

/**
 * Parses CSV from String to a Map of date strings as keys and stock data from the date in an object as values
 * @param {String} csv Content of a CSV file as a String
 */
const toMap = function(csv) {
  let lines = csv.split(/\r\n|\n/);
  let result = new Map();
  // Add data to Map with date as key and rest of the data as properties of an object as value
  lines.forEach(line => {
    lineArray = line.split(',');
    // Assuming the MM/DD/YYYY syntax from Nasdaq's csv files, omit header and empty rows
    if (lineArray[0].length === 10) {
      let date = new Date(lineArray[0]);
      // Specify the format to allow slicing through matching with similarly formatted date strings
      result.set(date.toDateString(), {
        close: parseFloat(lineArray[1].replace(/\$/, '')),
        volume: parseFloat(lineArray[2]),
        open: parseFloat(lineArray[3].replace(/\$/, '')),
        high: parseFloat(lineArray[4].replace(/\$/, '')),
        low: parseFloat(lineArray[5].replace(/\$/, ''))
      });
    }
  });
  return result;
}

/**
 * Parses CSV from String to a Map of date strings as keys and stock data from the date in an object as values
 * @param {String} csv Content of a CSV file as a String
 * @param {String} from Starting date of the date range
 * @param {String} to Ending date of the date range
 * @param {Number} buffer Optional amount of days with stock data in the beginning of the Map before start date
 */
const toDateRangedMap = function(csv, from, to, buffer = 0) {
  let lines = csv.split(/\r\n|\n/);
  let result = new Map();
  // add 2*buffer (but min 5) days to the start of date range in case of weekends etc.
  let beforeDate = new Date(dates.moveDate(from, -(Math.max(5, 2*buffer))));
  let afterDate = new Date(dates.moveDate(to, 1));
  // Add data to Map with date as key and rest of the data as properties of an object as value
  // Reverse the lines array to get dates into the Map in ascending order
  lines.slice().reverse().forEach(line => {
    lineArray = line.split(',');
    // Assuming the MM/DD/YYYY syntax from Nasdaq's csv files, omit header and empty rows
    if (lineArray[0].length === 10) {
      let date = new Date(lineArray[0]);
      if (date > beforeDate && date < afterDate) {
        result.set(date.toDateString(), {
          close: parseFloat(lineArray[1].replace(/\$/, '')),
          volume: parseFloat(lineArray[2]),
          open: parseFloat(lineArray[3].replace(/\$/, '')),
          high: parseFloat(lineArray[4].replace(/\$/, '')),
          low: parseFloat(lineArray[5].replace(/\$/, ''))
        });
      }
    }
  });

  // Trim the buffer to right size
  result = dates.trimDateBuffer(result, from, buffer);
  return result;
}

module.exports = { toArray, toDateRangedMap, toMap };