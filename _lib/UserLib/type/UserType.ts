/** User insterface */
//type pour update le user
export interface UpdateUserData {
    userId: string;
    field: string;
    value: string | number;
}

export interface UserType {
    dateOfBirth: string | undefined;
    email: string;
    lastName: string;
    _id: string;
    firstName: string;
    estAdmin: boolean | undefined;
    username: string;
    userId: any;
}

export interface ProfileData {
    nom: string;
    prenom: string;
    email: string;
    username: string;
    dateOfBirth: string;
}