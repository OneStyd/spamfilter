import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../app.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css'],
  providers: [AppService]
})
export class ReadComponent implements OnInit {
  private mailId: any;
  private mailContent: any;

  constructor(
    private DataService: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.mailId = params['id'];
    });
  }

  ngOnInit() {
    this.mailContent = this.DataService.getEmailContent(this.mailId);
  }

  deleteThis() {
    swal({
      title: 'Are you sure?',
      text: 'Deleted mail will be moved to Trash',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        console.log('deleted'); // change to delete function later
      }
    });
  }

  printThis() {
    swal(
      'Oops...',
      'This function is not implemented yet!',
      'error'
    );
  }

}
