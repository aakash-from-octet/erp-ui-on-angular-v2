import { Component, OnInit } from '@angular/core';
import { UiCommonService } from '../../services/ui-common/ui-common.service';
import { UtilityService } from '../../services/utility-service.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit{
  menuarray;

  constructor(
    private service: UiCommonService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.getMenuList();
    setTimeout(() => {
      this.utilityService.setPannelTerm(
        this.menuarray[this.menuarray?.length - 1]?.menus
      );
    }, 500);
  }

  handleButtonClick(e) {
    this.utilityService.setPannelTerm(e?.menus);
  }

  getMenuList() {
    this.service.getMenuList().subscribe((data) => {
      if (data.statuscode === 200) {
        this.menuarray = data?.data;
      }
    });
  }
}
