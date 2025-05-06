clones wo-42 mostly working

shortened workout logger but still not able to update scores.  can't use "scores" to tell AI to update input numbers (reps, weight, time).  Scores is identified as totals on a different supabase table

scores can now be updated 5/2/25

disabled Eruda in index.html with //

site.webmanifest was moved to root to replace the manifest.json

for favicons the src has to be specific to the location of the images

5/5/2025 fixed workout on Sunday not showing in weekly checklist


working message board

last feature i'm working on but it seems computer is having a problem.  

"I want to use supabase storage for all photos, the photo selected for profile and photo selected for Welcome Page image."

Tokens: 208688 (prompt: 207809, completion: 879)
Okay, I will modify the components to use Supabase storage for profile and welcome page images. This involves updating the ProfileSettings.tsx and AdminSettings.tsx components to upload images to Supabase storage and store the URLs in the database.

**When updating the sql, please always make it where I can copy and paste directly in supabase sql editor without getting errors like "table already exists"


Project Setup with Supabase Storage
Click to open Workbench

Create src/components/settings/AdminSettings.tsx
Create src/components/settings/ProfileSettings.tsx
Create supabase/migrations/20250506000000_complete_project.sql
Run command
npm install && npm run dev
I've updated the ProfileSettings.tsx and AdminSettings.tsx components to use Supabase storage for profile and welcome page images. I've also added a storage policy for avatars.

I want to remove cloudinary and use supabase storage/buckets for everything. Created a bucket on supabase titled "primalphotos"
