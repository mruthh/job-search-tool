const Backbone = require('backbone');
const JobsCollection = require('./JobsCollection');
const JobView = require('./JobView');
const $ = require('jquery');
Backbone.$ = $;

const AppView = Backbone.View.extend({
  events: {
    'click #snag-button': function() {
      console.log('clicked snag button');
      console.log(this.model);
      this.model.set('jobs', new JobsCollection())
    }
  },
  initialize: function(){
    this.$snagButton = $('#snag-button');
    this.$jobsContainer = $('#jobs-container');
    // this.listenTo(this.model.get('jobs'), 'change', function(){
    //   console.log('app view heard job added')
    //   const jobView = new JobView({ model: job});
    //   this.$thumbnails.append(jobView.render().el);
    // }, this);
    // this.collection.bind('add', this.onModelAdded, this);
    this.render();
  },
  el: '#container',
  render: function(){
    console.log('rendering app view')
    return this;
  },
  // renderJob: function(){
  //   this.$el.append(this.template(this.model.attributes));
  //   return this;
  // }
});

module.exports = AppView;