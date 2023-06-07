import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MainPageComponent} from './main-page/main-page.component';
import {ShoppingCartComponent} from './shopping-cart/shopping-cart.component';
import {ProductDetailComponent} from './product/modals/product-detail/product-detail.component';
import {RouterModule} from "@angular/router";
import {LoginPageComponent} from './login-page/login-page.component';
import {UploadImageComponent} from './image/upload-image/upload-image.component';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {CreateProductComponent} from './product/modals/create-product/create-product.component';
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {UpdateProductModalComponent} from './product/modals/update-product-modal/update-product-modal.component';
import {DeleteProductModalComponent} from './product/modals/delete-product-modal/delete-product-modal.component';
import {PaginationComponent} from './pagination/pagination.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ShoppingCartComponent,
    ProductDetailComponent,
    LoginPageComponent,
    UploadImageComponent,
    CreateProductComponent,
    UpdateProductModalComponent,
    DeleteProductModalComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatProgressBarModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: '**', component: MainPageComponent}
    ]),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
