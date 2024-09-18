import { Controller, Logger } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Match } from './interface/matches.interface';

const ackErrors: string[] = ['E11000'];

@Controller('matches')
export class MatchesController {
  private logger = new Logger(MatchesController.name);

  constructor(private readonly matchesService: MatchesService) {}

  @EventPattern()
  async createMatch(@Payload() match: Match, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.log(`createMatch: ${JSON.stringify(match)}`);
      await this.matchesService.createMatch(match);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }
}
