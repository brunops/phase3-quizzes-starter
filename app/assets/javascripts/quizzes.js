var Quizzes = Backbone.Collection.extend({
  url: '/quizzes.json'
})
var quizzes = new Quizzes
quizzes.fetch({
  success: function(collection, response, options){
    console.log(response)
  }
})

var Quiz = Backbone.Model.extend({
  defaults: {
    id: '',
    name: '',
  }
});

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'home'
  }
});
var appRouter = new AppRouter;
appRouter.on('route:home', function(){
  console.log("HIT")
});

Backbone.history.start();