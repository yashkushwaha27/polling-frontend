import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketUtil from "../../util/socket.util";
import { socketConstants } from "../../constants/socketConstants";
import useDecrementalCounter from "../../hooks/useDecrementalCounter";
import { ROUTES } from "../../routes/routes.constants";

const QuestionAnswer = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState<string | number>();

  const { seconds, startCountdown, isFinished } = useDecrementalCounter(
    question?.timer || 60
  );

  const submitHandler = () => {
    socketUtil.getSocket()?.emit(socketConstants.answerPublish, {
      questionId: question.id,
      question: question,
      answer,
      id: sessionStorage.getItem("id"),
    });
    setSubmitted(true);
  };

  useEffect(() => {
    socketUtil.getSocket()?.on(socketConstants.questionPublish, (data) => {
      if (JSON.stringify(data) !== JSON.stringify(question)) {
        setQuestion(data);
        startCountdown(data?.timer);
      }
    });
  }, [startCountdown, question]);

  useEffect(() => {
    if (isFinished || submitted) {
      navigate(ROUTES.RESULT);
    }
  }, [isFinished, submitted, navigate]);

  return (
    <div className="flex flex-col items-start h-full w-full lg:w-3/4">
      {question.question ? (
        <>
          <div className="flex items-start lg:items-center justify-between flex-col lg:flex-row w-full px-5 py-4">
            <p className="font-medium text-2xl">
              Select correct option and submit
            </p>
            <span className="border border-slate-300 rounded-[50%] h-[100px] w-[100px] text-xs font-medium flex flex-col items-center justify-center text-center  mt-5 lg:mt-0">
              <p>
                {seconds}/{question.timer}
              </p>
              <p>Seconds Remaining</p>
            </span>
          </div>
          <div className="flex flex-col items-start p-5">
            <p className="text-lg font-medium mb-2">Q: {question.question}</p>
            {question.options?.map((option: string | number, index: number) => (
              <span
                className="flex items-center gap-3 hover:cursor-pointer"
                onClick={() => setAnswer(option)}
              >
                <input
                  className="h-5"
                  type="radio"
                  value={option}
                  onChange={(e) => setAnswer(e.target.value)}
                  checked={option === answer}
                />
                <p>{option}</p>
              </span>
            ))}
            <button
              className="px-5 py-1 my-5 border rounded-md border-slate-500 hover:cursor-pointer hover:bg-slate-500 hover:text-white"
              onClick={submitHandler}
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <p className="text-xl m-5 font-medium">
          Wait for the teacher to publish the question...
        </p>
      )}
    </div>
  );
};

export default QuestionAnswer;
