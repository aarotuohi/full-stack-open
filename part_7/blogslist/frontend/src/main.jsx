import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Proxy from "./Proxy";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <Proxy>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Proxy>
);
