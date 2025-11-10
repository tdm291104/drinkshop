export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    status: string;
    parentId?: string;
}
