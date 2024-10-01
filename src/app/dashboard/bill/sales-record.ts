import { roundNumber } from "src/app/utils/number-tratment";

export interface ProductTicket{
    code: string;
    description: number;
    saleType: string;
    cost: number;
    salePrice: number;
    wholesalePrice: number | null;
    cantity: number;
    import: number;
  }

export class saleProducts{
    private products: ProductTicket[];
    public wholesale: boolean;

    constructor(){
        this.products = []
        this.wholesale = false;
    }

    add(product: any, cantity: number = 1): any{
        for(let prod of this.products){
            if(prod.code === product.code){
                prod.cantity += cantity;
                if(this.wholesale) prod.import = prod.wholesalePrice ? roundNumber(prod.cantity * prod.wholesalePrice) : roundNumber(prod.cantity * prod.salePrice);
                else prod.import = roundNumber(prod.cantity * prod.salePrice);
                return prod
            }
        }

        const prod = {
            code: product.code,
            description: product.description,
            saleType: product.saleType,
            cost: product.cost,
            salePrice: Math.round(product.salePrice * 100) / 100,
            wholesalePrice: product.wholesalePrice ? Math.round(product.wholesalePrice * 100) / 100: null,
            cantity: cantity,
            import: roundNumber(product.salePrice * cantity),
        }

        this.products.push(prod);
        return prod
        
    }

    remove(product: any, cantity: number): any{
        for(let index = 0; index < this.products.length; index++){
            if(this.products[index].code === product.code){
                if(cantity > 0 && this.products[index].cantity -1 > 0){
                    const prod = this.products[index];
                    prod.cantity -= cantity;
                    if(this.wholesale) prod.import = prod.wholesalePrice ? roundNumber(prod.cantity * prod.wholesalePrice) : roundNumber(prod.cantity * prod.salePrice);
                    else prod.import = roundNumber(prod.cantity * prod.salePrice);
                }else{
                    this.products.splice(index,1);
                }
                break
            }
        }
    }

    get(): any{
        return this.products;
    }

    total(): number{
        return this.products.reduce((acc, prod) => acc + prod.import, 0)
    }

    applyWholesale(): void{
        this.wholesale = true;
        for(let prod of this.products){
            prod.import = roundNumber(prod.wholesalePrice ? prod.cantity * prod.wholesalePrice : prod.cantity * prod.salePrice);
        }
    }

    undoWholesale(): void{
        this.wholesale = false;
        for(let prod of this.products){
            prod.import = roundNumber(prod.cantity * prod.salePrice);
        }
    }
}
