export const Home = () => {
  return (
    <div
      className="home_page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--primary-color)",
        color: "var(--white-color)",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <h1 style={{ fontSize: "var(--font-size-xx1)" }}>Recipes coming soon</h1>
    </div>
  );
};
