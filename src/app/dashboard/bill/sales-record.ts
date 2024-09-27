export interface ProductTicket{
    code: string;
    description: number;
    saleType: string;
    cost: number;
    salePrice: number;
    wholesalePrice: number;
    cantity: number;
    import: number;
  }

export class saleTicket{
    private products: ProductTicket[];

    constructor(){
        this.products = []
    }

    addProduct(product: any, cantity: number = 1): any{
        var alreadyAt = false;

        for(let prod of this.products){
            if(prod.code === product.code){
                prod.cantity += cantity;
                prod.import = prod.cantity * prod.salePrice;
                alreadyAt = true;
                break;
            }
        }

        if(!alreadyAt){
            const prod = {
                code: product.code,
                description: product.description,
                saleType: product.saleType,
                cost: product.cost,
                salePrice: product.salePrice,
                wholesalePrice: product.wholesalePrice,
                cantity: 1,
                import: product.salePrice,
            }
            this.products.push(prod);
        }

        return this.products;
    }

    getAllProducts(){
        return this.products;
    }
}