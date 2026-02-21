export const ADMIN_EMAIL = 'mrkett25@gmail.com';
export const ADMIN_ALIAS = 'CARCONNECT_ADMIN'; // Unique credential alias

export const isEmailAdmin = (identifier: string) => {
    const cleanId = identifier.toLowerCase().trim();
    return cleanId === ADMIN_EMAIL.toLowerCase() || cleanId === ADMIN_ALIAS.toLowerCase();
};

export const getAdminEmail = (identifier: string) => {
    const cleanId = identifier.toLowerCase().trim();
    if (cleanId === ADMIN_ALIAS.toLowerCase()) {
        return ADMIN_EMAIL;
    }
    return identifier;
};
