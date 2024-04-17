import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { UtilityService } from '../../services/utility-service.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
})
export class MainMenuComponent implements OnInit {
  isClose = false;
  panels;

  constructor(
    private renderer: Renderer2,
    private utilityService: UtilityService
  ) {}
  sidebarClose() {
    this.isClose = true;
    document.body.classList.add('sidebar-closed');
  }
  sidebarOpen() {
    this.isClose = false;
    document.body.classList.remove('sidebar-closed');
  }

  ngOnInit() {
    this.utilityService.getPannelTerm().subscribe((data) => {
      this.panels = data;
    });
  }
}
