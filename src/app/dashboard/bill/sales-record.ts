import { roundNumber } from "src/app/utils/number-tratment";

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

export class saleProducts{
    private products: ProductTicket[];
    public wholesale: boolean;

    constructor(){
        this.products = []
        this.wholesale = false;
    }

    add(product: any, cantity: number = 1): any{
        var alreadyAt = false;

        for(let prod of this.products){
            if(prod.code === product.code){
                prod.cantity += cantity;
                if(this.wholesale) prod.import = roundNumber(prod.cantity * prod.wholesalePrice);
                else prod.import = roundNumber(prod.cantity * prod.salePrice);
                alreadyAt = true;
                return prod
            }
        }

        if(!alreadyAt){
            const prod = {
                code: product.code,
                description: product.description,
                saleType: product.saleType,
                cost: product.cost,
                salePrice: Math.round(product.salePrice * 100) / 100,
                wholesalePrice: product.wholesalePrice ? Math.round(product.wholesalePrice * 100) / 100: Math.round(product.salePrice * 100) / 100,
                cantity: 1,
                import: roundNumber(product.salePrice),
            }
            this.products.push(prod);

            return prod
        }
    }

    remove(product: any, cantity: number): any{
        for(let index = 0; index < this.products.length; index++){
            if(this.products[index].code === product.code){
                if(cantity > 0 && this.products[index].cantity -1 > 0){
                    this.products[index].cantity -= cantity;
                    if(this.wholesale) this.products[index].import = roundNumber(this.products[index].cantity * this.products[index].wholesalePrice);
                    else this.products[index].import = roundNumber(this.products[index].cantity * this.products[index].salePrice);
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
            prod.import = prod.cantity * prod.wholesalePrice ? prod.wholesalePrice : prod.cantity * prod.salePrice;
        }
    }

    undoWholesale(): void{
        this.wholesale = false;
        for(let prod of this.products){
            prod.import = prod.cantity * prod.salePrice;
        }
    }
}
