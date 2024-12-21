import { UserType } from "@lib/UserLib/type/UserType";

export interface CommentaireDocument extends Document {
    _id: string;
    User: UserType;             // Informations sur l'utilisateur ayant soumis le commentaire
    objet: string;          // Objet du commentaire (sujet principal)
    message: string;        // Contenu du message du témoignage
    note: number;           // Note attribuée au témoignage (de 0 à 5 par exemple)
    dateEnvoie: Date;       // Date d'envoi ou de création du témoignage
}