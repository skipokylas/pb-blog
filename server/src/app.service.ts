import { Injectable } from '@nestjs/common';
import { SubsocialApi } from "@subsocial/api";

const config = {
  substrateNodeUrl: "wss://rco-para.subsocial.network",
  ipfsNodeUrl: "https://gw.crustfiles.app",
};

@Injectable()
export class AppService {
  api = SubsocialApi.create(config);

  async getSpace(id: number) {
    return  (await this.api).findSpace({ id })
  }
}
