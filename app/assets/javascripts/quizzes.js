var Quiz = Backbone.Model.extend({
  defaults: {
    id: '',
    name: '',
  }
});

var QuizView = Backbone.View.extend({
  tagName: 'li',

  render: function() {
    var self = this;
    this.$el.html(_.template($('#quiz-template').html(), { quiz: self.model }));
    return this.el;
  }
});

var QuizCollection = Backbone.Collection.extend({
  url: '/quizzes.json',
  model: Quiz,
  parse: function(data) {
    return data.quizzes;
  }
});

var quizCollection = new QuizCollection

var QuizzesView = Backbone.View.extend({
  el: 'ul#quizzes',
  initialize: function(options) {
    this.collection = options.collection;
  },
  render: function() {
    this.collection.each(function(quiz) {
      var quizView = new QuizView({ model: quiz });
      this.$el.append(quizView.render());
    }, this);
  }
});

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'home',
    'quizzes/:id': 'startQuiz'
  }
});
var appRouter = new AppRouter;
appRouter.on('route:home', function(){
  quizCollection.fetch({
    success: function(collection, response, options){
      new QuizzesView({collection: collection}).render();
    }
  });
});

appRouter.on('route:startQuiz', function(id) {
  console.log(id)
})

Backbone.history.start();






