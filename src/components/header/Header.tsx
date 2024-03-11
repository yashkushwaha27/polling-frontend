import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes.constants";
import { socketConstants } from "../../constants/socketConstants";
import socketUtil from "../../util/socket.util";

const Header = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const id = sessionStorage.getItem("id");
    const role = sessionStorage.getItem("role");
    if (id && role) {
      socketUtil.createSocket();
      if (id) {
        socketUtil.getSocket()?.emit(socketConstants.oldConnection, { id });
      }

      socketUtil
        .getSocket()
        ?.on(socketConstants.validConnection, (data: any) => {
          if (!data.status) {
            sessionStorage.clear();
            navigate(ROUTES.HOME);
          } else {
            navigate(
              role === "teacher"
                ? ROUTES.QUESTION_CREATOR
                : ROUTES.QUESTION_ANSWER
            );
          }
        });
      return;
    }
  }, []);

  return (
    <div className="border-b border-b-slate-400 px-5 py-4 bg-slate-600 text-slate-200 font-semibold text-xl">
      QnA Poll
    </div>
  );
};

export default Header;
