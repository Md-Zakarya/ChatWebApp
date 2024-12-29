export const MessageSkeleton = ({ darkMode }) => {
    return (
      <div className="space-y-8 py-4 animate-pulse">
        {/* Left Bubble */}
        <div className="flex justify-start">
          <div
            className={`
              p-3 rounded-xl max-w-xs
              ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}
            `}
          >
            <div
              className={`
                h-3 w-24 mb-2 rounded
                ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}
              `}
            />
            <div
              className={`
                h-3 w-16 rounded
                ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}
              `}
            />
          </div>
        </div>
  
        {/* Right Bubble */}
        <div className="flex justify-end">
          <div
            className={`
              p-3 rounded-xl max-w-xs
              ${darkMode ? 'bg-blue-800 text-white' : 'bg-blue-500 text-white'}
            `}
          >
            <div
              className={`
                h-3 w-20 mb-2 rounded
                ${darkMode ? 'bg-blue-700' : 'bg-blue-300'}
              `}
            />
            <div
              className={`
                h-3 w-12 rounded
                ${darkMode ? 'bg-blue-700' : 'bg-blue-300'}
              `}
            />
          </div>
        </div>
  
        {/* Left Bubble */}
        <div className="flex justify-start">
          <div
            className={`
              p-3 rounded-xl max-w-xs
              ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}
            `}
          >
            <div
              className={`
                h-3 w-24 mb-2 rounded
                ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}
              `}
            />
            <div
              className={`
                h-3 w-20 rounded
                ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}
              `}
            />
          </div>
        </div>

        {/* Additional Loading Animations */}
        <div className="flex justify-center gap-2">
  <div 
    className={`
      w-3 h-3 rounded-full 
      ${darkMode ? 'bg-gray-600' : 'bg-gray-400'}
      animate-[bounce_0.8s_infinite]
    `}
  />
  <div 
    className={`
      w-3 h-3 rounded-full 
      ${darkMode ? 'bg-gray-600' : 'bg-gray-400'}
      animate-[bounce_0.8s_infinite_0.2s]
    `}
  />
  <div 
    className={`
      w-3 h-3 rounded-full 
      ${darkMode ? 'bg-gray-600' : 'bg-gray-400'}
      animate-[bounce_0.8s_infinite_0.4s]
    `}
  />
  <div
    className={`
      w-3 h-3 rounded-full
      ${darkMode ? 'bg-gray-600' : 'bg-gray-400'} 
      animate-[bounce_0.8s_infinite_0.6s]
    `}
  />
</div>
      </div>
    );
  };