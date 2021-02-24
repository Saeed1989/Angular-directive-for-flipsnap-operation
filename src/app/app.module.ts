import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { rootRouterConfig } from './app.routes';
import { TestPageComponent } from './components/pages/test-page/test-page.component';
import { FlipsnapDirective } from './directives/flipsnap.directive';

@NgModule({
  declarations: [AppComponent, TestPageComponent, FlipsnapDirective],
  imports: [
    BrowserModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
