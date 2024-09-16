import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChallengesModule } from './challenges/challenges.module';
import { MatchesModule } from './matches/matches.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://thiagofdias2:eDMr2a5byleD2RFL@cluster.cjc37.mongodb.net/srdesafios?retryWrites=true&w=majority&appName=Cluster',
    ),
    ChallengesModule,
    MatchesModule,
    ProxyrmqModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
