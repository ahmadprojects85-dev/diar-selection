import { NewsForm } from "../NewsForm";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <NewsForm newsId={resolvedParams.id} />;
}
