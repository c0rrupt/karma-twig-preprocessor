/* jshint node:true */

var twigModule = require('twig');
var twig = twigModule.twig;
var extend = require('util')._extend;

var PER_FILE_OPTIONS = [
  'filename',
  'sourceFileName',
  'sourceRoot'
];

function createPreprocessor(args, config, logger, helper) {
  var log = logger.create('preprocessor.twig');

  var deleteTemplateById = function(id) {
    twigModule.extend(function(Twig) {
      delete Twig.Templates.registry[id];
    });
  };

  function twigCompile(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);

    var options = createOptions(config, file);
    file.path = options.filename || file.path;

    try {
      deleteTemplateById(file.path);
      var template = twig({id: file.path, data: content});
      var data = template.compile(options);

      done(null, data);
    } catch (e) {
      log.error('%s\n at %s', e.message, file.originalPath);
      done(e, null);
    }
  }

  function createOptions(config, file) {
    config = config || {};
    var options = extend({ filename: file.originalPath }, config.options || {});
    PER_FILE_OPTIONS.forEach(function(optionName) {
      var configFunc = config[optionName];
      if (typeof configFunc === 'function') {
        options[optionName] = configFunc(file);
      }
    });
    return options;
  }

  return twigCompile;
}

createPreprocessor.$inject =
  ['args', 'config.twigPreprocessor', 'logger', 'helper'];

module.exports = {
  'preprocessor:twig': ['factory', createPreprocessor]
};
