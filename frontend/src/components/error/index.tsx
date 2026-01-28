const ErrorComponent = ({ error }: { error: string }) => {
  return (
    <div
      className={`rounded-lg p-3 capitalize text-sm font-medium ${"bg-red-50 text-red-700"} ${error.trim().length ? "" : "invisible"}`}
    >
      {error?.toLocaleLowerCase().replace("_", " ")}
    </div>
  );
};

export default ErrorComponent;
