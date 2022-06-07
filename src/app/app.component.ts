import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';
import { orderBy } from 'lodash';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Subject } from 'rxjs';
import { range } from 'rxjs/internal/observable/range';
import { LotteryServiceService } from './lottery-service.service';
import { Activity } from './pages/activity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('prizeTmpl') prizeTmpl: TemplateRef<{}>;
  activityList: Activity[];
  selectedActivity = new FormControl('');
  activity: Activity;
  prizeInfo;
  candidateList: string[];
  isVisible = false;
  isCanBeAdded = false;
  isOpenAddedItem = false;
  minPrize:number;
  currentPrize: number;
  isAbleClicked = true;
  searchChange$ = new BehaviorSubject('');
  isLoading = false;
  isSpinning = false;

  newActivityForm!: FormGroup;
  prizeForm!: FormGroup;
  newActivityId = new FormControl('');
  prize = new FormControl('');
  quota = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private lotteryService: LotteryServiceService,
    private modal: NzModalService,
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isSpinning = true;
    this.getActivityList();
    this.addActivityCtrlListener();
    this.newActivityForm = this.fb.group({
      name: [''],
      usersCount: [''],
      prizeCount: [],
    });

    this.prizeForm = this.fb.group({
      prize: [''],
      quota: [''],
    });
  }

  addActivityCtrlListener() {
    this.selectedActivity.valueChanges.subscribe((result) => {
      this.isSpinning = true;
      this.getActivity(result);
    });
  }

  getActivityList() {
    this.lotteryService.getActivityList().subscribe((result) => {
      this.activityList = result;
      this.isSpinning = false;
      this.isLoading = false;
      if (this.newActivityId.value !== '') {
        this.selectedActivity.setValue(this.newActivityId.value);
      }
    });
  }

  getActivity(activityOid: string) {
    this.lotteryService.getActivity(activityOid).subscribe(
      (result) => {
        this.activity = result;
        this.isSpinning = false;
        this.prizeInfo = orderBy(result.info, 'prize', 'desc');
        this.candidateList = result.randomList.split(',');
        if (this.prizeInfo.length > 0) {
          this.minPrize = _.minBy(this.prizeInfo, function(prize) {
            return prize['prize'];
          })['prize'];
        } else {
          this.minPrize = this.activity.prizeCount;
        }
        this.isCanBeAdded = this.prizeInfo.length < this.activity.prizeCount;
      },
      (error) => {
        if (error.status == 400) {
          this.modal.error({
            nzTitle: '<i>Error</i>',
            nzContent: '<b>Empty record, please change the query criteria.</b>',
            nzOnCancel: () => console.log('Close'),
          });
        }
      }
    );
  }

  // add to ReadMe -> PPT / image
  draw(data: Activity['info']) {
    const lastIndex = this.activity.usersCount;
    const startIndex = Number(this.activity.currentIndex) + 1;
    const endIndex =
      startIndex + data['quota'] <= lastIndex
        ? startIndex + data['quota']
        : lastIndex;
    data['list'] = this.candidateList.slice(startIndex, endIndex);
    this.isAbleClicked = false;
    this.saveList(data);
  }

  saveList(data: Activity['info']) {
    this.lotteryService
      .savePrizeEmpls(
        this.activity.activityOid,
        data['prizeOid'],
        data['list'],
        data['quota']
      )
      .subscribe((result) => {
        this.refresh();
        this.drawCompleteMessage(result);

      });
  }

  refresh() {
    this.lotteryService
      .getActivity(this.activity.activityOid)
      .subscribe((result) => {
        this.prizeInfo = orderBy(result.info, 'prize', 'desc');
        this.activity.currentIndex = result.currentIndex;

          setTimeout(()=> {
            this.isAbleClicked = true;
          }, 1000)

        if (this.prizeInfo.length > 0) {
          this.minPrize = _.minBy(this.prizeInfo, function(prize) {
            return prize['prize'];
          })['prize'];
        } else {
          this.minPrize = this.activity.prizeCount;
        }
        this.currentPrize = this.minPrize - 1;
      });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  createBasicMessage(): void {
    this.nzMessageService.success('Create successfully.');
  }

  drawCompleteMessage(result) {
    this.nzMessageService.info(`Lottery draw completely! Saving data ...`);
  }

  createActivity() {
    this.lotteryService
      .createActivity(
        this.newActivityForm.get('name').value,
        this.newActivityForm.get('usersCount').value,
        this.newActivityForm.get('prizeCount').value
      )
      .subscribe(
        (result) => {
          this.getActivityList();
          this.newActivityId.setValue(result['oid']);
          this.newActivityForm.reset();
          this.isVisible = false;
          this.createBasicMessage();
        },
        (error) => {
          if (error.status === 403) {
            this.modal.error({
              nzTitle: '<i>Error</i>',
              nzContent:
                '<b>Prize count and users count both cannot smaller than 1.</b>',
              nzOnCancel: () => console.log('Close'),
            });
          }

          if (error.status === 400) {
            this.modal.error({
              nzTitle: '<i>Error</i>',
              nzContent:
                '<b>Already has the same activity name, please change name.</b>',
              nzOnCancel: () => console.log('Close'),
            });
          }
        }

      );
  }


  showAddItem(): void {
    this.isOpenAddedItem = true;
    this.prizeForm.get('quota').reset();

    if (this.minPrize === this.activity.prizeCount) {
      this.currentPrize = this.activity.prizeCount;
    } else {
      this.currentPrize = this.minPrize -1;
    }
    this.prizeForm.get('prize').setValue(this.currentPrize);
    this.modal.create({
      nzTitle: `新增${this.activity.name}獎項`,
      nzContent: this.prizeTmpl,
      nzFooter: null,
    });

  }

  createPrizeInfo() {
    this.lotteryService
      .createPrizeInfo(
        this.activity.activityOid,
        this.prizeForm.get('prize').value,
        this.prizeForm.get('quota').value
      )
      .subscribe((result) => {
        this.createBasicMessage();
        this.refresh();
        let prize =  this.currentPrize -1;
        if (prize === 0) {
            prize = prize + 1;
        }
        this.prizeForm.get('prize').setValue(prize);
        this.prizeForm.get('quota').reset();
      });
  }
}
