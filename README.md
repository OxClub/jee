# JEE MAINS TEST PREPARATION (Android app)

An Android app (Capacitor) with 10,000 practice questions per subject (Physics, Chemistry, Maths),
timed tests, instant solutions, study music, dark/light mode, and 30 solution PDFs that open inside the app.

## Get the APK with GitHub Actions
1. Create a new GitHub repository and upload everything in this folder (keep the folder names).
   The workflow file must be at `.github/workflows/android.yml`. If the web uploader skips the hidden
   `.github` folder, use "Add file > Create new file", type `.github/workflows/android.yml`, and paste its contents.
2. Open the repo's **Actions** tab, choose **Build Android APK**, and click **Run workflow** (it also runs on every push to `main`).
3. When it finishes, open the run and download the artifact **jee-prep-studio-apk**. Unzip it and install `app-debug.apk` on your phone.

## Before publishing on Google Play
- The workflow builds a *debug* APK for testing. Play Store needs a signed release bundle (AAB).
  Run `npm install && npm run prepare:web && npx cap add android && npx cap sync android && npx cap open android`
  on a computer with Android Studio, then use **Build > Generate Signed Bundle / APK**.
- The app icon comes from `assets/icon-foreground.png` and `assets/icon-background.png` (blue background, white JEE MAINS text). Replace those two files to change it.
- Add a privacy policy and fill in Play Console's data safety form.
- Keep the "not affiliated with NTA or any IIT" note.

## Saving PDFs
In the PDF viewer, **Save / Share PDF to phone** opens Android's share sheet. Choose Files, Drive, WhatsApp or any PDF reader to keep a copy.

## Regenerate the content
- `node tools/gen_all.js` builds `www/data/*.json` for JEE Main, JEE Advanced, NEET and UPSC (10,000 questions per subject, plus a 63-question GS set).
- `python3 tools/make_pdfs.py` builds `www/pdfs/*.pdf` (needs `pip install reportlab` and the DejaVu fonts).
- GitHub Actions runs both steps on every build, so the data and PDFs are not stored in the repository.

## Test the web version locally
`npm install && npm run prepare:web && npx serve www`
