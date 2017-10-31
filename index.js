const express = require('express');
const app = express();

app.use(express.static('build'));

app.use(function (req, res, next) {
  res.status(404).redirect("/errors/404")
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App started :)')
})