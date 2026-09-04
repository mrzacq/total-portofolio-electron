export default function Toast({ message, isError, visible }) {
  return (
    <div className={`tp-toast${visible ? " show" : ""}${isError ? " err" : ""}`}>
      <span className="dot"></span>
      {message}
    </div>
  );
}
