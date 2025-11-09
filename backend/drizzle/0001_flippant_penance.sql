ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."donors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "donors_email_idx" ON "donors" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "institutions_cnpj_idx" ON "institutions" USING btree ("cnpj");--> statement-breakpoint
CREATE UNIQUE INDEX "institutions_email_idx" ON "institutions" USING btree ("email");