# Webinar registrations → Google Sheet

`/webinar` sends every registration two ways:

1. **Email.** A notification goes to `SUBMISSION_NOTIFY_EMAIL`, and a Hebrew confirmation goes to the registrant. This uses the same SMTP relay as the opportunity brief.
2. **Google Sheet** (optional). The row is posted to an Apps Script web app when `WEBINAR_SHEET_WEBHOOK_URL` and `WEBINAR_SHEET_SECRET` are set.

Either channel is enough to accept a registration. If neither is configured or both fail, the form falls back to "send by email / WhatsApp" and keeps what the visitor typed.

## Set up the Sheet

1. Create a Google Sheet named **Webinar leads**. Put this header row in row 1:
   `submittedAt | name | email | phone | company | role | market | liveAudit | ref | pain | status`
2. Open **Extensions → Apps Script** and paste the script below. Replace `CHANGE_ME` with a long random string, which is the shared secret.
3. Choose **Deploy → New deployment → Web app**. Set "Execute as" to *Me* and "Who has access" to *Anyone*. Copy the `/exec` URL.
4. On the server, set `WEBINAR_SHEET_WEBHOOK_URL` to the `/exec` URL and `WEBINAR_SHEET_SECRET` to the same secret, then restart.

```js
const SECRET = "CHANGE_ME";

function doPost(e) {
  const data = JSON.parse(e.postData.contents || "{}");
  if (data.secret !== SECRET) return json({ ok: false, error: "unauthorized" });
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.appendRow([
    data.submittedAt, data.name, data.email, data.phone, data.company,
    data.role, data.market, data.liveAudit ? "yes" : "no", data.ref, data.pain, "new",
  ]);
  return json({ ok: true });
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
```

Use the `status` column as the lead pipeline: `new → invited → attended → fit call → audit`.

## Partner links

Each partner shares the page with their own `ref`, which shows up in the email subject and the Sheet. For example:

- `https://realization.world/webinar?ref=evgeni`
- `https://realization.world/webinar?ref=linkedin`
- `https://realization.world/webinar?ref=whatsapp-groups`
