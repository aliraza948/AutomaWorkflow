# PayHip Auto-Uploader — Read Me

## What this does

This is an **Automa** (browser extension) workflow. Once set up, it reads a list of
products from a Google Sheet and, one by one:

1. Opens a new PayHip "Add Digital Product" page
2. Uploads the product file
3. Types in the title, price, and description
4. Uploads a cover image
5. Clicks "Save"
6. Copies the product's download link back into your Google Sheet
7. Marks that row "done" so it's never uploaded twice
8. Moves on to the next row

You fill in a spreadsheet with your products; the workflow does the repetitive
clicking and typing for you.

---

## What you need before you start

- **Google Chrome** (or a Chromium browser) with the **Automa** extension installed
  from the Chrome Web Store
- A **PayHip account**, logged in in that same browser
- A **Google account** with access to Google Sheets, connected inside Automa
- Your product files (PDFs, ebooks, etc.) saved somewhere on your computer
- One cover image to use (see "Limitations" below)

---

## Step 1 — Set up your Google Sheet

Use the included template file, **`PayHip_Google_Sheet_Template.xlsx`**:

1. Open it and upload it to Google Sheets (File → Import, or drag it into Google Drive
   and open with Google Sheets), or just recreate the same 8 columns in a blank Google Sheet.
2. Keep row 1 exactly as the column headers — don't delete or reorder columns.
3. The sheet has two tabs: **Sheet1** (your product list) and **Read Me** (a plain-language
   guide to each column, also summarized below).

| Column | You fill in? | Meaning |
|---|---|---|
| A – Product Title | Yes | Product name shown on PayHip |
| B – Description | Yes | Product description text |
| C – File Folder Path | Yes | Folder on your computer holding the file, e.g. `C:\PayHip Products` |
| D – File Name | Yes | Exact file name with extension, e.g. `planner.pdf` |
| E – Price | Yes | Plain number, e.g. `9.99` |
| F – Product Link | No — auto-filled | The workflow writes the PayHip download link here |
| G – File Subfolder | Yes (optional) | A subfolder between the folder and file name, if you use one |
| H – Status | No — auto-filled | The workflow writes `done` here once uploaded |

**Important:** the workflow builds the full file location as
`Folder Path / File Subfolder / File Name`. If you don't use subfolders, leave column G
blank for that row — just make sure the file still sits directly inside the Folder Path.

Add one row per product, starting on row 2. Leave columns F and H empty — the
workflow fills those in for you.

---

## Step 2 — Connect the workflow to *your* sheet

The workflow file currently points at the sheet it was built with. You need to point it
at your own copy, once:

1. Open the Google Sheet you made in Step 1, and copy its **Spreadsheet ID** — the long
   code in the browser address bar between `/d/` and `/edit`.
2. In Automa, open this workflow and find the block near the start named **"javascript-code"**
   (right after the trigger and before the "Google Sheets" block). It contains one line like:
   ```
   automaSetVariable('sheet', ['YOUR-SPREADSHEET-ID-HERE', 'Sheet1'])
   ```
3. Replace the ID inside the quotes with your own Spreadsheet ID. Keep `'Sheet1'` as-is
   unless you renamed your tab.

---

## Step 3 — Point it at your own files and cover image

Two more things are hardcoded and need a one-time update to match your computer:

- **Cover image** — the block named "Cover" (an "upload-file" step) has a fixed file
  path to one image. Every product will use this same cover unless you change it. Update
  it to the image you want to use, or edit the path per run.
- **File paths** — the "Main File" upload step reads the folder/subfolder/file name
  from your spreadsheet automatically (columns C, G, D), so as long as those columns are
  filled in correctly for each row, you don't need to touch this step.

---

## Step 4 — Run it

1. Make sure you're logged into PayHip in the browser.
2. Open Automa, find this workflow, and press the trigger/Run button.
3. The workflow will:
   - Read your whole sheet
   - Skip any row already marked `done` in column H
   - For every other row, open PayHip, fill the form, upload the file and cover,
     submit, wait about 20 seconds for PayHip to process it, grab the download link,
     and write the link + `done` back into your sheet
4. Watch the first product go through once to confirm everything is mapped correctly,
   then let it run the rest unattended.

---

## Good to know / limitations

- **One cover image for every product**, unless you edit that step's file path between runs.
- **20-second pause** after clicking Save on each product, so PayHip has time to finish
  processing before the workflow grabs the download link. Don't close the tab or browser
  during a run.
- **Safe to re-run**: rows already marked `done` are skipped automatically, so you can stop
  and restart the workflow any time without duplicating products.
- **To re-upload a row** (e.g. you fixed a typo), just clear the `done` text in column H
  for that row — never type into column F or H yourself otherwise.
- **Row order matters**: the workflow starts at row 2, assuming row 1 is always the header.
- File names and folder paths are case- and spelling-sensitive — they must match exactly
  what's on your computer, or the file upload step will fail on that row.

---

## Quick troubleshooting

| Problem | Likely cause |
|---|---|
| A row keeps failing at the file upload step | Folder Path / Subfolder / File Name in the sheet doesn't exactly match a real file on your computer |
| Wrong cover shows up on every product | Expected — the cover image path is fixed, not read from the sheet |
| A product got uploaded twice | Column H wasn't marked `done` before running again — check the sheet after each run |
| Nothing happens when you run it | You're not logged into PayHip in that browser, or the Spreadsheet ID in Step 2 is wrong |