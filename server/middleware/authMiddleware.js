export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.admin) {
    return next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};
