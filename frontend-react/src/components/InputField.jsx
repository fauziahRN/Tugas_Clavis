function InputField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  inputMode,
  readOnly,
  disabled,
  ...props
}) {
  return (
    <div className="field-group">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input ${readOnly ? 'input-readonly' : ''}`}
        inputMode={inputMode}
        readOnly={readOnly}
        disabled={disabled}
        {...props}
      />
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

export default InputField;
