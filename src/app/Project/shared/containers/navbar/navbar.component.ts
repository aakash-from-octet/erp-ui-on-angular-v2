import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  actions = [
    { title: 'Action 1', description: 'Lorem ipsum is a dummy text' },
    { title: 'Action 2', description: 'Another dummy text' },
    { title: 'Action 3', description: 'Another ipsum is a dummy text' },
    { title: 'Action 4', description: 'Another dummy text' },
  ];
  constructor(
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  userName: string | null = null; // Initialize username

  ngOnInit(): void {
    this.setUsername();
  }

  setUsername() {
    this.keycloakService.getToken().then((token) => {
      if (token) {
        try {
          const token = this.keycloakService.getKeycloakInstance().tokenParsed;
          this.userName = token['preferred_username']; // Extract username
        } catch (error) {
          console.error('Error decoding access token:', error);
          this.userName = null; // Clear username on error
        }
      } else {
        console.warn('Missing access token');
        this.userName = null; // Clear username if no token
      }
    });
  }

  logout(): void {
    this.router.navigate([''], { replaceUrl: true }).then(() => {
      this.keycloakService.logout().then(() => {
        localStorage.clear();
        this.keycloakService.clearToken();
      });
    });
  }
  menuItems = [
    {
      title: '',
      routerLink: '/',
      text: 'Home',
      children: [],
    },
    {
      title: 'ASSETS',
      text: '',
      children: [{ text: 'Moulds', routerLink: null }],
    },
    {
      title: 'LIFE CYCLE',
      text: '',
      children: [
        { text: 'Innovations', routerLink: null },
        { text: 'Operations', routerLink: null },
        {
          text: 'Retirals',
          routerLink: null,
        },
      ],
    },
    {
      title: 'INSIGHTS',
      text: '',
      children: [
        { text: 'LC Cost', routerLink: null },
        { text: 'Capacity', routerLink: null },
        { text: 'Analytics', routerLink: null },
        {
          text: 'Admin',
          routerLink: null,
          hasSubmenu: true,
          menus: [
            {
              title: 'ORG SETUP',
              submenus: [
                { label: 'Organisation', link: 'admin/organisation' },
                { label: 'Vendor', link: 'admin/vendor-management' },
                { label: 'Location', link: 'admin/location' },
                { label: 'Facilities', link: 'admin/facilities' },
              ],
            },
            {
              title: 'USER MANAGEMENT',
              submenus: [
                { label: 'Roles', link: 'admin/roles' },
                { label: 'Role-permission', link: 'admin/role-permission' },
                { label: 'Users', link: 'admin/users' },
              ],
            },
            {
              title: 'PRODUCT HIERARCHY',
              submenus: [
                { label: 'Brand', link: 'admin/brand' },
                { label: 'Category', link: 'admin/category' },
                { label: 'Product', link: 'admin/product' },
                { label: 'Component', link: 'admin/component' },
              ],
            },
            {
              title: 'ASSET',
              submenus: [
                { label: 'Mould', link: 'admin/mould' },
                { label: 'Spare Master', link: 'admin/spare-master' },
                { label: 'Sensor Master', link: 'admin/sensor-master' },
              ],
            },
            {
              title: 'REPOSITORY',
              submenus: [
                // { label: 'Tasks', link: 'admin/tasks' },
                { label: 'Task Group', link: 'admin/task-group' },
                {
                  label: 'Maintenance Schedule Configuration',
                  link: 'admin/maintenance-schedule-configuration',
                },
                // {
                //   label: 'Non - Maintenance Schedule Configuration',
                //   link: 'admin/non-maintenance-schedule-configuration',
                // },
                {
                  label: 'Issue Code',
                  link: 'admin/issue-code',
                },
                {
                  label: 'Template Repository',
                  link: 'admin/template-repository',
                },
                {
                  label: 'Task Repository',
                  link: 'admin/task-repository',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  var_mainMenu = false;
  subMenuOpen: { [key: string]: boolean } = {};
  currentSubMenuTitle: string | null = null;
  openMobileMainMenu() {
    this.var_mainMenu = true;
  }
  closeMainMenu() {
    this.var_mainMenu = false;
  }
  toggleSubMenu(menuItem): void {
    this.subMenuOpen[menuItem] = !this.subMenuOpen[menuItem];

    if (this.subMenuOpen[menuItem]) {
      this.currentSubMenuTitle = menuItem;
    } else {
      this.currentSubMenuTitle = null;
    }
  }
  toggleSubMenu2(menuItem): void {
    this.subMenuOpen[menuItem] = !this.subMenuOpen[menuItem];
  }

  refreshMenu() {
    this.var_mainMenu = false;
    this.subMenuOpen = {};
    this.currentSubMenuTitle = null;
  }
}
