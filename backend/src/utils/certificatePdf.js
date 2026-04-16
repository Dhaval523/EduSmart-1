const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

let puppeteerRef = null;

const getPuppeteer = async () => {
  if (puppeteerRef) return puppeteerRef;
  try {
    const mod = await import("puppeteer");
    puppeteerRef = mod?.default || mod;
    return puppeteerRef;
  } catch (error) {
    const message = error?.message || String(error);
    throw new Error(`Puppeteer not available. Install 'puppeteer'. ${message}`);
  }
};

export const generateCertificatePdfBuffer = async ({
  userName,
  courseTitle,
  issuedAt,
  certificateId
}) => {
  const safeUserName = escapeHtml(userName);
  const safeCourseTitle = escapeHtml(courseTitle);
  const safeCertificateId = escapeHtml(certificateId);
  const issued = issuedAt ? new Date(issuedAt) : new Date();
  const issuedAtLabel = issued.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>EduSmart Certificate</title>
      <style>
        @page{
          size: A4 landscape;
          margin: 0;
        }
        :root{
          --bg: #f5f7fb;
          --text: #0f172a;
          --muted: #51607b;
          --primary: #0ea5a4;
          --secondary: #0f766e;
          --accent: #f59e0b;
          --border: #e2e8f0;
        }
        *{ box-sizing: border-box; }
        html, body{
          height: 100%;
        }
        body{
          margin:0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Arial, sans-serif;
          background: #ffffff;
          color: var(--text);
        }
        .sheet{
          width: 100%;
          height: 100%;
          padding: 54px 64px;
          background:
            radial-gradient(900px 450px at 12% 8%, rgba(14,165,164,0.10), transparent 60%),
            radial-gradient(900px 450px at 88% 92%, rgba(15,118,110,0.10), transparent 60%),
            linear-gradient(180deg, #ffffff 0%, #fbfdff 55%, #f5f7fb 100%);
          overflow: hidden;
        }
        .frame{
          width: 100%;
          height: 100%;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: #ffffff;
          position: relative;
          padding: 52px 56px;
        }
        .topRow{
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 24px;
        }
        .logo{
          display:flex;
          align-items:center;
          gap: 10px;
        }
        .mark{
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          box-shadow: 0 16px 32px rgba(14,165,164,0.22);
        }
        .product{
          font-weight: 900;
          letter-spacing: -0.02em;
          font-size: 22px;
        }
        .meta{
          text-align:right;
          font-size: 12px;
          color: var(--muted);
          line-height: 1.6;
        }

        /* Middle */
        .center{
          margin-top: 44px;
          text-align: center;
          padding: 0 56px;
        }
        .title{
          margin: 0;
          font-size: 42px;
          font-weight: 900;
          letter-spacing: -0.03em;
        }
        .subcopy{
          margin-top: 18px;
          font-size: 14px;
          color: var(--muted);
          letter-spacing: 0.01em;
        }
        .name{
          margin-top: 22px;
          font-size: 44px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }
        .nameRule{
          width: 170px;
          height: 4px;
          border-radius: 999px;
          margin: 14px auto 0;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
        }
        .completeCopy{
          margin-top: 18px;
          font-size: 14px;
          color: var(--muted);
        }
        .course{
          margin-top: 14px;
          display: inline-block;
          font-size: 20px;
          font-weight: 900;
          color: var(--text);
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(14,165,164,0.08), rgba(15,118,110,0.08));
        }
        .completionDate{
          margin-top: 18px;
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .completionDate strong{
          letter-spacing: normal;
          text-transform: none;
          color: var(--text);
          font-size: 13px;
        }

        /* Footer signatures */
        .footer{
          position:absolute;
          left: 56px;
          right: 56px;
          bottom: 52px;
          display:flex;
          align-items:flex-end;
          justify-content: space-between;
          gap: 18px;
        }
        .sig{
          flex: 1;
          min-width: 0;
          text-align: center;
        }
        .sigLine{
          width: 100%;
          height: 1px;
          background: var(--border);
        }
        .sigLabel{
          margin-top: 10px;
          font-size: 12px;
          color: var(--muted);
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .sigValue{
          margin-top: 6px;
          font-size: 12px;
          color: var(--muted);
        }

        /* Decorative footer */
        .sealWrap{
          position:absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 18px;
          background: linear-gradient(90deg, rgba(14,165,164,0.18), rgba(15,118,110,0.18));
        }
        .seal{
          position:absolute;
          right: 22px;
          bottom: 22px;
          width: 92px;
          height: 92px;
          border-radius: 999px;
          border: 1px solid var(--border);
          display:flex;
          align-items:center;
          justify-content:center;
          background:
            radial-gradient(circle at 30% 30%, rgba(245,158,11,0.22), transparent 60%),
            linear-gradient(135deg, rgba(14,165,164,0.14), rgba(15,118,110,0.14));
          color: var(--secondary);
          font-weight: 900;
          letter-spacing: 0.18em;
          font-size: 12px;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="sheet">
        <div class="frame">
          <div class="topRow">
            <div class="logo">
              <div class="mark"></div>
              <div class="product">EduSmart</div>
            </div>
            <div class="meta">
              <div><strong>Certificate ID:</strong> ${safeCertificateId}</div>
              <div><strong>Issued:</strong> ${escapeHtml(issuedAtLabel)}</div>
            </div>
          </div>

          <div class="center">
            <h1 class="title">CERTIFICATE OF COMPLETION</h1>
            <div class="subcopy">This certifies that</div>
            <div class="name">${safeUserName}</div>
            <div class="nameRule"></div>
            <div class="completeCopy">has successfully completed</div>
            <div class="course">${safeCourseTitle}</div>
            <div class="completionDate">Completion Date: <strong>${escapeHtml(issuedAtLabel)}</strong></div>
          </div>

          <div class="footer">
            <div class="sig">
              <div class="sigLine"></div>
              <div class="sigLabel">Instructor</div>
              <div class="sigValue">EduSmart</div>
            </div>
            <div class="sig">
              <div class="sigLine"></div>
              <div class="sigLabel">Platform</div>
              <div class="sigValue">EduSmart</div>
            </div>
            <div class="sig">
              <div class="sigLine"></div>
              <div class="sigLabel">Signature</div>
              <div class="sigValue">${escapeHtml("Authorized")}</div>
            </div>
          </div>

          <div class="seal">EduSmart</div>
          <div class="sealWrap"></div>
        </div>
      </div>
    </body>
  </html>`;

  const puppeteer = await getPuppeteer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdfBuffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
};
