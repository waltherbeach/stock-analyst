const chai = require('chai');
const expect = chai.expect;
const csv = require('../utils/csv');

const csvData = `Date,Close/Last,Volume,Open,High,Low
02/24/2021,$125.35,111039900,$124.94,$125.56,$122.23
02/23/2021,$125.86,158273000,$123.76,$126.71,$118.39
02/22/2021,$126,103916400,$128.01,$129.72,$125.6
02/19/2021,$129.87,87668830,$130.24,$130.71,$128.8
02/18/2021,$129.71,96856750,$129.2,$129.995,$127.41`

describe('CSV Utils', function() {
  describe('toArray', function() {
    it('should parse csv format String into an Array of Arrays', function() {
      const result = csv.toArray(csvData);
      expect(result).to.be.a('array');
      expect(result[0]).to.be.a('array');
    })

    it('should have headers stored in the 0 index', function() {
      const result = csv.toArray(csvData);
      const firstRow = result[0];
      expect(firstRow[0]).to.equal('Date');
      expect(firstRow[1]).to.equal('Close/Last');
      expect(firstRow[2]).to.equal('Volume');
      expect(firstRow[3]).to.equal('Open');
      expect(firstRow[4]).to.equal('High');
      expect(firstRow[5]).to.equal('Low');
    })

    it('should return an Array with empty string at 0 index, wrapped in another Array, if an empty string is given', function() {
      const result = csv.toArray('');
      expect(result).to.be.a('array');
      expect(result[0][0]).to.equal('');
    })
  })

  describe('toMap', function() {

  })
});