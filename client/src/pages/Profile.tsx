import { useAuth } from "../context/AuthContext";

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={pageStyle}>
      <div className="section_content" style={{ width: "100%" }}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>My Profile</h2>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Name</span>
            <span style={valueStyle}>{user?.name}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Email</span>
            <span style={valueStyle}>{user?.email}</span>
          </div>
        </div>

        <h3 style={sectionHeadingStyle}>My Bookmarks</h3>
        {user && user.bookmarks.length > 0 ? (
          <ul className="menu_list">
            {user.bookmarks.map((recipe) => (
              <li className="menu_item" key={recipe._id}>
                <img
                  className="menu_image"
                  src={recipe.image}
                  alt={recipe.name}
                />
                <h3 className="name">{recipe.name}</h3>
                <div className="recipe_content">
                  <p className="cuisine">{recipe.cuisine}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={emptyStyle}>
            <p>You haven't bookmarked any recipes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "var(--primary-color)",
  padding: "60px 0",
};

const cardStyle: React.CSSProperties = {
  background: "var(--white-color)",
  borderRadius: "var(--border-radius-s)",
  padding: "32px",
  maxWidth: "500px",
  margin: "0 auto",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
};

const titleStyle: React.CSSProperties = {
  color: "var(--primary-color)",
  marginBottom: "24px",
  textAlign: "center",
  fontSize: "var(--font-size-xl)",
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid var(--light-pink-color)",
};

const labelStyle: React.CSSProperties = {
  color: "var(--dark-color)",
  fontWeight: "var(--font-weight-semibold)" as unknown as number,
};

const valueStyle: React.CSSProperties = {
  color: "var(--secondary-color)",
  fontWeight: "var(--font-weight-medium)" as unknown as number,
};

const sectionHeadingStyle: React.CSSProperties = {
  color: "var(--white-color)",
  textAlign: "center",
  margin: "50px 0 30px",
  fontSize: "var(--font-size-l)",
};

const emptyStyle: React.CSSProperties = {
  textAlign: "center",
  color: "var(--white-color)",
  background: "rgba(255, 255, 255, 0.08)",
  borderRadius: "var(--border-radius-s)",
  padding: "40px 20px",
  maxWidth: "500px",
  margin: "0 auto",
};
