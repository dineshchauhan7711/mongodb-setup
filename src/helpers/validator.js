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

// Hours validation (HH:MM)
validator.register('hours_format', function (value) {
     // This is the regex to match HH:MM format with HH from 00-23 and MM from 00-59;
     const regex = /^(0?\d|1\d|2[0-3])(:([0-5]\d))?$|^(24:00)$/;
     return regex.test(value);
}, 'The hours must be in the format HH:MM');

//  'HH:MM:SS' format validation
validator.register('hh_mm_ss_format', function (value) {
     // This is the regex to match HH:MM:SS format with HH from 00-23, MM from 00-59 and SS from 00-59;
     const regex = /^(0?\d|1\d|2[0-3])(:([0-5]\d))?(:([0-5]\d))?$|^(24:00:00)$/;
     return regex.test(value);
}, 'The seconds must be in the format HH:MM:SS');

// Date validation for 'YYYY-MM-DD' format (year range is 1000-9999)
validator.register('date_format', function (value) {
     const regex = /^(1000|[1-9][0-9]{3})[- /.](0[1-9]|1[0-2])[- /.](0[1-9]|[12][0-9]|3[01])$/;
     return regex.test(value);
}, 'The :attribute must be in the format YYYY-MM-DD (Year range is 1000-9999).');


module.exports = validator

