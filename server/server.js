const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const cron = require('node-cron')
const { findInDbAndScrape, scrapeFromCrawler } = require('./scrape')
const itemsModel = require('./models/item')
const salesModel = require('./models/sales')
const activeAssinModel = require('./models/activeAssin')
const _ = require('lodash')
const path = require('path')
const ObjectID = require('mongodb').ObjectID

const db = require('./config/keys').mongoURI

app.use(cors())
app.use(bodyParser.json())

mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.post('/create', async (req, res) => {
  const { asin, url } = req.body
  let ifExist = false
  await findInDbAndScrape(url, asin, ifExist)

  res.json('success')
})

app.get('/list', (req, res) => {
  itemsModel.find().then(items => {
    res.json(items)
  })
})

app.get('/list/asin/:asin', (req, res) => {
  const { asin } = req.params
  let newArr = []
  console.log('asinvalue', req.params)
  itemsModel
    .find({
      asin,
      _id: {
        $gt: ObjectID.createFromTime(Date.now() / 1000 - 24 * 60 * 60),
      },
    })
    .then(item => {
      newArr.push(item[0], item[item.length - 1])
      console.log('newArr', newArr)
      res.json(newArr)
    })
})

app.get('/stop/:asin', async (req, res) => {
  const { asin } = req.params
  activeAssinModel.findOneAndRemove({ asin }).then(item => {
    res.json('success')
  })
})

app.get('/list/date/:date', (req, res) => {
  const { date } = req.params
  const newDate = date.replace(/\,/g, '/')
  itemsModel.find({ datecreated: newDate }).then(items => {
    res.json(items)
  })
})

app.get('/list/range/', (req, res) => {
  const { startDate, endDate } = req.query
  //console.log('query', startDate, endDate)

  itemsModel
    .find({
      datecreated: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .then(items => {
      res.json(items)
    })
})

cron.schedule('*/5 * * * *', () => {
  console.log('running a task every 5 min')

  activeAssinModel.find({}).then(async item => {
    if (item.length > 0) {
      _.map(_.uniqBy(item, 'asin'), async el => {
        await scrapeFromCrawler(el.url, el.asin)
      })
    }
  })
})

app.use(express.static(path.join(__dirname, 'build')))
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/build/index.html'))
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
