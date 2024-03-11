import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socketUtil from "../../util/socket.util";
import { socketConstants } from "../../constants/socketConstants";
import { generateRandomFiveDigit } from "../../util/math.util";
import { ROUTES } from "../../routes/routes.constants";

const QuestionCreator = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState({
    question: "",
    options: [{ id: 0, value: "" }],
    timer: 60,
  });
  const [error, setError] = useState<string>("");
  const [questionSubmitted, setQuestionSubmitted] = useState<boolean>(false);

  const askQuestion = () => {
    const questionToAsk = question.question;
    const options = question.options
      .map(({ value }) => {
        if (value) return value;
      })
      .filter((value) => value !== undefined);
    const timer = question.timer;
    const questionId = generateRandomFiveDigit();

    if (!questionToAsk) {
      setError("Question is Missing!");
      return;
    } else if (!options.length || !options[0]) {
      setError("Options are Missing!");
      return;
    } else if (!timer) {
      setError("Timer value is Missing!");
      return;
    } else {
      setError("");
    }

    socketUtil.getSocket()?.emit(socketConstants.questionPost, {
      question: questionToAsk,
      options,
      timer,
      questionId,
      id: sessionStorage.getItem("id"),
    });
    setQuestionSubmitted(true);
  };

  const publishResult = () => {
    navigate(ROUTES.RESULT, {
      state: {
        id: sessionStorage.getItem("id"),
        question: question.question,
      },
    });
  };

  return (
    <div className="flex items-start w-3/4 h-full">
      <div className="flex flex-col items-start px-5 py-4 w-full">
        {questionSubmitted ? (
          <>
            <div className="flex items-center justify-between px-5 py-4">
              <p className="font-medium text-2xl">Posted Question</p>
            </div>
            <div className="flex flex-col items-start p-5">
              <p className="text-lg font-medium mb-2">Q: {question.question}</p>
              {question.options?.map(({ value }, index: number) => (
                <span
                  key={`option-${index}`}
                  className="flex items-center gap-3"
                >
                  <input className="h-5" type="radio" value={value} disabled />
                  <p>{value}</p>
                </span>
              ))}
              <button
                className="px-5 py-1 my-5 border rounded-md border-slate-500 hover:cursor-pointer hover:bg-slate-500 hover:text-white"
                onClick={publishResult}
              >
                Publish Result
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="font-medium text-2xl">Enter Questions and Options</p>
            <textarea
              className="border border-slate-500 p-3 rounded-md focus:outline-none my-4 w-3/4"
              placeholder="Enter Question"
              value={question.question}
              onChange={(e) =>
                setQuestion((prevValue) => ({
                  ...prevValue,
                  question: e.target.value,
                }))
              }
            />
            <p className="text-lg">Add Options</p>

            <ul>
              {question.options.map(({ id, value }, index: number) => (
                <li
                  key={`option-${index}`}
                  className="flex items-center gap-2 my-2"
                >
                  <span className="h-2 w-2 rounded-[50%] bg-slate-500" />
                  <input
                    className="border border-slate-200 rounded-md px-3 py-1"
                    placeholder="Enter Option Value"
                    value={value}
                    onChange={(e) => {
                      const updatedOptions = question.options.map((option) => {
                        if (option.id === id) {
                          return { ...option, value: e.target.value };
                        }
                        return option;
                      });
                      setQuestion((prevValue) => ({
                        ...prevValue,
                        options: updatedOptions,
                      }));
                    }}
                  />
                  {index !== 0 && (
                    <p
                      className="text-xs text-red-800 font-semibold hover:cursor-pointer"
                      onClick={() => {
                        let options = question.options;
                        options.splice(index, 1);
                        setQuestion((prevValue) => ({ ...prevValue, options }));
                      }}
                    >
                      Delete
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex items-end justify-between w-3/4">
              <span className="flex flex-col items-start gap-5">
                <button
                  className="px-5 py-1 mt-5 border rounded-md border-slate-500 hover:cursor-pointer hover:bg-slate-500 hover:text-white"
                  onClick={() =>
                    setQuestion((prevValue) => ({
                      ...prevValue,
                      options: [
                        ...prevValue.options,
                        { id: prevValue.options.length + 1, value: "" },
                      ],
                    }))
                  }
                >
                  Add Option +
                </button>
                <span className="flex items-center gap-4">
                  <p>Timer Value : </p>
                  <input
                    className="px-3 py-1 rounded-md focus:outline-none"
                    type="number"
                    placeholder="Timer"
                    value={question.timer}
                    onChange={(e) =>
                      setQuestion((prevValue: any) => ({
                        ...prevValue,
                        timer: e.target.value,
                      }))
                    }
                  />
                </span>
              </span>
              <button
                className="px-5 py-1 border rounded-md border-slate-500 hover:cursor-pointer hover:bg-slate-500 hover:text-white"
                onClick={askQuestion}
              >
                Ask Question
              </button>
            </div>
            {error && <p className="font-medium text-red-800 my-5">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionCreator;
