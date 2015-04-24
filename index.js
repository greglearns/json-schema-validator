// var Stringify = require('json-stringify-safe');
var Themis = require('themis');
var jsonSchemaV4 = require(__dirname+'/meta-schema/schema');
var jsonHyperSchemaV4 = require(__dirname+'/meta-schema/hyper-schema');

module.exports = function(schema, opts) {
  var schemaList = [
    // { id: 'placeHolder' }, // will replace this with real schema
    schema,
    jsonSchemaV4,
    jsonHyperSchemaV4
  ];

  var validator = Themis.validator(schemaList, opts); // could pass in { enable_defaults: true }

  return validationFn;

  function validationFn(opts) {
    // if (!opts.schema) { throw new Error('schema must be defined'); }
    if (!opts.instance) { throw new Error('instance must be defined'); }

    schemaList[0] = opts.schema;
    var instance = clone(opts.instance);

    try{
      var report = validator(instance, schema.id || '0');
      return {
        valid: report.valid,
        instance: opts.instance,
        errors: reportSimple(report)
      }
    } catch(e) {
      throw e
      return {
        valid: false,
        instance: undefined,
        errors: [ "Error: "+e.message ]
      }
    }
  }
}

function reportSimple(root) {
  if (root.valid || !root.errors.length) { return [] }
  return root.errors.map(function(error) {
    var result = {
      message: error.message,
      path: error.path,
      absolute_schema_path: error.absolute_schema_path.replace(/^0#/,'#')
    }
    var missing = error.message.match(/The required property '([^']*)' is missing/)
    if (missing) {
      result.path = [ result.path, missing[1] ].join('/')
    }
    if (error.context) {
      result.context = error.context.map(function(context) {
        return reportSimple(context);
      }).filter(identity);
    }
    return result
  });
}

function identity(x) { return x }

function clone(o) { return JSON.parse(JSON.stringify(o)) }

