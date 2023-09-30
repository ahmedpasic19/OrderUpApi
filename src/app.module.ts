import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrganisationsModule } from './organisations/organisations.module';

@Module({
  imports: [UsersModule, OrganisationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
