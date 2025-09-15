export type Email = {
  id: string;
  folder: "inbox" | "sent" | "drafts" | "spam" | "trash";
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  time: string;
};

const mockEmails: Email[] = [
  { id: "inb-1", folder: "inbox", sender: "john.doe@example.com", recipient: "you@orbitmail.com", subject: "Welcome to OrbitMail", body: "Thanks for joining OrbitMail. This is your inbox. Enjoy!", time: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  { id: "inb-2", folder: "inbox", sender: "marketing@acme.com", recipient: "you@orbitmail.com", subject: "Special Offer", body: "Get 25% off on your next purchase.", time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "snt-1", folder: "sent", sender: "you@orbitmail.com", recipient: "client@company.com", subject: "Project Update", body: "Sharing the latest project status and next steps.", time: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: "snt-2", folder: "sent", sender: "you@orbitmail.com", recipient: "team@company.com", subject: "Sprint Notes", body: "Here are the sprint notes and retrospective points.", time: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
  { id: "drf-1", folder: "drafts", sender: "you@orbitmail.com", recipient: "", subject: "Unfinished Idea", body: "Write down the idea details later...", time: new Date(Date.now() - 300 * 60 * 1000).toISOString() },
  { id: "drf-2", folder: "drafts", sender: "you@orbitmail.com", recipient: "", subject: "Meeting Agenda", body: "Points to cover in the next meeting.", time: new Date(Date.now() - 600 * 60 * 1000).toISOString() },
  { id: "spm-1", folder: "spam", sender: "noreply@spammy.biz", recipient: "you@orbitmail.com", subject: "Win a Million!!!", body: "Click this suspicious link to claim your prize.", time: new Date(Date.now() - 1440 * 60 * 1000).toISOString() },
  { id: "spm-2", folder: "spam", sender: "fake@scam.co", recipient: "you@orbitmail.com", subject: "Urgent: Account Locked", body: "We locked your account. Send us your password.", time: new Date(Date.now() - 2880 * 60 * 1000).toISOString() },
  { id: "trh-1", folder: "trash", sender: "old@news.com", recipient: "you@orbitmail.com", subject: "Old Newsletter", body: "Last month newsletter archived.", time: new Date(Date.now() - 4320 * 60 * 1000).toISOString() },
  { id: "trh-2", folder: "trash", sender: "updates@service.com", recipient: "you@orbitmail.com", subject: "Service Update", body: "We updated our terms of service.", time: new Date(Date.now() - 8000 * 60 * 1000).toISOString() }
];

function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getEmails(folder: Email["folder"]): Promise<Email[]> {
  const items = mockEmails
    .filter((e) => e.folder === folder)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return delay(items, 600);
}

export async function sendEmail(to: string, subject: string, body: string): Promise<{ success: boolean }> {
  const now = new Date().toISOString();
  mockEmails.push({
    id: `snt-${Math.random().toString(36).slice(2, 8)}`,
    folder: "sent",
    sender: "you@orbitmail.com",
    recipient: to,
    subject,
    body,
    time: now,
  });
  return delay({ success: true }, 800);
}
