import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../app.service';
declare var $;

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.css'],
  providers: [AppService]
})
export class SentComponent implements OnInit {
  public username: any;
  public useremail: any;
  public emails: any;

  constructor(
    private DataService: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.username = this.DataService.username;
    this.useremail = this.DataService.useremail;
    this.emails = this.DataService.getSentEmails();
    setTimeout(function () {
      $('#emailterkirim').DataTable( {
        'order': [[ 0, 'desc' ]],
        'columnDefs': [ { 'searchable': false, 'targets': 0 } ]
      } );
    }, 10);
  }

  readThis(mailId) {
    this.router.navigate(['read/' + mailId]);
  }

}
