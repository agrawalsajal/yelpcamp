if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://agrawal_sajal:sajal@1234@ds239648.mlab.com:39648/yelp-camp'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/yelp_camp1'}
}