import { useState } from "react";
import { useDarkMode } from "../context/DarkModeContext";
import SettingsModal from "./SettingsModal";
import { useSocket } from "../context/SocketContext";
import { ImBug } from "react-icons/im";
import { SiTradingview } from "react-icons/si";

const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { socket } = useSocket();

  const handleDebug = () => {
    if (!socket) return;

    // Common data arrays
    const timeframes = ["15m", "1h", "4h", "1d"];
    const tickers = [
      "BTC",
      "SOL",
      "ETH",
      "LINK",
      "ADA",
      "DOT",
      "AVAX",
      "MATIC",
      "XRP",
      "DOGE",
      "BNB",
      "ATOM",
      "UNI",
      "AAVE",
      "SNX",
    ];
    const indicators = ["ZeroLag", "Pivot", "X48", "IA", "SMA"];
    const actions = ["BUY", "SELL"];

    // Generate recent alerts (standard signals)
    for (let i = 0; i < 8; i++) {
      const ticker = tickers[Math.floor(Math.random() * tickers.length)];
      const timeframe =
        timeframes[Math.floor(Math.random() * timeframes.length)];
      const indicator =
        indicators[Math.floor(Math.random() * indicators.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const price = (Math.random() * 1000).toFixed(2);

      const mockAlert = {
        ticker: `${ticker}/USDT`,
        timeframe,
        indicator,
        message: `${action} SIGNAL`,
        price,
        trigger_time: new Date().toISOString(),
        alert_name: `${indicator} ${action} Alert`,
        type: "recent",
      };

      socket.emit("test-alert", mockAlert);
    }

    // Generate history alerts (3 for 1 indicator signals)
    // These will have more concentrated signals (3 indicators showing same direction)
    for (let i = 0; i < 8; i++) {
      const ticker = tickers[Math.floor(Math.random() * tickers.length)];
      const timeframe =
        timeframes[Math.floor(Math.random() * timeframes.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const price = (Math.random() * 1000).toFixed(2);

      // Pick 3 different indicators for the same signal
      const shuffledIndicators = [...indicators].sort(
        () => Math.random() - 0.5
      );
      const selectedIndicators = shuffledIndicators.slice(0, 3);

      // Emit 3 alerts with different indicators but same direction
      selectedIndicators.forEach((indicator) => {
        const mockAlert = {
          ticker: `${ticker}/USDT`,
          timeframe,
          indicator,
          message: `${action} SIGNAL (3-1)`,
          price,
          trigger_time: new Date().toISOString(),
          alert_name: `${indicator} ${action} Alert (3-1)`,
          type: "history",
        };

        socket.emit("test-alert", mockAlert);
      });
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Trading Alerts
            </span>
            <SiTradingview size={30} />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleDebug}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Generate debug alerts"
            >
              <ImBug />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Open settings"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default Navbar;
