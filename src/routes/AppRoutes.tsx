import { Suspense } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

import RoleSelector from "../components/roleSelector";
import ErrorBoundary from "../components/errorBoundary";
import StudentOnboarding from "../components/studentOnboarding";
import QuestionAnswer from "../components/questionAnswer";
import QuestionCreator from "../components/questionCreator";
import Result from "../components/result";
import ResultHistory from "../components/resultHistory";

import { ROUTES } from "./routes.constants";
import socketUtil from "../util/socket.util";
import { socketConstants } from "../constants/socketConstants";

const routes = [
  { path: ROUTES.HOME, element: <RoleSelector /> },
  { path: ROUTES.STUDENT_ONBOARDING, element: <StudentOnboarding /> },
  { path: ROUTES.QUESTION_ANSWER, element: <QuestionAnswer /> },
  { path: ROUTES.QUESTION_CREATOR, element: <QuestionCreator /> },
  { path: ROUTES.RESULT, element: <Result /> },
  { path: ROUTES.RESULT_HISTORY, element: <ResultHistory /> },
];

const AppRoutes = () => {
  const appRoutes = useRoutes(routes);
  const navigate = useNavigate();

  socketUtil.getSocket()?.on(socketConstants.triggerClose, () => {
    socketUtil.getSocket()?.close();
    sessionStorage.clear();
    navigate(ROUTES.HOME);
  });

  return (
    <Suspense fallback={<>Loading...</>}>
      <ErrorBoundary>{appRoutes}</ErrorBoundary>
    </Suspense>
  );
};

export default AppRoutes;
