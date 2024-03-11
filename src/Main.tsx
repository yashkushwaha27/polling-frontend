import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { socketConstants } from "./constants/socketConstants";
import AppRoutes from "./routes/AppRoutes";
import socketUtil from "./util/socket.util";
import { ROUTES } from "./routes/routes.constants";

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [onlineStudents, setOnlineStudents] = useState<any[]>([]);

  useEffect(() => {
    if (
      location.pathname === ROUTES.QUESTION_CREATOR ||
      location.pathname === ROUTES.RESULT
    ) {
      socketUtil.getSocket()?.emit(socketConstants.getOnlineStudents);
      socketUtil
        .getSocket()
        ?.on(socketConstants.onlineStudents, (data: any) => {
          setOnlineStudents(data.list);
        });
    }
  }, [location.pathname]);

  return (
    <main
      className={twMerge(
        "h-full w-full flex flex-col items-stretch flex-1 md:flex-row"
      )}
    >
      <AppRoutes />
      {sessionStorage.getItem("role") === "teacher" && (
        <div className="border-l border-slate-500 h-full px-5 py-4 flex-1 flex flex-col">
          <p className="text-xl font-medium border-b mb-3">Student List</p>
          <div className="flex flex-col flex-1 items-start justify-between w-full">
            <ul className="w-full">
              {onlineStudents.map((item: any, index: number) => (
                <span
                  key={`student-${index}`}
                  className="flex items-center justify-between w-full"
                >
                  <span className="flex gap-2">
                    <p className="text-lg font-semibold">{index + 1}.</p>
                    <p className="text-lg font-semibold mx-2">{item.name}</p>
                  </span>
                  <span
                    className="text-sm font-medium text-red-900 border border-red-900 h-5 w-5 rounded-[50%] text-center hover:text-white hover:bg-red-900 hover:cursor-pointer"
                    onClick={() =>
                      socketUtil
                        .getSocket()
                        ?.emit(socketConstants.closeConnection, {
                          socketId: item.socketId,
                          studentId: item.studentId,
                        })
                    }
                  >
                    -
                  </span>
                </span>
              ))}
            </ul>
            <span
              className="text-lg font-medium hover:underline hover:cursor-pointer"
              onClick={() => navigate(ROUTES.RESULT_HISTORY)}
            >
              Get Previous Results
            </span>
          </div>
        </div>
      )}
    </main>
  );
};

export default Main;
