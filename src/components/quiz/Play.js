import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';
import QuestionNumber from "./QuestionNumber"
import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty'

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
            time: {}
        };
    }

    componentDidMount () {
        const { questions, currentQuestion, nextQuestion, previousQuestion} = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
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
                answer
            });
        }
    };

    playButtonSound = () => {
        document.getElementById('button-sound');
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
           this.correctAnswer();
       } else {
           this.wrongAnswer();
       }
    };
    
    handleQuitButtonClick = () => {
        this.playButtonSound();
        window.confirm('Are you sure you want to quit?')
        // if (window.confirm('Are you sure you want to quit?')) {

        // }
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
            numberofAnsweredQuestions: prevState.numberofAnsweredQuestions + 1
        }));
    }

    render() {
        const { currentQuestion } = this.state;
        return (
        <Fragment>
            <Helmet><title>Quiz Page</title></Helmet>
            <Fragment>
                
            </Fragment>
            <div className="questions">
                <div className="lifeline-container">
                    <p>
                        <span className="lifeline">3</span><span className="mdi mdi-set-center mdi-24px lifeline-icon"></span>
                    </p>
                    <p>
                        <span className="lifeline">5</span><span className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"></span>
                    </p>
                </div>
                <div>
                    <p>
                        <span className="left" style={{ float: 'left'}}> 1 of 5</span>
                        <span className="right">2:00<span className="mdi mdi-clock-outline mdi-24px"></span></span>
                    </p>
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