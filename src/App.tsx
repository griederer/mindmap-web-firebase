function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-coral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
            NODEM
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-coral-500 mx-auto rounded-full"></div>
        </div>

        <p className="text-2xl text-gray-700 mb-4 font-light">
          Interactive Mind Map Presentations
        </p>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Replace PowerPoint with dynamic, node-based storytelling
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto border border-gray-200">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-gray-700">Clean Slate Ready</p>
          </div>

          <div className="text-left space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Firebase configured</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Dependencies installed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Build system ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500">⟳</span>
              <span>Awaiting Task 1.1</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Environment: <span className="font-mono text-orange-600">{window.location.hostname}</span>
        </p>
      </div>
    </div>
  );
}

export default App;
