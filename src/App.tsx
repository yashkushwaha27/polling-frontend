import { HashRouter } from "react-router-dom";
import Header from "./components/header";
import Main from "./Main";

export default function App() {
  return (
    <HashRouter>
      <div className="flex flex-col h-screen w-screen">
        <Header />
        <Main />
      </div>
    </HashRouter>
  );
}
