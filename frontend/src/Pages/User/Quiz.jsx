import { useGetQuiz } from '@/hooks/quiz.hook'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react'

const Quiz = () => {
  const { id } = useParams()
  const { data, isLoading } = useGetQuiz(id)
  const navigate = useNavigate()

  const [selectedAnswer, setSelectedAnswer] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const handleSelectAnswer = (questionId, selectedOption) => {
    setSelectedAnswer(prev => ({
      ...prev,
      [questionId]: selectedOption
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let correctCount = 0

    data.quiz.questions.forEach(question => {
      if (selectedAnswer[question._id] === question.correctOption) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResult(true)
  }

  const handleRetake = () => {
    setShowResult(false)
    setSelectedAnswer({})
    setScore(0)
  }

  const questions = data?.quiz?.questions || []
  const totalQuestions = questions.length
  const answeredCount = Object.keys(selectedAnswer).length
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0

  if (isLoading) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#0ea5a4] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#51607b] font-medium">Loading quiz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg py-8">
      <div className="page-shell">
        {showResult ? (
          // Results View
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="bg-[#0ea5a4] text-white p-8 text-center">
              <Trophy className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-4xl font-black mb-2">Quiz Complete!</h1>
              <p className="text-[#0f766e] text-lg">Here's how you did</p>
            </div>

            {/* Score */}
            <div className="p-8 text-center border-b border-gray-200">
              <div className="inline-block">
                <div className="text-6xl font-black text-[#0f172a] mb-2">
                  {score}<span className="text-3xl text-gray-400">/{totalQuestions}</span>
                </div>
                <div className="text-xl font-semibold text-[#0ea5a4]">
                  {percentage.toFixed(0)}% Correct
                </div>
              </div>

              <p className="text-2xl font-bold text-[#0f172a] mt-6">
                {score === totalQuestions
                  ? 'Perfect score!'
                  : percentage >= 70
                  ? 'Great job!'
                  : percentage >= 50
                  ? 'Good effort!'
                  : 'Keep learning!'}
              </p>
            </div>

            {/* Answer Review */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-[#0f172a] mb-6">Review Answers</h3>
              
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const userAnswer = selectedAnswer[question._id]
                  const isCorrect = userAnswer === question.correctOption

                  return (
                    <div
                      key={question._id}
                      className={`p-5 rounded-xl border-2 ${
                        isCorrect
                          ? 'border-[#0ea5a4] bg-[#f5fbfa]'
                          : 'border-red-500 bg-red-50'
                      }`}
                    >
                      {/* Question */}
                      <div className="flex items-start gap-3 mb-4">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-[#0ea5a4] flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-bold text-[#51607b]">
                            Question {index + 1}
                          </span>
                          <p className="font-semibold text-[#0f172a] mt-1">
                            {question.content}
                          </p>
                        </div>
                      </div>

                      {/* Answers */}
                      <div className="ml-9 space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-[#0f172a]">Your Answer: </span>
                          <span className={isCorrect ? 'text-[#0ea5a4] font-semibold' : 'text-red-700 font-semibold'}>
                            {userAnswer || 'No answer'}
                          </span>
                        </div>

                        {!isCorrect && (
                          <div>
                            <span className="font-semibold text-[#0f172a]">Correct Answer: </span>
                            <span className="text-[#0ea5a4] font-semibold">
                              {question.correctOption}
                            </span>
                          </div>
                        )}

                        {question.explanation && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="font-semibold text-[#0f172a]">Explanation: </span>
                            <span className="text-[#51607b]">{question.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="p-8 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-4 border-2 border-gray-200 text-[#0f172a] font-semibold rounded-xl hover:bg-[#f5f7fb] transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Course
              </button>
              <button
                onClick={handleRetake}
                className="flex-1 px-6 py-4 btn-primary text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Retake Quiz
              </button>
            </div>
          </div>
        ) : (
          // Quiz Form
          <div>
            {/* Header */}
            <div className="card p-6 mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#51607b] hover:text-[#0f172a] font-medium mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h1 className="text-3xl font-black text-[#0f172a]">{data?.quiz?.content || 'Quiz'}</h1>
              <p className="text-[#51607b] mt-2">
                Answer all {totalQuestions} questions to complete the quiz
              </p>
              
              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm font-semibold text-[#0f172a] mb-2">
                  <span>Progress</span>
                  <span>{answeredCount}/{totalQuestions}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0ea5a4] transition-all duration-300"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {questions.map((question, index) => (
                <div key={question._id} className="card p-6">
                  {/* Question Header */}
                  <div className="mb-5">
                    <span className="inline-block px-3 py-1 bg-[#e7f5f4] text-[#0ea5a4] text-sm font-bold rounded-lg mb-3">
                      Question {index + 1} of {totalQuestions}
                    </span>
                    <p className="text-lg font-semibold text-[#0f172a] leading-relaxed">
                      {question.content}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => {
                      const isSelected = selectedAnswer[question._id] === option
                      return (
                        <label
                          key={optIndex}
                          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#0ea5a4] bg-[#f5fbfa]'
                              : 'border-gray-200 hover:border-gray-200 hover:bg-[#f5f7fb]'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question._id}`}
                            value={option}
                            checked={isSelected}
                            onChange={() => handleSelectAnswer(question._id, option)}
                            className="mt-1 w-5 h-5 text-[#0ea5a4] focus:ring-[#0f766e]"
                          />
                          <span className="flex-1 text-[#0f172a] font-medium">{option}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Submit Button */}
              <div className="card p-6">
                <button
                  type="submit"
                  disabled={answeredCount < totalQuestions}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
                    answeredCount < totalQuestions
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'btn-primary hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  {answeredCount < totalQuestions
                    ? `Answer All Questions (${answeredCount}/${totalQuestions})`
                    : 'Submit Quiz'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz











