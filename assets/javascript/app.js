const topics = ["kitten","puppy","alpaca","capybara","polar bear","iguana","squirrel","doggo"];
const api_key = "aeIIQVswLPZlsqF60UyxjLiN22lfoJsm";

// Creates buttons elements with text and id equal to the button name

function makeButton(name) {
  
      return $("<button>").attr("id",name)
                          .addClass("btn topic")
                          .text(name);
  
}

// Creates a masonry grid

function makeGrid(){

      $("#images").masonry({
        itemSelector: '.window'
      });

}

// Creates still images based on the source and the index in the array. Once an image has loaded
// It modifies the masonry grid to accomidate the loaded image size 

function makeStill(still,animated,i) {
  
    return $("<img>").attr( "src"      ,  still       )
                     .attr( "id"       , "image-" + i )
                     .attr( "ind"      , i            )
                     .attr( "moving"   , false        )
                     .attr( "still"    , still        )
                     .attr( "animated" , animated     )
                     .addClass("gif")
                     .on("load", makeGrid);
  
}

// Makes windows for the images

function makeWindow(ind) {

   return $("<div>").attr("id","window-" + ind).addClass("window");

}

// Switches images from animated to still and from still to animated using data attributes

function animateSwitch(img){

  let moving = $(img).attr("moving");

  if(moving === "true") {

      $(img).attr("src", $(img).attr("still"))
            .attr("moving",false);

  }
  else {

     $(img).attr("src", $(img).attr("animated"))
           .attr("moving",true);

  }
}

$(document).ready(function(){ 
  
    // Variable to store data objects retreived from the GIPHY api
    
    let images;
    
    // Requests GIFs from the GIPHY api based on a search string.
    
    function requestGifs(query) {

      console.log("atempting request for " + query);
      
      var request = $.get("https://api.giphy.com/v1/gifs/search?q=" + query + "&api_key=" + api_key + "&limit=10");
      
      // Once the request has gotten data, it saves it to the images variable
      // and calls the function to load the images into the "images" div
      
      request.done(function (data){

         console.log("request completed");
         images = data.data;
         loadEmUp();

      });
      
    }
    
   
    // Empties any old images from "images". Then, For each of the ten images retrived,
    //  it creates a new still image and adds it to The "images" div.
  
    function loadEmUp(){
      
      $("#images").empty();

      if(images != undefined)
        $("#images").masonry('destroy');
          
      for(let i = 0 ; i < images.length ;i++){
          
        makeWindow(i).appendTo("#images");
        makeStill(images[i].images.fixed_width_still.url,images[i].images.fixed_width.url,i).appendTo("#window-" + i);
        $("<div>").addClass("rating")
                  .text("Rating: " + images[i].rating.toUpperCase())
                  .appendTo("#window-" + i);
        
      }   
      
    }

    // When the page loads, it creates buttons for all of the words in the "topics" array
  
    for(let i = 0 ; i < topics.length ; i++) {
      
       makeButton(topics[i]).appendTo("#buttons");
      
    }
    
    // When a button in the buttons div is clicked, it requests gifs for that search term
  
    $("#buttons").on("click",".btn",function(){
      
        requestGifs(this.id);
   
    });
    
    // When an image in the images div is clicked, it changes from "still" to "moving" or vice versa
  
    $("#images").on("click" , ".gif" , function(){
        
       // The index held by the clicked image in the images array and switches the animated state
        
       let ind = $(this).attr("ind");

       animateSwitch("#" + this.id); 
        
    });

    // Adds new buttons when the form is submitted if the input is not null

    $("form").submit(function(event){

      event.preventDefault();
      let newTopic = $("#add-topic").val();

      if(newTopic != "") {

        makeButton(newTopic).appendTo("#buttons");
        $("#add-topic").val("");
        
      }
    
    });

    makeGrid();
  
});