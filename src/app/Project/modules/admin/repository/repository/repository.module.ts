import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepositoryRoutingModule } from './repository-routing.module';
import { repositoryContainer } from '../containers';
import { repositoryComponents } from '../components';
import { ShareModule } from 'src/app/Project/shared/share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [...repositoryContainer, ...repositoryComponents],
  imports: [
    CommonModule,
    RepositoryRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [...repositoryContainer, ...repositoryComponents],
})
export class RepositoryModule {}
