var Question = Backbone.Model.extend({
  initialize: function(quiz_id) {
    this.quiz_id = quiz_id
  },
  url: function() {
    return '/quizzes/' + this.quiz_id + '/questions/next.json?session_key=123'
  }
});

var QuestionView = Backbone.View.extend({
  el: '#current-question',
  render: function() {
    var self = this;
    self.model.fetch({
      success: function(collection, response) {
        self.$el.html(_.template($('#question-template').html(), { question: response }));
      }
    });
    return this;
  }
});

var QuizCollection = Backbone.Collection.extend({
  url: '/quizzes.json',
  parse: function(data) {
    return data.quizzes;
  }
});

var QuizzesCollectionView = Backbone.View.extend({
  el: '#quizzes',
  render: function() {
    var self = this;
    var quizCollection = new QuizCollection;
    quizCollection.fetch({
      success: function(quizzes) {
        var template = _.template($('#quizzes-template').html(), { quizzes: quizzes.models })
        self.$el.html(template);
      }
    });

    return this;
  }
});

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'home',
    'quizzes/:quiz_id/questions/next': 'nextQuestion'
  }
});
var appRouter = new AppRouter;

appRouter.on('route:home', function(){
  var quizzessCollectionView = new QuizzesCollectionView;
  quizzessCollectionView.render();
});

appRouter.on('route:nextQuestion', function(quiz_id) {
  var question = new Question(quiz_id);
  new QuestionView({ model: question }).render();
});

Backbone.history.start();






