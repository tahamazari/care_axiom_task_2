const express = require('express');
//this module will parse the url for us
const url = require('url');
const router = express.Router()
const async = require('async')
//this module will return us titles
var getTitleAtUrl = require('get-title-at-url');

router.get("/I/want/title", (req, res, next) => {
  //this address string stores the url fro which we want to extract all the titles
  var address = 'http://localhost:3000/I/want/title?address=dawn.com&address=www.google.com&address=www.facebook.com'
  //parse address using the urls module
  address = url.parse(address, true)
  //web_urls will now get urls e.g. [dawn.com, www.google.com, www.facebook.com] in this case
  var web_urls = address.query.address
  //this will store all the list of titles
  var list_of_titles = []

  //this function call adds www. if not already in the string
  add_www(web_urls)

  //function will return html, uses recursion
  function make_list_of_titles(index, limit){
    if(index == limit){
      console.log(list_of_titles);
      var html = send_html(list_of_titles);
      res.send(html)
      return;
    }
    if(typeof(web_urls) == "string"){
      var url = "https://"+ web_urls;
       getTitleAtUrl(url, function(title){
       if(typeof(title) == 'undefined'){
         list_of_titles.push(url + ' - Title not found')
       }
       else {
         list_of_titles.push(title);
       }
       make_list_of_titles(limit,limit);
     });
    }
    else {
      var url = "https://"+ web_urls[index];
      getTitleAtUrl(url, function(title){
        if(typeof(title) == 'undefined'){
          list_of_titles.push(url + ' - Title not found')
        }
        else {
          list_of_titles.push(title);
        }
        make_list_of_titles(index+1, limit);
      });
    }
  }

  async.series({
    one: function(callback){
      callback(null, make_list_of_titles(0,web_urls.length))
    }
  });

});

//this function will render the html, list is the total number of titles passed
//this function is called within the make_list_of_titles function
function send_html(list){
  var htmlStart = '<!DOCTYPE html><html><head></head><body><h1>Following are the titles of given websites:</h1><ul>'
  var htmlEnd = '</ul></body></html>'
  var listTemp = "";
  for(let i = 0 ; i < list.length ; i++){
    listTemp += "<li>"+ list[i] +"</li>"
  }
  return  htmlStart + listTemp + htmlEnd;
}

//this function adds www. if not already in the string
function add_www(array){
  var prefix = "www."
  for(let i = 0; i < array.length; i++){
    if (!array[i].match(/www/))
      {
          array[i] = 'www.' + array[i];
      }
  }
  console.log(array);
  return array
}

module.exports = router
