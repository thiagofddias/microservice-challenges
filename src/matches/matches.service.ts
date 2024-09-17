import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match } from './interface/matches.interface';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Challenge } from 'src/challenges/interface/challenges.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly logger = new Logger(MatchesService.name);

  private clientChallenges =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  async createMatch(match: Match): Promise<Match> {
    try {
      const createdMatch = new this.matchModel(match);
      this.logger.log(`Match created: ${JSON.stringify(createdMatch)}`);

      const result = await createdMatch.save();
      this.logger.log(`Result: ${JSON.stringify(result)}`);
      const idMatch = result._id;

      const challenge: Challenge = await firstValueFrom(
        this.clientChallenges.send<Challenge>('get-challenge', {
          idChallenge: match.challenge,
        }),
      );

      await firstValueFrom(
        this.clientChallenges.emit('update-challenge-match', {
          idMatch: idMatch,
          idChallenge: challenge,
        }),
      );

      return result;
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
