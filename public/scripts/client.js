/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Raw data taken from initial-tweets.json

$(document).ready(function () {
  loadtweets();

  //create Ajax POST request
  $("#request").submit(function (event) {
    event.preventDefault();

    const maxCharCount = 140;
    const inputLength = $(this).find("#tweet-text").val().length;
    //error message slides down when no input

    const tweet = $("#request").serialize(); //serialize
      $.ajax({
        url: "/tweets/",
        method: "post",
        data: tweet,
      }).then(function (res) {
        loadtweets(); 
        //reset textarea and counter
        $("#tweet-text").val("")
        $(".counter").val("140")
      });       


    if (!inputLength) {
      $("#error-short").slideDown("slow");
      $("#error-over").hide("fast");
      return;
      //error message slides down when input is over 140
    } else if (inputLength > maxCharCount) {
      $("#error-over").slideDown("slow");
      $("#error-short").hide("fast");
      return;
    } else {
      $("#error-short").hide(); //hides error message when correct input
      $("#error-over").hide();

      


    }
  });
});

//load tweet with GET
const loadtweets = () => {
  $.ajax("/tweets", { method: "GET" }).then((tweets) => {
    renderTweets(tweets);
  });
};

const renderTweets = (tweets) => {
  $("#tweets-container").empty();
  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container
  for (let index of tweets) {
    const render = createTweetElement(index);
    $("#tweets-container").prepend(render);
  }
};

const createTweetElement = (tweetData) => {
  //Prevent XSS attack with escape functoin
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };
  let $tweet = $(`
  <article>
  <header class="tweet-header">
     <span style="padding: 2%"><img src="${escape(tweetData.user.avatars)}">
        ${escape(tweetData.user.name)}
        </span> 
    <span class="user-id">${escape(tweetData.user.handle)}</span>

  </header>
<p class="user-text">${escape(tweetData.content.text)}</p>
<hr style="width: 95%">

<div>
</div>
<footer>
<time>${timeago.format(tweetData.created_at)}</time>
<div class="footer-icons"><i class="fa-solid fa-flag"></i>
<i class="fa-solid fa-retweet"></i>
<i class="fa-solid fa-heart"></i> </div>
</footer>

</article>`);
  return $tweet;
};
