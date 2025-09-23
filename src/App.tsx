import { BrowserRouter } from "react-router";
import RoutesApp from "./routes";
import GlobalStyle from "./styles/global";
import AppProvider from "./hooks";

const App: React.FC = () => (
  <BrowserRouter>
    <AppProvider>
      <RoutesApp />
    </AppProvider>

    <GlobalStyle />
  </BrowserRouter>
);

export default App;
