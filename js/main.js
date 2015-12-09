'use strict'


var id = 1; // unique id for list items
var data = {};
var groceryApp = groceryApp || {};


$(document).ready(function(e) {
    editButton();
    $('.grocery').hide();
    $('#logout-button').hide();




    ////////////////Login/Register Helper


    var form2object = function(form) {
        var data = {};
        $(form).find('input').each(function(index, element) {
            var type = $(this).attr('type');
            if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
                data[$(this).attr('name')] = $(this).val();
            }
        });
        return data;
    };

    var wrap = function wrap(root, formData) {
        var wrapper = {};
        wrapper[root] = formData;
        return wrapper;
    };

    var callback = function callback(error, data) {
        if (error) {
            console.error(error);
            return;
        }
        console.log(data);
    };












    /////////////////////////////////////////// Login Form//////////////////////////////////






    $('#login-form-link').on(function(e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').on('click', function(e) {
        e.preventDefault();
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');



    });


    ///////////////Register


    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        var credentials = wrap('credentials', form2object(e.target));
        smart_grocery.register(credentials, function(err, data) {
            //     if (err) { console.error(err); });
            $('#register-form').hide();
        });

    });




    ///////////////Login



    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        var credentials = wrap('credentials', form2object(e.target));
        smart_grocery.login(credentials, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                groceryApp.token = data.user.token;
                groceryApp.user_id = data.user.id;
                console.log(data);
                $('.logInForm').hide();
                $('#register_form').hide();
                $('#logout-button').show();
                $(".grocery").show();
            }

        });



        //});


        /////////Log out


        $('#logout-button').on('click', function(e) {
            e.preventDefault();
            var credentials = wrap('credentials', form2object(e.target));
            smart_grocery.logout(groceryApp.user_id, groceryApp.token, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                console.log("Logged out");
            }
            });
        });








        // ////////////////Smart-Grocery/////////////////////




        $("tbody").on("click", ".cross", function() {
            $(this).closest("tr").remove();
        });

        $("button").on("click", getInput);

        $("tbody").on("click", ".box", function() {
            $(this).closest("tr").find("span").toggleClass("checked");
        });

    });



    // triggered on Enter
    $(document).on("keydown", function(e) {
        if (e.keyCode === 13) {
            getInput();
        }
    });



    // Toggle delete icon when edit button is clicked
    function editButton() {
        $(".edit").on("click", "span", function() {
            $(".cross").toggle();
        });
    }


    // Obtaining customer input and then calling addItem() with the input
    function getInput() {
        var custInput = $(".custinput");
        var input = custInput.val();

        if ((input !== "") && ($.trim(input) !== "")) {
            addItem(input);
            custInput.val("");
        }

    }




    ////////////////////// adding item to the list increment id counter for unique id, will have to fix the code below in the future, but it is referencing <tr>,<td> in index.html////////////////////////

    function addItem(message) {

        //$(".cross").hide(); // hiding the delete icon

        var addCallback = function() {
            // var checkbox = "<td class=\"check\">" + "<input type=\"checkbox\" id=\"item" + id + "\" class=\"box\">" + "<label for=\"item" + id + "\" class=\"check-label\"></label></td>";

            // var content = "<td class=\"content\"><span>" + message + "</span></td>";

            // var delIcon = "<td><img src=\"img/cross.png\" alt=\"cross\" class=\"cross\"></td>";

            // $("tbody").append("<tr>" + checkbox + content + delIcon + "</tr>");
        };


        var item = {

            name: message


        };

        smart_grocery.createGroceries(token, {
            grocery: item
        }, addCallback);




    }

    $('#show-activity-list').on('click', function(e) {
        e.preventDefault();
        var item = {
            name: "name"
        };
        smart_grocery.showGroceries(groceryApp.token, function(err, data){
            console.log('data is' + data);
            var groceries = data.groceries;
            var listHTML = "";
            groceries.forEach(function(grocery){
                listHTML += "<tr data-id=\"" + grocery.id + "\"><td>" + grocery.name + "</td>" + "<td><button>Edit</button><button class='delete'>Delete</button></td></tr>";

            });
            $('#activity-table-labels').append(listHTML);


        //data.forEach(function(item) {
            // $('#activity-table tr:last').after(
                // '<tr data-id=' + item._id + '><td>' + item.name + '</td><td>' + item.city + '</td><td><button class="edit btn btn-primary" data-toggle="modal" data-target="#update-activity-popup">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');
        });
$('#activity-table').on('click', function(e){
        e.preventDefault();
        var target = e.target;
        var id = $(target).parent().parent().data('id');
        // if($target.hasClass("delete")){
        //     console.log("deleting ", id);
            target.remove();

            smart_grocery.deleteGroceries(groceryApp.token, id, function(err){
                console.log(err);
            });
        // }else if($target.hasClass("edit")){
        //     console.log("editing ", id);


        // $('#update-activity-popup').modal('hide');
        // $('.modal-backdrop').remove();
        // $('#show-activity-list').hide();

});
});




$('#create-activity').on('click', function(e) {
        e.preventDefault();
        var credentials = form2object(this);
        $('input:text').val('');
        $('#add-new-activity-popup').hide();

        bucketList_api.updateGroceries(credentials, function(err, data){
          handleError(err,data);
          $('#activity-table tr:last').after(
            '<tr data-id=' + data._id + '><td>' + data.name +  '</td><td>' + data.city + '</td><td><button class="edit btn btn-primary" data-toggle="modal" data-target="#update-activity-popup">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');
        $('#update-activity-popup').modal('hide');
        $('.modal-backdrop').remove();
        });
    });

$('#update-activity').on('submit', function(e) {
        e.preventDefault();
        var credentials = form2object(this);
        $('input:text').val('');
        console.log(credentials);
        console.log(id);
        bucketList_api.updateListItem(id, credentials, function(err, data){
          handleError(err,data);
          console.log('inside update AJAX');
          $('#activity-table tr:last').after(
            '<tr data-id=' + data._id + '><td>' + data.name +  '</td><td>' + data.city + '</td><td><button class="edit btn btn-primary" data-toggle="modal" data-target="#update-activity-popup">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');
        });
        $('#update-activity-popup').modal('hide');
        $('.modal-backdrop').remove();
    });

    // function updateItem(message) {

    //     //$(".cross").hide(); // hiding the delete icon

    //     var addCallback = function() {
    //         var checkbox = "<td class=\"check\">" + "<input type=\"checkbox\" id=\"item" + id + "\" class=\"box\">" + "<label for=\"item" + id + "\" class=\"check-label\"></label></td>";

    //         var content = "<td class=\"content\"><span>" + message + "</span></td>";

    //         var delIcon = "<td><img src=\"img/cross.png\" alt=\"cross\" class=\"cross\"></td>";

    //         $("tbody").append("<tr>" + checkbox + content + delIcon + "</tr>");
    //     };


    //     var item = {

    //         name: "name"


    //     };
    //     smart_grocery.updateGroceries(token, { grocery: item}, addCallback);




    // }

});
