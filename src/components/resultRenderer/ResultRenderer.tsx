const ResultRenderer = ({
  result,
  questionNumber = 1,
  showNewQuestionButton = true,
  onButtonClick,
}: IResultRenderer) => {
  return (
    <div className="flex flex-col items-start my-5 w-3/4">
      <p className="text-lg font-medium mb-2">
        Q {questionNumber}: {result.question}
      </p>
      <ul className="w-full">
        {result.options?.map(({ value, percentage }: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center w-3/4 my-2">
            <span
              className="bg-slate-200 rounded-md px-3 py-1 mr-2 min-w-12"
              style={{ width: `${percentage}%` }}
            >
              <p>{value}</p>
            </span>
            <p>{`${percentage}%`}</p>
          </div>
        ))}
      </ul>
      {showNewQuestionButton && (
        <button
          className="px-3 py-2 border border-slate-500 rounded-md my-5 hover:bg-slate-500 hover:text-white"
          onClick={() => onButtonClick && onButtonClick()}
        >
          {sessionStorage.getItem("role") === "teacher" ? "Ask" : "Wait for"}{" "}
          another question
        </button>
      )}
    </div>
  );
};

interface IResultRenderer {
  result: Record<string, any>;
  onButtonClick?: () => void;
  questionNumber?: number;
  showNewQuestionButton?: boolean;
}

export default ResultRenderer;
