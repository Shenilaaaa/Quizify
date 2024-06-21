// script.js
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let usedQuestions = {};

const questionContainer = document.getElementById('question-container');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result-container');
const scoreDisplay = document.getElementById('score');
const topicInputContainer = document.getElementById('topic-input-container');
const quizContainer = document.getElementById('quiz-container');
const popup = document.getElementById('popup');

function loadQuestions() {
    const topic = document.getElementById('quiz-topic').value.toLowerCase();
    const categoryId = getCategoryId(topic);
    if (categoryId) {
        fetch(`https://opentdb.com/api.php?amount=50&category=${categoryId}&type=multiple`)
            .then(response => response.json())
            .then(data => {
                let allQuestions = data.results.map(q => ({
                    question: q.question,
                    answers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
                    correct: q.correct_answer
                }));

                questions = getUniqueQuestions(allQuestions, 10);
                usedQuestions[topic] = questions.map(q => q.question);

                topicInputContainer.classList.add('hidden');
                quizContainer.classList.remove('hidden');
                startQuiz();
            })
            .catch(error => {
                console.error('Error fetching the questions:', error);
                alert('Failed to load questions. Please try again.');
            });
    } else {
        alert('Invalid topic. Please try another topic.');
    }
}

function getUniqueQuestions(allQuestions, number) {
    let uniqueQuestions = [];
    for (let question of allQuestions) {
        if (!usedQuestions[question.question] && uniqueQuestions.length < number) {
            uniqueQuestions.push(question);
        }
    }
    return uniqueQuestions;
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    updateScore();
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    nextButton.classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    resetState();
    const question = questions[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    questionElement.innerHTML = question.question;

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer, question.correct));
        answerButtons.appendChild(button);
    });
    questionContainer.classList.add('fade-in');
}

function resetState() {
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(answer, correctAnswer) {
    if (answer === correctAnswer) {
        showPopup('Correct!', 'correct');
        score++;
        updateScore();
    } else {
        showPopup(`Incorrect! The correct answer is: ${correctAnswer}`, 'incorrect');
    }
    nextButton.classList.remove('hidden');
}

function updateScore() {
    scoreDisplay.innerText = `Score: ${score}`;
}

function showPopup(message, className) {
    popup.innerHTML = message;
    popup.className = '';
    popup.classList.add(className);
    popup.classList.remove('hidden');
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 2000);
        nextQuestion();
    }, 2000);
}

function showResult() {
    questionContainer.classList.add('hidden');
    nextButton.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreDisplay.innerText = `Score: ${score}`;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
    questionContainer.classList.remove('fade-in');
    questionContainer.classList.add('fade-in');
}

function restartQuiz() {
    topicInputContainer.classList.remove('hidden');
    quizContainer.classList.add('hidden');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getCategoryId(topic) {
    const categories = {
        'politics': 24,
        'flora and fauna': 27, // Assuming 'Flora & Fauna' as Animals category
        'science': 17,
        'computers': 18,
        'history': 23
    };
    return categories[topic] || null;
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial setup
});
