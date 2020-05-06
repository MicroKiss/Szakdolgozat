
var home = document.querySelector("#hometab");


home.innerHTML = `
<div class="jumbotron">
<h1>Portal 2D</h1>

</div>

<div class="row">
    <div class="col-sm-5">
            <h2>About this project</h2>
            <p>
                This project is my Bachelor thesis for my university studies.
            </p>
    </div>
    <div class="col-sm-7">
        
        <h2>Welcome,</h2>
        <p>this is a multyplayer game based on the famous 
            <a href="https://store.steampowered.com/app/400/Portal/"> Portal</a> game.
            You can play at the <strong>Play</strong> tab above or 
            you can check out the tutorials at the <strong> How to play</strong> tab.
        </p>
    </div>
</div>



<div id="demo" class="carousel slide" data-ride="carousel">

<!-- Indicators -->
<ul class="carousel-indicators">
  <li data-target="#demo" data-slide-to="0" class="active"></li>
  <li data-target="#demo" data-slide-to="1"></li>
  <li data-target="#demo" data-slide-to="2"></li>
</ul>

<!-- The slideshow -->
<div class="carousel-inner">
  <div class="carousel-item active">
    <img src="assets/1.jpg" width="100%">
  </div>
  <div class="carousel-item">
    <img src="assets/2.jpg" width="100%">
  </div>
  <div class="carousel-item">
    <img src="assets/3.jpg" width="100%" >
  </div>
</div>

<!-- Left and right controls -->
<a class="carousel-control-prev" href="#demo" data-slide="prev">
  <span class="carousel-control-prev-icon"></span>
</a>
<a class="carousel-control-next" href="#demo" data-slide="next">
  <span class="carousel-control-next-icon"></span>
</a>

</div>`;