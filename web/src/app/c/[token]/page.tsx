import { PrismaClient, CampaignStatus } from '@prisma/client';

const prisma = new PrismaClient();

export default async function PublicPreview({ params }: { params: { token: string } }) {
  const { token } = params;
  const campaign = await prisma.campaign.findFirst({ where: { shareToken: token } });
  if (!campaign) return <main className="p-6">Not found</main>;

  const creatives = await prisma.creative.findMany({ where: { campaignId: campaign.id } });
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">
        {campaign.name} {campaign.status !== CampaignStatus.PUBLISHED && <span className="text-sm font-normal text-gray-500">(Preview)</span>}
      </h1>
      <ul className="grid grid-cols-2 gap-4">
        {creatives.map((c) => (
          <li key={c.id} className="rounded border p-2">
            <div className="text-sm text-gray-600">{c.type}</div>
            {c.type === 'IMAGE' && <img src={c.src} alt="" className="w-full" />}
            {c.type === 'VIDEO' && (
              <video controls className="w-full">
                <source src={c.src} />
              </video>
            )}
            {c.type === 'HTML5' && (
              <iframe src={c.src} className="h-96 w-full" title="HTML5 Creative" />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}


