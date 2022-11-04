module.exports = ((req, res) => {
  res.render('errors/err404', {
      title: '404'
  })
});