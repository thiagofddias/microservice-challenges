import { Module } from '@nestjs/common';
import { ChallengeService } from './challenges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interface/challenge.schema';
import { ChallengeController } from './challenges.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Challenges', schema: ChallengeSchema },
    ]),
  ],
  providers: [ChallengeService],
  controllers: [ChallengeController],
})
export class ChallengesModule {}
