import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.css'],
  providers: [AppService]
})
export class ComposeComponent implements OnInit {


  constructor(
    private DataService: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  doTextareaValueChange(ev) {
    try {
      this.DataService.textareaValue = ev.target.value;
    } catch(e) {
      console.info('could not set textarea-value');
    }
  }

}
