const Backbone = require('backbone');

const AppView = Backbone.View.extend({
  events: {},
  initialize: function(){
    this.render();
  },
  el: '#container',
  render: function(){
    this.$el.html('aaaaa');
    return this;
  }
});

module.exports = AppView;