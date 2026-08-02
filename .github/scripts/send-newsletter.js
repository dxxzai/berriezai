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

  for (const contact of contacts.data) {
    const email = {
      from: "Berriezai <updates@berriezai.cc>",
      to: contact.email,
      subject: "New Chapter Released!",
      headers: {
        "List-Unsubscribe":
          "<https://dxxzai.github.io/berriezai/Unsubscribe/>",
      },
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
        </p>

        <p style="font-size: 12px; color: #888;">
          You are receiving this because you subscribed to chapter updates.
          <br>
          <a href="https://dxxzai.github.io/berriezai/Unsubscribe/">
            Unsubscribe
          </a>
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

    console.log(`Sent to ${contact.email}:`, result);

    if (!sendResponse.ok) {
      throw new Error(JSON.stringify(result));
    }

    // Wait 1 second between emails to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("Newsletter sent to all subscribers!");
}

main();