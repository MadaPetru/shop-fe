import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MainPageComponent} from './main-page/main-page.component';
import {ProductDetailComponent} from './product/modals/product-detail/product-detail.component';
import {RouterModule} from "@angular/router";
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {CreateProductComponent} from './product/modals/create-product/create-product.component';
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {UpdateProductComponent} from './product/modals/update-product/update-product.component';
import {DeleteProductComponent} from './product/modals/delete-product/delete-product.component';
import {PaginationComponent} from './pagination/pagination.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ProductDetailComponent,
    CreateProductComponent,
    UpdateProductComponent,
    DeleteProductComponent,
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
