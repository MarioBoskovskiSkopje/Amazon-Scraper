var unirest = require('unirest')
const scrapeIt = require('scrape-it')
const itemsModel = require('./models/item')
const salesModel = require('./models/sales')

function scrapingSecondPhase(sessionid, offerlistingid, scrapeData, ASIN) {
  //console.log(sessionid, offerlistingid, scrapeData, ASIN)

  var req = unirest(
    'POST',
    'https://www.amazon.com/gp/verify-action/templates/add-to-cart/ordering',
  )

  req.headers({
    authority: 'www.amazon.com',
    'cache-control': 'max-age=0,no-cache',
    origin: 'https://www.amazon.com',
    'upgrade-insecure-requests': '1',
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    cookie: ` ubid-main=${sessionid};  session-id=${sessionid};`,
  })

  req.form({
    'offeringID.1': offerlistingid,
    'quantity.1': '999999',
    'session-id': sessionid,
    itemCount: '1',
  })

  req.end(function(res) {
    if (res.error) throw new Error(res.error)

    let data = scrapeIt.scrapeHTML(res.body, {
      articles: {
        listItem: '.a-spacing-micro',
      },
    })

    if (data.articles.length > 0) {
      if (data.articles[1].indexOf('than the') > -1) {
        let qty = data.articles[1]
          .split('than')[1]
          .split('from')[0]
          .match(/\d+/g)
          .map(Number)[0]

        const timestamp = Date.now()
        const date = new Date()
        let mnth = ('0' + (date.getMonth() + 1)).slice(-2)
        let day = ('0' + date.getDate()).slice(-2)

        const newdate = [date.getFullYear(), mnth, day].join('/')

        const item = new itemsModel({
          asin: ASIN,
          qty: qty,
          timestamp: timestamp,
          datecreated: newdate,
          price: scrapeData[0],
          reviews: scrapeData[1].split('reviews')[0],
          salesRank: scrapeData[2],
          amazonChoice: scrapeData[3].replace(/(\r\n|\n|\r)/gm, '').replace(/  +/g, ' '),
          badgebestSeller: scrapeData[4] !== null ? scrapeData[4].split('/')[2] : '',
          salesStars: scrapeData[5].split('out')[0],
        })

        item.save((err, item) => {
          console.log('item saved in db', item)
          if (err) {
            console.log(err)
          }
        })
      }
    }
  })
}

module.exports = { scrapeSecondUrl: scrapingSecondPhase }
