export const ShowError = ({ error }: { error: unknown }) => (
  <div
    style={{
      backgroundColor: "red",
      color: "white",
    }}
  >
    {JSON.stringify(error)}
  </div>
);
