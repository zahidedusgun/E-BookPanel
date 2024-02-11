const slugify = require('slugify');

const options = {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'en',
    trim: true
    };

module.exports = function slugifyField(url) {
    return slugify(url, options);
}