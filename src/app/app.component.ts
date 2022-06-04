import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { range } from 'rxjs/internal/observable/range';
import { LotteryServiceService } from './lottery-service.service';
import { Activity } from './pages/activity';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = new FormControl('');
  name = new FormControl('YEAR-END');
  year = new FormControl('2022');
  month = new FormControl('06');
  day = new FormControl('03');
  activity : Activity;


  isVisible = false;

  validateForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private lotteryService: LotteryServiceService,
    ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({});
    this.addField();

  }

  getActivity() {
    const req = {
      name: this.name.value,
      year: this.year.value,
      month: this.month.value,
      day: this.day.value,
    }
    this.lotteryService.getActivity(req).subscribe((result) => {
      console.log('result', result);
      this.activity = result;
    })
  }

  draw() {
  //  range(60000).subscribe((result)=> {
  //   console.log('range result', result);
  //  });
     console.log(_.range(10));
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `passenger${id}`
    };
    const index = this.listOfControl.push(control);
    console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
