import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge } from './interface/challenges.interface';
import { RpcException } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { ChallengeStatus } from './challenge-status.enum';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(challenge: Challenge): Promise<Challenge> {
    try {
      const createdChallenge = new this.challengeModel(challenge);
      return await createdChallenge.save();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findAllChallenges(): Promise<Challenge[]> {
    try {
      return await this.challengeModel.find().exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findChallengeFromId(_id: string): Promise<Challenge> {
    try {
      return await this.challengeModel.findOne({ _id }).exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findChallengeFromPlayer(_id: any): Promise<Challenge[] | Challenge> {
    try {
      return await this.challengeModel.find().where('players').in(_id).exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallenge(_id: string, challenge: Challenge): Promise<void> {
    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallengeMatch(
    idMatch: string,
    challenge: Challenge,
  ): Promise<void> {
    try {
      challenge.status = ChallengeStatus.REALIZED;
      challenge.match = idMatch;
      await this.challengeModel
        .findOneAndUpdate({ _id: challenge._id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deleteChallenge(challenge: Challenge): Promise<void> {
    try {
      const { _id } = challenge;

      challenge.status = ChallengeStatus.CANCELED;
      this.logger.log(`Challenge canceled: ${JSON.stringify(challenge)}`);

      await this.challengeModel.deleteOne({ _id }).exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
