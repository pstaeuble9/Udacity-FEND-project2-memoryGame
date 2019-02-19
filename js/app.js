/* Array that holds all of the available card icon classes so they can be assigned or removed */
const iconsArray = ["fa fa-diamond", "fa fa-diamond",
    "fa fa-paper-plane-o", "fa fa-paper-plane-o",
    "fa fa-anchor", "fa fa-anchor",
    "fa fa-bolt", "fa fa-bolt",
    "fa fa-cube", "fa fa-cube",
    "fa fa-leaf", "fa fa-leaf",
    "fa fa-bicycle", "fa fa-bicycle",
    "fa fa-bomb", "fa fa-bomb"
];

// ALL CARDS variable
const cards = document.querySelectorAll(".card");

// RESTART BUTTON variable
const restartButton = document.getElementsByClassName("restart")[0];

// SCORE variables
let seconds = 0;
let minutes = 0;
let moves = 0;
let Interval;
let isTimerSet = false;
const appendSeconds = document.getElementsByClassName("time-seconds")[0];
const appendMinutes = document.getElementsByClassName("time-minutes")[0];
const appendMoves = document.getElementsByClassName("moves")[0];
const starOne = document.getElementById("star-one");
const starTwo = document.getElementById("star-two");
const starThree = document.getElementById("star-three");

// MODAL variables
const modal = document.getElementsByClassName("modal-container")[0];
const exitModal = document.getElementsByClassName("close-modal")[0];
const replayBtn = document.getElementsByClassName("replay-button")[0];
const modalMoves = document.getElementsByClassName("modal-moves")[0];
const modalTimeMin = document.getElementsByClassName("modal-time-minutes")[0];
const modalTimeSec = document.getElementsByClassName("modal-time-seconds")[0];
const modalStars = document.getElementsByClassName("modal-stars")[0];

/* Provided shuffle function from http://stackoverflow.com/a/2450976
 * The function allows the card icons to be placed randomly across the board */
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/* function to make each card clickable by selecting the class, looping through the
 * array and adding an eventListener to each element */
function setCardEvents() {
    // shuffles the array
    myShuffledCards = shuffle(iconsArray);

    // updates HTML from the old to the new card so the shuffled array is displayed
    for (let x = 0; x < cards.length; x++) {
        const oldCard = document.getElementsByClassName("card")[x];
        const updatedHtml = myShuffledCards[x];
        newCard = oldCard.querySelector("i").className = updatedHtml;

        cards[x].addEventListener("click", cardEventListener);
    }

    /* this little helper loop logs where each icon is for testing purposes
     * activate if you don't want to do the guesswork ;)
    for (let i = 0; i < iconsArray.length; i++) {
        const item = iconsArray[i];
        console.log(item);
    } */
}

// adds an event listener to each card
function cardEventListener(event) {
    const addClasses = this.classList;
    addClasses.add("open", "show");

    // setting intervals for timer
    if (isTimerSet != true) {
        clearInterval(Interval);
        Interval = setInterval(startTimer, 1000);
        isTimerSet = true;
        startTimer();
    }
    isMatch();
}

/* counts the clicks purely for matching - gets reset as soon as its
 * value reaches 2 */
let clickCounter = 0;

// function to check whether the cards are a pair
function isMatch() {
    const openCard = document.getElementsByClassName("open show");

    clickCounter++;

    //accesses the first and second cards as they're clicked
    const firstCard = openCard[0];
    const secondCard = openCard[1];

    /* compares everything about the cards to each other (comparing the node would
     * probably not be the best solution in the wild, but because the whole card  * will be identical here, I think it's fine) */
    const matchedCards = firstCard.isEqualNode(secondCard);

    /* if the cards match, open & show classes are removed, match class is added
     * if the cards don't match, open & show classes are removed and the cards
     * can be accessed again */
    if (matchedCards) {
        firstCard.classList.remove("open", "show");
        secondCard.classList.remove("open", "show");
        firstCard.classList.add("match");
        secondCard.classList.add("match");

        clickCounter = 0;
        moves++;

    } else if (clickCounter === 2) {
        // closes both cards after a delay if they're not a match
        window.setTimeout(function() {
            firstCard.classList.remove("open", "show");
            secondCard.classList.remove("open", "show");
        }, 500);

        clickCounter = 0;
        moves++;

    } else {
        //// do nothing
    }

    /* victory condition which stops the timer and pops open a modal that
     * displays the player's stats */
    const allCardsMatched = document.querySelectorAll(".match");
    if (allCardsMatched.length === 16) {
        clearInterval(Interval);
        victoryModal();
    }
}

/* the restart button re-shuffles the card if the user wants to start over
 * from modal */
restartButton.addEventListener("click", function restartGame() {
    for (let x = 0; x < cards.length; x++) {
        const unflippedCard = document.getElementsByClassName("card")[x];
        const removedClass = unflippedCard.classList;
        removedClass.remove("match");
        cards[x].removeEventListener("click", cardEventListener);
    }
    setCardEvents();

    // resets the timer - see source for startTimer() function
    clearInterval(Interval);
    seconds = 0;
    minutes = 0;
    moves = 0;
    appendSeconds.innerHTML = seconds;
    appendMinutes.innerHTML = minutes;
    appendMoves.innerHTML = moves;
    starTwo.classList.remove("fa-star-o");
    starTwo.classList.add("fa-star");
    starThree.classList.remove("fa-star-o");
    starThree.classList.add("fa-star");

    isTimerSet = false;
});

// starts timer and appends stars
/* timer adapted from
 * https://www.cssscript.com/a-minimal-pure-javascript-stopwatch/ */
function startTimer() {
    seconds++;

    if (seconds > 59) {
        minutes++;
        seconds = 0;
        appendMinutes.innerHTML = minutes;
    }
    appendSeconds.innerHTML = seconds;
    appendMoves.innerHTML = moves;

    if (moves <= 15) {
        // 3 stars - do nothing
    } else if (moves <= 20) {
        // 2 stars
        starThree.classList.remove("fa-star");
        starThree.classList.add("fa-star-o");
    } else {
        // 1 star
        starTwo.classList.remove("fa-star");
        starTwo.classList.add("fa-star-o");
    }
}

// MODAL
function victoryModal() {
    modal.style.display = "flex";

    modalMoves.innerHTML = moves;
    modalTimeMin.innerHTML = minutes;
    modalTimeSec.innerHTML = seconds;
    modalStars.innerHTML = document.getElementsByClassName("stars")[0].innerHTML;
}

replayBtn.onclick = function() {
    modal.style.display = "none";

    //access restart function
    for (let x = 0; x < cards.length; x++) {
        const unflippedCard = document.getElementsByClassName("card")[x];
        const removedClass = unflippedCard.classList;
        removedClass.remove("match");
        cards[x].removeEventListener("click", cardEventListener);
    }
    setCardEvents();

    // resets the timer - see source for startTimer() function
    clearInterval(Interval);
    seconds = 0;
    minutes = 0;
    moves = 0;
    appendSeconds.innerHTML = seconds;
    appendMinutes.innerHTML = minutes;
    appendMoves.innerHTML = moves;
    starTwo.classList.remove("fa-star-o");
    starTwo.classList.add("fa-star");
    starThree.classList.remove("fa-star-o");
    starThree.classList.add("fa-star");

    isTimerSet = false;
}

exitModal.onclick = function() {
    modal.style.display = "none";
}

setCardEvents();