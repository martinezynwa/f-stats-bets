DROP TABLE IF EXISTS "BetCompetition" CASCADE;
DROP TABLE IF EXISTS "BetCompetitionToLeague" CASCADE;
DROP TABLE IF EXISTS "Bet" CASCADE;
DROP TABLE IF EXISTS "Fixture" CASCADE;
DROP TABLE IF EXISTS "FixtureRound" CASCADE;
DROP TABLE IF EXISTS "League" CASCADE;
DROP TABLE IF EXISTS "Nation" CASCADE;
DROP TABLE IF EXISTS "Team" CASCADE;
DROP TABLE IF EXISTS "Season" CASCADE;
DROP TABLE IF EXISTS "UserSettings" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Log" CASCADE;
DROP TABLE IF EXISTS "BetEvaluated" CASCADE;
DROP TABLE IF EXISTS "UserToBetCompetition" CASCADE;
DROP TYPE IF EXISTS federation_type;
DROP TYPE IF EXISTS organization_type;
DROP TYPE IF EXISTS league_type;
DROP TYPE IF EXISTS log_type;
DROP TYPE IF EXISTS bet_result_type;

CREATE TYPE federation_type AS ENUM (
    'AFRICA',
    'ASIA',
    'EUROPE',
    'NORTH_CENTRAL_AMERICA',
    'OCEANIA',
    'SOUTH_AMERICA',
    'WORLD'
);

CREATE TYPE organization_type AS ENUM (
    'AFC',
    'AUSTRIA',
    'BELGIUM',
    'CAF',
    'CONCACAF',
    'CONMEBOL',
    'CZECH',
    'ENGLAND',
    'FIFA',
    'FRANCE',
    'GERMANY',
    'ITALY',
    'NETHERLANDS',
    'OFC',
    'PORTUGAL',
    'SPAIN',
    'TURKEY',
    'UEFA'
);

CREATE TYPE league_type AS ENUM (
    'League',
    'LeagueCup',
    'ClubTournament',
    'NationalTournament',
    'Friendly',
    'Unassigned',
    'Totals'
);

CREATE TYPE log_type AS ENUM (
    'INFO',
    'ERROR',
    'WARNING'
);

CREATE TYPE bet_result_type AS ENUM (
    'HOME_WIN',
    'AWAY_WIN',
    'DRAW'
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "avatar" TEXT,
    "isVerified" BOOLEAN,
    "name" TEXT NOT NULL,
    "providerAvatar" TEXT,
    "providerId" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS "UserSettings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID UNIQUE NOT NULL,
    "leagueOrder" TEXT,
    "providerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "Season" (
    "seasonId" INTEGER PRIMARY KEY,
    "isActual" BOOLEAN NOT NULL DEFAULT FALSE,
    "isSupported" BOOLEAN,
    "seasonEndDate" TEXT NOT NULL,
    "seasonStartDate" TEXT NOT NULL,
    "supportedLeagues" JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS "League" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "season" INTEGER NOT NULL,
    "externalLeagueId" INTEGER NOT NULL,
    "countPlayerStats" BOOLEAN,
    "country" TEXT NOT NULL,
    "dateEnd" TEXT NOT NULL,
    "dateStart" TEXT NOT NULL,
    "federation" federation_type NOT NULL,
    "flag" TEXT NOT NULL,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "groupStage" BOOLEAN,
    "isForUnassigned" BOOLEAN DEFAULT FALSE,
    "logo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "national" BOOLEAN NOT NULL,
    "organization" organization_type,
    "supported" BOOLEAN NOT NULL DEFAULT FALSE,
    "type" league_type NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS "Nation" (
    "id" INTEGER PRIMARY KEY,
    "altNationName" TEXT,
    "code" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "nationName" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Team" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "leagueId" UUID NOT NULL,
    "season" INTEGER NOT NULL,
    "externalLeagueId" INTEGER NOT NULL,
    "externalTeamId" INTEGER NOT NULL,
    "code" TEXT,
    "country" TEXT NOT NULL,
    "isForUnassigned" BOOLEAN DEFAULT FALSE,
    "logo" TEXT,
    "name" TEXT NOT NULL,
    "national" BOOLEAN NOT NULL,
    "venue" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

ALTER TABLE "Team" ADD CONSTRAINT "Team_leagueId_fkey" 
    FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "Fixture" (
    "fixtureId" INTEGER PRIMARY KEY,
    "leagueId" UUID NOT NULL,
    "season" INTEGER NOT NULL,
    "id" UUID DEFAULT gen_random_uuid(),
    "externalLeagueId" INTEGER NOT NULL,
    "awayTeamExternalId" INTEGER NOT NULL,
    "awayTeamGoalsExtra" INTEGER,
    "awayTeamGoalsFinish" INTEGER,
    "awayTeamGoalsHalf" INTEGER,
    "awayTeamGoalsPenalty" INTEGER,
    "awayTeamId" UUID NOT NULL,
    "date" TEXT NOT NULL,
    "elapsed" INTEGER,
    "fixtureRoundId" TEXT,
    "homeTeamExternalId" INTEGER NOT NULL,
    "homeTeamGoalsExtra" INTEGER,
    "homeTeamGoalsFinish" INTEGER,
    "homeTeamGoalsHalf" INTEGER,
    "homeTeamGoalsPenalty" INTEGER,
    "homeTeamId" UUID NOT NULL,
    "referee" TEXT,
    "round" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "teamIdWon" TEXT,
    "venue" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_leagueId_fkey" 
    FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE;

ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_homeTeamId_fkey"
    FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE CASCADE;

ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_awayTeamId_fkey"
    FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "FixtureRound" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "leagueId" UUID NOT NULL,
    "season" INTEGER NOT NULL,
    "externalLeagueId" INTEGER NOT NULL,
    "dateStarted" TEXT NOT NULL,
    "hasStarted" BOOLEAN NOT NULL DEFAULT FALSE,
    "round" INTEGER NOT NULL
);

ALTER TABLE "FixtureRound" ADD CONSTRAINT "FixtureRound_leagueId_fkey" 
    FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "BetCompetition" (
    "betCompetitionId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "season" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "dateStart" TEXT NOT NULL,
    "dateEnd" TEXT NOT NULL,
    "playerLimit" INTEGER NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT FALSE,
    "hasFinished" BOOLEAN NOT NULL DEFAULT FALSE,
    "isGlobal" BOOLEAN NOT NULL DEFAULT FALSE,
    "fixtureResultPoints" FLOAT,
    "resultGoalsPoints" FLOAT,
    "resultGoalsHomePoints" FLOAT,
    "resultGoalsAwayPoints" FLOAT,
    "resultScorersPoints" FLOAT,
    "competitionTopScorerPoints" FLOAT,
    "competitionTopAssistPoints" FLOAT,
    "competitionTopCleanSheetsPoints" FLOAT,
    "competition1stTeamPoints" FLOAT,
    "competition2ndTeamPoints" FLOAT,
    "competition3rdTeamPoints" FLOAT,
    "competition4thTeamPoints" FLOAT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

ALTER TABLE "BetCompetition" ADD CONSTRAINT "BetCompetition_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "UserToBetCompetition" (
    "userId" UUID NOT NULL,
    "betCompetitionId" UUID NOT NULL,
    PRIMARY KEY ("userId", "betCompetitionId")
);

ALTER TABLE "UserToBetCompetition" ADD CONSTRAINT "UserToBetCompetition_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "UserToBetCompetition" ADD CONSTRAINT "UserToBetCompetition_betCompetitionId_fkey" 
    FOREIGN KEY ("betCompetitionId") REFERENCES "BetCompetition"("betCompetitionId") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "BetCompetitionToLeague" (
    "betCompetitionId" UUID NOT NULL,
    "leagueId" UUID NOT NULL,
    PRIMARY KEY ("betCompetitionId", "leagueId")
);

ALTER TABLE "BetCompetitionToLeague" ADD CONSTRAINT "BetCompetitionToLeague_betCompetitionId_fkey" 
    FOREIGN KEY ("betCompetitionId") REFERENCES "BetCompetition"("betCompetitionId") ON DELETE CASCADE;
ALTER TABLE "BetCompetitionToLeague" ADD CONSTRAINT "BetCompetitionToLeague_leagueId_fkey" 
    FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "Bet" (
    "betId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "fixtureId" INTEGER NOT NULL,
    "leagueId" UUID NOT NULL,
    "season" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "betCompetitionId" UUID NOT NULL,
    "fixtureResultBet" bet_result_type,
    "fixtureGoalsBet" JSONB,
    "fixtureScorersBet" JSONB,
    "isEvaluated" BOOLEAN NOT NULL DEFAULT FALSE,
    "oddValue" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

ALTER TABLE "Bet" ADD CONSTRAINT "Bet_fixtureId_fkey" 
    FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("fixtureId") ON DELETE CASCADE;
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_leagueId_fkey" 
    FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE;
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_betCompetitionId_fkey" 
    FOREIGN KEY ("betCompetitionId") REFERENCES "BetCompetition"("betCompetitionId") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "BetEvaluated" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "betId" UUID UNIQUE NOT NULL,
    "season" INTEGER NOT NULL,
    "betCompetitionId" UUID NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "fixtureResultPoints" FLOAT,
    "fixtureGoalsPoints" FLOAT,
    "fixtureHomeGoalsPoints" FLOAT,
    "fixtureAwayGoalsPoints" FLOAT,
    "fixtureScorersPoints" FLOAT,
    "fixtureScorers" JSONB,
    "fixtureScorersIncorrect" INTEGER,
    "fixtureScorersCorrect" INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

ALTER TABLE "BetEvaluated" ADD CONSTRAINT "BetEvaluated_betId_fkey" 
    FOREIGN KEY ("betId") REFERENCES "Bet"("betId") ON DELETE CASCADE;
ALTER TABLE "BetEvaluated" ADD CONSTRAINT "BetEvaluated_betCompetitionId_fkey" 
    FOREIGN KEY ("betCompetitionId") REFERENCES "BetCompetition"("betCompetitionId") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "Log" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID,
    "type" log_type NOT NULL,
    "action" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "additionalData" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "League" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Nation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Season" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Fixture" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FixtureRound" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BetCompetition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BetCompetitionToLeague" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BetEvaluated" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserToBetCompetition" ENABLE ROW LEVEL SECURITY;