import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../app.service';
declare var $;

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
  providers: [AppService]
})
export class InboxComponent implements OnInit {
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
    this.emails = this.DataService.getInboxEmails();
    setTimeout(function () {
      $('#emailmasuk').DataTable( {
        'order': [[ 0, 'desc' ]],
        'columnDefs': [ { 'searchable': false, 'targets': 0 } ]
      } );
    }, 1000);
  }

  readThis(mailId) {
    this.router.navigate(['read/' + mailId]);
  }

}
