// console.log(Meteor.users);

Tasklists = new Mongo.Collection("tasklists");
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  var currentUserEmail = Meteor.user().emails[0].address;

  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    },
    currentUserEmail: currentUserEmail
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;

      var now = new Date();
      var nowDateTime = now.getDate() + "/" + (now.getMonth()+1)  + "/" + now.getFullYear() + " @ " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
 
      // Insert a task into the collection
      Tasks.insert({
        text: text,
        createdBy: currentUserEmail,
        createdAt: nowDateTime,
        completedDate: null,
        completedBy: null,

      });

 
      // Clear form
      event.target.text.value = "";
    }
  });


  Template.task.events({

    // upon completing a task
    "click .toggle-checked": function () {
      var now = new Date();
      var nowDateTime = now.getDate() + "/" + (now.getMonth()+1)  + "/" + now.getFullYear() + " @ " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
 
      Tasks.update(this._id, {
        $set: {
          completed: ! this.completed,
          completedBy : currentUserEmail,
          completedDate: nowDateTime
        }
      });


    },

    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
