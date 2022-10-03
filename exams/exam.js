// selectors
let score;
let score_loc = {};
let the_answers = {};
let answered_test;
let min;
let sec;
let time;
let counter;
let play_click;

arrange()


if(localStorage.getItem('mytests') !== null){
    // get test from local storage
            answered_test = JSON.parse(localStorage.getItem('mytests'));
    // get score from local storage
            score_loc = JSON.parse(localStorage.getItem(`myscores`))
    // get previous answers
            the_answers = JSON.parse(localStorage.getItem(`myanswers`))
}else {
}
let score_local_storage = localStorage.getItem("myscores")

// localStorage.clear()
// fetch exams cards
let myreq_exam = new XMLHttpRequest()
myreq_exam.open("GET", "exams/json/exams.json")
myreq_exam.send()

// get exams cards
myreq_exam.onload = function(){
    let exams = JSON.parse(this.responseText)
    add_exam(exams)
}

// add cards
function add_exam (exams) {
    let out = "";
    for (let i = 0; i < exams.length; i++){
        let content = document.querySelector(`.${exams[i].moduleName} .content`)
        out = `
         <div class="exam-card">
        <div class="exam-name">
            <h3>${exams[i].examName}</h3> 
            </div> <hr>
        <div class="exam-info">
            <div class="detail">
                <span>topic:</span> <span class="topic subinfo">${exams[i].topic}</span>
            </div>
            <div class="detail">
                <span>questions\` number:</span> <span class="nums subinfo">${exams[i].nums}</span>
            </div>
            <div class="detail">
                time: <span class="time subinfo">${exams[i].time}</span>
            </div>
            <div class="detail ">
                your score: <span class="score subinfo ${exams[i].id}${i + 1}"> --</span>
            </div>
        </div> <hr>
        <div class="exam-foot">
            <div class="btn" id="${exams[i].id}${i + 1}">start</div>
            <div class="show" data-show='${exams[i].id}${i + 1}'> show answer <i class="fa-solid fa-check"></i> </div>

        </div>
    </div> `
    content.insertAdjacentHTML("beforeend", out)}

        // get data from local storage
    if(score_local_storage !== null){
        let score_show = JSON.parse(score_local_storage)
        let tests_show = JSON.parse(localStorage.getItem("mytests"))

          tests_show.forEach(test => {
            let  myspan = document.querySelector(`.${test}`)
            myspan.innerHTML =`${score_show[`${test}`][0]} of ${score_show[`${test}`][1]}`

            let show_btn = document.querySelector(`[data-show= '${test}']`)
            show_btn.classList.add("activejs")

        // show answers from local storage
        show_btn.addEventListener("click", function(){
            
            let show_url = this.dataset.show
            let show_req = new XMLHttpRequest()
            show_req.open('GET', `exams/json/tests/${show_url}.json`)
            show_req.send()

            show_req.onload = function(){
                let test = JSON.parse(this.responseText)

            // hide exams card
                 hide_exams()

                show_answers(test, the_answers[show_url])
            }
        })
         })

    } else {
        // console.log("empty")
    }
// ============================================================================
    // add a spicific test

    let my_tests = document.querySelectorAll(".btn")

    my_tests.forEach((test) => {

        test.addEventListener("click", (e) => {
        // get test URL
            let test_url = e.currentTarget.id


                //overlay
                let overlay = document.createElement("div")
                overlay.className = "overlay"
                document.body.appendChild(overlay)
        
                let popupbox = document.createElement("div")
                popupbox.className = "popupbox"
                overlay.appendChild(popupbox)


                let test_rules = `
                    <div> 
                        <h2> ${test_url} </h2>
                        <hr>
                        <div class= "rules">
                            <h3> RULES </h3>
                            <p class= "info">1 - when you click continue, the test will begin and you will not be able to back .</p>
                            <p class= "info">2 - focus and answer all questions . </p>
                            <p class= "info">3 - when the time is finshed, the test will be sent .</p>
                    </div>
                    <hr>
                    <div class="foot">
                        <div class= "continue btn"> continue </div>
                        <div class= "back red-btn"> back </div>
                    </div>
                `
                popupbox.insertAdjacentHTML("beforeend", test_rules)

                // when continue
                let start = document.querySelector(".continue")
                start.onclick = function(){
                    // remove popup
                    overlay.remove()

                    // hide exams card
                        hide_exams()
            
                    // get test
                        get_test(test_url)
                }

                // when back
                document.querySelector(".back").onclick = function(){
                    location.reload()
                }
        })
    })
}


// ===============================================================
//     the test

function get_test(testURL){

//   the reruest
    let myreq_test = new XMLHttpRequest()
    myreq_test.open("GET", `exams/json/tests/${testURL}.json`)
    myreq_test.send()
    myreq_test.onload = function(){
        if(this.readyState === 4 && this.status === 200){

            let test = JSON.parse(this.responseText)
        
        // add test to page
            add_test(test)

        // start timer
            startTimer(time)
        // get rigth answers
            let right_answers = []
             for (i = 1; i < test.length; i++){
                right_answers.push(test[i].right_answer)
            }

            let submit = document.querySelector(".submit")
        // when submit answers
            submit.onclick = function(){

        // get chosen ansewrs
            let chosen_answers = []
            document.querySelectorAll(".chosed").forEach(answer => {
                chosen_answers.push(answer.dataset.content)
            })
            
        //==========================================================================
                                //              after finishing
            if(play_click === 0 || right_answers.length === chosen_answers.length){
                if(chosen_answers.length !== right_answers.length){
                    chosen_answers = []
                    for(i = 1; i <= right_answers.length; i++){
                        document.querySelectorAll(`.answer${i}`).forEach(answer => {
                            if(answer.classList.contains(`chosed`)){
                                chosen_answers.push(answer.dataset.content)
                            }
                        })
                        // arrange chosen answers
                        if(chosen_answers.length !== i){
                            chosen_answers.push("wrooong")
                        }
                    }
                }

                // save answers 
                the_answers[`${test[0].id}`] = chosen_answers
                localStorage.setItem("myanswers", JSON.stringify(the_answers))

                // stop timer
                     clearInterval(counter)

                // check answers
                    check(right_answers, chosen_answers)
                // hide test
                    document.querySelectorAll(".qcontent").forEach(q => {
                        q.remove()
                    })
        
                // show score + put it in local storage
                    showScore(score, test)
        
                //  show answers + show score in card
                    document.querySelector(".showAnswer").onclick = function() {
                        show_answers(test, chosen_answers)
                    }

            } else {
                // if there not any questions
                alert("you did not answer all questions")
                } 
            }
        }
    }
}



// function hide exam card
function hide_exams (){
    let exams_container = document.querySelector('.exams-container')
    exams_container.remove()
    document.querySelector(".heroPages").style.display = "none"
    document.querySelector("footer").remove()
    document.querySelector("header").innerHTML = `
        medoctor
    `
}

// create test
function add_test(test) {

    // create the info / head
    let the_test = document.createElement("div")
    the_test.className= "the-test"
    document.body.appendChild(the_test)
 
    min = test[0].time_min
    sec = test[0].time_sec
    time = (min * 60 + sec)

    let qinfo = document.createElement("div")
    qinfo.className= "head"
    qinfo.innerHTML = `
    <div class="topic subinfo">${test[0].topic}</div>
    <div class="qnumber subinfo">${test[0].nums} Q</div>
    <div class="time subinfo">time left <span class="timer"></span></div>
    `
    the_test.appendChild(qinfo)

    let qcontent_element = document.createElement("div")
    qcontent_element.className= "qcontent"
    the_test.appendChild(qcontent_element)

    // get questions
    let qcontent = document.querySelector(".qcontent")
    let i;
    for (i = 1; i < test.length; i++){

        let questions = `

        <div class="question">
            <div class="qname">
                <span class="circle">${i}</span>
                - ${test[i].question_title}
            </div>
            <div class="answers-container">
                <div class="answer answer${i}" id="answer_1_${i}" onclick="selectme(this)" data-content="${test[i].answer_1}"> ${test[i].answer_1}</div>

                <div class="answer answer${i}" id="answer_2_${i}" onclick="selectme(this)" data-content="${test[i].answer_2}"> ${test[i].answer_2}</div>

                <div class="answer answer${i}" id="answer_3_${i}" onclick="selectme(this)" data-content="${test[i].answer_3}"> ${test[i].answer_3}</div>

                <div class="answer answer${i}" id="answer_4_${i}" onclick="selectme(this)" data-content="${test[i].answer_4}"> ${test[i].answer_4}</div>
            </div>  <hr>
    </div>`
        qcontent.insertAdjacentHTML("beforeend", questions)}
        let mysumbit = `<div class="submit">submit</div>`
        qcontent.insertAdjacentHTML("beforeend", mysumbit)    
}

function startTimer(time){

    counter = setInterval(timer, 1000)
    function timer(){ 
        let m
        let s
        m = Math.floor(time / 60)
        s = time % 60
        if(m < 10){
          m = `0${m}`
        }
        if(s < 10){
          s = `0${s}`
        }
        document.querySelector(".timer").innerHTML = `${m}:${s}`
        if (time === 0){
            clearInterval(counter)
            play_click = 0
            document.querySelector(".submit").click()
        }else {
            time--;
        }
    }
}


// check answers

function check(right_answers, chosen_answers) {
             score = 0
        for(i = 0; i < right_answers.length; i++){

            if(right_answers[i] === chosen_answers[i]){
                score++
            }else continue;
        }
    }

// show score 
function showScore(score, test){
    // add to local storage
         score_loc[`${test[0].id}`] = [score, test[0].nums]

         if(answered_test !== undefined){
             for(i = 0; i < answered_test.length; i++){
                 if(answered_test[i] === test[0].id){
                     answered_test[i] = test[0].id
                     
                 }else if (answered_test.includes(`${test[0].id}`)){
                    break
                } else{
                      answered_test.push(test[0].id)   
                 }
             }
         }else {
            answered_test = []
             answered_test.push(test[0].id)
         }
         
            localStorage.setItem("myscores", JSON.stringify(score_loc))
            localStorage.setItem(`mytests`, JSON.stringify(answered_test))
            let degree
            let draw
         if (score === (test.length - 1)){
             degree = "perfect"
         } else if (score < (test.length - 1) && score > ((test.length - 1) / 2)){
            degree = "medium"
         } else {
            degree = "failed"
         }
    let scorePage = `
    <div class="scorePage">
        <div class="info"> 

                <div> <span class= "highlight"> Congratulation </span> You have done </div>
                <div class="degree"> <span class="${degree}"> ${degree} </span> your score is
                    ${score} of ${test.length - 1}
        </div>
            <div class="click showAnswer"> show answers </div>
    </div> 
    `
    document.body.insertAdjacentHTML("beforeend", scorePage)
    
}

// show answers
function show_answers(test, chosen_answers){

        document.body.insertAdjacentHTML("beforeend", `<div class="click back"> Back </div>`)
        //  back button 
            document.querySelector(".back").onclick = function(){
            location.reload()
        }

    // right answers
    let right_answers = []
    for (i = 1; i < test.length; i++){
       right_answers.push(test[i].right_answer)
   }


    // show answers in page
    for (i = 1; i < test.length; i++){

        let questions = `

        <div class="the-test">
            <div class= "qcontent">
                <div class="qname">
                    <span class="circle">${i}</span>
                    - ${test[i].question_title}
                </div>
                <div class="answers-container">
                    <div class="answer answer${i}" id="answer_1_${i}" data-content="${test[i].answer_1}"> ${test[i].answer_1}</div>

                    <div class="answer answer${i}" id="answer_2_${i}" data-content="${test[i].answer_2}"> ${test[i].answer_2}</div>

                    <div class="answer answer${i}" id="answer_3_${i}" data-content="${test[i].answer_3}"> ${test[i].answer_3}</div>

                    <div class="answer answer${i}" id="answer_4_${i}" data-content="${test[i].answer_4}"> ${test[i].answer_4}</div>
                </div> 
            </div>  
    </div>`
    document.body.insertAdjacentHTML("beforeend", questions)}

// add rights and wrongs answers
        for(i = 1; i <= right_answers.length; i++){
            
            let ansewrs = document.querySelectorAll(`.answer${i}`)
            ansewrs.forEach(answer => {
                if(answer.dataset.content === chosen_answers[i - 1] && chosen_answers[i - 1] === right_answers[i - 1] ){
                     answer.classList.add("right")    
                }else if (answer.dataset.content === chosen_answers[i - 1]){
                     answer.classList.add("wrong")
                }
                if (answer.classList.contains("right")){
                  
                }else if (answer.dataset.content === right_answers[i - 1]){
                    answer.classList.add("right")    
                }
            })
        }
        if(document.querySelector(".showAnswer")){

            document.querySelector(".showAnswer").remove()
        }
}


// make chosen answers selected
function selectme(answer){
    let children = Array.from(answer.parentElement.children)
    children.forEach((el) => {
        el.classList.remove("chosed")
    })
    answer.classList.add("chosed")
}

function arrange(){
    document.querySelectorAll(".modules .module-name").forEach(module => {
        module.addEventListener("click", function(){
            module.parentElement.children[1].classList.toggle("hide")
            module.children[0].children[0].classList.toggle("rotate")
        })
    })
}