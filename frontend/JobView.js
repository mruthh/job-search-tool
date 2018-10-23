const Handlebars = require('handlebars');

const JobView = Backbone.View.extend({
  events: {},
  initialize: function(){},
  el: '#job',
  template: Handlebars.compile($('#jobs-container').html()),
  render: function(){
    this.$el.html(this.template(this.model.attributes));
  }
});

module.exports = JobView;