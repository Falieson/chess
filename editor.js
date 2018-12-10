window.onload = function() {
  let txtFile = new XMLHttpRequest();
  txtFile.onreadystatechange = function() {
    let allText;
    if (txtFile.readyState === 4 && txtFile.status == 200) {
      allText = txtFile.responseText;
      allText = allText.split("\n").splice(91).join("\n");
    }
    document.getElementById('code').innerHTML = "<pre class=\"prettyprint linenums lang-js\">" + allText + "</pre>";
    PR.prettyPrint();
  }
  txtFile.open("GET", "https://raw.githubusercontent.com/IcyTv/chess/master/Client/algorithm.js", true);
  txtFile.send();
}
