export const isAuthorized = (...roles)=> {
    return (req, res, next) => {
        if (!req.authUser) {
            return next(new Error("not authenticated"));
        }
        if (!roles.includes(req.authUser.role)) {
            return next(new Error("not authorized"));
        }

        return next();
    };
};
