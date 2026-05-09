// Logout endpoint

const logoutRoute = (app) => {
  app.post("/api/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
    res.json({ message: "Logged out" });
  });
};
export default logoutRoute;
