import { Entity, Enum, PrimaryKey, Property, Type, Platform, ValidationError, EntityProperty, UuidType, BigIntType } from "@mikro-orm/core";
import { BaseEntity } from "../../database/entities/base-entity.entity";
import { v4 as uuid } from "uuid";

export class NativeBigIntType extends BigIntType {
  convertToJSValue(value: any): any {
    if (!value) {
      return value;
    }

    return BigInt(value);
  }
}

@Entity({ tableName: "tokens" })
export class Token extends BaseEntity {
  @PrimaryKey()
  id: string;

  @Property()
  token: string;

  @Property({ type: NativeBigIntType })
  expiresAt: bigint;

  @Enum(() => TokenStatus)
  status: TokenStatus;

  @Property({nullable: true})
  usageCount: number;

  @Property({ type: 'json', nullable: true })
  meta: any;

  constructor(id: string, token: string, expiresAt: bigint, status: TokenStatus, usageCount: number, meta: string) {
    super();
    this.id = id;
    this.token = token;
    this.expiresAt = expiresAt;
    this.status = status;
    this.usageCount = usageCount;
    this.meta = meta;
  }
}

enum TokenStatus {
  INVALID,
  VALID,
}
