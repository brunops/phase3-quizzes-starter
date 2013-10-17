$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

var Question = Backbone.Model.extend({
  initialize: function(quiz_id) {
    this.quiz_id = quiz_id
  },
  url: function() {
    return '/quizzes/' + this.quiz_id + '/questions/next.json?session_key=1234'
  }
});

var QuestionView = Backbone.View.extend({
  el: '#current-question',
  events: {
    'submit #question-form': 'answerQuestion'
  },
  render: function() {
    var self = this;
    self.model.fetch({
      success: function(collection, response) {
        self.$el.html(_.template($('#question-template').html(), { question: response }));
      }
    });
    return this;
  },
  answerQuestion: function(e) {
    var self = this;
    e.preventDefault();

    var questionId = $('#question-id').val(),
        formValues = $(e.currentTarget).serializeObject(),
        url        = '/questions/' + questionId + '/answers.json',
        data       = {
          choice_id: formValues.choice_id
        };

    $.post(url, data, function(response) {
      if (response.correct && !response.more_questions) {
        appRouter.navigate('')
        self.$el.empty();
      }
    })
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






