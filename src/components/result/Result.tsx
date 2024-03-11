import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socketUtil from "../../util/socket.util";
import { socketConstants } from "../../constants/socketConstants";
import ResultRenderer from "../resultRenderer";
import { ROUTES } from "../../routes/routes.constants";
import { twMerge } from "tailwind-merge";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const publishResult = () => {
    setLoading(true);
    socketUtil.getSocket()?.emit(socketConstants.getResult, {
      id: sessionStorage.getItem("id"),
      question: location?.state?.question,
    });
  };

  const buttonClickHandler = () => {
    if (sessionStorage.getItem("role") === "teacher") {
      socketUtil.getSocket()?.emit(socketConstants.settingNewQuestion);
      navigate(ROUTES.QUESTION_CREATOR);
    } else {
      navigate(ROUTES.QUESTION_ANSWER);
    }
  };

  useEffect(() => {
    socketUtil.getSocket()?.on(socketConstants.resultPublish, (data: any) => {
      setLoading(false);
      if (data.status) {
        setResult(data);
      } else setResult({});
    });

    if (sessionStorage.getItem("role") === "student") {
      socketUtil.getSocket()?.on(socketConstants.newQuestionInbound, () => {
        navigate(ROUTES.QUESTION_ANSWER);
      });
    }
  }, [navigate]);

  return (
    <div className="p-5 w-3/4">
      <h1 className="text-2xl font-bold">Polling Results</h1>
      {!Object.keys(result).length ? (
        <div>
          <p className="text-xl my-5">
            {sessionStorage.getItem("role") === "teacher"
              ? "Publish result to students!"
              : "Results are still being computed..."}
          </p>
          {sessionStorage.getItem("role") === "teacher" && (
            <button
              className={twMerge(
                "px-3 py-2 border border-slate-500 rounded-md my-5 hover:bg-slate-500 hover:text-white",
                loading ? "hover:cursor-not-allowed" : "hover:cursor-pointer"
              )}
              onClick={() => !loading && publishResult()}
            >
              {loading ? "Publishing Result..." : "Publish Result"}
            </button>
          )}
        </div>
      ) : (
        <ResultRenderer result={result} onButtonClick={buttonClickHandler} />
      )}
    </div>
  );
};

export default Result;
