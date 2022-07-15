import { EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Token } from "./entities/token.entity";
import { getRandomString } from "./utils";
import { v4 as uuid } from "uuid";

enum TokenStatus {
  INVALID,
  VALID,
}

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: EntityRepository<Token>,
    private config: ConfigService,
  ) {}

  async tokenExists(id: string) {
    let query = { id: id, status: TokenStatus.VALID };
    let res = await this.tokenRepository.findOne(query);
    if (res) {
      if (res.expiresAt <= +new Date()) return false;
      else return res;
    } else return false;
  }
  async generateToken(
    id: any,
    tokenSettings: { uuid?: boolean; length?: number; capitalAlpha?: boolean; smallAlpha?: boolean; numeric?: boolean; specialChar?: boolean },
    expireAfter = 600000,
    meta?: any,
    name?: string,
    usageCount?: number,
  ) {
    //10mins

    if (!id) throw new Error("Unique _id object is required");

    let randomString: string;

    if (tokenSettings.uuid) {
      randomString = uuid();
    } else {
      randomString = getRandomString(tokenSettings || { length: 5, specialChar: false, capitalAlpha: false, smallAlpha: false });
    }
    let tokenName = name || randomString;
    let now = +new Date();
    let token;

    token = await this.tokenRepository.findOne({ id });
    let expiresAt : bigint = BigInt(0);
    if(expireAfter) expiresAt = BigInt(now + expireAfter);

    if (!token) {
      token = new Token(id, tokenName, expiresAt, TokenStatus.VALID, usageCount || null, meta);
    } else {
      token.token = tokenName;
      token.expiresAt = expiresAt;
      token.status = TokenStatus.VALID;
      token.usageCount = usageCount || null;
      token.meta = meta;
      token.id = id;
      token.meta = meta;
    }

    // console.log(token)

    await this.tokenRepository.persist(token);
    await this.tokenRepository.flush();
    return { token: tokenName };
  }

  /**
   * Verify token with an _id object for validity and expiration
   * @param _id Combination of attributes to identify token with. ex : username and category
   * @param token Token string to verify
   */
  async verifyToken(id: any, token, invalidate=true) {
    if (!id) throw new Error("Unique _id object is required.");

    if (!token) throw new Error("Token string is required for verification.");

    let query = { id: id, token: token, status: TokenStatus.VALID };
    let res = await this.tokenRepository.findOne(query);
    console.log(res, +new Date());
    if (res) {
      if (res.expiresAt && (res.expiresAt <= +new Date())) throw new Error("Token expired.");
      else {
        if(invalidate)
          await this.invalidateToken(query);
        return { code: 1, message: "Token verified.", meta: res.meta || {}};
      }
    } else throw new Error("Invalid token");
  }

  /**
   * Invalidate the tokens matching specified query
   * @param query Query to match tokens with
   */
  async invalidateToken(query): Promise<any> {
    let token = await this.tokenRepository.findOneOrFail(query);
    token.status = TokenStatus.INVALID;
    await this.tokenRepository.persistAndFlush(token);
    return;
  }

  /**
   * Removes invalid Or Expired Tokens
   * @param query Query to be used for matching tokens, default takes up all invalid or expired ones
   */
  async removeInvalidOrExpiredTokens(query) {
    let now = +new Date();
    let res = await this.tokenRepository.findAll({ ...query, $or: [{ status: TokenStatus.INVALID, expiresAt: { $lte: now } }] });
    res.forEach(async e => {
      await this.tokenRepository.removeAndFlush(e);
    });
    return;
  }

  async getTokenInfo(token:string){
    return this.tokenRepository.findOne({$or: [{token: token}, {id: token}]})
  }
}
