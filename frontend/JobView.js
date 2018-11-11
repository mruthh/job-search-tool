const Backbone = require('backbone');
const Handlebars = require('handlebars');
const $ = require('jquery');
Backbone.$ = $;

const JobView = Backbone.View.extend({
  events: {},
  initialize: function(){
    this.listenTo(this.collection, 'add', function(){
      this.render();
    });
  },
  el: '#jobs-container',
  template: Handlebars.compile($('#jobs-template').html()),
  render: function(){
    this.$el.append(this.template(this.model.attributes));
    return this;
  },
});

module.exports = JobView;