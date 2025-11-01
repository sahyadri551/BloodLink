import React, { useState } from "react";
import { Link } from "react-router-dom";

function EligibilityChecker() {
  const questions = [
    {
      id: 1,
      text: "Are you between 18 and 60 years of age?",
      key: "age",
    },
    {
      id: 2,
      text: "Do you currently weigh at least 50 kg (110 lbs)?",
      key: "weight",
    },
    {
      id: 3,
      text: "Have you donated blood in the last 3 months?",
      key: "recentDonation",
      invert: true,
    },
    {
      id: 4,
      text: "Do you currently have any infections, fever, or illness?",
      key: "illness",
      invert: true,
    },
    {
      id: 5,
      text: "Have you had a major surgery or tattoo in the last 6 months?",
      key: "surgery",
      invert: true,
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isEligible, setIsEligible] = useState(null);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentStep];
    const updatedAnswers = { ...answers, [currentQuestion.key]: answer };
    setAnswers(updatedAnswers);

    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      evaluateEligibility(updatedAnswers);
    }
  };

  const evaluateEligibility = (answers) => {
    let eligible = true;
    for (const q of questions) {
      const answer = answers[q.key];
      if (q.invert ? answer === "yes" : answer === "no") {
        eligible = false;
        break;
      }
    }
    setIsEligible(eligible);
    setFinished(true);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsEligible(null);
    setFinished(false);
  };

  const progress =
    ((currentStep + (finished ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">
        {!finished && (
          <div className="w-full mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-blue-700">
                Progress
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {finished ? (
          <div className="text-center">
            {isEligible ? (
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                Congratulations! You appear to be eligible to donate blood.
              </h2>
            ) : (
              <h2 className="text-2xl font-bold text-red-700 mb-4">
                Sorry, you do not appear to be eligible right now.
              </h2>
            )}
            <button
              onClick={resetForm}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Check Again
            </button>
            <div className="mt-4">
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Blood Donation Eligibility Checker
            </h1>
            <p className="text-lg font-medium text-gray-700 mb-8 text-center">
              {questions[currentStep].text}
            </p>

            <div className="flex justify-center space-x-6">
              <button
                onClick={() => handleAnswer("yes")}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer("no")}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
              >
                No
              </button>
            </div>

            <p className="text-gray-500 text-sm mt-6 text-center">
              Question {currentStep + 1} of {questions.length}
            </p>
          </>
        )}
        
      </div>
    </div>
  );
}

export default EligibilityChecker;
