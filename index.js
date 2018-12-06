const express = require('express')
const bodyParser = require('body-parser')
const read = require('node-readability')
const Article = require('./db').Article

const app = express()

app.set('port', process.env.PORT || 3000)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/articles', (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err)
    res.send(articles)
  })
})

app.post('/articles', (req, res, next) => {
  const url =req.body.url

  read(url, (err, result))
})

app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id
  Article.find(id, (err, article) => {
    if (err) return next(err)
    res.send(article)
  })
})

app.delete('/articles/:id', (req, res, next) => {
  const id = req.params.id
  Article.delete(id, (err) => {
    if (err) return nexy(err)
    res.send({ message: 'Deleted' })
  })
})

app.listen(app.get('port'), () => {
  console.log(`Express web app availible at localhost: ${app.get('port')}`)
})

module.exports = app
