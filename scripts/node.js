'use strict';

const merge = require('lodash.merge');
const Twitter = require('../services/twitter');
const settings = merge({}, require('../settings/default'), require('../settings/local'));

async function main (input) {
  const twitter = new Twitter(input);
  await twitter.start();
}

main(settings).catch((exception) => {
  console.error('[TWITTER]', 'Main Process Exception:', exception);
}).then((output) => {
  console.log('[TWITTER]', 'Started!');
});
