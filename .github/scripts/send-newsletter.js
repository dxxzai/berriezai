const apiKey = process.env.RESEND_API_KEY;
const audienceId = process.env.RESEND_AUDIENCE_ID;
const chapterFile = process.env.CHAPTER_FILE;
const chapterSlug = chapterFile
  .split("/")
  .pop()
  .replace(".mdx", "");
const chapterUrl =
  `https://dxxzai.github.io/berriezai/chapters/${chapterSlug}/`;

async function main() {
  const contactsResponse = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  const contacts = await contactsResponse.json();

  if (!contacts.data || contacts.data.length === 0) {
    console.log("No subscribers found.");
    return;
  }

  const email = {
    from: "Berriezai <updates@berriezai.cc>",
    to: contacts.data.map((contact) => contact.email),
    subject: "New Chapter Released!",
    html: `
      <h2>A new chapter is available!</h2>

      <p>
        A new chapter of <em>I'm a Young God, Won't You Raise Me?</em>
        has been released.
      </p>

      <p>
        <a href="${chapterUrl}">
            Read Chapter ${chapterSlug.replace("chapter-", "")}
        </a>
      </p>

      <p>
        Thank you for reading!
      <p style="font-size: 12px; color: #888;">
        You are receiving this because you subscribed to Berriezai chapter updates.
        <br>
        <a href="https://berriezai.cc/unsubscribe">
            Unsubscribe
        </a>
        </p>
        </p>
    `,
  };

  const sendResponse = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    }
  );

  const result = await sendResponse.json();

  console.log(result);

  if (!sendResponse.ok) {
    throw new Error(JSON.stringify(result));
  }

  console.log("Newsletter sent!");
}

main();