const topics = ["kitten","puppy","alpaca","capybara","polar bear","iguana","squirrel","doggo"];
const api_key = "aeIIQVswLPZlsqF60UyxjLiN22lfoJsm";

// Creates buttons elements with text and id equal to the button name

function makeButton(name) {
  
      return $("<button>").attr("id",name).addClass("btn topic").text(name);
  
}

// Creates a masonry grid

function makeGrid(){

      $("#images").masonry({
        itemSelector: '.window'
      });

}

// Creates still images based on the source and the index in the array. Once an image has loaded
// It modifies the masonry grid to accomidate the image size 

function makeStill(url,ind) {
  
    return $("<img>").attr("src",url)
                     .attr("id",ind)
                     .addClass("gif still")
                     .on("load",function(){

                          makeGrid();

                      });
  
}

// Makes windows for the images

function makeWindow(ind) {

   return $("<div>").attr("id","window-" + ind).addClass("window");

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
      $("#images").masonry('destroy');
          
      for(let i = 0 ; i < images.length ;i++){
          
        makeWindow(i).appendTo("#images");
        makeStill(images[i].images.fixed_width_still.url,"image"+i).appendTo("#window-" + i);
        $("<span>").text("Rating: " + images[i].rating.toUpperCase()).appendTo("#window-" + i);
        
      }   
      
    }
  
    // When the page loads, it creates buttons for all of the words in the "topics" array
  
    for(let i = 0 ; i < topics.length ; i++) {
      
       makeButton(topics[i]).appendTo("#buttons");
      
    }
    
    // Function that changes moving gifs to static ones and static ones to moving ones
    // Finds the image by id (index in images array), the new source, the class to remove and the class to add
    
    function changeSrc(id,newSrc,remove,add){
      
      $("#" + id).attr("src",newSrc).removeClass(remove).addClass(add);
      
    }
    
    // When a button in the buttons div is clicked, it requests gifs for that search term
  
    $("#buttons").on("click",".btn",function(){
      
        requestGifs(this.id);
   
    });
    
    // When an image in the images div is clicked, it changes from "still" to "moving" or vice versa
  
    $("#images").on("click" , ".gif" , function(){
        
       // The index held by the clicked image in the images array
        
       let ind = this.id.split("e")[1];
      
       // If the class of the clicked image contains "still" it changes to "moving"
       // Otherwise it goes back from "moving" to "still"
      
       if(this.className.indexOf("still") !== -1)

          changeSrc(this.id,images[ind].images.fixed_width.url,"still","moving");
            
       else

          changeSrc(this.id,images[ind].images.fixed_width_still.url,"moving","still");
        
    });

    $("form").submit(function(){

      makeButton($("#add-topic").val()).appendTo("#buttons");
      $("#add-topic").val("");
    
    });
  
});