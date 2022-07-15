import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, HttpCode } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { ApiBody } from "@nestjs/swagger";

@Controller("tokens")
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  async generateToken() {
    try {
      return await this.tokensService.generateToken(JSON.stringify({ id: "test" }), {}, 60000, JSON.stringify({ test: "test" }), "test", 10);
    } catch (e) {
      console.log(e);
      return {};
    }
  }
}
