import "./App.css";
import CustomTable from "./components/CustomTable";
import Navbar from "./components/Navbar";
import AlertLog from "./components/AlertLog";
import { DarkModeProvider } from "./context/DarkModeContext";
import { SocketProvider } from "./context/SocketContext";
import { SoundProvider } from "./context/SoundContext";

function App() {
  return (
    <DarkModeProvider>
      <SocketProvider>
        <SoundProvider>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="flex-1 container mx-auto p-4 max-w-[1920px]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <CustomTable tickerGroup={0} />
                <CustomTable tickerGroup={1} />
                <CustomTable tickerGroup={2} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AlertLog title="Recent Alerts" type="recent" />
                <AlertLog
                  title="Dashboard Alert History - 3 for 1 indicator"
                  type="history"
                />
              </div>
            </main>
          </div>
        </SoundProvider>
      </SocketProvider>
    </DarkModeProvider>
  );
}

export default App;
