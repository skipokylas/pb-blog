import { provideStore } from '@ngrx/store';
import { reducers } from './app/store/reducers';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore(reducers),
  ]
})
  .catch(err => console.error(err));
