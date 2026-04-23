export interface Photo {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    altText: string;
}

export interface Photographer {
    name: string;
    bio: string;
    style: string;
    website?: string;
    socialMedia?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

export interface ContactForm {
    name: string;
    email: string;
    message: string;
}