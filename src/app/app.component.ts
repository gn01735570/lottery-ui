import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { range } from 'rxjs/internal/observable/range';
import { LotteryServiceService } from './lottery-service.service';
import { Activity } from './pages/activity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = new FormControl('');
  name = new FormControl('尾牙');
  year = new FormControl('2025');
  month = new FormControl('12');
  day = new FormControl('31');
  activity: Activity;
  candidateList: number[];
  isVisible = false;
  validateForm!: FormGroup;
  newActivityId = new FormControl('');
  prize = new FormControl('');
  quota = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private lotteryService: LotteryServiceService,
    private modal: NzModalService  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [''],
      year: [''],
      month: [''],
      day: [''],
      usersCount: [''],
      prizeCount: [''],
    });
  }

  getActivity() {
    const req = {
      name: this.name.value,
      year: this.year.value,
      month: this.month.value,
      day: this.day.value,
    };
    this.lotteryService.getActivity(req).subscribe((result) => {
      this.activity = result;
      this.candidateList = _.shuffle(_.range(1, 60000));
    }, (error) => {
        if (error.status == 400) {
          this.modal.error({
            nzTitle: '<i>Error</i>',
            nzContent: '<b>Empty record, please change the query criteria.</b>',
            nzOnCancel: () => console.log('Close')
          })
        }
    });
  }

  draw(data: Activity['info']) {
    data['list'] = this.candidateList.slice(0, data['quota']);
    this.candidateList = this.candidateList.slice(data['quota'] + 1);
    this.saveList(data);
  }

  saveList(data: Activity['info']) {
    this.lotteryService
      .savePrizeEmpls(this.activity.activityOid, data['prizeOid'], data['list'])
      .subscribe((result) => {
        console.log('post result', result);
      });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  createActivity() {
    this.lotteryService
      .createActivity(
        this.validateForm.get('name').value,
        this.validateForm.get('year').value,
        this.validateForm.get('month').value,
        this.validateForm.get('day').value,
        this.validateForm.get('usersCount').value,
        this.validateForm.get('prizeCount').value
      )
      .subscribe((result) => {

        this.newActivityId.setValue(result['oid']);
        console.log('result.activityOid', result['oid']);
        console.log('this.newActivityId', this.newActivityId.value);
      });
  }

  createPrizeInfo() {
    this.lotteryService
      .createPrizeInfo(this.newActivityId.value, this.prize.value, this.quota.value)
      .subscribe((result) => {
        console.log('prize info', result);
      });
  }
}
