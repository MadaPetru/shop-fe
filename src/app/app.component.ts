import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gorrila_shop';

  ngOnInit() {
    localStorage.clear();
    // if (localStorage.getItem('appStarted') != 'true') {
    //   localStorage.clear();
    //   localStorage.setItem('appStarted', 'true');
    // }
    // for testing purpose comment this, i will get a better solution for the localStorage
  }
}
