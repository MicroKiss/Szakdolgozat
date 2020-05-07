var howtoplay = document.querySelector("#howtoplaytab");

howtoplay.innerHTML = `
<div data-spy="scroll data-target="#tutorialnavbar" data-offset="50">

<nav class="navbar navbar-expand-sm bg-light navbar-light">
  <ul class="navbar-nav">
  <h3 class="text-primary">Basics:</h3>
    <a class="nav-link" href="#dragndrop">
        <button type="button" class="btn btn-outline-info">
        Drag&Drop
        </button>
    </a>
    <a class="nav-link" href="#portals1">
        <button type="button" class="btn btn-outline-info">
        Portals I
        </button>
    </a>
    <a class="nav-link" href="#portals2">
        <button type="button" class="btn btn-outline-info">
        Portals II
        </button></a>
    <a class="nav-link" href="#goal">
        <button type="button" class="btn btn-outline-info">
        Goal
        </button>
    </a>
    <a class="nav-link" href="#unreachable">
        <button type="button" class="btn btn-outline-info">
        Uncreachable
        </button>
    </a>

    <h3 class="text-info">Tips:</h3>

    <a class="nav-link" href="#momentum">
        <button type="button" class="btn btn-outline-info">
        Momentum
        </button>
    </a>
    <a class="nav-link" href="#gravity">
        <button type="button" class="btn btn-outline-info">
        Gravity
        </button>
    </a>
    </ul>


</nav>
    <h2> Basics</h2>
    <div class="row" id="tutorial">
        <table class="table table-striped">
            <tbody>
                <tr id="dragndrop">
                    <td> 
                        <img src="./assets/tutorials/drag.gif" alt="drag and drop">
                    </td>
                    <td>
                        <p>You can <b>click on a ball to move</b>, it with the left mouse button</p>
                    </td>
                </tr>
                <tr id="portals1">
                    <td> 
                        <p> The core mechanics of the game are the portals.<br>
                        You can place a <b>Portal</b> via clicking on a <b>gray wall</b> with the left or right mouse button </p>
                    </td>
                    <td>
                        <img src="./assets/tutorials/portals.gif" alt="portals">
                    </td>
                </tr>
                <tr id="portals2">
                    <td> 
                        <img src="./assets/tutorials/portals2.gif" alt="portals2">
                    </td>
                    <td>
                        <p>You can place these portals on <b>any gray wall</b></p>
                    </td>
                </tr>
                <tr id="goal">
                    <td>
                        <p>Your goal is to <b>reach the green</b> rectangle <b>with one</b> of the <b>ball</b>s</b></p>
                    </td>
                    <td> 
                    <img src="./assets/tutorials/goal.gif" alt="goal">
                    </td>
                </tr>
                <tr id="unreachable">
                    <td>
                    <img src="./assets/tutorials/unreachable.gif" alt="unreachable">
                    </td>
                    <td> 
                    <p>There are protected <b>areas</b> in the game where you <b>can't move ball</b>s</p>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
<h2>Useful tips</h2>
    <div class="row" id="tips">
        <table class="table table-striped">
            <tbody>
                <tr id="momentum">
                    <td>
                        <p><b>Use</b> the ball's <b>momentum</b> to reach your destination</p>
                    </td>
                    <td> 
                        <img src="./assets/tutorials/velocity.gif" alt="momentum">
                    </td>
                </tr>
                <tr id="gravity">
                    <td>
                        <img src="./assets/tutorials/gravity.gif" alt="gravity">
                    </td>
                    <td> 
                        <p><b>Think</b> out of the box!<br> Use the portals to <b>reach</b> otherwise <b>unreachable</b> places</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


</div>

`;