'use strict';

const Message = require('@fabric/core/types/message');
const Service = require('@fabric/core/types/service');
const Client = require('twitter');

class Twitter extends Service {
  constructor (settings = {}) {
    super(settings);

    this.settings = Object.assign({
      keywords: [],
      targets: [],
      consumer: {
        key: null,
        secret: null,
      },
      token: {
        key: null,
        secret: null
      }
    }, settings);

    this.name = 'Twitter';
    this.stream = null;
    this.twitter = new Client({
      consumer_key: this.settings.consumer.key,
      consumer_secret: this.settings.consumer.secret,
      access_token_key: this.settings.token.key,
      access_token_secret: this.settings.token.secret
    });

    this._state = {
      status: 'STOPPED',
      keywords: this.settings.keywords,
      targets: this.settings.targets
    };

    return this;
  }

  /**
   * Establish connection to Twitter.
   * @return {Twitter} Connected instance of Twitter.
   */
  connect () {
    this.stream = this.twitter.stream('statuses/filter', {
      track: this._state.keywords.join(',')
    });

    // TODO: bind to event handler on this class
    this.stream.on('data', this._handleStreamEvent.bind(this));
    this.stream.on('error', function (err) {
      console.log('stream error:', err);
    });

    return this;
  }

  start () {
    this.connect();
    return this;
  }

  getProfile (id) {
    this.twitter.get('statuses/user_timeline', {
      screen_name: id
    }, function (error, tweets, response) {
      if (!error) {
        console.log('timeline:', tweets);
      }
    });
  }

  _handleStreamEvent (event) {
    const message = Message.fromVector(['Activity', {
      event
    }]);
    this.emit('message', message);
  }

  _handleStreamError (error) {
    this.emit('error', JSON.stringify(error));
  }
}

module.exports = Twitter;
