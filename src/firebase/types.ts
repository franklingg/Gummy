import { CollectionReference } from "firebase-admin/firestore";

type Award = {
    title: string;
    subtitle: string;
    banner?: string;
    role?: string;
    categories?: CollectionReference<Category>;
}

type Category = {
    title: string;
    candidate1: string;
    candidate2: string;
    candidate3?: string;
    candidate4?: string;
    candidate5?: string;
}

export type { Award, Category }