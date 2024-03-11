import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSockets } from "../../hooks/useSockets";
import { socketConstants } from "../../constants/socketConstants";
import socketUtil from "../../util/socket.util";
import { ROUTES } from "../../routes/routes.constants";
import { generateRandomFiveDigit } from "../../util/math.util";
import { twMerge } from "tailwind-merge";

const StudentOnboarding = () => {
  const { createSocket } = useSockets();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [socketCreated, setSocketCreated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    setError("");
    if (!socketUtil.getSocket()) {
      createSocket();
    }
    setSocketCreated(true);
    setLoading(true);
    socketUtil.getSocket()?.emit(socketConstants.createStudent, {
      name,
      studentId: generateRandomFiveDigit(),
    });
  };

  useEffect(() => {
    if (socketCreated) {
      socketUtil.getSocket()?.on(socketConstants.connectionId, (data: any) => {
        sessionStorage.setItem("id", data?.studentId);
        sessionStorage.setItem("role", "student");
        setLoading(false);
        navigate(ROUTES.QUESTION_ANSWER);
      });

      socketUtil.getSocket()?.on(socketConstants.alreadyExists, (data: any) => {
        setLoading(false);
        setError("Student Already Exists!");
      });
    }
  }, [socketCreated, navigate]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <p className="py-5 font-semibold text-2xl">Enter your full name</p>
      <form
        className="flex items-center gap-10"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="px-3 py-2 border border-slate-500 rounded-md"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className={twMerge(
            "border border-slate-800 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-slate-100",
            loading ? "hover:cursor-not-allowed" : "hover:cursor-pointer"
          )}
          type="submit"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Continue"}
        </button>
      </form>
      {error && (
        <p className="text-lg font-medium text-red-800 my-5">{error}</p>
      )}
    </div>
  );
};

export default StudentOnboarding;
