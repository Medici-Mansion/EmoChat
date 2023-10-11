CREATE TABLE IF NOT EXISTS "emotion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fontToEmotion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"fontId" uuid,
	"emotionId" uuid,
	"sentimentId" uuid,
	CONSTRAINT fontToEmotion_sentimentId_sentimentId_emotionId PRIMARY KEY("sentimentId","sentimentId","emotionId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "font" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"name" text,
	"alias" text,
	"code" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"text" text,
	"emotion" text,
	"nickname" text,
	"room" text,
	"fontToEmotionId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sentiment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"name" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fontToEmotion" ADD CONSTRAINT "fontToEmotion_fontId_font_id_fk" FOREIGN KEY ("fontId") REFERENCES "font"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fontToEmotion" ADD CONSTRAINT "fontToEmotion_emotionId_emotion_id_fk" FOREIGN KEY ("emotionId") REFERENCES "emotion"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fontToEmotion" ADD CONSTRAINT "fontToEmotion_sentimentId_sentiment_id_fk" FOREIGN KEY ("sentimentId") REFERENCES "sentiment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_fontToEmotionId_fontToEmotion_id_fk" FOREIGN KEY ("fontToEmotionId") REFERENCES "fontToEmotion"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
