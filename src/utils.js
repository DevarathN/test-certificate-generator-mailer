const sanitizeHtml = require('sanitize-html');

exports.sanitizeInput = (str) => {
  return sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} });
};
