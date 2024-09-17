import {
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Challenge } from './interface/challenges.interface';

const ackErrors: string[] = ['E11000'];

@Controller('challenges')
export class ChallengesController {
  private logger = new Logger(ChallengesController.name);

  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      await this.challengesService.createChallenge(challenge);
      await channel.ack(originalMessage);
      this.logger.log(`createChallenge: ${JSON.stringify(challenge)}`);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('get-challenges')
  async getChallenges(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<Challenge[] | Challenge> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const { idPlayer, _id } = data;
      this.logger.log(`data: ${JSON.stringify(data)}`);
      if (idPlayer) {
        return await this.challengesService.findChallengeFromPlayer(idPlayer);
      } else if (_id) {
        return await this.challengesService.findChallengeFromId(_id);
      } else {
        return await this.challengesService.findAllChallenges();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-challenge')
  async updateChallenge(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);
      const _id = data._id;
      const challenge: Challenge = data.challenge;
      await this.challengesService.updateChallenge(_id, challenge);
      await channel.ack(originalMessage);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackErrors) =>
        error.message.includes(ackErrors),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @EventPattern('update-challenge-match')
  async updateChallengeMatch(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);
      const _id = data._id;
      const challenge: Challenge = data.challenge;
      await this.challengesService.updateChallengeMatch(_id, challenge);
      await channel.ack(originalMessage);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackErrors) =>
        error.message.includes(ackErrors),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @EventPattern('delete-challenge')
  async deleteChallenge(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);
      const _id = data._id;
      await this.challengesService.deleteChallenge(_id);
      await channel.ack(originalMessage);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackErrors) =>
        error.message.includes(ackErrors),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }
}
