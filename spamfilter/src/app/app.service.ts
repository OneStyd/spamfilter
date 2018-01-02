import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { forEach } from '@angular/router/src/utils/collection';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

@Injectable()
export class AppService {
  public username = localStorage['username'] || 'Alexander Pierce';
  public useremail = localStorage['useremail'] || 'alex.pierce@gmail.com';
  public userphoto = localStorage['userphoto'] || 'avatar5.png';

  constructor(private http: Http) { }

  public emails = [
    {
      id: 1,
      senderName: 'Nadia Carmichael',
      recieverName: 'Alexander Pierce',
      sender: 'nadia.carmie@gmail.com',
      reciever: 'alex.pierce@gmail.com',
      title: 'Perkenalan',
      content: 'Halo, perkenalkan nama saya Nadia Carmichael. Saya baru saja mencoba aplikasi SpamFilter. Mohon kerja samanya.',
      date: '12/20/2017',
      status: 'normal',
      read: 'read'
    },
    {
      id: 2,
      senderName: 'Alexander Pierce',
      recieverName: 'Nadia Carmichael',
      sender: 'alex.pierce@gmail.com',
      reciever: 'nadia.carmie@gmail.com',
      title: 'Re: Perkenalan',
      content: 'Halo, nama saya Alexander Pierce. Saya salah satu developer SpamFilter. Jika ada yang bisa saya bantu jangan sungkan.',
      date: '12/20/2017',
      status: 'normal',
      read: 'read'
    },
    {
      id: 3,
      senderName: 'Alexander Pierce',
      recieverName: 'Nadia Carmichael',
      sender: 'alex.pierce@gmail.com',
      reciever: 'nadia.carmie@gmail.com',
      title: 'Hayolo email apa ini?',
      content: 'Ini salah satu email yang ga penting, ujung-ujungnya juga bakalan dihapus',
      date: '12/21/2017',
      status: 'trash',
      read: 'read'
    },
    {
      id: 4,
      senderName: 'Alexander Pierce',
      recieverName: 'Nadia Carmichael',
      sender: 'alex.pierce@gmail.com',
      reciever: 'nadia.carmie@gmail.com',
      title: 'Ayo beli',
      content: 'Ayo beli Ayo beli Ayo beli Ayo beli Ayo beli Ayo beli Ayo beli Ayo beli Ayo beli Ayo beli Ayo beli Ayo beli Ayo beli',
      date: '12/21/2017',
      status: 'spam',
      read: 'read'
    },
    {
      id: 5,
      senderName: 'Nadia Carmichael',
      recieverName: 'Alexander Pierce',
      sender: 'nadia.carmie@gmail.com',
      reciever: 'alex.pierce@gmail.com',
      title: 'Re: Perkenalan',
      content: 'Oke mas, jika saya mengalami kesulitan saya akan bertanya',
      date: '12/21/2017',
      status: 'normal',
      read: 'read'
    },
    {
      id: 6,
      senderName: 'Nadia Carmichael',
      recieverName: 'Alexander Pierce',
      sender: 'nadia.carmie@gmail.com',
      reciever: 'alex.pierce@gmail.com',
      title: 'Pertanyaan',
      content: 'Oiya mas, ngomong-ngomong arti lorem ipsum itu apa sih?',
      date: '12/22/2017',
      status: 'normal',
      read: 'read'
    },
    {
      id: 7,
      senderName: 'Alexander Pierce',
      recieverName: 'Nadia Carmichael',
      sender: 'alex.pierce@gmail.com',
      reciever: 'nadia.carmie@gmail.com',
      title: 'Re: Pertanyaan',
      content: 'Oh itu mah ga usah dipikirin mbak. Itu cuma text buat ngisi ruang yang kosong aja',
      date: '12/23/2017',
      status: 'normal',
      read: 'read'
    },
    {
      id: 8,
      senderName: 'Nadia Carmichael',
      recieverName: 'Alexander Pierce',
      sender: 'nadia.carmie@gmail.com',
      reciever: 'alex.pierce@gmail.com',
      title: 'Ga Yakin',
      content: 'Hmm.. masa sih mas. Kok saya masih kurang yakin ya',
      date: '12/23/2017',
      status: 'normal',
      read: 'unread'
    },
    {
      id: 9,
      senderName: 'Nadia Carmichael',
      recieverName: 'Alexander Pierce',
      sender: 'nadia.carmie@gmail.com',
      reciever: 'alex.pierce@gmail.com',
      title: 'Re: Ga Yakin',
      content: 'Coba nanti saya tanyakan ke teman saya',
      date: '12/23/2017',
      status: 'normal',
      read: 'unread'
    },
    {
      id: 10,
      senderName: 'Alexander Pierce',
      recieverName: 'Nadia Carmichael',
      sender: 'alex.pierce@gmail.com',
      reciever: 'nadia.carmie@gmail.com',
      title: 'Lorem Ipsum',
      content: 'Nanti saya coba kirim artikel yang ngebahas Lorem Ipsum',
      date: '12/24/2017',
      status: 'normal',
      read: 'unread'
    },
    {
      id: 11,
      senderName: 'Nadia Carmichael',
      recieverName: 'Alexander Pierce',
      sender: 'nadia.carmie@gmail.com',
      reciever: 'alex.pierce@gmail.com',
      title: 'Ini Spam',
      content: 'spam test spam test spam test spam test spam test spam test spam test spam test spam test spam test spam test',
      date: '12/25/2017',
      status: 'spam',
      read: 'unread'
    },
    {
      id: 12,
      senderName: 'Nadia Carmichael',
      recieverName: 'Alexander Pierce',
      sender: 'nadia.carmie@gmail.com',
      reciever: 'alex.pierce@gmail.com',
      title: 'Masih Spam',
      content: 'spam test spam test spam test spam test spam test spam test spam test spam test spam test spam test spam test',
      date: '12/26/2017',
      status: 'spam',
      read: 'unread'
    }
  ];

  getEmailContent(idEmail) {
    const id = +idEmail;
    const content = _.find(this.emails, function (obj) { return obj.id === id; });
    return content;
  }

  getInboxEmails() {
    const listEmail = [];
    this.emails.forEach(email => {
      if (email.reciever === this.useremail) {
        if (email.status === 'normal') {
          listEmail.push(email);
        }
      }
    });
    return listEmail;
  }

  getSentEmails() {
    const listEmail = [];
    this.emails.forEach(email => {
      if (email.sender === this.useremail) {
        listEmail.push(email);
      }
    });
    return listEmail;
  }

  getSpamEmails() {
    const listEmail = [];
    this.emails.forEach(email => {
      if (email.reciever === this.useremail) {
        if (email.status === 'spam') {
          listEmail.push(email);
        }
      }
    });
    return listEmail;
  }

  getTrashEmails() {
    const listEmail = [];
    this.emails.forEach(email => {
      if (email.reciever === this.useremail) {
        if (email.status === 'trash') {
          listEmail.push(email);
        }
      }
    });
    return listEmail;
  }

  countUnreadInbox() {
    let unread = 0;
    this.emails.forEach(email => {
      if (email.sender !== this.useremail) {
        if (email.status === 'normal') {
          if (email.read === 'unread') {
            unread++;
          }
        }
      }
    });
    if (unread > 0) {
      return unread;
    } else {
      return '';
    }
  }

  countUnreadSpam() {
    let unread = 0;
    this.emails.forEach(email => {
      if (email.sender !== this.useremail) {
        if (email.status === 'spam') {
          if (email.read === 'unread') {
            unread++;
          }
        }
      }
    });
    if (unread > 0) {
      return unread;
    } else {
      return '';
    }
  }

}
