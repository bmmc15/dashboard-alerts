import { useState } from 'react';
import { AlertData } from '../types/alert';
import { useSocket } from '../context/SocketContext';
import { useSoundSettings } from '../context/SoundContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: Props) => {
  const [notifications, setNotifications] = useState(true);
  const { socket, isConnected } = useSocket();
  const { soundEnabled, toggleSound } = useSoundSettings();
  
  if (!isOpen) return null;

  const sendTestAlert = (isBuySignal: boolean) => {
    if (!socket || !isConnected) {
      console.warn("Socket not connected, cannot send test alert");
      return;
    }

    const testAlert: AlertData = isBuySignal ? {
      ticker: "BTC/USDT",
      timeframe: "1h",
      indicator: "X48",
      message: "BUY",
      price: "45000",
      trigger_time: new Date().toISOString(),
      alert_name: "Test Buy Alert"
    } : {
      ticker: "ETH/USDT",
      timeframe: "4h",
      indicator: "ZeroLag",
      message: "SELL",
      price: "2800",
      trigger_time: new Date().toISOString(),
      alert_name: "Test Sell Alert"
    };

    console.log("Sending test alert:", testAlert);
    socket.emit("alert", testAlert);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Notifications</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                notifications ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Sound Alerts</span>
            <button
              onClick={toggleSound}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                soundEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Test Alerts</h3>
              <span className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => sendTestAlert(true)}
                disabled={!isConnected}
                className={`px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors 
                  dark:bg-green-900/30 dark:text-green-400 
                  ${isConnected 
                    ? 'hover:bg-green-200 dark:hover:bg-green-900/50' 
                    : 'opacity-50 cursor-not-allowed'
                  }`}
              >
                Test Buy Alert
              </button>
              <button
                onClick={() => sendTestAlert(false)}
                disabled={!isConnected}
                className={`px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors 
                  dark:bg-red-900/30 dark:text-red-400 
                  ${isConnected 
                    ? 'hover:bg-red-200 dark:hover:bg-red-900/50' 
                    : 'opacity-50 cursor-not-allowed'
                  }`}
              >
                Test Sell Alert
              </button>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Note: Test alerts are processed internally and won't trigger external systems.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
