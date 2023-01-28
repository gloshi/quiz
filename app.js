const dom = {
    testName: document.getElementById('test__name'),
    questionBlock: document.getElementById('question-block'),
    questionNumber: document.getElementById('question-number'),
    question: document.getElementById('question'),
    answers: document.getElementById('answers'),
    btn: document.getElementById('btn'),


    result: document.getElementById('result'),
    resultIcon: document.getElementById('result-icon'),
    resultStatus: document.getElementById('result-status'),

}

//массив вопросов
const newRandomArray = randomArray(data.questions, 4)

let questionIndex = 1
//Выбран ли вопрос
let isSelectAnswer = false

//число правильных ответов
let rightAnswersCount = 0

//Проходной балл
let answersCountForTetsComplete = 1



//рандомная пересортировка элементов массива 
//count-max кол-во элементов в новом массиве
function randomArray(arr, count) {
    let randomArr = []

    while(arr.length && randomArray.length < count) {
        const maxIndex = arr.length - 1
        const randomIndex = (Math.random() * maxIndex).toFixed(0)
        const cutQuestion = arr.splice(randomIndex, 1)
        
        randomArr = randomArr.concat(cutQuestion)
       
    }

   
    return randomArr
}



//Рендер вопроса на странице


//Рендер ответа на странице
function renderAnswers(answers, rightAnswerNumber) {
    const answersHtml = []
    for(let i = 0; i < answers.length; i ++) {
        if(i+1 === rightAnswerNumber) {
            answersHtml.push(`<div class="test__answer" data-valid >${answers[i]}</div>`)
        }else {
            answersHtml.push(`<div class="test__answer"  >${answers[i]}</div>`)
        }
    }

    
    dom.answers.innerHTML = answersHtml.join('')


}

const answers = newRandomArray[0].answers
const rightAnswerNumber = newRandomArray[0].rightAnswer

renderAnswers(answers,rightAnswerNumber )

//глобальная отрисовка вопроса 
function renderALL(data,questionNumber) {
    const {answers, rightAnswer}= data
  
    dom.questionNumber.innerHTML = questionNumber + ''
    dom.question.innerHTML = data.question
    renderAnswers(answers, rightAnswer)
    blockButton(true)
}

renderALL(newRandomArray[0],1)

//клик по кнопке след вопрос
dom.btn.onclick = () => {
    const number = newRandomArray[questionIndex]
    const questionEl = questionIndex + 1
    const nextQuestion = newRandomArray[questionIndex + 1]
    if(number) {
        
        renderALL(number,questionEl)
        questionIndex = questionIndex + 1
        isSelectAnswer = !isSelectAnswer
        if (!nextQuestion) {
            changeButton()
        }
    } else {
        
        renderResult()
    }

}

//клик по ответу 
dom.answers.onclick = (event) => {
    const isAnswerClick = event.target.classList.contains('test__answer')
   if(isAnswerClick && !isSelectAnswer ) {
    renderAnswersStatus(event.target)
    isSelectAnswer = !isSelectAnswer
    blockButton(false)
   }
}
//Функция отрисовки статусов (неверный/верный) ответа
function renderAnswersStatus(answerClick) {
    const isValid = answerClick.dataset.valid !== undefined
    if(isValid) {
        answerClick.classList.add('valid')
        rightAnswersCount++
    } else {
        answerClick.classList.add('invalid')
        const rightAnswerClick = answerClick.parentNode.querySelector('[data-valid]')
        rightAnswerClick.classList.add('valid')
    }
}

//Функция блокировки/разблокировки кнопки
function blockButton(isDisable) {
    if(isDisable) {
        dom.btn.classList.add('disable')
    } else {
        dom.btn.classList.remove('disable')
    }
}
//Функция изменения текста кнопки на посмотреть результаты (когда вопросы закончились)

function changeButton() {
    dom.btn.innerText = 'Посмотреть результаты'
    dom.btn.dataset.result = true
}

//Вывод результатов тестирования
function renderResult() {
    dom.questionBlock.style.display = 'none'
    dom.answers.style.display = 'none'
    dom.btn.style.display = 'none'
    dom.result.style.display = 'block'
    if  (testIsCorrect()) {
        dom.resultIcon.innerText = '🎉'
        dom.resultStatus.innerText = 'Вы прошли тест'
        dom.resultStatus.classList.add('valid')
    } else {
        dom.resultIcon.innerText = '☹️'
        dom.resultStatus.innerText = 'Вы не прошли тест'
        dom.resultStatus.classList.add('invalid')
    }
}

//Функция проверки пройден ли тест
function testIsCorrect() {
   return answersCountForTetsComplete <= rightAnswersCount
}