import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UsersModule, OrganisationsModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
