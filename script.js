// https://opentdb.com/api.php?amount=30&category=18&difficulty=easy&type=multiple

// -------- timer ---------
let time = document.querySelector(".time");
let timeAnim = document.querySelector(".time-anim");
let timeLeft = document.querySelector(".time-left");
let timeValue = 10;
let again;


// -------- main btns ---------
let start = document.querySelector('.start button');
let quit = document.querySelector(".buttons .quit");
let cont = document.querySelector(".buttons .continue");
let next = document.querySelector(".next");
let exit = document.querySelector(".exit");
let restart = document.querySelector(".restart");
const icon = document.querySelector('.result-wrapper .icon');


// -------- box of rules, quiz, result ---------
let rules = document.querySelector('.rules-wrapper');
let quiz = document.querySelector('.quiz-wrapper');
let result = document.querySelector('.result-wrapper');

// -------- ques, opt, score ---------
let ques = document.querySelector('.ques');
let opt = document.querySelector('.options');
let score = document.querySelector('.score');
let queCount = document.querySelector('.q-count')


// -------- tick cross animation ---------
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';


// ----------- score, correct, incorrect, Qnos -----------
let userScore = 0;
let correct_answer;
let incorrect_answers = [];
let shuffledOptions = [];
let qNo = 0;   // question no according to json
let NoOfQues = 0;   // question no which is to be showm


// --------------- xtras -------------------

let lEl;    // it will create a list of random el
let index;  // this will match json with random list
let qNoRandom = 0;    // the index which carry index of list and fetch index of json


// ------------- API fetching ---------------
/*function questions() {
  fetch('https://opentdb.com/api.php?amount=34&category=18&difficulty=easy&type=multiple')
    .then(response => response.json())
    .then((data) => {
      qNo++;
      showQuestions(data.results[qNo]);
    })
    .catch(error => console.log("error =>",error));
}*/

async function questions(){
  const APIUrl = 'https://opentdb.com/api.php?amount=34&category=18&difficulty=easy&type=multiple';
  const result = await fetch(`${APIUrl}`)
  const data = await result.json();
  if (qNoRandom == 0) {
    index = lEl[qNoRandom];
    showQuestions(data.results[index]);
  }
  else{
    index = lEl[qNoRandom];
    showQuestions(data.results[index]);
  }
}


// -------- logic for unique questions -----------

function create(){
  let list = [];
  let el;
  for(let ind=0 ; ind<6 ; ind++){
      el = Math.floor(Math.random()*34);
      list[ind] = el;
  }
  let newList = counting(list);
  return newList;
}

function counting(list){
  
  let count=0;
  let x;
  for(let ind1=0 ; ind1<list.length ; ind1++){
      for(let ind2=0 ; ind2<list.length ; ind2++){
          if(list[ind1] == list[ind2]){
              count = count + 1;
          }
      }
      
      if(count > 1){
          x = Math.floor(Math.random()*34);
          list[ind1] = x;
      }
      count = 0;
  }
  return list;
}



// -------- main btns ---------
start.onclick = () =>{
  rules.classList.add('rules-wrapper-show');
  start.classList.add('start-hide');
}

quit.onclick = () =>{
  rules.classList.remove('rules-wrapper-show');
  start.classList.remove('start-hide');
}

exit.onclick = () =>{
  result.classList.remove('result-wrapper-show');
  start.classList.remove('start-hide');
  next.classList.remove("next-show");
}

cont.onclick = (e) =>{
  e.preventDefault();
  rules.classList.remove('rules-wrapper-show');
  quiz.classList.add('quiz-wrapper-show');
  NoOfQues = 0;
  qNo = 0;
  userScore = 0;
  qNoRandom = 0;
  lEl = create();   // it will create a list of random el
  questions();
  startTimer(timeValue);
}

restart.onclick = (e) =>{
  e.preventDefault();
  result.classList.remove('result-wrapper-show');
  quiz.classList.add('quiz-wrapper-show');
  next.classList.remove("next-show");
  NoOfQues = 0;
  if(qNo < 30){
    userScore = 0;
    qNoRandom = 0;
    lEl = create();   // it will create a list of random el
    questions();
    startTimer(timeValue);
  }
  else{
    userScore = 0;
    qNoRandom = 0;
    lEl = create();   // it will create a list of random el
    questions();
    startTimer(timeValue);
  }
  
}

// -------- showQ, Opt, SelAns ---------
function showQuestions(data){
  NoOfQues++;
  let q = `<h3>`+ `${NoOfQues}. ` + data.question +`</h3>`;
  ques.innerHTML = q;
  queCount.innerHTML = NoOfQues + ` / 6`;
  correct_answer = data.correct_answer;
  incorrect_answers = data.incorrect_answers;
  let o;
  const options = [correct_answer, ...incorrect_answers];
  shuffledOptions = shuffleArray(options);
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  shuffledOptions.forEach(() => {
    o = 
      `<p class='opts' onclick='optionSelected(this)'><span>`+ shuffledOptions[0] + `</span></p>`+
      `<p class='opts' onclick='optionSelected(this)'><span>`+ shuffledOptions[1] + `</span></p>`+
      `<p class='opts' onclick='optionSelected(this)'><span>`+ shuffledOptions[2] + `</span></p>`+
      `<p class='opts' onclick='optionSelected(this)'><span>`+ shuffledOptions[3] + `</span></p>`;
    opt.innerHTML = o;
  });
}


function cAns(ans){
  let text1 = "For";
  let text2 = "Captures";
  if(ans.includes(text1)) {
    ans = "'For' loops";
    return ans;
  }if(ans.includes(text2)){
    ans = "Captures what's on the screen and copies it to your clipboard";
    return ans;
  }
  else {
    return ans;
  }
}

function optionSelected(answer){
  clearInterval(again);
  let Arrlen = shuffledOptions.length;
  next.classList.add("next-show");
  let optSel = answer.textContent;
  console.log("the option selected =>",optSel);
  console.log("the correct answer is =>",cAns(correct_answer));
  
  if(optSel == cAns(correct_answer)){ //if user selected option is equal to array's correct answer
    userScore += 1; //upgrading score value with 1
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    console.log("Correct Answer");
    console.log("Your correct answers = " + userScore);
  }
  else{
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    console.log("Wrong Answer");
    for(i=0; i < Arrlen; i++){
      if(opt.children[i].textContent == cAns(correct_answer)){ //if there is an option which is matched to an array answer 
          opt.children[i].setAttribute("class", "opts correct"); //adding green color to matched option
          opt.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
          console.log("Auto selected correct answer.");
      }
  }
  }
  for (let i = 0; i < Arrlen; i++) {
    opt.children[i].classList.add('disabled');
  }
}



next.onclick = ()=>{
  if(NoOfQues < 6 && qNoRandom < 6){ //if question count is less than total question length
    qNo++;
    qNoRandom++;
    next.classList.remove("next-show");
    questions();
    clearInterval(again);
    startTimer(timeValue);
  }
  else{
    showResult();
  }
}


function showResult(){
  quiz.classList.remove('quiz-wrapper-show');
  result.classList.add('result-wrapper-show');
  let sc = "";  
  if(userScore < 2) {
    sc = `<p> You have scored `+ userScore + ` out of ` + NoOfQues + `. Try solving more questions and practice hard</p>`;
    icon.innerHTML = `<i class="fa-regular fa-face-frown"></i>`;
  }
  else if(userScore > 2 && userScore < 4) {
    sc = `<p> Well done, You have scored `+ userScore + ` out of ` + NoOfQues + `. Brushup your knowledge a little bit</p>`;
    icon.innerHTML = `<i class="fa-solid fa-thumbs-up"></i>`;
  }
  else{
    sc = `<p> Congrats, You have scored `+ userScore + ` out of ` + NoOfQues + `</p>`;
    icon.innerHTML = `<i class="fas fa-crown"></i>`;
  }
  score.innerHTML = sc;
  console.log(icon);
}


function startTimer(timeValue){
  again = setInterval(startTime, 1000);
  
  function startTime(){
    time.textContent = timeValue; //changing the value of timeCount with time value
        timeValue--; //decrement the time value
        if(timeValue < 9){ //if timer is less than 9
            let addZero = time.textContent; 
            time.textContent = "0" + addZero; //add a 0 before time value
        }
        if(timeValue < 0){ //if timer is less than 0
            clearInterval(again); //clear counter
            const arrLen = opt.children.length; //getting all option items
            for(i=0; i < arrLen; i++){
                if(opt.children[i].textContent === cAns(correct_answer)){ //if there is an option which is matched to an array answer
                    opt.children[i].setAttribute("class", "opts correct"); //adding green color to matched option
                    opt.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                    console.log("Time Off: Auto selected correct answer.");
                }
            }
            for(i=0; i < arrLen; i++){
                opt.children[i].classList.add("disabled"); //once user select an option then disabled all options
            }
            next.classList.add("next-show"); //show the next button if user selected any option
        }
  }
}
