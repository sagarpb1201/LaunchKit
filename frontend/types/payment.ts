export interface Plan {
    id:string;
    name:string;
    price:number;
    currency:string;
    interval:string;
    stripePriceId:string;
    features:string[];
    active:boolean;
    productsId:string | null;
}