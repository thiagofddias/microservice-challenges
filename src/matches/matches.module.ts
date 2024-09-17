import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesSchema } from './interface/matches.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchesSchema }]),
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
