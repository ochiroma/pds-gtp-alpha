var Metalsmith        = require('metalsmith');
var handlebars        = require('handlebars');
var layouts           = require('metalsmith-layouts');
var markdown          = require('metalsmith-markdown');
var contentful        = require('contentful-metalsmith');
var marked            = require('marked');
var metalsmithExpress = require('metalsmith-express');

handlebars.registerHelper("slugify", function(input) {
    var output = input.toLowerCase();
    // return output.replace(" ", "-");
    // var replaced = str.replace(/ /g, '+');
    return output.replace(/ /g, '-');
});

handlebars.registerHelper('marked', function (text) {
  return marked(text);
})


Metalsmith(__dirname)         // __dirname defined by node.js:
                              // name of current working directory
  .metadata({                 // add any variable you want
                              // use them in layout-files
    sitename: "Guide to procedure",
    siteurl: "http://beta.parliament.uk/",
    description: "A guide to UK parliamentary procedure",
    generatorname: "Metalsmith",
    generatorurl: "http://metalsmith.io/"
  })
  .source('./src')            // source directory
  .destination('./build')     // destination directory
  .clean(true)                // clean destination before
  // .use(contentful({ 
  //   'access_token' : process.env.CONTENT_API_KEY,
  //   'space_id' : process.env.CONTENT_SPACE_ID,
  //   'host': process.env.CONTENT_API_URL
  // }))
  .use(contentful({ 
    'access_token' : '9affc5d65b294616590dc4d7a4219766c808fd593ded5882524b7317429c5db5',
    'space_id' : '04pp5gayetsw',
    'host': 'cdn.contentful.com'
  }))
  .use(markdown())            // transpile all md into html
  .use(layouts({              // wrap layouts around html
    engine: 'handlebars',     // use the layout engine you like
  }))
  .use(metalsmithExpress({
    liveReload: false,
    }))
  .build(function(err) {      // build process
    if (err) throw err;       // error handling is required
  });

