const scrapeIt = require('scrape-it')
const { scrapeSecondUrl } = require('./secondPhaseScrape')
const activeAssinModel = require('./models/activeAssin')

async function scrapeData(baseUrl) {
  let scrapeData = []
  let arr = []
  scrapeIt(baseUrl, {
    price: '#priceblock_ourprice',
    reviews: '#acrCustomerReviewText',
    salesRank: '#dpx-amazon-sales-rank_feature_div > li',
    amazonChoice: '.ac-badge-rectangle',
    badgeBestSeller: { selector: '.badge-link', attr: 'href' },
    reviewsStars: '#acrPopover',
    allID: { selector: '#addToCart', how: 'html' },
  }).then(async ({ data, response }) => {
    let html = data.allID

    console.log('data.reviewsStars', data.reviewsStars)

    //return
    if (html) {
      html.split('\n').map(item => {
        const pattern = /value="([^"]+)/g
        const match = pattern.exec(item)
        if (match) {
          arr.push(match[1])
        }
      })

      const SESSION_ID = arr[0]
      const ASIN = arr[1]
      const OFFERLISTING_ID = arr[10] !== undefined && arr[10].length > 10 ? arr[10] : arr[2]
      const MERCHANT_ID = arr[4]
      const NODE_ID = arr[6]
      const CUSTOMER_ID = arr[4]
      const STORE_ID = arr[8]
      const ACTION_CODE = arr[6]

      let url = `https://www.amazon.com/gp/product/handle-buy-box/ref=dp_start-bbf_1_glance?session-id=${SESSION_ID}&ASIN=${ASIN}&offerListingID=${OFFERLISTING_ID}&isMerchantExclusive=0&merchantID=A10IG442CCQHV5&isAddon=0&nodeID=3760901&sellingCustomerID=${CUSTOMER_ID}&qid=&sr=&storeID=${STORE_ID}&tagActionCode=${ACTION_CODE}&viewID=glance&rebateId=&rsid=${SESSION_ID}&sourceCustomerOrgListID=&sourceCustomerOrgListItemID=&wlPopCommand=&quantity=99999&submit.add-to-cart=Add+to+Cart&dropdown-selection=add-new&dropdown-selection-ubb=add-new&triggerUSSWeblab=1`

      scrapeData.push(
        data.price,
        data.reviews,
        data.salesRank,
        data.amazonChoice,
        data.badgeBestSeller !== '' ? data.badgeBestSeller : null,
        data.reviewsStars,
      )

      scrapeSecondUrl(SESSION_ID, OFFERLISTING_ID, scrapeData, ASIN)
    }
  })
}

async function findInDbAndScrape(baseMarketPlace, baseAsin) {
  const assin = new activeAssinModel({
    asin: baseAsin,
    url: baseMarketPlace,
  })
  assin.save(async (err, item) => {
    if (err) {
      console.log(err)
    }
    console.log(item)
  })

  const baseUrl = `https://www.${baseMarketPlace}/dp/${baseAsin}`
  await scrapeData(baseUrl)
}

async function scrapeFromCrawler(baseMarketPlace, baseAsin) {
  const baseUrl = `https://www.${baseMarketPlace}/dp/${baseAsin}`
  await scrapeData(baseUrl)
}

//findInDbAndScrape('amazon.com', 'B07GX1DS6R')

module.exports = { findInDbAndScrape, scrapeFromCrawler }
