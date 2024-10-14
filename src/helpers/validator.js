const validator = require("validatorjs");

// Uppercase
validator.register('uppercase',
     value => value === value.toUpperCase(),
     'The :attribute must be in uppercase.'
);

// Lowercase
validator.register('lowercase',
     value => value === value.toLowerCase(),
     'The :attribute must be in lowercase.'
);


module.exports = validator

