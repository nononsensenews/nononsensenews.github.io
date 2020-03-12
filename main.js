
var blocked_words = [];
if (localStorage.getItem("blocked_words")) 
	blocked_words = JSON.parse(localStorage.getItem("blocked_words"));

var bws = document.getElementById("blocked-words");
if (blocked_words.length != 0)
	bws.style.display = "block";
for (var i = 0; i < blocked_words.length; i++) {
	bws.insertAdjacentHTML('beforeend', `<button id="bw-btn-${blocked_words[i]}" onclick="remove('${blocked_words[i]}')">'${blocked_words[i]}'</button> `);
}

window.onload = get_news;

document.getElementById("block-input").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("block-btn").click();
  }
});

document.getElementById("block-btn").addEventListener('click', function() {
	var value = document.getElementById("block-input").value;
	if (!value || blocked_words.includes(value))
		return;
 	blocked_words.push(document.getElementById("block-input").value);
 	localStorage.setItem("blocked_words", JSON.stringify(blocked_words));
 	var bws = document.getElementById("blocked-words");
 	bws.style.display = "block";
	bws.insertAdjacentHTML('beforeend', `<button id="bw-btn-${value}" onclick="remove('${value}')">'${value}'</button> `);
	document.getElementById("block-input").value = "";
	get_news();
}, false);


function remove(value) {
	for(var i = blocked_words.length - 1; i >= 0; i--) {
	    if(blocked_words[i] === value) {
	        blocked_words.splice(i, 1);
	        document.getElementById(`bw-btn-${value}`).remove();
	    }
    }
	localStorage.setItem("blocked_words", JSON.stringify(blocked_words));
	if (blocked_words.length == 0)
		document.getElementById("blocked-words").style.display = "none";
	get_news();
}


function show_article(item, index) {
	var t_arr = item.title.split("-");
	var title = t_arr.slice(0,-1).join("-");
	var source = t_arr[t_arr.length-1];

	var search_title = title.replace(/[^\w\s]/gi, ' ').toLowerCase();

	var search_desc = "";
	if (item.description)
		var search_desc = item.description.replace(/[^\w\s]/gi, ' ').toLowerCase();
	for (var i = 0; i < blocked_words.length; i++) {
		var words_found = 0;
		for (var j = 0; j < blocked_words[i].split(" ").length; j++)
			if (search_title.split(" ").includes(blocked_words[i].split(" ")[j].toLowerCase()) || search_desc.split(" ").includes(blocked_words[i].split(" ")[j].toLowerCase()))
				words_found++;
		if (words_found == blocked_words[i].split(" ").length)
			return;
	}

	var container = document.getElementById('news-container');
	container.insertAdjacentHTML('beforeend', `<div id="article-${index}" class="article"></div>`);
	var article_div = document.getElementById(`article-${index}`);
	article_div.insertAdjacentHTML('beforeend', `<div id="article-inner-${index}" class="article-inner"></div>`);
	article_div.style.backgroundImage = `url('${item.urlToImage}')`;
	var article_inner = document.getElementById(`article-inner-${index}`);
	
	article_inner.insertAdjacentHTML('beforeend', `<a href="${item.url}" target="_blank"><h2>${title}</h2></a>`);
	if (item.description)
		article_inner.insertAdjacentHTML('beforeend', `<h3>${item.description}</h3>`);
	article_inner.insertAdjacentHTML('beforeend', `<h5>${source}</h5>`);
}


function get_news() {
	var container = document.getElementById('news-container');
	container.innerHTML = "";

	var api_key = "c4c94903673e42b98955225991fa5c90";
	var request = new XMLHttpRequest();
	var url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${api_key}`;
	request.open('GET', url, true);
	request.onload = function() {
		var data = JSON.parse(this.response);
		data.articles.forEach(show_article);
	}
	request.send();
}
