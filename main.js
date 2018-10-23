const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone');
Backbone.$ = $;

const AppView = require('./AppView');
const AppModel = require('./AppModel');

const appModel = new AppModel({});
const appView = new AppView({ model: appModel });