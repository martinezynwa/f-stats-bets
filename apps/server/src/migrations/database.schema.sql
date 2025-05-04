DROP TABLE IF EXISTS "Bet" CASCADE;
DROP TABLE IF EXISTS "Fixture" CASCADE;
DROP TABLE IF EXISTS "League" CASCADE;
DROP TABLE IF EXISTS "Nation" CASCADE;
DROP TABLE IF EXISTS "Season" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "UserSettings" CASCADE;

DROP TYPE IF EXISTS federation_type;
DROP TYPE IF EXISTS organization_type;
DROP TYPE IF EXISTS league_type;

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

CREATE TABLE IF NOT EXISTS "UserSettings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "leagueOrder" TEXT,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "userId" UUID UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "avatar" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "isVerified" BOOLEAN,
    "name" TEXT NOT NULL,
    "providerAvatar" TEXT,
    "providerId" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
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
    "apiLeagueId" INTEGER NOT NULL,
    "countPlayerStats" BOOLEAN,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
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
    "season" INTEGER NOT NULL REFERENCES "Season"("seasonId"),
    "supported" BOOLEAN NOT NULL DEFAULT FALSE,
    "type" league_type NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS "Nation" (
    "id" INTEGER PRIMARY KEY,
    "altNationName" TEXT,
    "code" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "nationName" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Fixture" (
    "id" UUID DEFAULT gen_random_uuid(),
    "apiLeagueId" INTEGER NOT NULL,
    "awayTeamApiId" INTEGER NOT NULL,
    "awayTeamGoalsExtra" INTEGER,
    "awayTeamGoalsFinish" INTEGER,
    "awayTeamGoalsHalf" INTEGER,
    "awayTeamGoalsPenalty" INTEGER,
    "awayTeamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT NOT NULL,
    "elapsed" INTEGER,
    "fixtureId" INTEGER PRIMARY KEY,
    "fixtureRoundId" TEXT,
    "homeTeamApiId" INTEGER NOT NULL,
    "homeTeamGoalsExtra" INTEGER,
    "homeTeamGoalsFinish" INTEGER,
    "homeTeamGoalsHalf" INTEGER,
    "homeTeamGoalsPenalty" INTEGER,
    "homeTeamId" TEXT NOT NULL,
    "leagueId" UUID NOT NULL REFERENCES "League"("id"),
    "oddsId" TEXT,
    "referee" TEXT,
    "round" INTEGER NOT NULL,
    "season" INTEGER NOT NULL REFERENCES "Season"("seasonId"),
    "status" TEXT NOT NULL,
    "teamIdWon" TEXT,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "venue" TEXT
);

CREATE TABLE IF NOT EXISTS "Bet" (
    "betId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "betCompetitionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "fixtureGoalsBet" JSONB,
    "fixtureId" INTEGER NOT NULL REFERENCES "Fixture"("fixtureId"),
    "fixtureResultBet" TEXT CHECK ("fixtureResultBet" IN ('0', '1', '2')),
    "fixtureScorersBet" JSONB,
    "isEvaluated" BOOLEAN NOT NULL DEFAULT FALSE,
    "leagueId" UUID NOT NULL REFERENCES "League"("id"),
    "oddValue" JSONB,
    "season" INTEGER NOT NULL REFERENCES "Season"("seasonId"),
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "userId" UUID NOT NULL REFERENCES "User"("id")
);

-- Enable Row Level Security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "League" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Nation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Season" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Fixture" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bet" ENABLE ROW LEVEL SECURITY;
