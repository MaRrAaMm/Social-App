const generateMessage = (entity) =>({
        notFound: `${entity} not found`,
        alreadyExist:`${entity} already exist`,
        createdSuccessfully : `${entity} created succcessfully`,
        updatedSuccessfully : `${entity} updated succcessfully`,
        deletedSuccessfully : `${entity} deleted succcessfully`,
        failToCreate : `fail to create ${entity}`,
        failToUpdate : `fail to update ${entity}`,
        failToDelete : `fail to delete ${entity}`,
});
export const message={
    AUTH:{loginSuccessfully : "login successfully"},
    USER: {...generateMessage("user"),
        activateAccount:"activate account first"},
    otp:generateMessage("otp")
};