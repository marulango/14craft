const express = require('express');
const app = express();
const axios = require('axios');

app.get('/api', async function (req, res, next) {
  try {
    const response = await axios.get('https://api.xivdb.com');
    res.send(response.data);
    const [resp1, resp2, resp3] = await Promise.all([
      axios.get('https://api.xivdb.com/item/1'),
      axios.get('https://api.xivdb.com/item/2'),
      axios.get('https://api.xivdb.com/item/3')
    ]);
    const resp4 = await axios.get('https://api.xivdb.com/item/4');
    if (resp4.data.values) {
      const resp5 = await axios.get('https://api.xivdb.com/item/' + resp4.data.iem);
    }
  } catch (e) {
    next(e);
  }
});

app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // only use in development
  const errorhandler = require('errorhandler');
  app.use(errorhandler());
}

app.listen(3000, () => console.log('IT ALIVE! :3000!'));
