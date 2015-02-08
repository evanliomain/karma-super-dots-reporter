(function() {
  'use strict';

  var chalk      = require('chalk'),
      logSymbols = require('log-symbols');

  var SuperDotsReporter = function(hasColors, options) {

    chalk.enabled = hasColors;

    // Configuration
    options               = options               || {};
    options.nbDotsPerLine = options.nbDotsPerLine || 80;
    options.icon          = options.icon          || {};
    options.icon.failure  = options.icon.failure  || logSymbols.error;
    options.icon.success  = options.icon.success  || logSymbols.success;
    options.icon.ignore   = options.icon.ignore   || logSymbols.info;
    options.color         = options.color         || {};
    options.color.failure = options.color.failure || 'red';
    options.color.success = options.color.success || 'green';
    options.color.ignore  = options.color.ignore  || 'blue';

    if (hasColors) {
      this.USE_COLORS      = true;
      options.icon.failure = colorInto(options.color.failure, options.icon.failure);
      options.icon.success = colorInto(options.color.success, options.icon.success);
      options.icon.ignore  = colorInto(options.color.ignore,  options.icon.ignore);
    } else {
      this.USE_COLORS      = false;
      options.icon.failure = noColor(options.icon.failure);
      options.icon.success = noColor(options.icon.success);
      options.icon.ignore  = noColor(options.icon.ignore);
    }

    this.onRunStart = function() {
      this._dotsCount = 0;
    };

    this.specSuccess = function() {
      this._writeCharacter(options.icon.success);
    };

    this.specFailure = function() {
      this._writeCharacter(options.icon.failure);
    };

    this.specSkipped = function() {
      this._writeCharacter(options.icon.ignore);
    };


    this.onSpecComplete = function(browser, result) {
      if (result.skipped) {
        this.specSkipped(browser, result);
      } else if (result.success) {
        this.specSuccess(browser, result);
      } else {
        this.specFailure(browser, result);
      }
    };

    this._writeCharacter = function(character) {
      this._dotsCount = (1 + this._dotsCount) % options.nbDotsPerLine;
      write(this._dotsCount ? character : character + '\n');
    }
  };

  SuperDotsReporter.$inject = ['config.colors', 'config.superDotsReporter'];

  module.exports = { 'reporter:super-dots': ['type', SuperDotsReporter] };

  function colorInto(color, str) {
    return chalk[color](chalk.stripColor(str));
  }

  function noColor(str) {
    return chalk.stripColor(str);
  }

  function write(string) {
    process.stdout.write(string);
  }
})();
