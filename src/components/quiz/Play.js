import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';
import QuestionNumber from "./QuestionNumber"
import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';

import correctNotification from '../../assets/audio/error3.mp3';
import wrongNotification from '../../assets/audio/error2.mp3';
import buttonSound from '../../assets/audio/click_2.mp3';

class Play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberofQuestions: 0,
            numberofAnsweredQuestions: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 5,
            fiftyFifty: 2,
            usedFiftyFifty: false,
            previousRandNumber: [],
            time: {}
        };
        this.interval = null
    }

    componentDidMount () {
        const { questions, currentQuestion, nextQuestion, previousQuestion} = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
        this.startTimer();
    }

    displayQuestions = (questions = this.state.questions, currentQuestion, nextQuestion, previousQuestion) => {
        let { currentQuestionIndex } = this.state;
        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion.answer;
            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberofQuestions: questions.length,
                answer,
                previousRandNumber: []
            }, () => {
                this.showOptions();
            });
        }
    };

    playButtonSound = () => {
        document.getElementById('button-sound').play();
    };

    handleButtonClick = (e) => {
        switch (e.target.id) {
            case 'next-btn':
                    this.handleNextButtonClick();
                break;

            case 'prev-btn':
                this.handlePreviousButtonClick();
                break;

            case 'quit-btn':
                this.handleQuitButtonClick();
                break;
            default:
                break;
        }
        this.playButtonSound();
    };

    handleOptionClick = (e) => {
       if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            setTimeout(() => {
                document.getElementById('correct-sound').play();
            }, 250);
            
            this.correctAnswer();
       } else {
           setTimeout(() => {
            document.getElementById('wrong-sound').play();
           }, 250);
            this.wrongAnswer();
       }
    };
    
    handleQuitButtonClick = () => {
        this.playButtonSound();
        window.confirm('Are you sure you want to quit?')
         if (window.confirm('Are you sure you want to quit?')) {
            this.props.history.push('/');
        }
    };

    handleNextButtonClick = () => {
        this.playButtonSound();
        if (this.state.nextQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };

    handlePreviousButtonClick = () => {
        this.playButtonSound();
        if (this.state.nextQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };

    correctAnswer = () => {
        M.toast({
            html: 'Correct Answer!',
            classes: 'toast-valid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            score: prevState.score + 1,
            correctAnswers: prevState.correctAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberofAnsweredQuestions: prevState.numberofAnsweredQuestions + 1,

        }), () => {
            this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion)
        });
    }

    wrongAnswer = () => {
        navigator.vibrate(1000);
        M.toast({
            html: 'Wrong Answer!',
            classes: 'toast-invalid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberofAnsweredQuestions: prevState.numberofAnsweredQuestions
        }));
    }

    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));

        options.forEach(option => {
            option.style.visibility = 'visible';
        });

        this.setState({
            usedFiftyFifty: false
        });
    }

    handleHints = () => {
         if (this.state.hints > 0) {
            const options = Array.from(document.querySelectorAll('.option'));
            let indexOfAnswer;

            options.forEach((option, index) => {
            if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

        while (true) {
            const randomNumber = Math.round(Math.random() * 3);
            if (randomNumber !== indexOfAnswer && !this.state.previousRandNumber.includes(randomNumber)) {
                options.forEach((option, index) => {
                    if (index === randomNumber) {
                        option.style.visibility = 'hidden';
                        this.setState((prevState) => ({
                            hints: prevState.hints - 1,
                            previousRandNumber: prevState.previousRandNumber.concat(randomNumber)
                        }));
                    }
                });
                break;
            }

        if (this.state.previousRandNumber.length >= 3) break;
        }
    }
    }

    handleFiftyFifty = () => {
        if ( this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {
            const options = document.querySelectorAll('.option');
            const randomNumbers = [];
            let indexOfAnswer;

            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

            let count = 0;
            do {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer) {
                    if (randomNumbers.length < 2 && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                        randomNumbers.push(randomNumber);
                        count ++;
                    } else {
                        while (true) {
                            const newRandomNumber = Math.round(Math.random() * 3);
                            if (!randomNumbers.includes(newRandomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                                randomNumbers.push(newRandomNumber);
                                count ++;
                                break;
                            }
                        }
                    }
                }
        } while (count < 2);
            options.forEach((option, index) => {
                if (randomNumbers.includes(index)) {
                    option.style.visibility = 'hidden';
                }
            });
            this.setState( prevState => ({
                fiftyFifty: prevState.fiftyFifty - 1,
                usedFiftyFifty: true
            }));
        }
    }

    startTimer = () => {
        const countDownTime = Date.now() + 180000;
        this.interval = setInterval(() => {
            const now = new Date();
            const distance = countDownTime - now;

            const minuites = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 % 60)) / 1000);

            if (distance < 0) {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minuites: 0,
                        seconds: 0
                    }
                }, () => {
                    alert('Your Time is up!!');
                    this.props.history.push('/');
                });
            } else {
                this.setState({
                    time: {
                        minuites,
                        seconds
                    }
                });
            }
        }, 1000);
    }

    progbar = () => {
        
    }
        

    render() {
        const { currentQuestion, currentQuestionIndex, numberofQuestions, hints , fiftyFifty, time} = this.state;
        return (
        <Fragment>
            <Helmet><title>Quiz Page</title></Helmet>

            <Fragment>
                <audio id="correct-sound" src={correctNotification}></audio>
                <audio id="wrong-sound" src={wrongNotification}></audio>
                <audio id="button-sound" src={buttonSound}></audio>
            </Fragment>
            <div className="questions">
                <div className="lifeline-container">
                    <p>
                        <span className="lifeline">{fiftyFifty}</span>
                        <span onClick={this.handleFiftyFifty} className="mdi mdi-set-center mdi-24px lifeline-icon"></span>
                    </p>
                    <p>                        
                        <span onClick={this.handleHints} className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"></span>
                        <span className="lifeline">{hints}</span>
                    </p>
                </div>
                <div>
                    <p>
                        <span className="left" style={{ float: 'left'}}>{currentQuestionIndex + 1} of { numberofQuestions}</span>
                        <span className="right">{time.minuites}:{time.seconds}<span className="mdi mdi-clock-outline mdi-24px"></span></span>
                    </p><br/>
                    <p className="prog">{(currentQuestionIndex + 1) / numberofQuestions * 100}  </p>
                </div>

                <div>
                    <QuestionNumber currentQuestion = { currentQuestion }/>
                </div>
        <h5>{ currentQuestion.question }</h5>
                <div className="options-container">
                    <p onClick={this.handleOptionClick} className="option">{ currentQuestion.optionA }</p>
                    <p onClick={this.handleOptionClick} className="option">{ currentQuestion.optionB }</p>
                </div>
                <div className="options-container">
                    <p onClick={this.handleOptionClick} className="option">{ currentQuestion.optionC }</p>
                    <p onClick={this.handleOptionClick} className="option">{ currentQuestion.optionD }</p>
                </div>

                <div className="button-container">
                    <button onClick={this.handleButtonClick} id="prev-btn">Previos</button>
                    <button onClick={this.handleButtonClick} id="next-btn">Next</button>
                    <button onClick={this.handleButtonClick} id="quit-btn">Quit</button>
                </div>
            </div>
        </Fragment>
        );
    }
}
export default Play;