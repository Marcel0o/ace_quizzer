import React, { Fragment} from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const QuizInstructions = () => (
    <Fragment>
        <Helmet><title>Quiz Instructions - Quiz App</title></Helmet>
        <div className="instructions container">
            <h1>How to Take the Quiz</h1>
            <p>Ensure you read this guide from start to finish.</p>
            <ul className="browser-default" id="main-list">
                <li><Link to="/">No take me back</Link></li>
                <li><Link to="/play/quiz">start</Link></li>
                <li></li>
            </ul>
        </div>
    </Fragment>
);

export default QuizInstructions;
