import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes.constants";
import socketUtil from "../../util/socket.util";
import { socketConstants } from "../../constants/socketConstants";
import { useEffect, useState } from "react";
import { generateRandomFiveDigit } from "../../util/math.util";

const RoleSelector = () => {
  const navigate = useNavigate();
  const [teacherAdded, setTeacherAdded] = useState<boolean>(false);

  const handleTeacherClick = () => {
    socketUtil.createSocket();
    socketUtil.getSocket()?.emit(socketConstants.createTeacher, {
      teacherId: generateRandomFiveDigit(),
    });
    setTeacherAdded(true);
  };

  useEffect(() => {
    socketUtil.getSocket()?.on(socketConstants.connectionId, (data) => {
      if (data.id) {
        sessionStorage.setItem("id", data.teacherId);
        sessionStorage.setItem("role", "teacher");
        navigate(ROUTES.QUESTION_CREATOR);
      }
    });
  }, [teacherAdded, navigate]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h3 className="text-2xl font-semibold">
        Select the role you wish to login through
      </h3>
      <div className="flex items-center gap-10 p-5">
        <span
          className="border border-slate-500 rounded-md p-5 hover:cursor-pointer hover:bg-slate-200"
          onClick={() => navigate(ROUTES.STUDENT_ONBOARDING)}
        >
          I'm a student
        </span>
        <span
          className="border border-slate-500 rounded-md p-5 hover:cursor-pointer hover:bg-slate-200"
          onClick={handleTeacherClick}
        >
          I'm a teacher
        </span>
      </div>
    </div>
  );
};

export default RoleSelector;
