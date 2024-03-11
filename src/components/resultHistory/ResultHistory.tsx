import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResultRenderer from "../resultRenderer";
import socketUtil from "../../util/socket.util";
import { socketConstants } from "../../constants/socketConstants";
import { ROUTES } from "../../routes/routes.constants";

const ResultHistory = () => {
  const navigate = useNavigate();

  const [resultHistory, setResultHistory] = useState<any[]>([]);

  useEffect(() => {
    socketUtil.getSocket()?.emit(socketConstants.getPollingHistory, {
      teacherId: sessionStorage.getItem("id"),
    });
    socketUtil.getSocket()?.on(socketConstants.pollingHistory, (data) => {
      if (data.status) setResultHistory(data.result);
    });
  }, []);

  return (
    <div className="h-full w-3/4 p-5 flex flex-col">
      <h2 className="text-2xl font-bold">Polling Result History</h2>
      <div className="flex flex-col items-start w-full flex-1 overflow-auto">
        {resultHistory.length ? (
          resultHistory?.map((item, index) => (
            <span
              key={`result-${index + 1}`}
              className="w-full border border-slate-500 p-3 rounded-md my-2"
            >
              <ResultRenderer
                result={item}
                questionNumber={index + 1}
                showNewQuestionButton={false}
              />
            </span>
          ))
        ) : (
          <p className="font-semibold text-lg my-5">No questions asked yet!</p>
        )}
      </div>
      <button
        onClick={() => navigate(ROUTES.QUESTION_CREATOR)}
        className="border border-slate-500 rounded-md w-max px-4 py-2 text-lg hover:bg-slate-500 hover:text-white hover:cursor-pointer"
      >
        Back to question creator
      </button>
    </div>
  );
};

export default ResultHistory;
