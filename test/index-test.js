var expect = require('chai').expect;
var Subject = require(__dirname+'/../index')

describe('Greglearns JSON-Schema Validator', function() {
  var subject

  beforeEach(function() {
    subject = Subject( schema() )
  })

  describe('for invalid instances', function() {

    it('reports the paths with errors', function() {
      var report = subject({ instance: { aString: 5 } })//invalidInstance() })
      expect(report.valid).to.eql(false);
      var fieldsWithErrors = report.errors.map(function(e) { return e.path })
      expect(fieldsWithErrors.sort()).to.eql([ "/aNumber", "/aString" ]);
    })

  })

  describe('for valid instances', function() {

    it('validates an object', function() {
      var report = subject({ instance: validInstance() })
      expect(report.valid).to.eql(true);
    })

    describe('for valid, but incomplete, instances', function() {

      it('adds default fields', function() {
        expect(validIncompleteInstance().aString).to.not.exist;
        var report = subject({ instance: validInstance() })
        expect(report.instance.aString).to.eql('boo');
      })

    })

  })

})

function validInstance() {
  return {
    "aNumber": 5,
    "aString": "boo"
  }
}

function validIncompleteInstance() {
  return {
    "aNumber": 5
  }
}

function invalidInstance() {
  return {
    "aString": false
  }
}

function schema() {
  return {
    "$schema": "http://json-schema.org/draft-04/hyper-schema",
    "title": "Testing 123",
    "description": "A simple schema",
    "type": [ "object" ],
    "properties": {
      "aNumber": { "type": "number" },
      "aString": { "type": "string", "default": "boo" }
    },
    "required": [ "aNumber" ],
    "links": [
      {
      "title": "API Schema",
      "href": "/api/schema",
      "method": "GET",
      "rel": "full"
    }
    ]
  }
}
