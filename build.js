if (process.env.NODE_ENV !== 'production') {
  var dotenv = require('dotenv');
  dotenv.load();
}

var Metalsmith        = require('metalsmith');
var handlebars        = require('handlebars');
var layouts           = require('metalsmith-layouts');
var markdown          = require('metalsmith-markdown');
var contentful        = require('contentful-metalsmith');
var marked            = require('marked');
var path              = require('path');
var fs                = require('fs');
// var dirHierarchy      = require('metalsmith-directory-hierarchy');
var ancestry = require("metalsmith-ancestry");
var links = require("metalsmith-relative-links");


// sets all file's metadata to have its file path set to `path`
var filePathTask = function(files, metalsmith, done){
    for(var file in files){
        files[file].path = file;
    }
    done();
};

var relativePathHelper = function(current, target) {
    // normalize and remove starting slash
    current = path.normalize(current).slice(0);
    target = path.normalize(target).slice(0);



    current = path.dirname(current);
    var out = path.relative(current, target);
console.log(current);
    return out;

};

handlebars.registerHelper('relative_path', relativePathHelper);


//handle bars helpers
handlebars.registerHelper("slugify", function(input) {
  if(input){
    var output = input.toLowerCase();
    // return output.replace(" ", "-");
    // var replaced = str.replace(/ /g, '+');
    output = output.replace(/ /g, '-');
    output = output.replace(/'/g, '');
    output = output.replace(/"/g, '');
    output = output.replace(/,/g, '');
    output = output.replace(/\./g, '');
    output = output.replace(/'/g, '');
    output = output.replace(/’/g, '');
    output = output.replace(/\?/g, '');
    output = output.replace(/!/g, '');
    output = output.replace(/:/g, '');
    return output;
  }
});

handlebars.registerHelper("cleanURL", function(input) {
  if(input){
    var output = input.toLowerCase();
    output = output.replace(/index\.html/g, '');
    return output;
  }
});

handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});



handlebars.registerHelper('marked', function (text) {
  if(text){
    return marked(text);
  }
})

handlebars.registerHelper('toJSON', function(object) {
  return new handlebars.SafeString(JSON.stringify(object));
});

handlebars.registerHelper("log", function(something) {
  console.log(something);
});


//handlebars partials
handlebars.registerPartial('header', fs.readFileSync(__dirname + '/layouts/partials/header.html').toString());
handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/layouts/partials/footer.html').toString());
handlebars.registerPartial('contact', fs.readFileSync(__dirname + '/layouts/partials/contact.html').toString());
handlebars.registerPartial('breadcrumbs', fs.readFileSync(__dirname + '/layouts/partials/breadcrumbs.html').toString());
handlebars.registerPartial('siblings-nav', fs.readFileSync(__dirname + '/layouts/partials/siblings-nav.html').toString());
handlebars.registerPartial('productlabel', fs.readFileSync(__dirname + '/layouts/partials/productlabel.html').toString());





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
  .use(contentful({ 
    'access_token' : process.env.CONTENT_ACCESS_TOKEN,
    'space_id' : process.env.CONTENT_SPACE_ID,
    'host': process.env.CONTENT_HOST
  }))
  .use(markdown())            // transpile all md into html
  // .use(links())
  .use(ancestry({
    ancestryProperty: "ancestry",
    match: "**/*"
    // "test" : /\.md?$/
  }))
  // .use(function(files, metalsmith, done){
  //       for(var file in files){
  //           file.path = file;
  //       }})
  .use(filePathTask)
  .use(layouts({              // wrap layouts around html
    engine: 'handlebars',     // use the layout engine you like
  }))
  // .use(metalsmithExpress({
  //   liveReload: false,
  //   port: process.env.PORT || 3000
  //   }))
  .build(function(err) {      // build process
    if (err) throw err;       // error handling is required
  });

