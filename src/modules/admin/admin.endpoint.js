import { roles } from "../../db/models/user.model.js";

export const endPoints={
    adminDashboard:[roles.ADMIN,roles.SUPER_ADMIN,roles.OWNER]
}