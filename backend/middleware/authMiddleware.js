const requireAuth = (req, res, next) => {
    if (!req.session.organizationId) {
        return res.redirect("/login");
    }

    next();
};

export default requireAuth;