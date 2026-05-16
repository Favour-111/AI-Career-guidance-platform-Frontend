import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, icon: Icon, rightElement = null, className = "", ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && <label className="input-label">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? "pl-10" : ""} ${rightElement ? "pr-11" : ""} ${error ? "border-red-400 focus:ring-red-400" : ""} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

export default Input;
