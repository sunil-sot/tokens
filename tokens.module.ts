import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Token } from "./entities/token.entity";
import { TokensController } from "./tokens.controller";
import { TokensService } from "./tokens.service";

@Module({
  controllers: [TokensController],
  providers: [TokensService],
  imports: [MikroOrmModule.forFeature([Token]), ConfigModule],
  exports: [TokensService]
})
export class TokensModule {}
