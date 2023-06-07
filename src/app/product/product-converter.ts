import {ProductResponse} from "./dto/response/product-response";
import {Product} from "./entity/product";

export class ProductConverter{

  static convertToEntity(response:ProductResponse):Product{
    let entity:Product = new Product();
    entity.name = response.name;
    entity.quantity = response.quantity;
    entity.price = response.price;
    entity.images = response.images;
    entity.id = response.id;
    return entity;
  }
}
