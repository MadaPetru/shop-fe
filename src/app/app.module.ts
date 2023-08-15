import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MainPageComponent} from './main-page/main-page.component';
import {ProductDetailComponent} from './product/modals/product-detail/product-detail.component';
import {RouterModule} from "@angular/router";
import {MatIconModule} from '@angular/material/icon';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {CreateProductComponent} from './product/modals/create-product/create-product.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {UpdateProductComponent} from './product/modals/update-product/update-product.component';
import {DeleteProductComponent} from './product/modals/delete-product/delete-product.component';
import {PaginationComponent} from './pagination/pagination.component';
import {LoginModalComponent} from './login/login-modal/login-modal.component';
import {AuthInterceptor} from "./auth-interceptor";
import { ErrorModalComponent } from './error-modal/error-modal.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ProductDetailComponent,
    CreateProductComponent,
    UpdateProductComponent,
    DeleteProductComponent,
    PaginationComponent,
    LoginModalComponent,
    ErrorModalComponent
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
    ReactiveFormsModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
